
var socket = io();
var marker1;
var marker2;
let maphi= L.map('maphi').setView([10.97, -74.65], 15);      
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);
var popup = L.popup();

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        let info = data.info;
        let hasData = data.hasData;
        console.log(hasData);
        if(!hasData) {
            alert("La búsqueda no ha encontrado ningún resultado.");
            polyline.removeFrom(maphi);
            maphi.removeLayer(marker1);
            maphi.removeLayer(marker2);
        } if(hasData) {
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
            let longitudes = [];
            info.forEach(coord => {  
                polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
                longitudes.push(parseFloat(coord.Longitud));
                horas.push(coord.Hora);
                fechas.push(coord.Fecha);
            }); 

            polyline.on('click', (e) => {
                const target = parseFloat(e.latlng.lng);
                let cercano = longitudes.reduce(
                                function(prev, curr) {
                                    return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
                                });
                const index = longitudes.indexOf(cercano);
                let label = `<b>Taxi ubicado en:</b><br/>Latitud: ${e.latlng.lat}<br/>Longitud: ${e.latlng.lng}<br/>Fecha: ${fechas[index]}<br/>Hora: ${horas[index]}`
                popup.setLatLng(e.latlng).setContent(label).openOn(maphi);
            });        
        } 
    });
}); 