'use strict'

let express = require('express');

let AnimalController = require('../controllers/animal');



let api = express.Router();
let md_auth = require('../middlewares/authenticate');
let md_validateRol = require('../middlewares/validateRolUser');

let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir : './uploads/animals'});


api.get('/animales', AnimalController.getAnimals);
api.get('/animal/:id',AnimalController.getAnimal);
api.get('/image-animal/:images', [md_auth.ensureAuth, md_validateRol.isAdmin], AnimalController.getImageFile);
api.post('/animales', md_auth.ensureAuth, AnimalController.saveAnimal);
api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_upload, md_validateRol.isAdmin], AnimalController.uploadImage);
api.put('/animal/:id', [md_auth.ensureAuth, md_validateRol.isAdmin], AnimalController.updateAnimal);
api.delete('/animal/:id', [md_auth.ensureAuth, md_validateRol.isAdmin], AnimalController.deleteAnimal);

module.exports = api;