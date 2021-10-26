const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillsSchema = new Schema({
    _id: {
        type: Number,
        default: 1
    },
    nombre: {
        type: String
    }
});

module.exports = mongoose.model('Skills', skillsSchema);