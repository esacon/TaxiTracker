
let marker;
let circle;
//let map = L.map('maphi');            
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
var lat=[10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.556000, 10.556000, 10.556200, 10.556400, 10.556400, 10.556600, 10.556900, 10.556900, 10.557200, 10.557500, 10.557500]
var lon=[-73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.222600, -73.222600, -73.222500, -73.222200, -73.222200, -73.222100, -73.221900, -73.221900, -73.221800, -73.221700]
var latlngs = [lat,lon];

// Update HTML content
document.addEventListener('DOMContentLoaded', function() {
    var mapOptions = {
        center: [16.506174, 80.648015],
        zoom: 7
     }
     var map = new L.map('maphi', mapOptions);

    // Load Map
    /*
    map.setView([], 18); 
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);   
*/
    // Place first marker
    marker = L.marker(latlngs).addTo(map);                         

    // Initialize map.
    var polyline = L.polyline(latlngs, {color: 'red'});
         
    // Adding to poly line to map
    polyline.addTo(map);
}); 