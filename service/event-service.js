
const https = require('https');
const NotFoundError = require('../error/not-found-error');

const sports = new Map();
const events = new Map();

let eTag;

const getData = ({ host, path }) => () =>
  new Promise((resolve, reject) => {
    https.get({
      protocol: 'https:',
      headers: eTag ? {
        'If-None-Match': eTag,
      } : {},
      host,
      path
    }, response => {
      eTag = response.headers.etag;
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(JSON.parse(data));
          console.log('New data read');
        } else if (response.statusCode === 304) {
          console.log('No new data');
        } else {
          reject(data);
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  }).then(response => {
    consumeData(response.result);
  });

const consumeData = (data) => {
  data.sports.forEach(sport => {
    sports.set(sport.id, sport);
    sport.comp.forEach(comp => {
      comp.events.forEach(event => {
        events.set(event.id, event);
      });
    })
  });
};

const getSports = () =>
  Array.from(sports.values()).map(({ desc, id }) => ({ desc, id }));

const getEvents = () =>
  Array.from(events.values()).map(event => {
    return {
      desc: event.desc,
      scr: (event.scoreboard && event.scoreboard.scrA)
        ? `${event.scoreboard.scrA}:${event.scoreboard.scrB}`
        : undefined
    };
  });

const getEventsBySportId = (sportId) => {
  if (!sports.has(sportId)) {
    throw new NotFoundError(`Sport with id: ${sportId} doesn't exit`);
  }
  return sports.get(sportId).comp.flatMap(({ events }) =>
    events.map(event => ({
      desc: event.desc,
      scr: (event.scoreboard && event.scoreboard.scrA)
        ? `${event.scoreboard.scrA}:${event.scoreboard.scrB}`
        : undefined
    }))
  );
};

module.exports = ({ host, path }) => {
  setInterval(getData({ host, path }), 5000);

  return {
    getSports, getEvents, getEventsBySportId
  }
};
