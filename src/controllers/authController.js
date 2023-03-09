//definição de constantes necessarias para a configuração e execução das rotas 

const { response } = require('express');
const express = require('express');
const { findOne, findByIdAndRemove } = require('../models/user');

const User = require('../models/user');
const router = express.Router();


//função para validar dados digitados na requisição das rotas 
const validarDados = (req) => {

    if (req.body.titulo == req.body.nome_fachada) {  //verifica se titulo e fachada informados são iguais 
        throw new Error('Titulo igual a fachada');
    }

    if ((req.body.cidade).toLowerCase() != 'nova york' && (req.body.cidade).toLowerCase() != 'rio de janeiro' && (req.body.cidade).toLowerCase() != 'tóquio') { //verifica se as cidades informadas são validas
        throw new Error('Cidade indisponivel');
    }

    //codigos para verificar se as tecnologias disponiveis foram adicionadas corretamente 
    var vetor = ['laboratório de nanotecnologia', 'jardim de ervas venenosas', 'estande de tiro', 'academia de parkour'];
    var count = (req.body.tecnologias.match(/\,/g) || []).length ;
    count = count + 1;

    var aux = 0;

    for (var i = 0; i < vetor.length; i++){
        
        if ((req.body.tecnologias).toLowerCase().includes (vetor[i])){
            aux = aux + 1;

            if (aux == count){
                return;
            }
        }
    }
    throw new Error('Tecnologia indisponivel') ;


}

//rota post para o cadastro de novas bases no banco 
router.post('/register', async (req, res) => {

    var aux = '';

    try {

        aux = validarDados(req);

        const user = await User.create(req.body);
        user.nome_fachada = undefined;
        return res.send({ user });

    } catch (err) {
        return res.status(400).send({ error: 'Falhou o registro! ' + err.message });
    }

});

//rota put para atualizar os dados de um cadastro presente no banco 
router.put('/:id', async (req, res) => {

    var aux = '';

    try {

        aux = validarDados(req);

        const { titulo, nome_fachada, cidade, tecnologias, createdAt } = req.body;
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { titulo, nome_fachada, cidade, tecnologias, createdAt }, { new: true });

        return res.send({ user });

    } catch (err) {
        return res.status(400).send({ error: 'Falha na atualização! ' + err.message });
    }
});


//rota get responsavel por listar os dados do banco 
router.get('/listar', async (req, res) => {

    const titulo = req.query['titulo'];
    const cidade = req.query['cidade'];
    const tecnologias = req.query['tecnologias'];

    if (titulo == undefined && cidade == undefined && tecnologias == undefined) {
        const busca = await User.find().select(['-nome_fachada']);
        return res.json(busca);
    } else {

        const vetor = {};

        if (titulo) {
            vetor.titulo = titulo;
        }
        if (cidade) {
            vetor.cidade = cidade;
        }
        if (tecnologias) {
            vetor.tecnologias = tecnologias;

            if(vetor.titulo && ! vetor.cidade){
                const result = await User.find({titulo: vetor.titulo , tecnologias: {$regex: vetor.tecnologias, $options: 'i'}});
                return res.json(result);
            }else if (vetor.cidade && ! vetor.titulo){
                const result = await User.find({cidade: vetor.cidade, tecnologias: {$regex: vetor.tecnologias, $options: 'i'}});
                return res.json(result);
            }else{
                if (! vetor.cidade && ! vetor.titulo){
                    const result = await User.find({tecnologias: {$regex: vetor.tecnologias, $options: 'i'}});
                    return res.json(result);
                }
                const result = await User.find({titulo: vetor.titulo , cidade: vetor.cidade, tecnologias: {$regex: vetor.tecnologias, $options: 'i'}});
                return res.json(result);
            }
        }
        const result = await User.find(vetor);

        if (result != "") {
            return res.json(result);
        } else {
            return res.json(result);
        }
    }

});

//rota delete para realizar a exclusão de bases cadastradas
router.delete('/:id', async (req, res) => {

    const { id } = req.params;
    await User.findByIdAndRemove(id);
    return res.status(200).send({ message: 'A base do vilão foi removida!' });

});


//rota post para realizar o aluguel de bases 
router.post('/:titulo/:nome_fachada', async (req, res) => {

    const { titulo } = req.params;

    const { nome_fachada } = req.params;
    
    const buscaAluguel = await User.findOne({ 'titulo': titulo });
    const buscaAluguelFachada = await User.findOne({ 'nome_fachada': nome_fachada });

    if (req.body.desalugar == true && buscaAluguel != null && buscaAluguelFachada != null) {
        await User.findByIdAndUpdate(buscaAluguel.id, { aluguel: false }, { new: true });
        return res.status(200).send({ message: 'Aluguel cancelado com sucesso: ' });
    }

    if (buscaAluguel != null) {
        if (buscaAluguel.aluguel) {
            return res.status(400).send({ error: 'A base já está alugada!' });
        }
    }

    if (buscaAluguel == null || buscaAluguelFachada == null) {
        return res.status(400).send({ error: 'Base/Fachada não existe, impossivel alugar!' });
    } else {

        if (req.body.senha != null && req.body.senha == 'heroes') {
            await User.findByIdAndUpdate(buscaAluguel.id, { aluguel: true }, { new: true });
            return res.status(200).send({ message: 'Base alugada com sucesso: ' });
        } else {
            return res.status(400).send({ error: 'Senha incorreta ou não informada!' });
        }
    }

});



module.exports = app => app.use('/auth', router); 