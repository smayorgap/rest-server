const { request, response } = require('express');
const Producto = require('../models/producto');


// Obtener productos - paginado - total - populate
const obtenerProductos = async( req = request, res = response ) => {

    const { limite = 5 } = req.query;

    try {
        
        const [ total, productos ] = await Promise.all([
            Producto.countDocuments({ estado: true }),
            Producto.find({ estado: true})
                    .populate('usuario', 'nombre')
                    .populate('categoria', 'nombre')
                    .limit( Number( limite ))
        ]);
        
        res.json({
            total,
            productos
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            Mensaje: 'Algo fallo, hable con el administrador'
        })
    }

}


// Obtener producto
const obtenerProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findById( id )
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');
    
    res.json( producto )


}


//  Crear producto
const crearProducto = async( req = request, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne( { nombre: body.nombre } );


    if( productoDB ){
        return res.status(400).json({
            Mensaje: `El producto ${ productoDB.nombre } ya existe.`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
        ...body
    }

    const producto = new Producto( data );

    // Guardamos en db
    await producto.save();

    res.json( producto );

}

// Actualizar producto
const actualizarProducto = async( req = request, res = response ) => {

    const { id } = req.params;
    
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;


    const productoActualizado = await Producto.findByIdAndUpdate( id, data, { new: true });

    res.json( productoActualizado );

}


// Borrar producto
const eliminarProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true}); // Actualizamos el estado a false
    
    res.json( producto );

}

module.exports = {
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}