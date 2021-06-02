'use strict';

const repository = require('../repositories/order-repository');
const guid = require('guid');

exports.get = async(req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send({ 
            data: data,
            message: 'Listagem de pedidos feita com sucesso!',
            status: 200,
            sucess: true
        });
    }
    catch(err) {
        res.status(500).send({ 
            data: err,
            message: 'Falha ao processar sua requisição',
            status: 500,
            sucess: false                
        });
    }
};

exports.post = async(req, res, next) => {
    try {
        await repository.create({
            customer: req.body.customer,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });
        res.status(201).send({ 
            data: null,
            message: 'Pedido criado com sucesso!',
            status: 201,
            sucess: true
        });
    }
    catch (err) {
        res.status(500).send({ 
            data: err,
            message: 'Falha ao processar sua requisição',
            status: 500,
            sucess: false                
        });
    }  
};