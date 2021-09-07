const mysql = require('mysql');
const colors = require('colors');


const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'app'
});

const socket = io();

const insert_query = "INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?";

socket.on('update', function(info) {
    let values = [[null, info.latitud, info.longitud, info.fecha, info.hora]];

    // Conexión a la base de datos.
    database.connect(function(err) {
        if (err) {
            console.log("No se pudo conectar a la base de datos.".red);
            throw err;
        };
        console.log("Base de datos conectada".green);
    });

    // Insertar datos en la db.
    database.query(insert_query, [values], (err, rows) => {
        if(err) {
            console.log("No se pudo subir a la base de datos.".red);
            throw err;
        };
        console.log("Datos insertados en la base de datos.").green;
    });

    // Cerrar conexión.
    database.end();
});