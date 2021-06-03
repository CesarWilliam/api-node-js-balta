'use strict';

const ValidationContract = require('../validators/fluent-validators'); 
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

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
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ['user']
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Node Store',
            global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send({ 
            data: null,
            message: 'Cliente cadastrado com sucesso!',
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

exports.authenticate = async(req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                data: null,
                message: 'Usuário ou senha inválidos',
                status: 404,
                success: false    
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            data: {
                email: customer.email,
                name: customer.name,
                token: token
            },
            message: 'Usuário autenticado com sucesso!',
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
}

exports.refreshToken = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                data: null,
                message: 'Cliente não encontrado',
                status: 404,
                success: false  
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            data: {
                email: customer.email,
                name: customer.name,
                token: tokenData
            },
            message: 'Usuário autenticado com sucesso!',
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