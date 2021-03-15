const { request, response } = require("express");
const Categoria = require('../models/categoria');


// Obtener categorias - paginado - total - poupalte
const obtenerCategorias = async( req = request, res = response ) => {

    const { limite = 5 } = req.query;

    try {

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments({ estado: true }),
            Categoria.find({ estado: true })
                    .populate('usuario', 'nombre')
                    .limit( parseInt(limite) ),
        ]);


        res.json({
            total,
            categorias
        })
    
    } catch (error) {
        res.status(400).json({
            Mensaje: 'Algo paso, hable con el admin'
        })
    }
    
}

// ObtenerCategoria - populate
const obtenerCategoria = async( req= request, res = response ) => {

    const { id } = req.params

    const categoria = await Categoria.findById( id, {estado: true} ).populate('usuario', 'nombre');


    res.json(categoria)

}


const crearCategoria = async( req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            Mensaje: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    
    // Guardar DB
    await categoria.save();

    res.json(categoria);


}


// Actualizar categoria
const actualizarCategoria = async( req = request, res = response ) => {

    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const updateCategoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.json(updateCategoria);
}


// Borrar Categoria - estado false
const eliminarCategoria = async( req = request, res = response ) => {

    const { id } = req.params;
  

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true}); // Actualizamos el estado a false
    
    res.json(categoria);
}




module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    eliminarCategoria,
    actualizarCategoria
}