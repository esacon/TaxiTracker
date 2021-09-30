
let marker;
let circle;
let map = L.map('maphi');   
var map = L.Wrld.map("maphi", "your_api_key_here", {
    center: [37.780813, -122.404750],
    zoom: 17
  });         
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
//var lat=[10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.556000, 10.556000, 10.556200, 10.556400, 10.556400, 10.556600, 10.556900, 10.556900, 10.557200, 10.557500, 10.557500]
//var lon=[-73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.222600, -73.222600, -73.222500, -73.222200, -73.222200, -73.222100, -73.221900, -73.221900, -73.221800, -73.221700]
var polylinePoints = [        [37.781814, -122.404740],
[37.781719, -122.404637],
[37.781489, -122.404949],
[37.780704, -122.403945],
[37.780012, -122.404827]
];            
var polyline = L.polyline(polylinePoints).addTo(map);   

// Update HTML content
document.addEventListener('DOMContentLoaded', function() {
    polyline.addTo(map);

    // Load Map
    //map.setView([lat,lon], 18); 
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);   

    // Place first marker
    //marker = L.marker(lat,lon).addTo(map);                         

    // Initialize map.
    /*
    map.setView(lat,lon);
    marker.setLatLng(lat,lon);                        
    polyline.addLatLng(lat,lon);*/
}); 