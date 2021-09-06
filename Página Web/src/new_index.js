import express from 'express';
import colors from 'colors';
import {routes} from './scripts/routes.js'

const app = express();

// Settings
app.set('port', 3000);
app.set('view engine', 'ejs');

// Routes
app.use(router);

// Static files
app.use(express.static(__dirname + '/public/'));

// Server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`.yellow);
});
