const express = require('express');
const app = express();
const color = require('colors');
const { render } = require('ejs');

app.use(express.static(__dirname + '/public/'));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 3000; // puerto del servidor.
app.set('view engine', 'ejs'); // motor de plantillas.
app.set('views', __dirname + '/views'); // Dirección de las vistas.

//Rutas webS
app.use('/', require('./router/routes'));

app.listen(PORT, function() {
    console.log(`Servidor iniciado en el puerto ${PORT}`.green)
});