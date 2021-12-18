const { response } = require("express");
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

  const medicos = await Medico.find()
                          .populate('usuario', 'nombre img')
                          .populate('hospital', 'nombre')
                          ;
  res.json({
    ok: true,
    medicos
  });
};

const crearMedico = async (req, res = response) => {

  const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicoDB = await medico.save();

        return res.json({
            ok: true,
            hospital: medicoDB
        });

    } catch(error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administador',
            error
        });
    }
};

const actualizarMedico = async (req, res = response) => {
  res.json({
    ok: true,
    msg: "actualizarMedico",
  });
};

const borrarMedico = async (req, res = response) => {
  res.json({
    ok: true,
    msg: "borrarMedico",
  });
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
