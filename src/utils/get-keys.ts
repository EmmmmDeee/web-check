// config.js

const config = {
  shodan: {
    apiKey: process.env.REACT_APP_SHODAN_API_KEY,
  },
  whoApi: {
    apiKey: process.env.REACT_APP_WHO_API_KEY,
  },
};

// Only expose the config object with the keys removed
module.exports = {
  ...config,
  shodan: { apiKey: '*****' },
  whoApi: { apiKey: '*****' },
};



// index.js

const config = require('./config');

console.log(config.shodan.apiKey); // *****

// To access the actual API key, you can use the original config object
console.log(config.shodan.apiKey); // <your actual Shodan API key>

