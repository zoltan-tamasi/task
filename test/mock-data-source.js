
const dataEN = require('./mock-data-en.json');
const dataDE = require('./mock-data-de.json');
const dataZH = require('./mock-data-zh.json');

const { consumeData } = require('../service/data-source')({ host: null, path: null });

const sports = new Map();
const events = new Map();
const competitions = new Map();

const eTagByLanguage = {};

consumeData({ 
  data: dataEN.result, 
  languageCode: 'en',
  sports, events, competitions
});

consumeData({ 
  data: dataDE.result, 
  languageCode: 'de',
  sports, events, competitions
});

consumeData({ 
  data: dataZH.result, 
  languageCode: 'zh',
  sports, events, competitions
});

const getSports = (languageCode) =>
  sports.get(languageCode);

const getEvents = (languageCode) =>
  events.get(languageCode);

const getCompetitions = (languageCode) =>
  competitions.get(languageCode);

module.exports = {
  getSports, getEvents, getCompetitions
};
