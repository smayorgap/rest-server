const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir, validarCampos } = require('../middlewares')


const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
], mostrarImagen );

router.post('/', validarArchivoSubir, cargarArchivo );

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos']) ),
    validarCampos,
    validarArchivoSubir
], actualizarImagenCloudinary ) 
//actualizarImagen )


module.exports = router;