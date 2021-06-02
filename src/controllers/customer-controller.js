'use strict';

const ValidationContract = require('../validators/fluent-validators'); 
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
const global = require('../../config/strings');

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
            sucess: false                
        });
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.saltKey)
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Node Store',
            global.emailTmpl.replace('{0}', req.body.name));

        res.status(201).send({ 
            data: null,
            message: 'Cliente cadastrado com sucesso!',
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