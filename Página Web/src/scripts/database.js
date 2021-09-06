import { createConnection } from 'mysql';
import color from 'colors';

const database = createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'app'
});

const socket = io();

// Conexión a la base de datos.
database.connect(function(err) {
    if (err) {
        console.log("No se pudo conectar a la base de datos.".red);
        throw err;
    };
    console.log("Base de datos conectada".green);
});

// Insertar datos en la db.
const insert_query = "INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?";

socket.on('update', function(info) {
    let values = [[null, info.latitud, info.longitud, info.fecha, info.hora]];

    database.query(insert_query, [values], (err, rows) => {
        if(err) {
            console.log("No se pudo subir a la base de datos.".red);
            throw err;
        };
        console.log("Datos insertados en la base de datos.").green;
    });
});
