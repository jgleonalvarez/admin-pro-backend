const bcrypt = require("bcryptjs");
const { response } = require("express");
const { googleVerify } = require("../helpers/google-verify");
const { generarJwt } = require("../helpers/jwt");
const Usuario = require("../models/usuario");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Contraseña no válida",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJwt(usuarioDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Consulte al administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;
  console.log(googleToken);

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      // si no exite el usuario
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@",
        img: picture,
        google: true,
      });
    } else {
      // existe usuario
      usuario = usuarioDB;
      usuario.password = "@";
      usuario.google = true;
    }

    await usuario.save();

    const token = await generarJwt(usuario.id);

    res.json({
      ok: true,
      msg: "Google SignIn",
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Token incorrecto",
      error,
    });
  }
};

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJwt(uid);

    res.json({
        ok: true,
        uid,
        token
    })
};

module.exports = {
  login,
  googleSignIn,
  renewToken
};
