
const { Router } = require('express');
const NotFoundError = require('../error/not-found-error');

const sportsController = Router();
const eventsController = Router();

let eventService;

const afterRefreshData = (req, res, next) =>
  eventService.refreshData()
    .then(next)
    .catch(next);

sportsController.get('/', afterRefreshData, (req, res) => {
  res.json({
    result: eventService.getSports(),
    success: true
  });
});

sportsController.get('/:sportId/events', afterRefreshData, ({ params: { sportId }}, res) => {
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
      throw(error);
    }
  }
});

eventsController.get('/', afterRefreshData, (req, res) => {
  res.json({
    result: eventService.getEvents(),
    success: true
  });
});

eventsController.get('/:eventId', afterRefreshData, ({ params: { eventId }}, res) => {
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
