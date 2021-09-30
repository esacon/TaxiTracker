const express = require('express');
const app = express();
const { render } = require('ejs');
const http = require('http');
const server = http.createServer(app);
const colors = require('colors');
const udp = require('dgram');
const udp_server = udp.createSocket('udp4');
const socket = require('socket.io');
const mysql = require('mysql2');
const env_var = require('dotenv').config();
const datetime = require('../src/datetime.js')


app.use(express.static(__dirname + '/public/'));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 3000; // puerto del servidor.
app.set('view engine', 'ejs'); // motor de plantillas.
app.set('views', __dirname + '/views'); // Dirección de las vistas.

var io = socket(server);

//Rutas webS
app.use('/', require('./router/routes'));

// Funciones 
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

function connection() {
    console.log(`Servidor iniciado en el puerto ${PORT}`.green);

    let rows = getData("Select latitud, longitud, fecha, hora from datos order by id desc limit 1;"); 

    io.on('connection', function(socket) {
        socket.emit('getData', {
            latitud: latitud,
            longitud: longitud,
            fecha: fecha,
            hora: hora
        });
    });
    
    udp_server.on('message', (msg, rinfo) => {
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
            let insert = insertData([[null, latitud.toString(), longitud.toString(), fecha.toString(), hora.toString()]]);  

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
}

app.listen(PORT, connection());