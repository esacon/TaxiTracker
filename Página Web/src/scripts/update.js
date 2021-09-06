const socket = io();

document.addEventListener('DOMContentLoaded', function() {
    socket.on('update', function(info) {
        console.log("\nDatos recibidos:");
        
        document.getElementById('latitud').innerText = info.latitud;
        document.getElementById('longitud').innerText = info.longitud;
        document.getElementById('fecha').innerText = info.fecha;
        document.getElementById('hora').innerText = info.hora;

        console.log(info);
    });
});
