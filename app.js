
const express = require('express');

const NotFoundError = require('./error/not-found-error');

const API_HOST = 'partners.betvictor.mobi';
const API_PATH = (languageCode) => `/${languageCode}/in-play/1/events`;

const app = express();
const port = 3000;

const eventService = require('./service/event-service')({ host: API_HOST, path: API_PATH });
const { sportsController, eventsController } = require('./controller/controller')(eventService);

app.use('/sports', sportsController);
app.use('/events', eventsController);

app.use((error, req, res, next) => {
  if (error instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  } else {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

