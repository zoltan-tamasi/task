
const https = require('https');

const sports = new Map();
const events = new Map();
const competitions = new Map();

const eTagByLanguage = {};

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
        consumeData({ 
          data: response.result, 
          languageCode,
          sports, 
          competitions,
          events
        });
      }
    });
};

const consumeData = ({ data, languageCode, sports, competitions, events }) => {
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

const getSports = (languageCode) =>
  sports.get(languageCode);

const getEvents = (languageCode) =>
  events.get(languageCode);

const getCompetitions = (languageCode) =>
  competitions.get(languageCode);

module.exports = ({ host: _host, path: _path }) => {

  host = _host;
  path = _path;

  return {
    getSports, getEvents, getCompetitions, refreshData, consumeData
  };
};

