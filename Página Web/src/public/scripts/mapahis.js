
                var socket = io();
                let marker;
                let circle;
                let map = L.map('maphi');            
                let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
                // Load Map
                map.setView([0,0], 18); 
                L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
                        attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                        maxZoom: 20,
                        center: [0,0],
                        tileSize: 512,
                        zoomOffset: -1,
                    }).addTo(map);   
                

                // Update HTML content
                document.addEventListener('DOMContentLoaded', function() {         
                    socket.on("getConsulta", function(data){
                        const info = data.info;
                        // Initialize map.
                        const inicio = [parseFloat(info[0]['latitud']), parseFloat(info[0]['longitud'])];
                        const fin = [parseFloat(info[info.length - 1]['latitud']), parseFloat(info[info.length - 1]['longitud'])];
                        const medio = [parseFloat(info[Math.floor(info.length/2)]['latitud']), parseFloat(info[Math.floor(info.length/2)]['longitud'])];
                        
                        // Place first marker
                        marker = L.marker(medio).addTo(map); 

                        marker.setLatLng(inicio); 
                        marker.setLatLng(fin);  

                        info.forEach(coord => {
                            polyline.addLatLng([parseFloat(info[coord]['latitud']), parseFloat(info[coord]['longitud'])]);
                        }); 
                    });
                }); 