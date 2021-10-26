const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const candidatoController = require('../controllers/candidatoController');

router.post('/:url',
    candidatoController.subirCv,
    candidatoController.agregarCandidato
);

router.get('/:id', 
    auth,
    candidatoController.obtenerCandidatos
);

router.post('/:id',
    auth,
    candidatoController.eliminarCandidato
);

module.exports= router;