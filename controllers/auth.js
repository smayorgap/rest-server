const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');


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


const googleSignin = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if( !usuario ) {
            // Crear el usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        // SI el usuario esta inactivo en DB
        if( !usuario.estado ) {
            return res.status(401).json({
                Mensaje: 'Hable con el administrador, usuario bloqueado'
            });
        }
        
        // Generar token
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });


    } catch (error) {
        
        res.status(400).json({
            Mensaje: 'Token de Google no es valido'
        })

    }


}

module.exports = {
    login,
    googleSignin
}