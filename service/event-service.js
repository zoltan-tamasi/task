
const https = require('https');
const NotFoundError = require('../error/not-found-error');

const sports = new Map();
const events = new Map();
const competitions = new Map();

const eTagByLanguage = {};

const SUPPORTED_LANGUAGE_CODES = ['en', 'de', 'zh'];

let host, path;

const sortByPos = ({ pos: posA }, { pos: posB }) => posA > posB;

const refreshData = (languageCode) => {
  const eTag = eTagByLanguage[languageCode];
  return new Promise((resolve, reject) => {
    https.get({
      protocol: 'https:',
      headers: eTag ? {
        'If-None-Match': eTag,
      } : {},
      host,
      path: path(languageCode)
    }, response => {
      eTagByLanguage[languageCode] = response.headers.etag;
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(JSON.parse(data));
          console.log('New data read');
        } else if (response.statusCode === 304) {
          resolve(null);
          console.log('No new data');
        } else {
          reject(data);
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  })
    .then(response => {
      if (response !== null) {
        consumeData(response.result, languageCode);
      }
    });
};

const consumeData = (data, languageCode) => {
  if (!sports.has(languageCode)) {
    sports.set(languageCode, new Map());
  }
  if (!competitions.has(languageCode)) {
    competitions.set(languageCode, new Map());
  }
  if (!events.has(languageCode)) {
    events.set(languageCode, new Map());
  }
  data.sports.forEach(sport => {
    sports.get(languageCode).set(sport.id, sport);
    sport.comp.forEach(comp => {
      competitions.get(languageCode).set(comp.id, comp);
      comp.events.forEach(event => {
        event.comp_id = comp.id;
        events.get(languageCode).set(event.id, event);
      });
    })
  });
};

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
  sport: sports.get(languageCode).get(event.sport_id).desc,
  competition: competitions.get(languageCode).get(event.comp_id).desc,
});


const getSports = (languageCode) =>
  Array.from(sports.get(languageCode).values()).sort(sortByPos).map(mapSport);

const getEvents = (languageCode) =>
  Array.from(events.get(languageCode).values()).sort(sortByPos).map(mapEvent);

const getEventsBySportId = (sportId, languageCode) => {
  if (!sports.get(languageCode).has(sportId)) {
    throw new NotFoundError(`Sport with id: ${sportId} doesn't exit`);
  }
  return sports.get(languageCode).get(sportId).comp.flatMap(({ events }) =>
    events.sort(sortByPos).map(mapEvent)
  );
};

const getEventById = (eventId, languageCode) => {
  if (!events.get(languageCode).has(eventId)) {
    throw new NotFoundError(`Event with id: ${eventId} doesn't exit`);
  }
  return mapEventAllData(events.get(languageCode).get(eventId), languageCode);
};

const getLanguageFromHeader = (languageCodeHeader) =>
  SUPPORTED_LANGUAGE_CODES.includes(languageCodeHeader) ? languageCodeHeader : 'en';

module.exports = ({ host: _host, path: _path }) => {

  host = _host;
  path = _path;

  return {
    getSports, getEvents, getEventsBySportId, getEventById, refreshData,
    getLanguageFromHeader
  };
};
