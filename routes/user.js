'use strict'

let express = require('express');

let  UserController = require('../controllers/user');

let api = express.Router();
let md_auth = require('../middlewares/authenticate');

let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir : './uploads/users'});


api.get('/pruebas', md_auth.ensureAuth,  UserController.pruebas);
api.get('/image-user/:images', md_auth.ensureAuth, UserController.getImageFile);
api.get('/keepers', md_auth.ensureAuth, UserController.getKeepers);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
module.exports = api;




















