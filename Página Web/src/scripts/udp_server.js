import dgram from 'dgram';
import color from 'colors';

const server = dgram.createSocket('udp4');

function getDate(UNIX_timestamp) {        
    return new Date(parseInt(UNIX_timestamp)).toLocaleDateString('es-CO');
}

function getHour(UNIX_timestamp) {  
    return new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO');
}

server.on('error', (err) => {
    console.log(`server error: \n${err.stack}`.red);
    server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`.blue);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`.yellow);
});

udp_server.bind({
    addres: 'localhost',
    port:8888
});

module.exports = server;