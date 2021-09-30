const express = require('express');
const router = express.Router();
const color = require('colors');
const dotenv = require('dotenv').config();
const mysql = require('mysql2');
const udp = require('dgram');
const udp_server = udp.createSocket('udp4');

function getDate(UNIX_timestamp) {        
    const date = new Date(parseInt(UNIX_timestamp)).toLocaleDateString('es-CO', { timeZone: 'America/Bogota'});
    const d = date.split("/")[0];
    const m = date.split("/")[1]; 
    const y = date.split("/")[2];
    return new Date(`${y}-${m}-${d}`).toISOString().slice(0,10);
}

function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes, seconds] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }
    
    console.log(typeof(modifier.trim()));
    console.log(modifier.trim());
     
    console.log(modifier.trim() == "p. m.");
    if (modifier == "p. m.") {
        console.log("entre");
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:${seconds}`;
}
    
function getHour(UNIX_timestamp) {  
    const time12h = new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota'});
    return convertTime12to24(time12h);
}

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

router.get('/', (req, res) => {    
    let rows = database.getData("Select latitud, longitud, fecha, hora from datos order by id desc limit 1;"); 

    io.on('connection', function(socket) {
        socket.emit('getData', {
            latitud: latitud,
            longitud: longitud,
            fecha: fecha,
            hora: hora
        });
    });
    
    udp_server.on('message', (msg, rinfo) => {
        cont += 1;
        console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`.gray);

        let arr = msg.toString().split(";");
        let latitud = parseFloat(arr[0]).toFixed(4);
        let longitud = parseFloat(arr[1]).toFixed(4);
        let timeStamp = arr[2];

        let fecha = datetime.getDate(timeStamp);
        let hora = datetime.getHour(timeStamp);

        if (latitud != 0) {  
            console.log([latitud, longitud, timeStamp, fecha, hora].blue);            

            // Insertar datos en la db.
            let insert = database.insertData([[null, latitud.toString(), longitud.toString(), fecha.toString(), hora.toString()]]);  

            io.on('connection', function(socket) {
                socket.emit('change', {
                    latitud: latitud,
                    longitud: longitud,
                    fecha: fecha,
                    hora: hora
                });
            });    
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

    res.render("index", {info:rows}) 
});

router.get('/historicos', (req, res) => {
    res.render("historicos");
});

router.post('/historicos', (req, res) => {
    res.render("historicos");
});


module.exports = router;