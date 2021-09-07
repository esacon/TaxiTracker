const express = require('express');
const socket = require('socket.io');
const colors = require('colors');

const app = express();

// Settings
app.set('port', 3000);
app.set('view engine', 'ejs');

// Routes
app.use(require('./scripts/routes.js'));

// Files
app.use(require("./scripts/udp_server"));

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
    });
});