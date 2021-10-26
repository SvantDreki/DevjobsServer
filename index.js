const express = require('express');
const conectarBD = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la DB
conectarBD();

//Habilitar cors
app.use( cors({
    origin: {
        source: 'https://unruffled-jepsen-efd1d0.netlify.app/'
    }
}) );

app.options('*', cors());

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

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor en el puerto ${port}`);
});
