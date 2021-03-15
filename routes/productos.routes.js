const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, eliminarProducto, actualizarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeUsuarioPorId, existeProductoPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();


/**
 * {{url}}/api/categorias
 */

 // Obtener todas las categorias - publico
router.get('/', obtenerProductos);


// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido.').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto);


// Crear producto - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').trim().not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);


// Actualizar un registro por id - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);


// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], eliminarProducto);





module.exports = router;