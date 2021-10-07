
var socket = io();
var marker1;
var marker2;
let maphi= L.map('maphi').setView([10.97, -74.65], 15);      
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(maphi);;

// Update HTML content
document.addEventListener('DOMContentLoaded', function() { 

    socket.on("getConsulta", function(data){
        const info = data.info;
        if(info.length != 0) {
            console.log(info);
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
            latlngs = []
            info.forEach(coord => {  
                polyline.addLatLng([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
                latlngs.push([parseFloat(coord.Latitud), parseFloat(coord.Longitud)]);
            }); 

            polyline.on('click', (e) => {
                console.log(e);

                var counts =[];
                for ( var j=0;j<latlngs.length;j++ ){
                    counts.push(latlngs[j][0]);
                };
            
                goal = parseFloat(e.latlng.lat);
                var closest = counts.reduce(
                                function(prev, curr) {
                                    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                                });
                console.log(counts.indexOf(closest));
                var index=counts.indexOf(closest);
                popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString() +"n\ fecha : "+dates[index][0]+ " hora : "+dates[index][1] ).openOn(myMap);
            })
        
        }
    });
}); 