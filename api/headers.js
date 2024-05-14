const axios = require('axios');
const middleware = require('./_common/middleware');

// Handler function to make GET request to the given URL
const handler = async (url, event, context) => {
  try {
    const response = await axios.get(url);

    // Check if the status code is in the range of 200-599
    if (response.status >= 200 && response.status < 600) {
      return response.headers;
    } else {
      throw new Error(`Received status code ${response.status} from ${url}`);
    }
  } catch (error) {
    // If the error is related to the status code, throw a new error
    if (error.response && error.response.status) {
      throw new Error(error.response.statusText);
    } else {
      throw new Error(error.message);
    }
  }
};

// Export the middleware-wrapped handler function
module.exports = middleware(handler);
