import express from 'express';
import path from 'path';

const routes = express.Router();

routes.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
    require('./udp_server');
});

module.exports.routes = routes;