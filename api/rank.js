const axios = require('axios');
const middleware = require('./_common/middleware');

const handler = async (url) => {
  const domain = url ? new URL(url).hostname : null;
  if (!domain) throw new Error('Invalid URL');

  const auth = (process.env.TRANCO_API_KEY && {
    auth: {
      username: process.env.TRANCO_USERNAME,
      password: process.env.TRANCO_API_KEY,
    },
  }) || {};

  const requestOptions = {
    method: 'GET',
    baseURL: 'https://tranco-list.eu/api/ranks/domain/',
    url: domain,
    timeout: 5000,
    ...auth,
  };

  try {
    const response = await axios.request(requestOptions);

    if (!response.data || !response.data.ranks || response.data.ranks.length === 0) {
      return { skipped: `Skipping, as ${domain} isn't ranked in the top 100 million sites yet.` };
    }

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      return { error: `Unable to fetch rank, HTTP response error: ${error.response.status} - ${error.response.statusText}` };
    }
    return { error: `Unable to fetch rank, ${error.message}` };
  }
};

module.exports = handler;
module.exports.middleware = middleware(handler);

