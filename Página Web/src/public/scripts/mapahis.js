
var socket = io();
var marker1;
var marker2;
var marker3;
var marker4;
var marker5;
var marker6;
let maphi= L.map('maphi').setView([10.97, -74.65], 15);      
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);
let polyline2 = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);
var popup = L.popup();
var popup2 = L.popup();
var index = 0;
var index2 = 0;
var info = null;
var info2 = null;

var LeafIcon = L.Icon.extend({
    options: {
       iconSize:     [20, 25],
       shadowSize:   [20, 14]
    }
});

var taxiIcon = new LeafIcon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/75/75780.png'
});

var placaText = document.querySelector('#placa');
var placa = 0;
validateInfo(placa);

placaText.addEventListener('change', () => {
    placa = placaText.value;
    validateInfo(placa);
});

function validateInfo(placa) {    
    if (info != null || info2 != null) {
        let data = info;
        let data2 = info2;
        if (placa == 0) {
            data = null;
        } else if (placa == 1) {
            data = data2;
            data2 = null;
        }
        console.log(placa);
        plotMapa(data, data2);
    }
}

function plotMapa(data, data2) {
    console.log('Plotting mapa');
    console.log('Data:');
    console.log(data);
    console.log('Data2:');
    console.log(data2);
    if (data2 === null) {    
        console.log('One car');              
        maphi.removeLayer([marker1, marker2, marker3, marker4, marker5, marker6, polyline, polyline2]);

        // Initialize map.
        const inicio = [parseFloat(data[0].Latitud), parseFloat(data[0].Longitud)];
        const fin = [parseFloat(data[data.length - 1].Latitud), parseFloat(data[data.length - 1].Longitud)];
        const medio = [parseFloat(data[Math.floor(data.length/2)].Latitud), parseFloat(data[Math.floor(data.length/2)].Longitud)];
        
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
        if (marker3 != undefined) {
            maphi.removeLayer(marker3);
        };
        if (marker4 != undefined) {
            maphi.removeLayer(marker4);
        };
        if (marker5 != undefined) {
            maphi.removeLayer(marker5);
        };
        if (marker6 != undefined) {
            maphi.removeLayer(marker6);
        };

        polyline2.removeFrom(maphi);
        polyline2 = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);
        marker1 = L.marker(inicio).addTo(maphi).bindPopup("<b>Punto de inicio</b>").openPopup();             
        marker2 = L.marker(fin).addTo(maphi).bindPopup("<b>Punto de fin</b>").openPopup();
        polyline.removeFrom(maphi);
        polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);

        let fechas = [];
        let horas = [];
        let coords = [];
        data.forEach(coord => {  
            polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            coords.push([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            horas.push(coord.Hora);
            fechas.push(coord.Fecha);
        });  

        let $avanzar = document.querySelector('#rango');    
        $avanzar.setAttribute("max", coords.length - 1);

        $avanzar.addEventListener('change', ()=> {
            if (marker3 != undefined) {
                maphi.removeLayer(marker3);
            };

            index = $avanzar.value;
            document.getElementById('1latitud_text').innerText = coords[index][0];
            document.getElementById('1longitud_text').innerText = coords[index][1];
            document.getElementById('1fecha_text').innerText = fechas[index];
            document.getElementById('1hora_text').innerText = horas[index];
            document.getElementById('1RPM_text').innerText = rpms[index];
            marker3 = L.marker([coords[index][0], coords[index][1]], {icon: taxiIcon}).addTo(maphi);
            maphi.setView([coords[index][0], coords[index][1]], 20);
        });
    } else {
        console.log('Two cars');
        maphi.removeLayer([marker1, marker2, marker3, marker4, marker5, marker6, polyline, polyline2]);

        // Initialize map.
        const inicio = [parseFloat(data[0].Latitud), parseFloat(data[0].Longitud)];
        const fin = [parseFloat(data[data.length - 1].Latitud), parseFloat(data[data.length - 1].Longitud)];
        const medio = [parseFloat(data[Math.floor(data.length/2)].Latitud), parseFloat(data[Math.floor(data.length/2)].Longitud)];           
        
        // Load Map
        maphi.setView(medio); 
        
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20,
            center: medio,
            tileSize: 512,
            zoomOffset: -1
        }).addTo(maphi);    

        // Primer vehículo
        if (marker1 != undefined) {
            maphi.removeLayer(marker1);
        };
        if (marker2 != undefined) {
            maphi.removeLayer(marker2);
        };
        if (marker3 != undefined) {
            maphi.removeLayer(marker3);
        };

        marker1 = L.marker(inicio).addTo(maphi).bindPopup("<b>Punto de inicio AAA111</b>").openPopup();             
        marker2 = L.marker(fin).addTo(maphi).bindPopup("<b>Punto de fin AAA111</b>").openPopup();
        polyline.removeFrom(maphi);
        polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);

        let fechas = [];
        let horas = [];
        let coords = [];
        let rpms = [];
        data.forEach(coord => {  
            polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            coords.push([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            horas.push(coord.Hora);
            fechas.push(coord.Fecha);
            rpms.push(coord.RPM);
        });  

        let $avanzar = document.querySelector('#rango');    
        $avanzar.setAttribute("max", coords.length - 1);

        $avanzar.addEventListener('change', ()=> {
            if (marker3 != undefined) {
                maphi.removeLayer(marker3);
            };

            index = $avanzar.value;
            document.getElementById('1latitud_text').innerText = coords[index][0];
            document.getElementById('1longitud_text').innerText = coords[index][1];
            document.getElementById('1fecha_text').innerText = fechas[index];
            document.getElementById('1hora_text').innerText = horas[index];
            document.getElementById('1RPM_text').innerText = rpms[index];
            marker3 = L.marker([coords[index][0], coords[index][1]], {icon: taxiIcon}).addTo(maphi);
            maphi.setView([coords[index][0], coords[index][1]], 20);
        });

        // Segundo vehículo.
        const inicio2 = [parseFloat(data2[0].Latitud), parseFloat(data2[0].Longitud)];
        const fin2 = [parseFloat(data2[data2.length - 1].Latitud), parseFloat(data2[data2.length - 1].Longitud)];
        
        if (marker4 != undefined) {
            maphi.removeLayer(marker4);
        };
        if (marker5 != undefined) {
            maphi.removeLayer(marker5);
        };
        if (marker6 != undefined) {
            maphi.removeLayer(marker6);
        };

        marker4 = L.marker(inicio2).addTo(maphi).bindPopup("<b>Punto de inicio AAA222</b>").openPopup();             
        marker5 = L.marker(fin2).addTo(maphi).bindPopup("<b>Punto de fin AAA222</b>").openPopup();
        polyline2.removeFrom(maphi);
        polyline2 = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);

        let fechas2 = [];
        let horas2 = [];
        let coords2 = [];
        let rpms2 = [];
        data2.forEach(coord => {  
            polyline2.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            coords2.push([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            horas2.push(coord.Hora);
            fechas2.push(coord.Fecha);
            rpms2.push(coord.RPM);
        });

        let $avanzar2 = document.querySelector('#rango2');    
        $avanzar2.setAttribute("max", coords2.length - 1);

        $avanzar2.addEventListener('change', ()=> {
            if (marker6 != undefined) {
                maphi.removeLayer(marker6);
            };

            index2 = $avanzar2.value;
            document.getElementById('1latitud_text2').innerText = coords2[index2][0];
            document.getElementById('1longitud_text2').innerText = coords2[index2][1];
            document.getElementById('1fecha_text2').innerText = fechas2[index2];
            document.getElementById('1hora_text2').innerText = horas2[index2];
            document.getElementById('1RPM_text2').innerText = rpms2[index2];
            marker6 = L.marker([coords2[index2][0], coords2[index2][1]], {icon: taxiIcon}).addTo(maphi);
            maphi.setView([coords2[index2][0], coords2[index2][1]],20);
        });
    }
}

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        console.log(placa);
        info = data.info;
        info2 = data.info2;              

    });

    socket.on('noData', function(data){
        maphi.removeLayer([marker1, marker2, marker3, marker4, marker5, marker6, polyline, polyline2]);
        polyline.removeFrom(maphi);
        maphi.removeLayer(marker1);
        maphi.removeLayer(marker2);
        polyline2.removeFrom(maphi);
        maphi.removeLayer(marker4);
        maphi.removeLayer(marker5);
        alert("La búsqueda no arrojó ningún resultado, intente nuevamente.");
    });
}); 