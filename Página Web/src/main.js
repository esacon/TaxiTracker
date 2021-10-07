const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const colors = require('colors');
const socket = require('socket.io');
const env_var = require('dotenv').config();
const mysql = require('mysql2');
const udp = require('dgram');
const udp_server = udp.createSocket('udp4');
const router = express.Router();
const { render } = require('ejs');
const datetime = require('./datetime.js');
const database = require('./database.js');
const alert = require('alert'); 


var io = socket(server);

app.use(express.static(__dirname + '/public/'));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

const PORT = 3000; // puerto del servidor.
app.set('view engine', 'ejs'); // motor de plantillas.
app.set('views', __dirname + '/views'); // Dirección de las vistas.

router.get('/', (req, res) => {
    res.render("index");
});

router.get('/historicos', (req, res) => {
    res.render("historicos");
});

router.post('/historicos', (req, res) => {
    const body = req.body;

    const start_date = body.datetimes.split(" ")[0];
    const start_hour = body.datetimes.split(" ")[1];
    const end_date = body.datetimes.split(" ")[3];
    const end_hour = body.datetimes.split(" ")[4];

    console.log([start_date, start_hour, end_date, end_hour]);

    async function retrieve() {
        const info = await database.getData(`SELECT * FROM datos WHERE str_to_date(concat(fecha, ' ', hora),'%Y-%m-%d %H:%i:%s') >= str_to_date(concat('${start_date}', ' ', '${start_hour}'),'%Y-%m-%d %H:%i:%s') AND str_to_date(concat(fecha, ' ', hora),'%Y-%m-%d %H:%i:%s') <= str_to_date(concat('${end_date}', ' ', '${end_hour}'),'%Y-%m-%d %H:%i:%s')`);
        io.on('connection', function(socket) {
            socket.emit('getConsulta', {
                info: info
            });
        });        
    }; 

    retrieve();
});

app.use('/', router);

server.listen(PORT, function() {
    console.log(`Servidor iniciado en el puerto ${PORT}`.green);
    

    async function retrieve() {
        const info = await database.getData("Select latitud, longitud, fecha, hora from datos order by id desc limit 1;");
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

    // Recibir datos del router.
    udp_server.on('message', (msg, rinfo) => {

        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`.yellow);

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
});