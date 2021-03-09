const { request, response } = require("express")

const esAdminRole = ( req = request, res = response, next ) => {

    if( !req.usuario ) {
        return res.status(500).json({
            Mensaje: 'Se quiere verificar el role sin validar el token antes'
        });
    }
    

    const { rol, nombre } = req.usuario;

    if( rol !== 'ADMIN_ROL' ) {
        return res.status(401).json({
            Mensaje: `${ nombre } no es administrador - No puede hacer esto`
        });
    }


    next();

}



const tieneRol = ( ...roles ) => { // recibe todos los argumentos, para no especificar 1 en 1

    return ( req = request, res = response, next ) => { // retorna esta funcion la cual sera ejecutar en las rutas

        if( !req.usuario ) {
            return res.status(500).json({
                Mensaje: 'Se quiere verificar el role sin validar el token antes'
            });
        }


        if( !roles.includes( req.usuario.rol )) {
            return res.status(401).json({
                Mensaje: `El servicio requiere uno de estos roles: ${ roles }`
            });
        }


        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRol
}