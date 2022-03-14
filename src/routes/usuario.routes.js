const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middelwares/autenticacion');

const api = express.Router();

api.post('/registrar', usuarioControlador.Registrar);
api.post('/login', usuarioControlador.Login);
api.put('/editarUsuario/:idUsuario', md_autenticacion.Auth, usuarioControlador.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.Auth, usuarioControlador.EliminarUsuario);


module.exports = api;