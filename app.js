'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//cargar rutas

let user_routes = require('./routes/user');
let animal_routes = require('./routes/animal');

//middlewares body-parser

app.use(bodyParse.urlencoded({extended : false}));
app.use(bodyParse.json());

//cabeceras y cors

app.use((req, res, next)=>{
   res.header('Acces-Cntrol-Allow-Origin','*');
   res.header('Acces-Cntrol-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-Whit, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Method','GET,POST,OPTIONS,PUT,DELETE');
   res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
   next();
});

//rutas base

app.use('/api',user_routes);
app.use('/api',animal_routes);


module.exports = app;