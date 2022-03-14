const express = require('express');
const CategoriaControlador = require('../controllers/categorias.controller');
const md_autenticacion = require('../middelwares/autenticacion');

const api = express.Router();

api.post('/agregarCategorias',md_autenticacion.Auth, CategoriaControlador.agregarCategorias);

api.put('/agregarCategoriaAProducto/:idProducto/:idCategoria',md_autenticacion.Auth, CategoriaControlador.agregarCategoriaProducto);
api.put( '/editarCategoriaProducto/:idCategoria', md_autenticacion.Auth, CategoriaControlador.editarCategoriaProducto);
api.get('/busquedaCategoria', md_autenticacion.Auth, CategoriaControlador.busquedaCategoria);
api.get('/obtenerCategoria', md_autenticacion.Auth, CategoriaControlador.obtenerCategoria)
api.get('/categoriaAgregada', md_autenticacion.Auth, CategoriaControlador.categorias);
api.put('/editarCategoria/:idCategoria', md_autenticacion.Auth, CategoriaControlador.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria', md_autenticacion.Auth, CategoriaControlador.eliminarCategoria);
module.exports = api;