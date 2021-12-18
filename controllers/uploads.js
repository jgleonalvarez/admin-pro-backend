const pathSrv = require('path');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const fs = require('fs');

const fileUpload = (req, res = response) => {

    const { tipo, id } = req.params;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    // Validar tipo
    if (!tiposValidos.includes(tipo)) {
        return res.status(404).json({
            ok: false,
            msg: `Se recibió ${tipo}, el esperado es: hospitales, medicos, usuarios`
        });
    }

    // Valikdar el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar la imagen
    const img = req.files.imagen;
    const nombreCortado = img.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(404).json({
            ok: false,
            msg: `La extensión recibida es ${extensionArchivo}, el esperado es: png, jpg, jpeg, gif`
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    img.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar la base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });

    });
}

const dowloadImage = (req, res = response) => {

    const { tipo, img } = req.params;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    // Validar tipo
    if (!tiposValidos.includes(tipo)) {
        return res.status(404).json({
            ok: false,
            msg: `Se recibió ${tipo}, el esperado es: hospitales, medicos, usuarios`
        });
    }

    const pathImg = pathSrv.join(__dirname, `../uploads/${tipo}/${img}`);

    // Verificar si existe la imagen
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImgDefault = pathSrv.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImgDefault);
    }
}

module.exports = {
    fileUpload,
    dowloadImage
}