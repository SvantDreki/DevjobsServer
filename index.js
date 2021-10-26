const express = require('express');
const conectarBD = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la DB
conectarBD();

//Opciones de cors
const opciones = {
    origin: {
        source: `${process.env.FRONTEND_URL}`
    }
}

//Habilitar cors
app.use( cors(opciones) );

const port = process.env.PORT || 4000;

//Habilitar leer los valores del body
app.use( express.json() );

//Habilitar carpeta publica
app.use( express.static('uploads') );

//Rutas 
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vacantes', require('./routes/vacantes'));
app.use('/api/candidatos', require('./routes/candidatos')); 
app.use('/api/skills', require('./routes/skills'));

app.listen(port, () => {
    console.log(`Servidor en el puerto ${port}`);
});
