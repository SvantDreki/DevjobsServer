const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');

router.post('/', 
    skillsController.agregarSkills
)

router.get('/',
    skillsController.obtenerSkills
);

module.exports = router;