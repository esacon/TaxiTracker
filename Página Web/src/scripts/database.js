const mysql = require('mysql2');
const colors = require('colors');
const env_var = require('dotenv').config();


const insert_query = "INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'taxiApp'
});

module.exports = function connect (latitud, longitud, fecha, hora) {
    let values = [[null, latitud, longitud, fecha, hora]];

    // Conexión a la base de datos.
    connection.connect(function(err) {
        if (err) {
            console.log("No se pudo conectar a la base de datos.".red);
            throw err;
        };
        console.log("Base de datos conectada".green);
    });

    // Insertar datos en la db.
    connection.query(insert_query, [values], (err, rows) => {
        if(err) {
            console.log("No se pudo subir a la base de datos.".red);
            throw err;
        };
        console.log("Datos insertados en la base de datos.".green);
    });

    // Cerrar conexión.
    connection.end();
};