const express = require('express');
const app = express();
const http = require('http');
const socket = require('socket.io');

const server = http.createServer(app);
var io = socket(server);

app.use(express.static(__dirname + '/public/'));
app.set('port', 3000);

server.listen(app.get('port'), () => {
    console.log('Servidor web escuchando en el puerto 3000');

    function format_time(UNIX_timestamp) {
        const dtFormat = new Intl.DateTimeFormat('es-CO', {
            timeStyle: 'medium',
            dateStyle: 'full',
            timeZone: 'Southamerica/Colombia'
        });
        
        return dtFormat.format(new Date(UNIX_timestamp * 1000));
    }

    // Base de datos.
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'app'
    });

    // Conexión a la base de datos.
    connection.connect((err) => {
    if (err) {
        console.log("No se pudo conectar a la base de datos.");
        throw err
    };
    console.log('Base de datos conectada');
    });

    // Recibir datos del router.
    const udp = require('dgram');
    const udp_server = udp.createSocket('udp4');

    udp_server.on('message', (msg, rinfo) => {

        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

        const arr = msg.toString.split(";");
        let latitud = arr[0];
        let longitud = arr[1];
        let timeStamp = arr[2];

        let fecha = format_time(timeStamp);

        console.log(latitud);
        console.log(longitud);
        console.log(timeStamp);
        console.log(fecha);

        io.emit('change', {
            latitud_text: latitud,
            longitud_text: longitud,
            fecha_text: fecha,
            hora_text: timeStamp
        });

        io.on('connection', function(socket) {
            socket.emit('change', {
                latitud_text: latitud,
                longitud_text: longitud,
                fecha_text: fecha,
                hora_text: timeStamp
            });
        });
        
        // Obtener el último dato.
        connection.query('SELECT MAX(ID) FROM datos', (err, rows) => {
        if(err) {
            console.log("No se pudo hacer la consulta.");
            throw err
        };
        console.log(rows);
        });

        // Insertar datos en la db.
        let id = 1;
        const insert_query = `INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES(${id}, ${latitud}, ${longitud}, ${fecha}, ${hora})`;
        connection.query(insert_query, (err, rows) => {
        if(err) {
            console.log("No se pudo subir a la base de datos.");
            throw err
        };
        console.log('Datos insertados en la base de datos.');
        });

    });

    udp_server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    udp_server.bind({
        addres: 'localhost',
        port:8888
    });
});
