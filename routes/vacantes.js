const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vacanteController = require('../controllers/vacanteContoller');
const { check } = require('express-validator');

router.post('/',
    [
        check('titulo', 'El titulo es obligatorio').notEmpty(),
        check('ubicacion', 'Campo Obligatorio').notEmpty()
    ],
    auth,
    vacanteController.nuevaVacante
);

router.put('/:url', 
    auth,
    vacanteController.editarVacante
);

router.delete('/:id',
    auth,
    vacanteController.eliminarVacante
)

router.get('/', 
    vacanteController.obtenerVacantes
)

router.get('/:url', 
    vacanteController.obtenerVacante
);

router.get('/autor/:id',
    auth,
    vacanteController.obtenerAutor
);

module.exports = router;