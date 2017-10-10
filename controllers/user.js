'user strict'

//modulos

var bcrypt = require('bcrypt-nodejs');

var User   = require('../models/user');
let JWT =require('../services/jwt');

let pruebas = (req , res) => {

    res.status(200).send({
        message : 'soy un test de usuario :)'
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



module.exports = {
    pruebas,
    saveUser,
    login
}