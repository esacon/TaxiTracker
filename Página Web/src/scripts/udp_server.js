const dgram = require('dgram');
const colors = require('colors');

const server = dgram.createSocket('udp4');
const socket = io();

function getDate(UNIX_timestamp) {        
    return new Date(parseInt(UNIX_timestamp)).toLocaleDateString('es-CO');
}

function getHour(UNIX_timestamp) {  
    return new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO');
}

server.on('error', function(err) {
    console.log(`Server error: \n${err.stack}`.red);
    server.close();
});

server.on('message', function(msg, rinfo) {
    console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`.blue);

    // Retrieve information.
    let info = msg.toString().split(";");
    let latitud = info[0];
    let longitud = info[1];
    let timeStamp = info[2];
    let fecha = getDate(timeStamp);
    let hora = getHour(timeStamp);

    console.log({
        'Latitud': latitud,
        'Longitud': longitud,
        'TimeStamp': timeStamp,
        'Fecha': fecha,
        'Hora': hora
    }.toString().green);

    // Update changes to server.
    socket.emit('update', {
        latitud: latitud,
        longitud: longitud,
        fecha: fecha,
        hora: hora
    });
});

server.on('listening', function() {
    const address = server.address();
    console.log(`Server listening ${address.address}:${address.port}`.yellow);
});

server.bind({
    addres: 'localhost',
    port:8888
});

module.exports = server;