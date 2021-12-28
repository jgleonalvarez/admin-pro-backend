const { response } = require("express");
const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 0;

  const [medicos, total] = await Promise.all([
    Medico.find()
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre")
      .skip(page)
      .limit(limit),

    Medico.countDocuments(),
  ]);

  res.json({
    ok: true,
    medicos,
    total,
  });
};

const getMedico = async (req, res = response) => {
  const id = req.params.id;  

  try {

    const medico = await Medico.findById(id)
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre");

      // console.log(medico);

    res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administador",
      error,
    });
  }
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });

  try {
    const medicoDB = await medico.save();

    return res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administador",
      error,
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
      usuario: uid,
    };

    const medicoUpdated = await Medico.findByIdAndUpdate(id, cambios, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "El médico se ha actualizado",
      medico: medicoUpdated,
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
  getMedico,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
