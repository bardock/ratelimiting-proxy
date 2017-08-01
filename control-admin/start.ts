"use strict";

import config from './config';
import utils from './utils';

import * as express from "express";
import * as bodyParser from "body-parser";
import errorHandler from "./errorHandler";

const app = express();
app.use(bodyParser.json());

// routing
app.use('/rules', require('./controllers/rules'));
app.get('/', utils.decorate(async (req, res, next) => {
    res.send('Welcome');
}));

// middleware
app.use(errorHandler());

// start
app.listen(config.port, () => {
	console.log(`Control Web API listening on port ${config.port}!`)
});