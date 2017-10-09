'use strict'

let  mongoose = require('mongoose');
let Schema  = mongoose.Schema;

var AnimalSchema = Schema({
   name:String,
   description:String,
   year:number,
   image:String,
   user: {
       type:Schema.ObjectId,
       ref: 'User'
   }
});
module.exports = mongoose.model('Animal', AnimalSchema);
