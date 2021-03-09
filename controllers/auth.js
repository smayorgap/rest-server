const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');


const login = async( req = request, res = response ) => {

    const { correo, password } = req.body;
    
    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                Mensaje: 'Usuario / Password incorrectos - correo'
            });
        }

        
        // El usuario esta activo
        if( !usuario.estado ) {
            return res.status(400).json({
                Mensaje: 'Usuario / Password incorrectos - estado: false'
            });
        }

        // Verificar password
        const validPass = bcryptjs.compareSync( password, usuario.password );
        if( !validPass ) {
            return res.status(400).json({
                Mensaje: 'Usuario / Password incorrectos - password'
            });
        }


        // Generar JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        });    
        
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            msg: 'Algo salio mal, hable con el administrador.'
        });
    }

}


module.exports = {
    login
}