
let eventService;

const getSportsController = (req, res) => {
  res.json(eventService.getSports());
};

module.exports = (_eventService) => {
  eventService = _eventService;
  return {
    getSportsController,
  };
};
