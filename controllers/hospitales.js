const { response } = require("express");
const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

  const hospitales = await Hospital.find()
    .populate('usuario', 'nombre img');

  res.json({
    ok: true,
    hospitales
  });
};

const crearHospital = async (req, res = response) => {

  const uid = req.uid;
  const hospital = new Hospital({
    usuario: uid,
    ...req.body
  });

  try {
    const hospitalDB = await hospital.save();

    return res.json({
      ok: true,
      hospital: hospitalDB
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administador',
      error
    });
  }
};

const actualizarHospital = async (req, res = response) => {

  const id = req.params.id
  const uid = req.uid;

  try {

    const hospital = Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "El hospital no existe",
        error
      });
    }

    const cambios = {
      ...req.body,
      usuario: uid
    };

    const hospitalUpdated = await Hospital.findByIdAndUpdate(id, cambios, { new: true });

    res.json({
      ok: true,
      msg: "Hospital actualizado!",
      hospital: hospitalUpdated
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Consulte al administrador",
      error
    });
  }
};

const borrarHospital = async (req, res = response) => {
  const id = req.params.id

  try {

    const hospital = Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "El hospital no existe",
        error
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Hospital eliminado!"
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Consulte al administrador",
      error
    });
  }
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
