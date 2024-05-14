const https = require('https');
const middleware = require('./_common/middleware');

const handler = async (url, event, context) => {
  const checkHSTS = (hstsHeader) => {
    if (!hstsHeader) {
      return {
        message: `Site does not serve any HSTS headers.`,
        compatible: false,
        hstsHeader,
      };
    }

    const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
    const includesSubDomains = hstsHeader.includes('includeSubDomains');
    const preload = hstsHeader.includes('preload');

    if (!maxAgeMatch || parseInt(maxAgeMatch[1]) < 10886400) {
      return {
        message: `HSTS max-age is less than 10886400.`,
        compatible: false,
        hstsHeader,
      };
    }

    if (!includesSubDomains) {
      return {
        message: `HSTS header does not include all subdomains.`,
        compatible: false,
        hstsHeader,
      };
    }

    if (!preload) {
      return {
        message: `HSTS header does not contain the preload directive.`,
        compatible: false,
        hstsHeader,
      };
    }

    return {
      message: `Site is compatible with the HSTS preload list!`,
      compatible: true,
      hstsHeader,
    };
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      const headers = res.headers;
      const hstsHeader = headers['strict-transport-security'];
      const result = checkHSTS(hstsHeader);
      resolve(result);
    });

    req.on('error', (error) => {
      resolve({
        message: `Error making request: ${error.message}`,
        compatible: false,
        hstsHeader: null,
      });
    });

    req.end();
  });
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

