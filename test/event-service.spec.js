const { expect } = require('chai');

const mockDataSource = require('./mock-data-source');
const eventService = require('../service/event-service')(mockDataSource);

describe('Event service spec', () => {
  it('tests event service', () => {

    const sports = eventService.getSports('en');
    expect(sports.length).to.equal(20);
    expect(sports[0].id).to.equal(1600);
    expect(sports[0].desc).to.equal('Futsal');
    expect(sports[1].id).to.equal(1041100);

    const sportsDE = eventService.getSports('de');
    expect(sportsDE[2].id).to.equal(100);
    expect(sportsDE[2].desc).to.equal('Fußball');

    const sportsZH = eventService.getSports('zh');
    expect(sportsZH[2].id).to.equal(100);
    expect(sportsZH[2].desc).to.equal('足球');

    const eventsBySportId = eventService.getEventsBySportId(100, 'en');
    expect(eventsBySportId[0].desc).to.equal('Erzgebirge Aue v Nurnberg');

    const events = eventService.getEvents('en');
    expect(events.length).to.equal(121);
    expect(events[0].id).to.equal(1443384200);
    expect(events[1].id).to.equal(1443382300);

    const event = eventService.getEventById(1443384200, 'en');
    expect(event.id).to.equal(1443384200);
    expect(event.desc).to.equal('AC Sparta Praha v SK Slavia Praha');
    expect(event.oppADesc).to.equal('AC Sparta Praha');
    expect(event.sport).to.equal('Futsal');
    expect(event.competition).to.equal('1. Liga');

    const sportsAllLanguages = eventService.getSportsAllLanguages();
    expect(sportsAllLanguages.length).to.equal(20);
    expect(sportsAllLanguages[2].id).to.equal(100);
    expect(sportsAllLanguages[2].en).to.equal('Football');
    expect(sportsAllLanguages[2].de).to.equal('Fußball');
    expect(sportsAllLanguages[2].zh).to.equal('足球');

  });
});