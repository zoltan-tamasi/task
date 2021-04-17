
const { Router } = require('express');
const NotFoundError = require('../error/not-found-error');

const sportsController = Router();
const eventsController = Router();

let eventService;

sportsController.get('/', (req, res) => {
  res.json({
    result: eventService.getSports(),
    success: true
  });
});

sportsController.get('/:sportId/events', ({ params: { sportId }}, res) => {
  try {
    res.json({
      result: eventService.getEventsBySportId(parseInt(sportId)),
      success: true
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    } else {
      throw error;
    }
  }
});

eventsController.get('/', (req, res) => {
  res.json({
    result: eventService.getEvents(),
    success: true
  });
});

eventsController.get('/:eventId', ({ params: { eventId }}, res) => {
  try {
    res.json({
      result: eventService.getEventById(parseInt(eventId)),
      success: true
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    } else {
      throw error;
    }
  }
});

module.exports = (_eventService) => {
  eventService = _eventService;
  return {
    sportsController,
    eventsController
  };
};
