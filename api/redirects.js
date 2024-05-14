import got from 'got';

const handler = async (url) => {
  const redirects = [url];

  try {
    const response = await got(url, {
      followRedirect: true,
      maxRedirects: 12,
      hooks: {
        beforeRedirect: [
          (options, response) => {
            redirects.push(response.headers.location);
          },
        ],
      },
    });

    return {
      redirects: redirects,
      finalUrl: response.url,
    };
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

const middleware = require('./_common/middleware');
module.exports = middleware(handler);
