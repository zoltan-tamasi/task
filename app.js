
const express = require('express');

const API_HOST = 'partners.betvictor.mobi';
const API_PATH = '/en-gb/in-play/1/events';

const app = express();
const port = 3000;

const eventService = require('./service/event-service')({ host: API_HOST, path: API_PATH });
const { getSportsController } = require('./controller/controller')(eventService);

app.get('/sports', getSportsController);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


