const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJwt } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {

    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 0;

    const [usuarios, total] = await Promise.all([

        Usuario.find({}, 'nombre email google role img')
            .skip(page)
            .limit(limit),

        Usuario.countDocuments(),
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
};

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar el usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJwt(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.. revisar logs'
        });
    }
};

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones    
        const { password, google, email, ...campos } = req.body;
        console.log(usuarioDB.email, email);
        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        } else if ( usuarioDB.email !== email ){
            return res.status(400).json({
                ok: false,
                msg: 'La cuenta es de google, no se puede cambiar el correo.'
            });
        }

        const usuarioUpdated = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioUpdated
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.. revisar logs'
        });
    }
};

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.. revisar logs'
        });
    }
};

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}