const Usuarios = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: 'variables.env' });

exports.autenticarUsuario = async (req, res, next) => {

    //Mostrar errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
    }

    //Ver si el usuario esta registrado
    const { email, password } = req.body;
    const usuario = await Usuarios.findOne({ email });
    if(!usuario) {
        res.status(401).json({ msg: 'El usuario no esta Registrado' });
        return next();
    }

    //Verificar la pass y autenticar al usuario
    if(bcrypt.compareSync( password, usuario.password)) {
        //Crear jwt
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            imagen: usuario.imagen
        }, process.env.SECRETA, {
            expiresIn: '24h'
        });

        res.json({ token });
    } else {
        res.status(401).json({ msg: 'Password Incorrecta' });
        return next();
    }

}

exports.usuarioAutenticado = (req, res) => {
    const { usuario } = req;

    res.json({ usuario });
}