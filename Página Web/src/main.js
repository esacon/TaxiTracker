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
const datetime = require('./datetime.js');
const database = require('./database.js');

app.use(express.static(__dirname + '/public/'));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 3000; // puerto del servidor.
app.set('view engine', 'ejs'); // motor de plantillas.
app.set('views', __dirname + '/views'); // Dirección de las vistas.

var io = socket(server);

//Rutas webS
app.use('/', require('./router/routes'));


function connection() {
    console.log(`Servidor iniciado en el puerto ${PORT}`.green);

    async function retrieve() {
        const info = database.getData("Select latitud, longitud, fecha, hora from datos order by id desc limit 1;");
        let latitud = info[0]['latitud'];
        let longitud = info[0]['longitud'];
        let fecha = info[0]['fecha'];
        let hora = info[0]['hora'];

        io.on('connection', function(socket) {
            socket.emit('getData', {
                latitud: latitud,
                longitud: longitud,
                fecha: fecha,
                hora: hora
            });
        });
    };

    retrieve();
    
    udp_server.on('message', (msg, rinfo) => {
        console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`.gray);

        let arr = msg.toString().split(";");
        let latitud = parseFloat(arr[0]).toFixed(4);
        let longitud = parseFloat(arr[1]).toFixed(4);
        let timeStamp = arr[2];

        let fecha = datetime.getDate(timeStamp);
        let hora = datetime.getHour(timeStamp);

        if (latitud != 0) {  
            console.log([latitud, longitud, timeStamp, fecha, hora]);            
            
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

            // Insertar datos en la db.
            database.insertData([[null, latitud.toString(), longitud.toString(), fecha.toString(), hora.toString()]]);
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