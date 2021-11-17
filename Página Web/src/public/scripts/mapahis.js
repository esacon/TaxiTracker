
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
const MAX_LENGTH = 1000;

var LeafIcon = L.Icon.extend({
    options: {
       iconSize:     [20, 25],
       shadowSize:   [20, 14]
    }
});

var taxiIcon = new LeafIcon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/75/75780.png'
});
var taxi1inicio = new LeafIcon({
    iconUrl: 'https://github.com/esacon/TaxiTracker/blob/marca/P%C3%A1gina%20Web/src/public/inicioa1.png?raw=true'
});
var taxi1fin = new LeafIcon({
    iconUrl: 'https://github.com/esacon/TaxiTracker/blob/marca/P%C3%A1gina%20Web/src/public/fina1.png?raw=true'
});
var taxi2inicio = new LeafIcon({
    iconUrl: 'https://github.com/esacon/TaxiTracker/blob/marca/P%C3%A1gina%20Web/src/public/inicioa2.png?raw=true'
});
var taxi2fin = new LeafIcon({
    iconUrl: 'https://github.com/esacon/TaxiTracker/blob/marca/P%C3%A1gina%20Web/src/public/fina2.png?raw=true'
});
var taxiinicio = new LeafIcon({
    iconUrl: 'https://github.com/esacon/TaxiTracker/blob/marca/P%C3%A1gina%20Web/src/public/inicio.png?raw=true'
});
var taxifin = new LeafIcon({
    iconUrl: 'https://github.com/esacon/TaxiTracker/blob/marca/P%C3%A1gina%20Web/src/public/fin.png?raw=true'
});


var placaText = document.querySelector('#placa');
var placa = 0;

function getArraySample(arr, sample_size, return_indexes = false) {
    if(sample_size > arr.length) return false;
    const sample_idxs = [];
    const randomIndex = () => Math.floor(Math.random() * arr.length);
    while(sample_size > sample_idxs.length){
        let idx = randomIndex();
        while(sample_idxs.includes(idx)) idx = randomIndex();
        sample_idxs.push(idx);
    }
    sample_idxs.sort((a, b) => a > b ? 1 : -1);
    if(return_indexes) return sample_idxs;
    return sample_idxs.map(i => arr[i]);
}

placaText.addEventListener('change', () => {
    placa = placaText.value;
    validateInfo(placa);
});

function validateInfo(placa) {    
    if (info != null || info2 != null) {
        let data = info;
        let data2 = info2;
        if (info.length > MAX_LENGTH) {
            data = getArraySample(info, MAX_LENGTH);
        }
        if (info2.length > MAX_LENGTH) {
            data2 = getArraySample(info2, MAX_LENGTH);
        }
        // Validar selección de placas.
        if (placa == 0) {
            data2 = null;
        } else if (placa == 1) {
            data = data2;
            data2 = null;
        }
        console.log(placa);
        plotMapa(data, data2);
    }
}

function plotMapa(data, data2) {
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
        marker1 = L.marker(inicio,{icon:taxiinicio}).addTo(maphi);             
        marker2 = L.marker(fin,{icon:taxifin}).addTo(maphi);
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
            maphi.setView([coords[index][0], coords[index][1]]);
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

        marker1 = L.marker(inicio,{icon:taxi1inicio}).addTo(maphi);             
        marker2 = L.marker(fin,{icon:taxi1fin}).addTo(maphi);
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
            maphi.setView([coords[index][0], coords[index][1]]);
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

        marker4 = L.marker(inicio2, {icon:taxi2inicio}).addTo(maphi);             
        marker5 = L.marker(fin2, {icon:taxi2fin}).addTo(maphi);
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
            maphi.setView([coords2[index2][0], coords2[index2][1]]);
        });
    }
}

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        info = data.info;
        info2 = data.info2;             
        validateInfo(placaText.value);    
    });

    socket.on('noData', function(){
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