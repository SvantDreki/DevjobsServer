const Skills = require('../models/Skills');

exports.agregarSkills = async (req, res) => {
    const cantidad = (await Skills.find({})).length;

    const skill = new Skills(req.body)
    skill._id = cantidad + 1;
    await skill.save();

    res.json({ msg: 'Correcto' });

}

exports.obtenerSkills = async (req, res, next) => {

    const skills = await Skills.find({});

    res.json({ skills });

    return next();
}