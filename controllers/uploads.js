const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')


const cargarArchivo = async( req = request, res = response ) => {


    try {
        // Imagenes
        //const nombreArchivo = await subirArchivo( req.files, ['txt','pdf'], 'pdf' );
        const nombreArchivo = await subirArchivo( req.files, undefined, 'images' );

        res.json({ nombreArchivo });

    } catch (mensaje) {
        res.status(400).json( {mensaje} );
    }

    
}


const actualizarImagen = async( req = request, res = response ) => {


    const { id, coleccion } = req.params;

    let modelo;

    try {
        switch ( coleccion ) {
            case 'usuarios':
                
                modelo = await Usuario.findById( id );
                if ( !modelo ) {
                    return res.status(400).json({ Mensaje: `No existe un usuario con el id ${id}`});
                }
    
            break;
    
            case 'productos':
                modelo = await Producto.findById( id );
                if ( !modelo ) {
                    return res.status(400).json({ Mensaje : `No existe un producto con el id ${ id }`});
                }
            break;
        
            default:
                return res.status(500).json({ Mensaje: 'Se me olvido validar esto.'})
                
        }
        
        // Limpiar imagenes previas
        if ( modelo.img ) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if ( fs.existsSync( pathImagen ) ){
                fs.unlinkSync( pathImagen );
            }
        }

    
        const nombre = await subirArchivo( req.files, undefined, coleccion );
        modelo.img = nombre;
    
        await modelo.save();
    
    
        res.json( modelo );

    } catch ( mensaje ) {
        res.status(400).json({ mensaje });
    }

}



const actualizarImagenCloudinary = async( req = request, res = response ) => {


    const { id, coleccion } = req.params;

    let modelo;

    try {
        switch ( coleccion ) {
            case 'usuarios':
                
                modelo = await Usuario.findById( id );
                if ( !modelo ) {
                    return res.status(400).json({ Mensaje: `No existe un usuario con el id ${id}`});
                }
    
            break;
    
            case 'productos':
                modelo = await Producto.findById( id );
                if ( !modelo ) {
                    return res.status(400).json({ Mensaje : `No existe un producto con el id ${ id }`});
                }
            break;
        
            default:
                return res.status(500).json({ Mensaje: 'Se me olvido validar esto.'})
                
        }
        
        // Limpiar imagenes previas
        if ( modelo.img ) {
            // TODO
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            
            cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.img = secure_url;

    
        await modelo.save(); 
    
    
        res.json( modelo );

    } catch ( mensaje ) {
        res.status(400).json({ mensaje });
    }

}



const mostrarImagen = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    try {
        switch ( coleccion ) {
            case 'usuarios':
                
                modelo = await Usuario.findById( id );
                if ( !modelo ) {
                    return res.status(400).json({ Mensaje: `No existe un usuario con el id ${id}`});
                }
    
            break;
    
            case 'productos':
                modelo = await Producto.findById( id );
                if ( !modelo ) {
                    return res.status(400).json({ Mensaje : `No existe un producto con el id ${ id }`});
                }
            break;
        
            default:
                return res.status(500).json({ Mensaje: 'Se me olvido validar esto.'})
                
        }
        
        // Limpiar imagenes previas
        if ( modelo.img ) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if ( fs.existsSync( pathImagen ) ){
                return res.sendFile( pathImagen );
            }
        }

        const notFoundImage = path.join( __dirname, '../assets/no-image.jpg'); 
        res.sendFile( notFoundImage )

    } catch ( mensaje ) {
        res.status(400).json({ mensaje });
    }

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}