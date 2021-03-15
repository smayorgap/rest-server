const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const esRolValido =  async( rol = '' ) => {

    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        throw new Error(`El rol ${ rol } no existe en la BD.`);
    }
}

const correoExiste = async ( correo = '' ) => {

    const existeEmail = await Usuario.findOne({ correo })
    if( existeEmail ) {
        throw new Error(`Este correo ${ correo } ya esta registrado.`);
    }

}


const existeUsuarioPorId = async ( id ) => {

    const existeUserId = await Usuario.findById(id)
    if( !existeUserId ) {
        throw new Error(`El ID ${ id } no existe.`);
    }

}


const existeCategoriaPorId = async( id ) => {

    const existeId = await Categoria.findById( id );
    if( !existeId ) {
        throw new Error (`El ID ${ id } no existe en la categoria`);
    }

}


const existeProductoPorId = async ( id ) => {

    const existeId = await Producto.findById( id );
    if( !existeId ) {
        throw new Error (`El id ${ id } no existe en producto`);
    }
}


/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = '' ) => {

    const incluida = colecciones.includes( coleccion );

    if( !incluida ) {
        throw new Error (`La coleccion ${ coleccion } no es permitida. Colecciones permitidas: ${ colecciones }`)
    }

    return true

}

module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}