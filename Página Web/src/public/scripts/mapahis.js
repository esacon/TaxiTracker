
var socket = io();
var marker1;
var marker2;
let maphi= L.map('maphi').setView([10.97, -74.65], 15);      
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);
var popup = L.popup();
var index = 0;

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        let info = data.info;
        maphi.removeLayer([marker1, marker2, polyline]);

        // Initialize map.
        const inicio = [parseFloat(info[0].Latitud), parseFloat(info[0].Longitud)];
        const fin = [parseFloat(info[info.length - 1].Latitud), parseFloat(info[info.length - 1].Longitud)];
        const medio = [parseFloat(info[Math.floor(info.length/2)].Latitud), parseFloat(info[Math.floor(info.length/2)].Longitud)];
        
        // Load Map
        maphi.setView(medio); 
        
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20,
            center: medio,
            tileSize: 512,
            zoomOffset: -1
        }).addTo(maphi);    

        // Place markers
        if (marker1 != undefined) {
            maphi.removeLayer(marker1);
        };
        if (marker2 != undefined) {
            maphi.removeLayer(marker2);
        };
        marker1 = L.marker(inicio).addTo(maphi).bindPopup("<b>Punto de inicio</b>").openPopup();             
        marker2 = L.marker(fin).addTo(maphi).bindPopup("<b>Punto de fin</b>").openPopup();
        polyline.removeFrom(maphi);
        polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);

        let fechas = [];
        let horas = [];
        let coords = [];
        info.forEach(coord => {  
            polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            coords.push([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            horas.push(coord.Hora);
            fechas.push(coord.Fecha);
        });  

        if (index == coords.length) {
            index--;
        }  

        function avanzarIndex() {
            index++;
        }

        function retrocederIndex() {
            if (index != 0) {
                index--;
            }
        }

        let label = `<b>Taxi ubicado en:</b><br/>Latitud: ${coords[index][0]}<br/>Longitud: ${coords[index][1]}<br/>Fecha: ${fechas[index]}<br/>Hora: ${horas[index]}`
        popup.setLatLng([coords[index][0], coords[index][1]]).setContent(label).openOn(maphi);
    });

    socket.on('noData', function(data){
        maphi.removeLayer([marker1, marker2, polyline]);
        polyline.removeFrom(maphi);
        maphi.removeLayer(marker1);
        maphi.removeLayer(marker2);
    });
}); 