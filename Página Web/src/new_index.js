const express = require('express');
const socket = require('socket.io');
const colors = require('colors');

const app = express();

// Settings
app.set('port', 3000);
app.set('view engine', 'ejs');

// Routes
const routes = require('./scripts/routes.js');
app.use(routes);
let connect = require("../src/scripts/database.js")(info.latitud, info.longitud, info.fecha, info.hora);
// Files
const udp = require("./scripts/udp_server.js");
app.use(udp);

// Static files
app.use(express.static(__dirname + '/public/'));

// Server
const server = app.listen(app.get('port'), function() {
    console.log(`Server on port ${app.get('port')}`.yellow);
});

// Web socket
const io = socket(server);
io.on("conection", function() { 
    socket.on('update', function(info) { 
        socket.broadcast.emit(info);
        let connect = require("../src/scripts/database.js")(info.latitud, info.longitud, info.fecha, info.hora);
    });
});