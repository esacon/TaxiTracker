
let marker;
let circle;
let map = L.map('maphi');            
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
let lat=[10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.556000, 10.556000, 10.556200, 10.556400, 10.556400, 10.556600, 10.556900, 10.556900, 10.557200, 10.557500, 10.557500]
let lon=[-73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.222600, -73.222600, -73.222500, -73.222200, -73.222200, -73.222100, -73.221900, -73.221900, -73.221800, -73.221700]
var polylinePoints = [lat,lon];            
  
  var polyline = L.polyline(polylinePoints).addTo(map);   

// Update HTML content
document.addEventListener('DOMContentLoaded', function() {
    polyline.addTo(map);

    // Load Map
    map.setView([lat,lon], 18); 
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);   

    // Place first marker
    marker = L.marker([lat,lon]).addTo(map);                         

    // Initialize map.
    map.setView([lat,lon]);
    marker.setLatLng([lat,lon]);                        
    polyline.addLatLng([lat,lon]);
}); 