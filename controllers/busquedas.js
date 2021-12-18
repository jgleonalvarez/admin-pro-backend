const { response } = require("express");
const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

// getTodo
const getTodo = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex })
    ]);

    res.json({
        ok: true,
        msg: 'Búsqueda de todo',
        busqueda,
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentoColeccion = async (req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    let data = [];

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regex })
            break;

        case 'medicos':
            data = await Medico.find({ nombre: regex })
                        .populate('usuario','nombre img')
                        .populate('hospital', 'nombre img');

            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                        .populate('usuario','nombre img');

            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La colección debe usuarios, medicos u hospitales'
            });
    }

    res.json({
        ok: true,
        resultados: data,
    });
}

module.exports = {
    getTodo,
    getDocumentoColeccion
}