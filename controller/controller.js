
let eventService;

const getSportsController = (req, res) => {
  res.json(eventService.getSports());
};

const getEventsController = ({ params: { sportId }}, res) => {
  if (sportId) {
    res.json(eventService.getEventsBySportId(parseInt(sportId)));
  } else {
    res.json(eventService.getEvents());
  }
};

module.exports = (_eventService) => {
  eventService = _eventService;
  return {
    getSportsController,
    getEventsController
  };
};
