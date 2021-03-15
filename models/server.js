const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.buscarPath = '/api/buscar';
        this.productosPath = '/api/productos';
        this.categoriaPath = '/api/categorias';
        this.uploadsPath = '/api/uploads';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB() {

        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use( this.authPath, require('../routes/auth.routes') ); 
        this.app.use( this.buscarPath, require('../routes/buscar.routes'));
        this.app.use( this.usuariosPath, require('../routes/usuarios.routes') );
        this.app.use( this.productosPath, require('../routes/productos.routes') );
        this.app.use( this.categoriaPath, require('../routes/categorias.routes'));
        this.app.use( this.uploadsPath, require('../routes/uploads.routes'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server is running on port', this.port);
        });
    }



}


module.exports = Server;