'user strict'

//modulos

var bcrypt = require('bcrypt-nodejs'),
    fs     = require("fs"),
    path   = require('path'),
    User  = require('../models/user'),
    JWT   = require('../services/jwt');

let pruebas = (req , res) => {

    res.status(200).send({
        message : 'soy un test de usuario :)',
        user: req.user
    });
}


let saveUser = (req, res) => {
    let user = new User();
    let params = req.body;


    if( params.password && params.name && params.surname && params.email){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({ email : user.email.toLowerCase()}, (err, respUser) => {
             if(err)
             {
                 res.status(500).send({message:'El usuario ya se encuentra registrado'});
             }else{

                 if (!respUser)
                 {
                    console.log('entro');
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        user.save((err,userStored)=>{
                            if(err)
                            {
                                res.status(500).send({message:"Problemas alguardar el usuario"});
                            }else{
                                if(!userStored)
                                {
                                    res.status(404).send({message:"Problemas alguardar el usuario no found"});
                                }else{
                                    console.log(userStored);
                                    res.status(200).send({message: userStored});
                                }
                            }
                        });
                    });
                 }
             }

             res.status(500).send({message: "Elusuario ya esta registrado"});

        });

    }else{
        res.status(200).send({message:"datos incorrectos"});
    }



}

let login = (req, res) => {
     let params = req.body;
     let email = params.email;
     let password = params.password;

     User.findOne({ email: email.toLowerCase()},( err, user) => {
         if(err)
         {
             res.status(500).send({message:'Error al comprobar'});
         }else{
             if(user)
             {
                 bcrypt.compare(password,user.password,(err,check)=> {
                     if(check)
                     {
                         if(params.gettoken)
                         {
                            res.status(200).send({toekn:JWT.createToken(user)});
                         }else{
                            res.status(200).send({message:user});
                         }
                     }else{
                         res.status(500).send({message:"credenciales incorrectas"});

                     }
                 });
             }else{
                 res.status(404).send({message:"El usuario no existe"});
             }
         }

     });
 }


 let updateUser = (req, res) => {
    let userId = req.params.id;
    let update = req.body;
    console.dir(update);

    if(userId != req.user.sub)
    {
        res.status(500).send({message:'No tiene permisos para ejecutar la acción'});
    }

    User.findByIdAndUpdate(userId, update,{new:true}, (err, userUpdate) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!userUpdate){
                res.status(404).send({mesagge:'No se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({user:userUpdate});
            }
        }
    });
 }

 let uploadImage = (req, res) => {

    let userId = req.params.id;
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
            if(userId != req.user.sub)
            {
                res.status(500).send({message:'No tiene permisos para ejecutar la acción'});
            }

            User.findByIdAndUpdate(userId, {image:filename},{new:true}, (err, userUpdate) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!userUpdate){
                        res.status(404).send({mesagge:'No se ha podido actualizar el usuario'});
                    }else{
                        console.log("user:"+userUpdate);
                        res.status(200).send({user:userUpdate, image: filename});
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
    let path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, (exists) => {
        console.log(exists);
        if(exists)
        {
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'la img no existe'});
        }
    });
 }

let getKeepers = (req,res) => {

    User.find({role:'ROLE_ADMIN'}).exec((err,users)=>{
        if(err)
        {
            res.status(500).send({mssage:'Error en la pticion'});
        }else{
            if(!users)
            {
                res.status(404).send({message:'No hay cuidadores'});
            }else{
                res.status(200).send({users});
            }
        }
    });

}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
}
















