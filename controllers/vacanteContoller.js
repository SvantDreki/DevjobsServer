const Vacantes = require('../models/Vacantes');
const Usuarios = require('../models/Usuarios');
const { validationResult } = require('express-validator');
const slug = require('slug');
const shortid = require('shortid');

exports.nuevaVacante = async (req, res, next) => {

    //Mostrar errores de express-validator
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const vacante = new Vacantes(req.body);

    vacante.autor = req.usuario.id;
    const url = await slug(vacante.titulo);
    vacante.url = `${url}-${shortid.generate()}`;

    try {
        await vacante.save();

        res.json({ msg: 'Vacante Creada Correctamente' });
    } catch (error) {
        console.log(error);
        return next();
    }
    

}

exports.editarVacante = async (req, res) => {

    const { url } = req.params;

    try {
        let vacante = await Vacantes.findOne({ url });

        if(!vacante) {
            return res.status(404).json({ msg: 'Vacante no Encontrada' });
        }

        if(vacante.autor.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        const vacanteActualizada = req.body;

        vacante = await Vacantes.findOneAndUpdate({ url }, vacanteActualizada, { new: true } );

        res.json({ msg: 'Actualizado Correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el Servidor' });
    }
}

exports.eliminarVacante = async (req, res) => {
    const { id } = req.params;

    let vacante = await Vacantes.findById(id);

    if(!vacante) {
        return res.status(404).json({ msg: 'Vacante no Encontrada' });
    }

    if(vacante.autor.toString() !== req.usuario.id) {
        return res.status(401).json({ msg: 'No Autorizado' });
    }

    try {
        
        await Vacantes.findOneAndDelete({ _id: id });
        return res.json({ msg: 'Eliminado Correctamente' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el Servidor' })
    }
}

exports.obtenerVacantes = async (req, res,next) => {
    
    const vacantes = await Vacantes.find({});

    res.json({ vacantes });

    return next();
}

exports.obtenerVacante = async (req, res, next) => {
    const { url } = req.params;

    let vacante = await Vacantes.findOne({ url });

    if(!vacante) {
        return res.status(404).json({ msg: 'Vacante no Encontrada' });
    }

    const usuario = await Usuarios.findOne({ _id: vacante.autor });

    const autor = {
        nombre: usuario.nombre,
        imagen: usuario.imagen
    }

    res.json({ vacante, autor});

    return next();

}

exports.obtenerAutor = async (req, res, next) => {
    const { id } = req.params;

    const usuario = await Usuarios.findOne({ autor: id });

    const autor = {
        nombre: usuario.nombre,
        imagen: usuario.imagen
    };

    res.json({ autor });

    return next();
}

