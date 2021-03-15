const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, eliminarCategoria, actualizarCategoria } = require('../controllers/categorias');
const { existeCategoria, existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();


/**
 * {{url}}/api/categorias
 */

 // Obtener todas las categorias - publico
router.get('/', obtenerCategorias);


// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido.').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria);


// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
    validarCampos
], crearCategoria);


// Actualizar un registro por id - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoria ),
    validarCampos
], actualizarCategoria);


// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], eliminarCategoria);





module.exports = router;