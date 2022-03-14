const Producto = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');

function agregarProducto(req, res) {
    var parametros = req.body;
    var ProductosModel = new Producto();

    if(req.user.rol == 'ADMINISTRADOR'){
        if(parametros.nombreProducto && parametros.codigo && parametros.precio && parametros.cantidad) {
            ProductosModel.nombreProducto = parametros.nombreProducto;
            ProductosModel.codigo = parametros.codigo;
            ProductosModel.precio = parametros.precio;
            ProductosModel.cantidad = parametros.cantidad;
            ProductosModel.rol = 'PRODUCTOS'
                Producto.find({ nombreProducto : parametros.nombreProducto }, (err, ProductoEncontrado) => {
                    
                    if ( ProductoEncontrado.length == 0 ) {
    
                            ProductosModel.save((err, ProductoGuardado) => {
                                if (err) return res.status(500)
                                    .send({ mensaje: 'Error en la peticion' });
                                if(!ProductoGuardado) return res.status(500)
                                    .send({ mensaje: 'Error al agregar el producto'});
                                
                                return res.status(200).send({ producto: ProductoGuardado });
                            });                    
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Este nombre ya se encuentra utilizado' });
                    }
                })
        }
    }else{
        return res.status(500).send({mensaje: 'Tiene que ser administrador para agregar productos.'})
    }
}

function editarProducto(req, res) {
    var idProducto = req.params.idProducto;
    var parametros = req.body;

    if(req.user.rol == 'ADMINISTRADOR'){
        Producto.findByIdAndUpdate(idProducto, parametros, { new : true } ,(err, ProductoEditado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!ProductoEditado) return res.status(404)
                .send({ mensaje: 'Error al Editar el producto' });
    
            return res.status(200).send({ producto: ProductoEditado});
        })
    }else{
        return res.status(404).send({mensaje: 'Tiene que ser administrador para editar los productos.'})
    }
    
}

function ObtenerProductos (req, res) {
    Producto.find({}, (err, productosEncontrados) => {
        return res.send({ productos: productosEncontrados })
    })
}

function StockProductos (req, res) {
    var idProducto = req.params.idProducto;

    Producto.findOne({_id : idProducto}, (err, productoEncontrados) => {
        return res.send({productos : productoEncontrados.cantidad })
    })

} 

function buscarProductoXCategoria(req, res) {
    const categoriaId = req.params.idCategoria;

    Producto.find({ categoria: { $elemMatch: { _id: categoriaId } } }, (err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!productosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener los productos por categoria'});

        return res.status(200).send({ productos: productosEncontrados })
    })
    
}

module.exports = {
    agregarProducto,
    editarProducto,
    ObtenerProductos,
    buscarProductoXCategoria,
    StockProductos
}