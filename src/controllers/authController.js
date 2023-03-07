const express = require('express');
const { findOne, findByIdAndRemove } = require('../models/user');

const User = require('../models/user');

const router = express.Router();


const validarDados = (req) =>{

    if (req.body.titulo == req.body.nome_fachada) {
        return 'Titulo igual a fachada';
    }

    if ((req.body.cidade).toLowerCase() != 'nova york' && (req.body.cidade).toLowerCase() != 'rio de janeiro' && (req.body.cidade).toLowerCase() != 'tóquio') {
        return 'Cidade indisponivel';
    }

    if ((req.body.tecnologias).toLowerCase() != 'laboratório de nanotecnologia' && (req.body.tecnologias).toLowerCase() != 'jardim de ervas venenosas' && (req.body.tecnologias).toLowerCase() != 'estande de tiro' && (req.body.tecnologias).toLowerCase() != 'academia de parkour') {
        return 'Tecnologia indisponivel';
    }

    return 'Já Registrado';
}
const getUser = () => undefined;


router.post('/register', async (req, res) => {

    var aux = '';

    try {

        aux = validarDados(req);

        if (aux != 'Já Registrado'){
            throw new Error();
        }

        const user = await User.create(req.body);
        user.nome_fachada = undefined;
        return res.send({ user });

    } catch (err) {
        aux = validarDados(req);
        return res.status(400).send({ error: 'Falhou o registro! ' + aux});

    }

});


router.put('/:id', async (req, res) => {


    const aux = validarDados(req);

    if (aux != 'Já Registrado') {
        return res.status(400).send({ error: 'Falha na atualização! ' + aux});
    }

    if (await User.findOne({ 'titulo': req.body.titulo })) {
        return res.status(400).send({ error: 'Já existe uma base com esse titulo!'});
    }


    const {titulo, nome_fachada, cidade, tecnologias, createdAt} = req.body;
    const {id} = req.params;
    const user = await User.findByIdAndUpdate (id, {titulo, nome_fachada, cidade, tecnologias, createdAt}, {new: true});
    
    return res.send({ user });
});



router.get('/listar', async (req, res) => {

    const titulo = req.query['titulo'];
    const cidade = req.query['cidade'];
    const tecnologia = req.query['tecnologia'];

    if(titulo == undefined && cidade == undefined && tecnologia == undefined){
        const busca = await User.find().select(['-nome_fachada']);
        return res.json(busca);
    }else{

    const buscaTitulo = await User.find({'titulo': titulo}).select(['-nome_fachada']);
    const buscaCidade = await User.find({'cidade': cidade}).select(['-nome_fachada']);
    const buscaTec = await User.find({'tecnologia': tecnologia}).select(['-nome_fachada']);

    if(buscaTitulo){
        return res.json(buscaTitulo);
    }else if(buscaCidade){
        return res.json(buscaCidade);
    }else if (buscaTec){
        return res.json(buscaTec);
    }else{
        return res.status(400).send({ error: 'Nao encontrado!' });

    }


    }


});

router.delete('/:id', async (req, res) =>{

    const {id} = req.params;
    await User.findByIdAndRemove(id);
    return res.status(400).send({ message: 'A base do vilão foi removida!' });

});



router.post('/:titulo/:nome_fachada', async (req, res) => {


    const {titulo} = req.params;
    const {senha} = req.params;
    const {nome_fachada} = req.params;
    const {aluguel} = req.params;


    const buscaAluguel = await User.findOne({ 'titulo': titulo });
    const buscaAluguelFachada = await User.findOne({ 'nome_fachada': nome_fachada });

    if(req.body.desalugar == true){ 
        await User.findByIdAndUpdate (buscaAluguel.id, {aluguel: false}, {new: true});
        return res.status(400).send({ message: 'Aluguel cancelado com sucesso: ' });
    }


    if(buscaAluguel.aluguel == true){
        return res.status(400).send({ message: 'A base já está alugada!' });
    }


    if(buscaAluguel == null || buscaAluguelFachada == null){
        return res.status(400).send({ message: 'Base/Fachada não existe, impossivel alugar!' });
    }else{
        if(req.body.senha != null && req.body.senha == 1234){
            
            await User.findByIdAndUpdate (buscaAluguel.id, {aluguel: true}, {new: true});
            return res.status(400).send({ message: 'Base alugada com sucesso: ' });
        }else{
            return res.status(400).send({ error: 'Senha incorreta ou não informada!' });
        }
    }
    
    

});



module.exports = app => app.use('/auth', router);