
const https = require('https');

const sports = new Map();
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
    response.result.sports.forEach(sport => {
      sports.set(sport.id, sport);
    });
  });

const getSports = () => 
  Array.from(sports.values()).map(({ desc }) => desc);

module.exports = ({ host, path }) => {
  setInterval(getData({ host, path }), 5000);

  return {
    getSports,
  }
};
