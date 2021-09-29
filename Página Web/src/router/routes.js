const express = require('express');
const router = express.Router();
const color = require('colors');
const dotenv = require('dotenv').config();
const mysql = require('mysql2');
const udp = require('dgram');
const udp_server = udp.createSocket('udp4');

const db_connection_info = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'taxiApp'
};

async function getData(query) {
    return new Promise(function(resolve, reject) {
        const connection = mysql.createConnection(db_connection_info);

        // Conexión a la base de datos.
        connection.connect((err) => {
            if (err) {
                console.log("No se pudo conectar a la base de datos.".red);
                connection.end(); 
            };
            console.log('Base de datos conectada'.yellow);
        });

        connection.query(query,  (err, info) => {
            if (err) {
                console.log("No se pudo ejecutar el query.".red);
                return reject(err);
            }
            console.log("Datos recibidos con éxito.".gray);
            connection.end();
            resolve(info);
        });
    });
}

async function insertData(values) {
    return new Promise(function(resolve, reject) {
        const connection = mysql.createConnection(db_connection_info);

        // Conexión a la base de datos.
        connection.connect((err) => {
            if (err) {
                console.log("No se pudo conectar a la base de datos.".red);
                connection.end(); 
            };
            console.log('Base de datos conectada'.yellow);
        });

        connection.query("INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?", values,  (err, info) => {
            if (err) {
                console.log("No se pudo ejecutar el query.".red);
                return reject(err);
            }
            console.log("Datos insertados con éxito.".gray);
            resolve(connection.end());
        });
    });
}

function getDate(UNIX_timestamp) {        
    return new Date(parseInt(UNIX_timestamp)).toLocaleDateString('es-CO', { timeZone: 'America/Bogota'});
}
    
function getHour(UNIX_timestamp) {  
    return new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota'});
}

router.get('/', (req, res) => {    
    let rows = getData("Select latitud, longitud, fecha, hora from datos order by id desc limit 1;"); 
    
    udp_server.on('message', (msg, rinfo) => {
        cont += 1;
        console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`.gray);

        let arr = msg.toString().split(";");
        let latitud = parseFloat(arr[0]).toFixed(4);
        let longitud = parseFloat(arr[1]).toFixed(4);
        let timeStamp = arr[2];

        let fecha = getDate(timeStamp);
        let hora = getHour(timeStamp);

        if (latitud != 0) {  
            console.log([latitud, longitud, timeStamp, fecha, hora].blue);            

            // Insertar datos en la db.
            let insert = insertData([[null, latitud.toString(), longitud.toString(), fecha.toString(), hora.toString()]]);  

            res.render("index", {first_data:rows, udp_data:[latitud, longitud, fecha, hora]});     
        }
    });

    udp_server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`.red);
        udp_server.close();
    });

    udp_server.bind({
        addres: process.env.HOST,
        port:8888
    });    
});

router.get('/historicos', (req, res) => {
    res.render("historicos");
});

router.post('/historicos', (req, res) => {
    res.render("historicos");
});



