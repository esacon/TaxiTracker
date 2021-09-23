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

var io = socket(server);

app.use(express.static(__dirname + '/public/'));
app.set('port', 3000);

function getDate(UNIX_timestamp) {        
    return new Date(parseInt(UNIX_timestamp)).toLocaleDateString('es-CO', { timeZone: 'America/Bogota'});
}
    
function getHour(UNIX_timestamp) {  
    return new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota'});
}

let db_connection_info = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'taxiApp'
    };

const insert_query = "INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?";

function database_upload(values) {
    
    let connection = mysql.createConnection(db_connection_info);

    // Conexión a la base de datos.
    connection.connect((err) => {
        if (err) {
            console.log("No se pudo conectar a la base de datos.".red);
            throw err
        };
        console.log('Base de datos conectada'.green);
    });
    
    // Insert data.
    connection.query(insert_query, [values], (err, info) => {
        if(err) {
            console.log("No se pudo subir a la base de datos.".red);
            throw err
        };
        console.log("Datos insertados en la base de datos.".green);     
        // Cerrar conexión.
        connection.end(); 
        console.log("Conexión cerrada".grey); 
    });       
}

function start_server() {
    console.log('Servidor web escuchando en el puerto 3000');

    // Base de datos.
    let connection = mysql.createConnection(db_connection_info);

    // Conexión a la base de datos.
    connection.connect((err) => {
        if (err) {
            console.log("No se pudo conectar a la base de datos.".red);
            throw err
        };
        console.log('Base de datos conectada'.green);
    });

    // Retrieve last coordinates.
    const last_data = "Select latitud, longitud, fecha, hora from datos order by id desc limit 1;"
    connection.query(last_data, (err, info) => {
        if(err) {
            console.log("No se pudo ejecutar el query.".red);
            throw err
        };   

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
        
        console.log('Último dato recopilado con éxito.'.green);
    }); 

    connection.end();

    // Recibir datos del router.
    udp_server.on('message', (msg, rinfo) => {

        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`.yellow);

        let arr = msg.toString().split(";");
        let latitud = parseFloat(arr[0]).toFixed(4);
        let longitud = parseFloat(arr[1]).toFixed(4);
        let timeStamp = arr[2];

        let fecha = getDate(timeStamp);
        let hora = getHour(timeStamp);

        if (latitud != 0) {  
            console.log(latitud.blue);
            console.log(longitud.blue);
            console.log(timeStamp.blue);
            console.log(fecha.blue);
            console.log(hora.blue);

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
            let values = [[null, latitud.toString(), longitud.toString(), fecha.toString(), hora.toString()]];
            database_upload(values);          
        }
    });

    udp_server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`.red);
        server.close();
    });

    udp_server.bind({
        addres: process.env.HOST,
        port:8888
    });
}

const git = require('child_process');
server.post('/git', () => {
    console.log("Entré")
    git.exec("cd /home/ubuntu/TaxiTracker/ && git reset --hard && git pull");
    console.log("Subí")
});

server.listen(app.get('port'), start_server);
