'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//cargar rutas

let user_routes = require('./routes/user');

//middlewares body-parser

app.use(bodyParse.urlencoded({extended : false}));
app.use(bodyParse.json());

//cabeceras y cors

//rutas base

app.use('/api',user_routes);


module.exports = app;