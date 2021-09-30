var socket = io();
let marker;
let circle;
let map = L.map('mapid');            
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);

// Update HTML content
document.addEventListener('DOMContentLoaded', function() {
    


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

    socket.on('change', function(info) {
        // Add Polyline to map.
        polyline.addTo(arrayCoordsLatLng);

        addPolyline(arrayCoordsLatLng= [10.9888	-74.8299, 10.9888 -74.8294]); {
            this.polylineRoute = L.polyline(arrayCoordsLatLng,
                {
                    color: '#ee0033',
                    weight: 8,
                    opacity: .8,
                    dashArray: '20,15',
                    lineJoin: 'round'
                }
            );
            //Añadir Ruta Polyline
            this.markersLayer.addLayer(this.polylineRoute);
            this.map.fitBounds(this.polylineRoute.getBounds());
        }
        // Update HTML content.
        document.getElementById('latitud_text').innerText = info.latitud_text;
        document.getElementById('longitud_text').innerText = info.longitud_text;
        document.getElementById('fecha_text').innerText = info.fecha_text;
        document.getElementById('hora_text').innerText = info.hora_text;

        // Initialize map.
        map.setView([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
        marker.setLatLng([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);                        
        polyline.addLatLng([parseFloat(info.latitud_text), parseFloat(info.longitud_text)]);
    });
