const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoModel = Schema({
    nombreProducto : String,
    codigo : String,
    precio: Number,
    cantidad: Number,
    categoria: [{
        nombreCategoria: String
    }],
    rol: String
})

module.exports = mongoose.model('Producto', ProductoModel);