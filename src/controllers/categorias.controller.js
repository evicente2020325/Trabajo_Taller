const Productos = require('../models/productos.model');
const Categoria = require('../models/categorias.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


function agregarCategorias (req, res) {
    var parametros = req.body;
    var CategoriaModel = new Categoria();

    if(req.user.rol == 'ADMINISTRADOR'){
        if(parametros.nombreCategoria) {
            CategoriaModel.nombreCategoria = parametros.nombreCategoria;

                Categoria.find({ nombreCategoria : parametros.nombreCategoria }, (err, categoriaEncontrada) => {
                    
                    if ( categoriaEncontrada.length == 0 ) {
    
                            CategoriaModel.save((err, CategoriaGuardada) => {
                                if (err) return res.status(500)
                                    .send({ mensaje: 'Error en la peticion' });
                                if(!CategoriaGuardada) return res.status(500)
                                    .send({ mensaje: 'Error al agregar la categoria'});
                                
                                return res.status(200).send({ categoria: CategoriaGuardada });
                            });                    
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Este nombre ya se encuentra utilizado' });
                    }
                })
        }
    }else{
        return res.status(500).send({mensaje: 'Tiene que ser administrador para agregar categorias.'})
    }

}

function editarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var parametros = req.body;

    if(req.user.rol == 'ADMINISTRADOR'){

        Categoria.findByIdAndUpdate(idCategoria, parametros, { new : true}, (err, categoriaEditada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!categoriaEditada) return res.status(404).send({ mensaje: 'Error al Editar la categoria' });
    
            return res.status(200).send({ categoria: categoriaEditada});
        })          

    }else{

        return res.status(500).send({mensaje: 'Tiene que ser administrador para editar.'})
    }

}
function agregarCategoriaProducto(req, res) {
    var productoId = req.params.idProducto;
    var categoriaId = req.params.idCategoria;

    if(req.user.rol == 'ADMINISTRADOR'){
        Productos.findByIdAndUpdate(productoId, { $push: {  categoria : { idCategoria: categoriaId } } }, {new : true}, 
            (err, categoriaAgregada) => {
                if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
                if(!categoriaAgregada) return res.status(500).send({ mensaje: 'Error al agregar la categoria al producto.'});
    
                return res.status(200).send({ categoria: categoriaAgregada });
            }).populate('categoria.idCategoria');
    }else{
        return res.status(500).send({mensaje: 'No tienes permiso para agregar una categoria.'})
    }
}

function obtenerCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    if(req.user.rol == 'ADMINISTRADOR'){

        Productos.aggregate([
            {
                $match: {"_id": mongoose.Types.ObjectId(idCategoria)}
            },
            {
                $unwind: "$categoria"
            },
            {
                $match: { }
            }, 
            {
                $group: {
                    "_id": "$_id",
                    "nombreCategoria": { "$first": "$nombreCategoria" },
                    "nombreCategoria": { $push: "$nombreCategoria" }
                }
            }
        ]).exec((err, categoriaEncontrada) => {
            return res.status(200).send({ categoria: categoriaEncontrada })
        })

    }else{

        return res.status(200).send({mensaje: 'Solo los administradores pueden ver las categorias'})

    }

}

function editarCategoriaProducto(req, res) {
    const categoriaId = req.params.idCategoria;
    const parametros = req.body;

    if(req.user.rol == 'PRODUCTOS'){
        Productos.findOneAndUpdate({ Categoria: { $elemMatch: {_id: categoriaId}}},
            {"categoria.$.nombreCategoria": parametros.nombreCategoria}, {new : true}, (err, categoriaActualizada) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!categoriaActualizada) return res.status(500).send({mensaje: 'error al editar la categoria'});

        return res.status(200).send({categoria: categoriaActualizada}) 
    })
    }else{
        return res.status(500).send({mensaje: 'no tienes permisos para editar el empleado.'})
    }
    
    
}

function EliminarCategoria(req, res) {
    var idCategoria = req.params.idCategoria;

    if(req.user.rol == 'ADMINISTRADOR'){
        Productos.findOneAndUpdate({ categoria : { $elemMatch : { _id: idCategoria } } }, 
            { $pull : { categoria : { _id : idCategoria } } }, {new : true}, (err, categoriaEliminada)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                if(!categoriaEliminada) return res.status(500).send({ mensaje: 'Error al eliminar la categoria'});
    
                return res.status(200).send({empleado : categoriaEliminada})
            })
    }else{
        return res.status(500).send({mensaje: 'No tienes permisos para eliminar una categoria.'})
    }
}

function categorias(req, res){
    Categoria.find({}, (err, CategoriaEncontrada) => {
        return res.send({categoria: CategoriaEncontrada})
    })
}

function busquedaCategoria(res, req) {
    var productoId = req.user.sub;
    var parametros = req.body;

    
    Empresa.aggregate([
        {
            $match: { "_id": mongoose.Types.ObjectId(productoId) }
        },
        {
            $unwind: "$categoria"
        },
        {
            $match: { "categoria.nombreCategoria": { $regex: parametros.nombreCategoria, $options: 'i' } }
        }, 
        {
            $group: {
                "_id": "$_id",
                "nombreCategoria": { "$first": "$nombreCategoria" },
                "categoria": { $push: "$categoria" }
            }
        }
    ]).exec((err, categoriaEncontrados) => {
        return res.status(200).send({ categoria: categoriaEncontrados })
    })
}

function eliminarCategoria(req, res){
    var idCategoria = req.params.idCategoria;

    if(req.user.rol == 'ADMINISTRADOR'){
        Categoria.findByIdAndDelete(idCategoria, (err, categoriaEliminada)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!categoriaEliminada) return res.status(500)
                .send({ mensaje: 'Error al eliminar la categoria' })
    
            return res.status(200).send({ categoria: categoriaEliminada });
        })
    }else{
        return res.status(500).send({ mensaje: 'Tiene que ser administrador para eliminar categorias.'})
    }   

}

module.exports = {
    agregarCategorias,
    agregarCategoriaProducto,
    editarCategoriaProducto,
    categorias,
    EliminarCategoria,
    busquedaCategoria,
    obtenerCategoria,
    editarCategoria,
    eliminarCategoria
}