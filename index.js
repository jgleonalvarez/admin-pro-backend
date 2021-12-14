// console log('Hola Mundo');
require('dotenv').config();
const express = require('express');
const { dbConn } = require('./database/config');
const cors = require('cors');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConn();

// Rutas
app.get('/', (req, res) => {

    res.json({ // res.status(400).json({
        ok: true,
        msg: 'Hola mundo'
    });

});
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});