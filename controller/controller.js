
const { Router } = require('express');

const sportsController = Router();
const eventsController = Router();

let eventService;

const afterRefreshData = (req, res, next) => {
  const headers = req.headers;
  const languageCode = eventService.getLanguageFromHeader(headers['accept-language']);
  res.locals.languageCode = languageCode;
  eventService.refreshData(languageCode)
    .then(next)
    .catch(next);
}

sportsController.get('/', afterRefreshData, (req, res) => {
  res.json({
    result: eventService.getSports(res.locals.languageCode),
    success: true
  });
});

sportsController.get('/:sportId/events', afterRefreshData, ({ params: { sportId }}, res) => {
  res.json({
    result: eventService.getEventsBySportId(parseInt(sportId), res.locals.languageCode),
    success: true
  });
});

eventsController.get('/', afterRefreshData, (req, res) => {
  res.json({
    result: eventService.getEvents(res.locals.languageCode),
    success: true
  });
});

eventsController.get('/:eventId', afterRefreshData, ({ params: { eventId }}, res) => {
  res.json({
    result: eventService.getEventById(parseInt(eventId), res.locals.languageCode),
    success: true
  });
});

module.exports = (_eventService) => {
  eventService = _eventService;
  return {
    sportsController,
    eventsController
  };
};
