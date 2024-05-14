const Wappalyzer = require('wappalyzer');
const middleware = require('./_common/middleware');

// Validate URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Middleware function
const handleRequest = async (handler, url) => {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format');
  }

  try {
    return await handler(url);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Handler function
const handler = async (url) => {
  const options = {};

  const wappalyzer = new Wappalyzer(options);

  try {
    await wappalyzer.init();
    const headers = {};
    const storage = {
      local: {},
      session: {},
    };
    await wappalyzer.open(url, headers, storage);

    // Wait for the 'technologies' event
    return new Promise((resolve, reject) => {
      wappalyzer. technologies((technologies) => {
        if (!technologies || technologies.length === 0) {
          reject(new Error('Unable to find any technologies for site'));
        }
        resolve(technologies);
      });
    });
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await wappalyzer.destroy();
  }
};

module.exports = {
  handler,
  middleware: (handler) => middleware(handleRequest.bind(null, handler)),
};

