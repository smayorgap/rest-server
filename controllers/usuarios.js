const { request, response } = require('express');

const usuariosGet = ( req = request, res = response ) => {

    const query = req.query;


    res.json({
        msj: "get API - controlador",
        query
    });
}


const usuariosPost = ( req = request, res = response ) => {

    const { nombre, edad } = req.body;

    res.json({
        msj: "post API - controlador",
        nombre,
        edad
    });
}


const usuariosPut = ( req = request, res = response ) => {

    const id = req.params.id;

    res.json({
        msj: "put API - controlador",
        id
    });
}


const usuariosPatch = ( req = request, res = response ) => {
    res.json({
        msj: "patch API - controlador"
    });
}


const usuariosDelete = ( req = request, res = response ) => {
    res.json({
        msj: "delete API - controlador"
    });
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}