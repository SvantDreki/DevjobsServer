const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
 
router.post('/',
    [
        check('nombre', 'El nombre es Obligatorio').notEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);

router.post('/editar', 
    auth,
    usuarioController.subirImagen,
    usuarioController.editarPerfil
);

router.get('/vacantes', 
    auth,
    usuarioController.obtenerVacanteUsuario
);

module.exports = router;