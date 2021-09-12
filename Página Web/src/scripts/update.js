const socket = io();
const map = L.map('mapid');
const marker;
const circle;

document.addEventListener('DOMContentLoaded', function() {
    socket.on('update', function(info) {
        console.log("\nDatos recibidos:");
        
        document.getElementById('latitud').innerText = info.latitud;
        document.getElementById('longitud').innerText = info.longitud;
        document.getElementById('fecha').innerText = info.fecha;
        document.getElementById('hora').innerText = info.hora;

        console.log(info);        
                    
        // Initialize map.
        map.setView([parseFloat(info.latitud_text), parseFloat(info.longitud_text)], 18);

        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);

        if(!circle) {
            circle = L.circle([parseFloat(info.latitud_text), parseFloat(info.longitud_text)], {
                color: 'green',
                fillColor: '#00ff00',
                fillOpacity: 0.3,
                radius: 50
            }).addTo(map);
        }
        
        if(!marker) {
            marker = L.marker([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]).addTo(map);
        }

        marker.setLatLng([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
        circle.setLatLng([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
    });
});
