const Usuarios = require('../models/Usuarios');
const Vacantes = require('../models/Vacantes');
const bcrypt = require('bcrypt');
const { validationResult }  = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    
    //Mostrar errores de express-validator
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    let usuario = await Usuarios.findOne({ email });
    if(usuario) {
        return res.status(400).json({ msg: 'Usuario ya esta Registrado' });
    }

    //Crear el usuario
    usuario = new Usuarios(req.body);

    //hashear pass
    const salt = await bcrypt.genSaltSync(10);
    usuario.password = await bcrypt.hashSync( password, salt );

    try {
        await usuario.save();

        res.json({ msg: 'Usuario creado Correctamente' });
    } catch (error) {
        console.log(error);
    }

}

exports.subirImagen = (req, res, next) => {
    const configurarMulter = {
        limits: { fileSize: 1024*1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads/perfiles');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        }),
        fileFilter (req, file, cb) {
            if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
                //El callBack se ejecuta como true o false ; true cuando la imagen se acepta
                cb(null, true);
            } else {
                cb(new Error('Formato No Válido, jpeg o png'), false);
            }

            const fileSize = parseInt(req.headers['content-length']);
            
            if (fileSize > 1024*1024) {
                cb(new Error('Tamaño maximo 1MB'));
            }
        }
    }

    const upload = multer(configurarMulter).single('imagen');

    upload(req, res, async (error) => {
        if(!error) {
            return next();
        } else {
            return res.json({ msg: error.message });
        }
    });
}

exports.editarPerfil = async (req, res, next) => {
    const usuario = await Usuarios.findById( req.usuario.id );

    const { nombre, email, password } = req.body;

    usuario.nombre = nombre;
    usuario.email = email;

    if(password) {
        //hashear nueva pass
        const salt = await bcrypt.genSaltSync(10);
        usuario.password = await bcrypt.hashSync( password, salt );
    }

    if(req.file) {
        if(usuario.imagen) {
            fs.unlinkSync(__dirname+`/../uploads/perfiles/${usuario.imagen}`);
            usuario.imagen = req.file.filename;
        } else {
            usuario.imagen = req.file.filename;
        }
    }

    //Crear jwt
    const token = jwt.sign({
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        imagen: usuario.imagen
    }, process.env.SECRETA, {
        expiresIn: '24h'
    });

    await usuario.save();

    res.json({
        msg: 'Perfil Actualizado Correctamente',
        token
    })

}

exports.obtenerVacanteUsuario = async (req, res, next) => {
    
    const usuario = await Usuarios.findOne({ email: req.usuario.email });

    const vacantes = await Vacantes.find({autor: usuario._id});

    res.json({ vacantes });

    return next();
}

