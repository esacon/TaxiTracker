document.addEventListener('DOMContentLoaded', () => {
    var socket = io();
    socket.on('change', info => {
        document.getElementById('latitud_text').innerText = info.latitud_text;
        document.getElementById('longitud_text').innerText = info.longitud_text;
        document.getElementById('fecha_text').innerText = info.fecha_text;
        document.getElementById('hora_text').innerText = info.hora_text;
    });
});