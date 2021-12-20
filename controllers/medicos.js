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

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administador',
      error
    });
  }
};

const actualizarMedico = async (req, res = response) => {

  const uid = req.uid;
  const id = req.params.id;
  
  try {

    const medico = Medico.findById(id);

    if (!medico) {
      res.status(404).json({
        ok: false,
        msg: "El médico no existe",
        error,
      });
    }
    
    const cambios = {
      ...req.body,
      usuario: uid
    }

    const medicoUpdated = await Medico.findByIdAndUpdate(id, cambios, { new: true });

    res.json({
      ok: true,
      msg: "El médico se ha actualizado",
      medicoUpdated
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contacte al administrador",
      error,
    });
  }
};

const borrarMedico = async (req, res = response) => {

  const id = req.params.id;

  try {

    const medico = Medico.findById(id);

    if (!medico) {
      res.status(404).json({
        ok: false,
        msg: "El médico no existe",
        error,
      });
    }

    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Médico eliminado",
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contacte al administrador",
      error,
    });
  }
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
