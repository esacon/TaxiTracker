
var socket = io();
let marker;
let map = L.map('maphi');     
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3});

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        const info = data.info
        map.removeLayer(polyline);
        // Initialize map.
        const inicio = [parseFloat(info[0].Latitud), parseFloat(info[0].Longitud)];
        const fin = [parseFloat(info[info.length - 1].Latitud), parseFloat(info[info.length - 1].Longitud)];
        const medio = [parseFloat(info[Math.floor(info.length/2)].Latitud), parseFloat(info[Math.floor(info.length/2)].Longitud)];
        
        // Load Map
        map.setView(medio, 15);   
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
                attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                maxZoom: 20,
                center: medio,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(map);   

        // Place markers
        polyline.addTo(map);
        marker = L.marker(inicio).addTo(map);
        marker.bindPopup("<b>Punto de inicio</b>").openPopup(); 
        marker = L.marker(fin).addTo(map); 
        marker.bindPopup("<b>Punto de fin</b>").openPopup();        
        polyline.addTo(map);
        info.forEach(coord => {
            polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
        }); 
    });
}); 