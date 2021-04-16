
const https = require('https');

const sports = new Map();

const getData = (apiUrl) => () => 
  new Promise((resolve, reject) => {
    https.get(apiUrl, response => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on("error", (err) => {
      reject(err);
    });
  }).then(response => {
    response.result.sports.forEach(sport => {
      sports.set(sport.id, sport);
    });
    console.log('Data read');
  });

const getSports = () => 
  Array.from(sports.values()).map(({ desc }) => desc);

module.exports = (apiUrl) => {
  setInterval(getData(apiUrl), 5000);

  return {
    getSports,
  }
};
