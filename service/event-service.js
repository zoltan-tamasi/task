
const NotFoundError = require('../error/not-found-error');

const SUPPORTED_LANGUAGE_CODES = ['en', 'de', 'zh'];

let dataSource;

const sortByPos = ({ pos: posA }, { pos: posB }) => posA > posB;

const mapSport = sport => ({
  id: sport.id,
  desc: sport.desc,
});

const mapEvent = event => ({
  id: event.id,
  desc: event.desc,
  scr: (event.scoreboard && event.scoreboard.scrA)
    ? `${event.scoreboard.scrA}:${event.scoreboard.scrB}`
    : undefined,
});

const mapEventAllData = (event, languageCode) => ({
  ...mapEvent(event),
  oppADesc : event.oppADesc,
  oppBDesc : event.oppBDesc,
  time: new Date(event.time),
  inPlay: event.inPlay,
  sport: dataSource.getSports(languageCode).get(event.sport_id).desc,
  competition: dataSource.getCompetitions(languageCode).get(event.comp_id).desc,
  ...event
});

const getSports = (languageCode) =>
  Array.from(dataSource.getSports(languageCode).values()).sort(sortByPos).map(mapSport);

const getSportsAllLanguages = () => {
  const sportsInAllLanguages = new Map();
    SUPPORTED_LANGUAGE_CODES
      .forEach(languageCode =>
        Array.from(dataSource.getSports(languageCode).values())
          .sort(sortByPos)
          .forEach(({ id, desc }) => {
            if (!sportsInAllLanguages.has(id)) {
              sportsInAllLanguages.set(id, {});
            }
            sportsInAllLanguages.get(id)[languageCode] = desc;
          })
      );
  return Array.from(sportsInAllLanguages.entries()).map(([id, descriptions]) => ({
    id,
    ...descriptions
  }));
}

const getEvents = (languageCode) =>
  Array.from(dataSource.getEvents(languageCode).values()).sort(sortByPos).map(mapEvent);

const getEventsBySportId = (sportId, languageCode) => {
  if (!dataSource.getSports(languageCode).has(sportId)) {
    throw new NotFoundError(`Sport with id: ${sportId} doesn't exit`);
  }
  return dataSource.getSports(languageCode).get(sportId).comp.flatMap(({ events }) =>
    events.sort(sortByPos).map(mapEvent)
  );
};

const getEventById = (eventId, languageCode) => {
  if (!dataSource.getEvents(languageCode).has(eventId)) {
    throw new NotFoundError(`Event with id: ${eventId} doesn't exit`);
  }
  return mapEventAllData(dataSource.getEvents(languageCode).get(eventId), languageCode);
};

const getLanguageFromHeader = (languageCodeHeader) =>
  SUPPORTED_LANGUAGE_CODES.includes(languageCodeHeader) ? languageCodeHeader : 'en';

module.exports = (_dataSource) => {

  dataSource = _dataSource;

  return {
    getSports, getSportsAllLanguages, getEvents, getEventsBySportId, getEventById,
    getLanguageFromHeader, SUPPORTED_LANGUAGE_CODES
  };
};
