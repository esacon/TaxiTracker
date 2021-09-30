     
var socket = io();
let marker;
let circle;
let map = L.map('mapid');            
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);

// Update HTML content
document.addEventListener('DOMContentLoaded', function() {
    
    // Get First Data from server.
    socket.on('getData', function(info) {
        console.log('últimos datos: ')
        console.log([parseFloat(info.latitud), parseFloat(info.longitud)]);      
        map.setView([parseFloat(info.latitud), parseFloat(info.longitud)], 18); 

        // Update HTML
        document.getElementById('latitud_text').innerText = info.latitud;
        document.getElementById('longitud_text').innerText = info.longitud;
        document.getElementById('fecha_text').innerText = info.fecha;
        document.getElementById('hora_text').innerText = info.hora; 

        // Load Map
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
                attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                maxZoom: 20,
                center: [parseFloat(info.latitud), parseFloat(info.longitud)],
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(map);   

        // Place first marker
        marker = L.marker([parseFloat(info.latitud), parseFloat(info.longitud)]).addTo(map);                         
    });              
    const latlon = [
                   [10.8716,-74.7781],
                   [10.8716,-74.7780],
                   [10.8715,-74.7775], 
                   [10.8715,-74.7775], 
                   [10.8715,-74.7774], 
                   [10.8714,-74.7769],
                   [10.8714,-74.7769], 
                   [10.8713,-74.7768], 
                   [10.8712,-74.7763]
                ];
    var polylinePoints = [latlon];
    var polyline = L.polyline(polylinePoints).add.To(map);
    socket.on('change', function(info) {
        // Add Polyline to map.
        polyline.addTo(map);

        // Update HTML content.
        document.getElementById('latitud_text').innerText = info.latitud_text;
        document.getElementById('longitud_text').innerText = info.longitud_text;
        document.getElementById('fecha_text').innerText = info.fecha_text;
        document.getElementById('hora_text').innerText = info.hora_text;

        // Initialize map.
        map.setView([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
        marker.setLatLng([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);                        
        //polyline.addLatLng([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
        polyline.addLatLng(latlon);
    });
}); 