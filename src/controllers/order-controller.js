'use strict';

const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send({ 
            data: data,
            message: 'Listagem de pedidos feita com sucesso!',
            status: 200,
            success: true
        });
    }
    catch(err) {
        res.status(500).send({ 
            data: err,
            message: 'Falha ao processar sua requisição',
            status: 500,
            success: false                
        });
    }
};

exports.post = async(req, res, next) => {
    try {
        // recupera o token
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decodifica o token
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });

        res.status(201).send({ 
            data: null,
            message: 'Pedido criado com sucesso!',
            status: 201,
            success: true
        });
    }
    catch (err) {
        res.status(500).send({ 
            data: err,
            message: 'Falha ao processar sua requisição',
            status: 500,
            success: false                
        });
    }  
};