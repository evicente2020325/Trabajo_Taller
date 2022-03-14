const Usuario = require('../models/usuario.model');
const Producto = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');



function Registrar(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

    if(parametros.nombre && parametros.apellido && parametros.password) {

                    modeloUsuario.nombre = parametros.nombre;
                    modeloUsuario.apellido = parametros.apellido;
                    modeloUsuario.rol = 'CLIENTE';
                    //modeloUsuario.totalCarrito = 0;

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        modeloUsuario.password = passwordEncriptada;

                        modeloUsuario.save((err, usuarioGuardado)=>{
                            if(err) return res.status(500)
                                .send({ mensaje : 'Error en la peticion' })
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al guardar el Usuario' })
    
                            return res.status(200).send({ usuario: usuarioGuardado})
                        })
                    })                               
    } else {
        return res.status(404)
            .send({ mensaje : 'Debe ingresar los parametros obligatorios'})
    }

}

function EditarUsuario(req, res) {
    var parametros = req.body;
    var idUsuario = req.params.idUsuario;

    delete parametros.password

    if(req.user.rol == 'ADMINISTRADOR'){
        Usuario.findOne({_id : idUsuario}, (err, usuarioEncontrado) => {
            if(usuarioEncontrado.rol == 'CLIENTE'){
                Usuario.findByIdAndUpdate(idUsuario, parametros, {new: true}, (err, usuarioEditado)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
                    if(!usuarioEditado) return res.status(500).send({mensaje: 'Error al editar el Usuario'});
        
                    return res.status(200).send({ usuario: usuarioEditado });
                })
            }else{
                return res.status(500).send({mensaje : 'No se puede editar este usuario.'})
            }
        })
    }else{
        return res.status(500).send({ mensaje : 'no tienes los permisos para editar un usuario.'})
    }
   
}

function EliminarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;

    if(req.user.rol  == 'ADMINISTRADOR'){
        Usuario.findOne({_id : idUsuario}, (err, usuarioEncontrado) => {
            if(usuarioEncontrado.rol == 'CLIENTE'){
                Usuario.findByIdAndDelete(idUsuario, (err, usuarioElimiando) => {
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if(!usuarioElimiando) return res.status(500)
                        .send({ mensaje: 'Error al eliminar el usuario' })
            
                    return res.status(200).send({ usuario: usuarioElimiando });
                })
            }else{
                return res.status(500).send({mensaje: 'No se pueden eliminar los administradores.'})
            }
        })
    }else{
        return res.status(500).send({message: 'No tienes los permisos para eliminar'})
    }
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ nombre : parametros.nombre }, (err, usuarioEncontrado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'}); 
        if (usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({ token: jwt.crearToken(usuarioEncontrado)})
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La contrasena no coincide.'})
                    }
                })
        }
    })
}

function usuarioPorDefecto() {
    var modeloUsuarios = new Usuario;
    Usuario.find({nombre: 'ADMIN'},(err, usuarioSim) => {
        if(usuarioSim.length > 0) {
            console.log("el usuario ya existe");
        }else{ bcrypt.hash('123456', null, null, (err, password) => {

            modeloUsuarios.nombre = 'ADMIN';
            modeloUsuarios.password = password;
            modeloUsuarios.rol = 'ADMINISTRADOR';

            modeloUsuarios.save((err, usuarioSim) => {
                console.log({usuarioSim: usuarioSim});
            })
        })   
        }
    })
}

module.exports = {
    Registrar,
    Login,
    usuarioPorDefecto,
    EditarUsuario,
    EliminarUsuario
}