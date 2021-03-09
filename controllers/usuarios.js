const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async( req = request, res = response ) => {

    //const query = req.query;
    const { limite = 5, desde = 0} = req.query;

    /* const usuarios = await Usuario.find({ estado: true })
        .skip ( Number(desde) )
        .limit( parseInt(limite) );

    const total = await Usuario.countDocuments({ estado: true }); */
    

    // cuando las promesas son independientes se las puede ejecutar de manera simultanea.
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
                .skip ( Number(desde) )
                .limit( parseInt(limite) )
    ]);

    res.json({
        //resp
        total,
        usuarios
    })
}


const usuariosPost = async( req = request, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    
    // Encriptar pass
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar DB
    await usuario.save();

    res.json({
        msj: "post API - controlador",
        usuario
    });
}


const usuariosPut = async( req = request, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    // TODO validar contra bd
    if( password ) {
        // Encriptar pass
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        usuario
    });
}


const usuariosPatch = ( req = request, res = response ) => {
    res.json({
        msj: "patch API - controlador"
    });
}


const usuariosDelete = async( req = request, res = response ) => {

    const { id } = req.params;
    //const  uid  = req.uid;

    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }); // Actualizamos el estado a false

    const usuarioAutenticado = req.usuario;



    res.json({
        usuario
        //uid
    });
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}