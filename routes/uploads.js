/*
    Path: api/uploads/
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpload, dowloadImage } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:img', dowloadImage);

module.exports = router;