"use strict";

import express = require('express');
import bodyParser = require('body-parser');
import utils from './utils';

const app = express();

app.use(bodyParser.json());

app.use('/rules', require('./controllers/rules'));

app.get('/', utils.decorate(async (req, res, next) => {
    res.send('Welcome');
}));

app.listen(8081, () => {
  console.log('Example app listening on port 8081!')
});