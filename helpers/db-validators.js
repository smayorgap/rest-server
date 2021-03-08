const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioPorId
}