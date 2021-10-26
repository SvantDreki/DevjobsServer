const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vacantesSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        required: true,
        trim: true
    },
    salario: {
        type: Number,
        default: 0
    },
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios'
    }
});

module.exports = mongoose.model('Vacantes', vacantesSchema);