'use strict';

let mongoose = require('mongoose');
let app = require('./app');

let port = process.env.PORT || 3789;


mongoose.connect('mongodb://localhost:27017/petfud',{ useMongoClient : true})
    .then( () => {
        console.log('Se conecto')
        app.listen(port, () => {
            console.log("server runing...");
        });
    } )
    .catch( err => console.log(err));

