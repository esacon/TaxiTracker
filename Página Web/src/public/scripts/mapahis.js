
var socket = io();
let marker;
let map = L.map('maphi');            
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
// Load Map
map.setView([0,0], 18);   

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        const info = data.info

        // Initialize map.
        const inicio = [parseFloat(info[0].Latitud), parseFloat(info[0].Longitud)];
        const fin = [parseFloat(info[info.length - 1].Latitud), parseFloat(info[info.length - 1].Longitud)];
        const medio = [parseFloat(info[Math.floor(info.length/2)].Latitud), parseFloat(info[Math.floor(info.length/2)].Longitud)];
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
                attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                maxZoom: 20,
                center: medio,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(map);   
        // Place first marker
        marker = L.marker(inicio).addTo(map); 
        marker.setLatLng(fin);  

        info.forEach(coord => {
            polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
        }); 
    });
}); 