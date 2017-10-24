'user strict'

//modulos

var fs     = require("fs"),
    path   = require('path'),
    User   = require('../models/user'),
    Animal = require('../models/animal');

let pruebas = (req , res) => {
    console.log(req.user);
    res.status(200).send({
        message : 'soy un test de animales :)',
        user: req.user
    });
}

let saveAnimal = (req, res)=> {

    let animal = new Animal();
    let params = req.body;

    if(params.name)
    {
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;

        animal.save((err, animalStore) => {
            if(err)
            {
                res.status(500).send({message:'Erro en el servidor'});
            }else{
                if(!animalStore)
                {
                    res.status(400).send({message:'no se guardo el animal '});

                }else{
                    res.status(200).send({message:animalStore});

                }
            }
        })
    }else{
        res.status(200).send({message:'El nombre es obligatorio'});
    }

}


let getAnimals = (req, res) => {
     Animal.find({}).populate({path:'user'}).exec((err, animals)=>{
         if(err){
             res.status(500).send({message:'Erro en el servidor'});
         }else{
             if(!animals){
                 res.status(400).send({message:'no hay animal'});
             }else{
                 res.status(200).send({animals});
             }
         }
     } );
}

let getAnimal = (req,res)=> {
    let animalId = req.params.id;
    Animal.findById(animalId).populate({path:'user'}).exec((err,animal)=>{
        if(err){
            res.status(500).send({message:'Erro en el servidor'});
        }else{
            if(!animal){
                res.status(400).send({message:'no hay animales'});
            }else{
                res.status(200).send({animal});
            }
        }
    })
}

let updateAnimal = (req, res)=>{
    let animalId = req.params.id;
    let update   = req.body;

    Animal.findByIdAndUpdate(animalId, update,{new:true},(err,updateAnimal)=>{
        if(err){
            res.status(500).send({message:'Erro en el servidor'});
        }else{
            if(!updateAnimal){
                res.status(400).send({message:'no se actualizo el animal'});
            }else{
                res.status(200).send({updateAnimal});
            }
        }
    })

}


let uploadImage = (req, res) => {

    let animalId = req.params.id;
    let file_name = 'No subido...';


    if(req.files)
    {
        let file_path = req.files.image.path;
        let file_split = file_path.split('/');
        let filename = file_split[2];
        let ext_split = filename.split('.');
        let file_ext = ext_split[1];


        if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' || file_ext === 'gif')
        {


            Animal.findByIdAndUpdate(animalId, {image:filename},{new:true}, (err, animalUpdate) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el animal'});
                }else{
                    if(!animalUpdate){
                        res.status(404).send({mesagge:'No se ha podido actualizar el animal'});
                    }else{

                        res.status(200).send({animal:animalUpdate, image: filename});
                    }
                }
            });
        }else{

            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(500).send({message:'Formato invalido foto borrada'});
                } else {

                    res.status(500).send({message:'Formato invalido'});
                }
            });
        }
    }else{
        res.status(404).send({message:'Archivo no encontrado'});
    }


}

let getImageFile = (req, res) => {

    let imageFile = req.params.images;
    let path_file = './uploads/animals/'+imageFile;

    fs.exists(path_file, (exists) => {

        if(exists)
        {
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'la img no existe'});
        }
    });
}

let deleteAnimal = (req, res)=>{

    let animalId = req.params.id;
    console.log(animalId);
    Animal.findByIdAndRemove(animalId,(err,animalRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!animalRemoved){
                res.status(404).send({mesagge:'No se ha podido actualizar el animal'});
            }else{

                res.status(200).send({animal:animalRemoved});
            }
        }
    })

}
module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImage,
    getImageFile,
    deleteAnimal
}