const axios = require('axios');
const cheerio = require('cheerio');
const urlLib = require('url');
const middleware = require('./_common/middleware');

const linkHandler = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const linkMaps = {
      internal: new Map(),
      external: new Map(),
    };

    // Get all links on the page
    $('a[href]').each((i, link) => {
      const href = $(link).attr('href');
      const absoluteUrl = urlLib.resolve(url, href);

      // Check if absolute / relative, append to appropriate map or increment occurrence count
      const linkType = absoluteUrl.startsWith(url) ? 'internal' : 'external';
      const count = linkMaps[linkType].get(absoluteUrl) || 0;
      linkMaps[linkType].set(absoluteUrl, count + 1);
    });

    // Sort by most occurrences, remove supplicates, and convert to array
    const linkArrays = Object.entries(linkMaps).map(([key, map]) => {
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
    });

    return {
      [linkArrays[0][0]]: linkArrays[0][1],
      [linkArrays[1][0]]: linkArrays[1][1],
    };

  } catch (error) {
    if (!error.response) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'No response received from the server. Please check the URL and try again.',
        }),
      };
    }

    const { status, statusText, data } = error.response;
    return {
      statusCode: status,
      body: JSON.stringify({
        error: `Error ${status}: ${statusText}\n${data}`,
      }),
    };
  }
};

const handler = middleware(linkHandler);
module.exports = { handler, linkHandler };

