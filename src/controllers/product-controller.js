'use strict';

const ValidationContract = require('../validators/fluent-validators'); 
const repository = require('../repositories/product-repository');

// dentro do método find(), no primeiro parametro é possível filtrar por dados específicos
// no segundo parametro, é possível receber como response apenas as propriedades solicitadas (tipo graphQl)
exports.get = async(req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send({ 
            data: data,
            message: 'Listagem de produtos com sucesso!',
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

exports.getBySlug = async(req, res, next) => {
    try {
        const data = await repository.getBySlug(req.params.slug);
        res.status(200).send({ 
            data: data,
            message: 'Produto encontrado com sucesso!',
            status: 200,
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

exports.getById = async(req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        res.status(200).send({ 
            data: data,
            message: 'Produto encontrado com sucesso!',
            status: 200,
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

exports.getByTag = async(req, res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag);
        res.status(200).send({ 
            data: data,
            message: 'Produto(s) encontrado(s) com sucesso!',
            status: 200,
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

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelo menos 3 caracteres');

    if (!contract.isValid()) {
        res.status(400).send({ 
            data: null,
            message: contract.errors(),
            status: 400,
            success: false                
        });
        return;
    }

    try {
        await repository.create(req.body);
        res.status(201).send({ 
            data: null,
            message: 'Produto cadastrado com sucesso!',
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

exports.put = async(req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({ 
            data: null,
            message: 'Produto atualizado com sucesso!',
            status: 200,
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

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({ 
            data: null,
            message: 'Produto removido com sucesso!',
            status: 200,
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