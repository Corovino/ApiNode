'use strict'

let mongoose = require('mongoose');
let Schema   = mongoose.Schema;


let UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    image:String,
    password: String,
    role:String
});

module.exports = mongoose.model('User', UserSchema);

