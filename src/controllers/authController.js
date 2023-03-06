const express = require('express');
const { findOne, findByIdAndRemove } = require('../models/user');

const User = require('../models/user');

const router = express.Router();


router.post('/register', async (req, res) => {

    if (req.body.titulo == req.body.nome_fachada) {
        return res.status(400).send({ error: 'Nome da fachada deve ser diferente do titulo!' });
    }

    if ((req.body.cidade).toLowerCase() != 'nova york' && (req.body.cidade).toLowerCase() != 'rio de janeiro' && (req.body.cidade).toLowerCase() != 'tóquio') {
        return res.status(400).send({ error: 'Essa cidade não está no catalogo!' });
    }

    if ((req.body.tecnologias).toLowerCase() != 'laboratório de nanotecnologia' && (req.body.tecnologias).toLowerCase() != 'jardim de ervas venenosas' && (req.body.tecnologias).toLowerCase() != 'estande de tiro' && (req.body.tecnologias).toLowerCase() != 'academia de parkour') {
        return res.status(400).send({ error: 'Essa tecnologia não está no catalogo!' });
    }

    try {

        const user = await User.create(req.body);

        user.nome_fachada = undefined;

        return res.send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Falhou o registro!' });

    }

});


router.put('/:id', async (req, res) => {

    if (req.body.titulo == req.body.nome_fachada) {
        return res.status(400).send({ error: 'Nome da fachada deve ser diferente do titulo!' });
    }

    if ((req.body.cidade).toLowerCase() != 'nova york' && (req.body.cidade).toLowerCase() != 'rio de janeiro' && (req.body.cidade).toLowerCase() != 'tóquio') {
        return res.status(400).send({ error: 'Essa cidade não está no catalogo!' });
    }

    if ((req.body.tecnologias).toLowerCase() != 'laboratório de nanotecnologia' && (req.body.tecnologias).toLowerCase() != 'jardim de ervas venenosas' && (req.body.tecnologias).toLowerCase() != 'estande de tiro' && (req.body.tecnologias).toLowerCase() != 'academia de parkour') {
        return res.status(400).send({ error: 'Essa tecnologia não está no catalogo!' });
    }

    const busca = await User.find({titulo: req.body.titulo});

    //if(busca == null){
    //    return res.status(400).send({ error: 'Esse já o titulo de outra base. Tente novamente!' + busca});
    //}

    const {titulo, nome_fachada, cidade, tecnologias, createdAt} = req.body;
    const {id} = req.params;

    const user = await User.findByIdAndUpdate (id, {titulo, nome_fachada, cidade, tecnologias, createdAt}, {new: true});

    return res.status(204).json({user});

    

});



router.get('/', async (req, res) => {

    const busca = await User.find().select(['-nome_fachada']);
    return res.json(busca);

});

router.delete('/:id', async (req, res) =>{

    const {id} = req.params;
    await User.findByIdAndRemove(id);
    return res.status(400).send({ message: 'A base do vilão foi removida!' });

});



router.post('/:titulo/:nome_fachada/:senha', async (req, res) => {

    const {titulo} = req.params;
    const {senha} = req.params;
    const {nome_fachada} = req.params;

    const {aluguel} = req.params;

    const buscaAluguel = await User.findOne({ 'titulo': titulo });
    const buscaAluguelFachada = await User.findOne({ 'nome_fachada': nome_fachada });

    
    if(buscaAluguel.aluguel == true){
        return res.status(400).send({ message: 'A base já está  alugada!' });
    }


    if(buscaAluguel == null || buscaAluguelFachada == null){
        return res.status(400).send({ message: 'Base/Fachada não existe, impossivel alugar!' });
    }else{
        if(senha == 1234){
            
            await User.findByIdAndUpdate (buscaAluguel.id, {aluguel: true}, {new: true});
            return res.status(400).send({ message: 'Base alugada com sucesso: ' });
        }else{
            return res.status(400).send({ message: 'Senha incorreta!' });
        }
    }
    
    

});



module.exports = app => app.use('/auth', router);