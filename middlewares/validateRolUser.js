'use strict'

exports.isAdmin = ()=>{
    if(req.user.role != 'ROLE_ADMIN')
    {
        res.status(200).send({message : 'No tienes acceso a esta zona'});
    }

    next();
}