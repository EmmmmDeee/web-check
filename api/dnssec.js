const https = require('https');
const middleware = require('./_common/middleware'); // Make sure this path is correct

const handler = async (domain) => {
  if (!domain) {
    throw new Error('Domain is required');
  }

  const dnsTypes = ['DNSKEY', 'DS', 'RRSIG'];
  const records = {};

  for (const type of dnsTypes) {
    const options = {
      hostname: 'dns.google',
      path: `/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
      method: 'GET',
      headers: {
        'Accept': 'application/dns-json'
      }
    };

    try {
      const dnsResponse = await new Promise((resolve, reject) => {
        const req = https.request(options, res => {
          let data = '';

          res.on('data', chunk => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(JSON.parse(data));
          });

          res.on('error', error => {
            reject(error);
          });
        });

        req.end();
      });

      const { Answer } = dnsResponse;
      records[type] = {
        isFound: Answer ? true : false,
        answer: Answer,
        response: dnsResponse
      };
    } catch (error) {
      throw new Error(`Error fetching ${type} record: ${error.message}`);
    }
  }

  return Object.assign({}, records);
};

module.exports = middleware(handler);
