/*
async function obtenerInformacion() {
    let respuesta = await fetch("http://localhost:7900/coordenadas");
    document.getElementById("latitud_text").textContent = await respuesta.text();
    setInterval(obtenerInformacion, 3000);
    // (latitud, longitud, fecha, hora) 
} 
*/
  
import { createSocket } from 'dgram';

const socket = createSocket('udp4');

function format_time(UNIX_timestamp) {
  const dtFormat = new Intl.DateTimeFormat('es-CO', {
    timeStyle: 'medium',
    dateStyle: 'full',
    timeZone: 'Southamerica/Colombia'
  });
  
  return dtFormat.format(new Date(UNIX_timestamp * 1e3));
}

socket.on('message', (msg, rinfo) => {

    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

    const arr = msg.split(";");
    let latitud = arr[0];
    let longitud = arr[1];
    let timeStamp = arr[2];

    let fecha = format_time(timeStamp);

    console.log(latitud);
    console.log(longitud);
    console.log(timeStamp);
    console.log(fecha);

    document.getElementById("latitud_text").innerText = latitud;
    document.getElementById("longitud_text").innerText = longitud;
    document.getElementById("fecha_text").innerText = fecha;
});

socket.bind(8888);
