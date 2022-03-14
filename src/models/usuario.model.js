const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioModel = Schema({
    nombre : String,
    apellido : String,
    password : String,
    rol : String,
})

module.exports = mongoose.model('Usuario', UsuarioModel);