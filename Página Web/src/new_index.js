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

// Static files
app.use(express.static(__dirname + '/public/'));

// Server
const server = app.listen(app.get('port'), function() {
    console.log(`Server on port ${app.get('port')}`.yellow);
});

// Web socket
const io = socket(server);
const database = require("../src/scripts/database.js");

// Files
const udp_server = require("./scripts/udp_server.js");

io.on("conection", function(socket) { 
    socket.on('update', function(info) { 
        socket.broadcast.emit(a);
        database(info.latitud, info.longitud, info.fecha, info.hora);
    });
});