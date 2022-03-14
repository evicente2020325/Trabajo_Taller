const express = require('express');
const ProductoControlador = require('../controllers/productos.controller');
const md_autenticacion = require('../middelwares/autenticacion');

const api = express.Router();

api.post('/agregarProductos',md_autenticacion.Auth, ProductoControlador.agregarProducto);
api.put('/editarProductos/:idProducto', md_autenticacion.Auth, ProductoControlador.editarProducto);
api.get('/ObservarProductos', md_autenticacion.Auth, ProductoControlador.ObtenerProductos)
api.get('/ObtenerProductoXCatetegoria/:idCategoria', md_autenticacion.Auth, ProductoControlador.buscarProductoXCategoria);
api.get('/stockProductos/:idProducto', md_autenticacion.Auth, ProductoControlador.StockProductos);

module.exports = api;