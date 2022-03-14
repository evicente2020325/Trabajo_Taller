const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS
const ProductoRoutes = require('./src/routes/productos.routes');
const UsuarioRoutes = require('./src/routes/usuario.routes');
const CategoriaRoutes = require('./src/routes/categorias.routes');

// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/productos
app.use('/api', ProductoRoutes, UsuarioRoutes, CategoriaRoutes);

module.exports = app;