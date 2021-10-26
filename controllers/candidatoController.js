const Vacantes = require('../models/Vacantes');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs'); 

exports.subirCv = (req, res, next) => {
    const configurarMulter = {
        limits: { fileSize: 1024*1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads/cv');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        }),
        fileFilter (req, file, cb) {
            if(file.mimetype === 'application/pdf') {
                //El callBack se ejecuta como true o false ; true cuando la imagen se acepta
                cb(null, true);
            } else {
                cb(new Error('Formato No Válido'), false);
            }

            const fileSize = parseInt(req.headers['content-length']);
            
            if (fileSize > 1024*1024) {
                cb(new Error('Tamaño maximo 1MB'));
            }
        }
    }

    const upload = multer(configurarMulter).single('cv');

    upload(req, res, async (error) => {
        if(!error) {
            return next();
        } else {
            return res.json({ msg: error.message });
        }
    });
}

exports.agregarCandidato = async (req, res, next) => {

    const { url } = req.params;

    const vacante = await Vacantes.findOne({ url });

    if( !vacante ) return next();

    const { nombre, email } = req.body;
    
    const nuevoCandidato = {
        nombre,
        email,
        cv: req.file.filename
    }

    vacante.candidatos.push(nuevoCandidato);

    try {
        await vacante.save();
        res.json({ msg: 'Curriculum enviado' });
        return next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el Servidor' })
    }
}

exports.obtenerCandidatos = async (req, res, next) => {
    
    const { id } = req.params;

    let vacante = await Vacantes.findById(id);

    if(!vacante) return next();

    if(vacante.autor.toString() != req.usuario.id) return next();

    const { candidatos } = vacante;

    res.json({ candidatos }); 

}

exports.eliminarCandidato = async (req, res, next) => {
    
    const { id } = req.params;
    const { email } = req.body;

    let vacante = await Vacantes.findById(id);

    if(!vacante) return next();

    if(vacante.autor.toString() != req.usuario.id) return next();

    const cv = vacante.candidatos.filter( candidato => candidato.email === email && ( candidato.cv ) );

    fs.unlinkSync(__dirname+`/../uploads/cv/${cv[0].cv}`);

    const candidatos = vacante.candidatos.filter( candidato => candidato.email !== email );

    vacante.candidatos = candidatos;

    await vacante.save();

    res.json({ msg: 'Candidato eliminado' });

    return next();
    
}