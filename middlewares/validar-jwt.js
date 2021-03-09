
const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            Mensaje: 'No hay token en la peticion'
        });
    }


    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
        
        //req.uid = uid;

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if( !usuario ) {
            return res.status(400).json({
                Mensaje: 'Usuario no existe  - undefinded'
            });
        }


        // Verificar si el uid tiene estado en true
        if( !usuario.estado ) {
            return res.status(401).json({
                Mensaje: 'Usuario inactivo - estado: false'
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            Mensaje: 'Token no valido.'
        });
    }
    
}

module.exports = {
    validarJWT

}