const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


const socket = require('socket.io');
const env_var = require('dotenv').config();

const mysql = require('mysql2');

const udp = require('dgram');
const udp_server = udp.createSocket('udp4');

var io = socket(server);

app.use(express.static(__dirname + '/public/'));
app.set('port', 3000);


function getDate(UNIX_timestamp) {        
    return new Date(parseInt(UNIX_timestamp)).toLocaleDateString('es-CO', { timeZone: 'America/Bogota'});
}

function getHour(UNIX_timestamp) {  
    return new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota'});
}

server.listen(app.get('port'), () => {
    console.log('Servidor web escuchando en el puerto 3000');

    // Base de datos.

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'taxiApp'
    });

    // Conexión a la base de datos.
    connection.connect((err) => {
        if (err) {
            console.log("No se pudo conectar a la base de datos.");
            throw err
        };
        console.log('Base de datos conectada');
    });

    // Retrieve last coordinates.
    const last_data = "Select latitud, longitud from datos order by id desc limit 1;"
    connection.query(last_data, (err, info) => {
        if(err) {
            console.log("No se pudo ejecutar el query.");
            throw err
        };   

        let latitud = info[0]['latitud'];
        let longitud = info[0]['longitud'];

        io.emit('getData', {
            latitud: latitud,
            longitud: longitud
        });

        io.on('connection', function(socket) {
            socket.emit('getData', {
                latitud: latitud,
                longitud: longitud
            });
        });
        
        console.log('Último dato recopilado con éxito.');
    });
    

    // Recibir datos del router.
    udp_server.on('message', (msg, rinfo) => {

        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

        let arr = msg.toString().split(";");
        let latitud = parseFloat(arr[0]).toFixed(6);
        let longitud = parseFloat(arr[1]).toFixed(6);
        let timeStamp = arr[2];

        let fecha = getDate(timeStamp);
        let hora = getHour(timeStamp);

        console.log(latitud);
        console.log(longitud);
        console.log(timeStamp);
        console.log(fecha);
        console.log(hora);

        io.emit('change', {
            latitud_text: latitud,
            longitud_text: longitud,
            fecha_text: fecha,
            hora_text: hora
        });

        io.on('connection', function(socket) {
            socket.emit('change', {
                latitud_text: latitud,
                longitud_text: longitud,
                fecha_text: fecha,
                hora_text: hora
            });
        });

        const insert_query = "INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?";
        if (parseFloat(longitud) != 0) {
            // Insertar datos en la db.
            let values = [[null, latitud.toString(), longitud.toString(), fecha.toString(), hora.toString()]];

            connection.query(insert_query, [values], (err, rows) => {
                if(err) {
                    console.log("No se pudo subir a la base de datos.");
                    throw err
                };
                console.log('Datos insertados en la base de datos.');
            });
        }

    });

    udp_server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    udp_server.bind({
        addres: process.env.HOST,
        port:8888
    });
});
