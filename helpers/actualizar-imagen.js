const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No se encontró el médico');
                return false;
            }

            borrarImagen(`./uploads/medicos/${medico.img}`);

            medico.img = nombreArchivo;
            await medico.save();

            return true;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No se encontró el hospital');
                return false;
            }

            borrarImagen(`./uploads/hospitales/${hospital.img}`);

            hospital.img = nombreArchivo;
            await hospital.save();

            return true;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No se encontró el usuario');
                return false;
            }

            borrarImagen(`./uploads/usuarios/${usuario.img}`);

            usuario.img = nombreArchivo;
            await usuario.save();

            return true;

        default:
            break;
    }
}

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // Borra la imagen anterior
        fs.unlinkSync(path);
    }
}

module.exports = {
    actualizarImagen
}

