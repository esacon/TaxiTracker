/*
async function obtenerInformacion() {
    let respuesta = await fetch("http://localhost:7900/coordenadas");
    document.getElementById("latitud_text").textContent = await respuesta.text();
    setInterval(obtenerInformacion, 3000);
    // (latitud, longitud, fecha, hora) 
} 
*/
  

function format_time(UNIX_timestamp) {
  const dtFormat = new Intl.DateTimeFormat('es-CO', {
    timeStyle: 'medium',
    dateStyle: 'full',
    timeZone: 'Southamerica/Colombia'
  });
  
  return dtFormat.format(new Date(UNIX_timestamp * 1e3));
}

// Recibir datos del router.
const dgram =  require('dgram');

const socket = createSocket('udp4');

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

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

socket.bind({
  addres: 'localhost',
  port:8888
});

//Base de datos.
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'app'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Base de datos conectada');
});

// Obtener el último dato.
connection.query('SELECT MAX(ID) FROM datos', (err, rows) => {
  if(err) throw err;

  console.log('último dato:');
  console.log(rows);
});

// Insertar datos en la db.
let id = 1;
const insert_query = `INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES(${id}, ${latitud}, ${longitud}, ${fecha}, ${hora})`;
connection.query(insert_query, (err, rows) => {
  if(err) throw err;
  console.log('Dato insertado en la base de datos.');
});
