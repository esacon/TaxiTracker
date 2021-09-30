/*
let marker;
let map = L.map('maphi');            
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
var lat = [10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.554300, 10.556000, 10.556000, 10.556200, 10.556400, 10.556400, 10.556600, 10.556900, 10.556900, 10.557200, 10.557500, 10.557500];
var lon = [-73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.224000, -73.222600, -73.222600, -73.222500, -73.222200, -73.222200, -73.222100, -73.221900, -73.221900, -73.221800, -73.221700];       
var es=new L.LatLng(lat,lon);
var polyline = L.polyline(es).addTo(map);   
*/
// Update HTML content
document.addEventListener('DOMContentLoaded', function() {
 //polyline.addTo(map);

    // Load Map
    var map = L.map('maphi').setView([46, 14.84], 7); 

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mAWo6ZVOwQECEfInDbLo', {
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);   

        var lineStrings = turf.randomLineString(10, {bbox: [13.24, 45.5, 16.35, 46.84], num_vertices: 100000})

        var vectorGrid = L.vectorGrid.slicer(lineStrings, {
          maxZoom: 18,
          rendererFactory: L.svg.tile,
          vectorTileLayerStyles: {
            sliced: function(properties, zoom) {
              return {
                stroke: true,
                color: 'red',
                weight: 2
              }
            }
          },
          interactive: false,
        }).addTo(map);
}); 