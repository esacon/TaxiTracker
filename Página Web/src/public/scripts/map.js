    
var socket = io();
let marker;
let marker2;
var coord_taxi1 = [];
var coord_taxi2 = [];
let prev_lat;
let prev_long;
let prev_placa;
let map = L.map('mapid');            
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
let polyline2 = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);

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
        map.setView([parseFloat(info.latitud), parseFloat(info.longitud)], 18); 
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
                attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                maxZoom: 20,
                center: [parseFloat(info.latitud), parseFloat(info.longitud)],
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(map);   

        // Place first marker
        marker = L.marker([parseFloat(info.latitud), parseFloat(info.longitud)]).addTo(map);       
        marker2 = L.marker([parseFloat(info.latitud), parseFloat(info.longitud)]).addTo(map);                    
    });              

    socket.on('change', function(info) {
        
        // Add Polyline to map.
        polyline.addTo(map);

        // Update HTML content.
        document.getElementById('latitud_text').innerText = info.latitud_text;
        document.getElementById('longitud_text').innerText = info.longitud_text;
        document.getElementById('fecha_text').innerText = info.fecha_text;
        document.getElementById('hora_text').innerText = info.hora_text;

        // Initialize map.
        let placa = document.querySelector('#placa').value; 

        if (prev_placa === undefined && placa === '2') {
            prev_placa = info.placa;
            prev_lat = parseFloat(info.latitud_text);
            prev_long = parseFloat(info.longitud_text);
        }                
       
        if (info.placa === 'AAA111') {
            if (placa === '0' || placa === '2') {
                marker1 = L.marker([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]).addTo(map).bindPopup("Taxi 1").openPopup(); 
                polyline1 = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
            } else {
                if (marker2 != undefined) {
                    map.removeLayer(marker2);
                    polyline.removeFrom(map);
                }
            }
            coord_taxi1.push([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
        } 

        if (info.placa === 'AAA222') {
            if (placa === '1' || placa === '2') {
                marker2 = L.marker([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]).addTo(map).bindPopup("Taxi 2").openPopup(); 
                polyline2 = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
            } else {
                if (marker1 != undefined) {
                    map.removeLayer(marker1);
                    polyline.removeFrom(map);
                };
            }
            coord_taxi2.push([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
        }
    
        map.setView([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
        polyline.setLatLngs(coord_taxi1);
        polyline2.setLatLngs(coord_taxi2);      
    });
}); 