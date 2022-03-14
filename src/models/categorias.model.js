const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaModel = Schema({
    nombreCategoria : String
})

module.exports = mongoose.model('Categoria', CategoriaModel);