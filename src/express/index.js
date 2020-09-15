'use strict';

const express = require(`express`);

const mainRoutes = require('./routes/main-routes');
const offersRoutes = require('./routes/offers-routes');
const myRoutes = require('./routes/my-routes');
const path = require(`path`);
const PUBLIC_DIR = `public`;
const DEFAULT_PORT = 8080;
const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));

app.use('/',mainRoutes);
app.use('/offers',offersRoutes);
app.use('/my',myRoutes);


app.listen(DEFAULT_PORT);
