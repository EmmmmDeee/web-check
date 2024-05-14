const traceroute = require('traceroute');
const url = require('url');
const middleware = require('./_common/middleware');

const traceHost = async (urlString, context) => {
  // Parse the URL and get the hostname
  const parsedUrl = url.parse(urlString);
  const host = parsedUrl.hostname;

  if (!host) {
    throw new Error('Invalid URL provided');
  }

  // Traceroute with callback
  const hops = await new Promise((resolve, reject) => {
    traceroute.trace(host, (err, result) => {
      if (err || !result) {
        reject(err || new Error('No hops found'));
      } else {
        resolve(result);
      }
    });
  });

  return {
    message: "Traceroute completed!",
    hops,
  };
};

const handler = middleware(traceHost);
module.exports = { handler, traceHost };

