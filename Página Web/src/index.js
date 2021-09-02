const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

app.use(express.static(__dirname + '/public/'));
app.set('port', 3000);

server.listen(app.get('port'), "localhost", () => {
    console.log('Servidor web escuchando en el puerto 3000');

    function format_time(UNIX_timestamp) {
        const dtFormat = new Intl.DateTimeFormat('es-CO', {
            timeStyle: 'medium',
            dateStyle: 'full',
            timeZoneName: "GMT-5"
        });
        
        return dtFormat.format(new Date(UNIX_timestamp * 1000));
    }

    /*

    // Base de datos.
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'app'
    }); 
    
    */

    // Conexión a la base de datos.
    connection.connect((err) => {
        if (err) {
            console.log("No se pudo conectar a la base de datos.");
            throw err
        };
        console.log('Base de datos conectada.');
    });

    // Recibir datos del router.
    const udp = require('dgram');
    const udp_server = udp.createSocket('udp4');

    udp_server.on('message', (msg, rinfo) => {

        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

        let arr = msg.toString.split(";");
        let latitud = arr[0];
        let longitud = arr[1];
        let timeStamp = arr[2];

        let fecha = format_time(timeStamp);

        console.log(latitud);
        console.log(longitud);
        console.log(timeStamp);
        console.log(fecha);

        document.getElementById(latitud_text).innerText = latitud;
        document.getElementById(longitud_text).innerText = longitud;
        document.getElementById(fecha_text).innerText = fecha;
        document.getElementById(hora_text).innerText = timeStamp;

        /*

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

        */

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
