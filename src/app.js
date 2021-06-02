'use strict';

const express = require('express');
const db = require('../config/db');

const app = express();

// Conexão com o banco
db();

// Carregar models
const Product = require('./models/product');
const Customer = require('./models/customer');

// Carregar rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');

// configuração para receber um json via body da requisição e ter o response no mesmo formato
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRoute);
app.use('/products', productRoute);
 
module.exports = app;