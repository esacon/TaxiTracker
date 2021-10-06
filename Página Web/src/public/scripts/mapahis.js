
var socket = io();
let marker1;
let marker2;
let map = L.map('maphi').setView([10.97, -74.65], 15);      
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3});

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        const info = data.info;
        if(info.length != 0) {
            console.log(info);
            map.removeLayer([marker1, marker2, polyline]);

            // Initialize map.
            const inicio = [parseFloat(info[0].Latitud), parseFloat(info[0].Longitud)];
            const fin = [parseFloat(info[info.length - 1].Latitud), parseFloat(info[info.length - 1].Longitud)];
            const medio = [parseFloat(info[Math.floor(info.length/2)].Latitud), parseFloat(info[Math.floor(info.length/2)].Longitud)];
            
            // Load Map
            map.setView(medio); 
            L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
                attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                maxZoom: 20,
                center: medio,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(map);    

            // Place markers
            marker1 = L.marker(inicio).addTo(map).bindPopup("<b>Punto de inicio</b>").openPopup(); 
            marker2 = L.marker(fin).addTo(map).bindPopup("<b>Punto de fin</b>").openPopup();
            polyline.removeFrom(maphi);
            polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
            info.forEach(coord => {  
                polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            }); 
             
        }
    });
}); 