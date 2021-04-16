
const { Router } = require('express');

const sportsController = Router();
const eventsController = Router();

let eventService;

sportsController.get('/', (req, res) => {
  res.json(eventService.getSports());
});

eventsController.get('/', (req, res) => {
  res.json(eventService.getEvents());
});

eventsController.get('/:sportId', ({ params: { sportId }}, res) => {
  res.json(eventService.getEventsBySportId(parseInt(sportId)));
});

module.exports = (_eventService) => {
  eventService = _eventService;
  return {
    sportsController,
    eventsController
  };
};
