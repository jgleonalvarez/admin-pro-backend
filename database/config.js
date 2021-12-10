const mongoose = require('mongoose');

// Usuario: mean_jgleon
// Psw: Leon.2021

const dbConn = async () => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD, ver logs');
    }
};

module.exports = {
    dbConn
}