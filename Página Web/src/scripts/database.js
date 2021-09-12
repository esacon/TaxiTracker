const mysql = require('mysql2');
const colors = require('colors');
const env_var = require('dotenv').config();


const insert_query = "INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?";

const connection = mysql.createConnection({
    host: "database-1.c8q8azgauzis.us-east-2.rds.amazonaws.com",
    user: 'admin',
    password: "Quique.1228.",
    database: 'taxiApp'
});

function connect (latitud, longitud, fecha, hora) {
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

module.exports = connect;