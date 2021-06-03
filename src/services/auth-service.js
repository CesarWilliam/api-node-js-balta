'use strict';
const jwt = require('jsonwebtoken');

// criação do token
exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

// verifica se é realmente o token que está em funcionamento
exports.decodeToken = async (token) => {
    const data = await jwt.verify(token, global.SALT_KEY);
    return data;
}

// verifica se na requisição se encontra o token
exports.authorize = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            data: null,
            message: 'Acesso Restrito',
            status: 401,
            success: false 
        });
    } 
    else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    data: null,
                    message: 'Token Inválido',
                    status: 401,
                    success: false 
                });
            } 
            else {
                next();
            }
        });
    }
}

exports.isAdmin = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            data: null,
            message: 'Token Inválido',
            status: 401,
            success: false 
        });
    } 
    else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    data: null,
                    message: 'Token Inválido',
                    status: 401,
                    success: false 
                });
            } 
            else {
                if (decoded.roles.includes('admin')) {
                    next();
                } 
                else {
                    res.status(403).json({
                        data: null,
                        message: 'Esta funcionalidade é restrita para administradores',
                        status: 401,
                        success: false 
                    });
                }
            }
        });
    }
};