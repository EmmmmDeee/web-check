const axios = require('axios');
const middleware = require('./_common/middleware');

const handler = async (url, event, context) => {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    throw new Error('API key (GOOGLE_CLOUD_API_KEY) not set');
  }

  // Validate the URL before making the API request
  if (!/^(f|ht)tps?:\/\/[a-z0-9-]+([\-\.]{1}[a-z0-9-]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url)) {
    throw new Error('Invalid URL');
  }

  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&category=PWA&strategy=mobile&key=${apiKey}`;

  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data from Google PageSpeed API: ${error.message}`);
  }
};

// Export the handler function separately
module.exports.handler = middleware(handler);

// Export the module with the same name for backward compatibility
module.exports = module.exports.handler;
