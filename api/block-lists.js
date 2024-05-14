const dns = require('dns');
const middleware = require('./_common/middleware');
const { handler: originalHandler } = require('./path/to/module');

const DNS_SERVERS = [
  // ...
];

const knownBlockIPs = [
  // ...
];

const isDomainBlocked = async (domain, serverIP) => {
  try {
    const addresses = await dns.resolve4(domain, { server: serverIP });
    if (addresses.some((addr) => knownBlockIPs.includes(addr))) {
      return true;
    }
  } catch (err) {
    if (err.code !== 'ENOTFOUND' && err.code !== 'SERVFAIL') {
      throw err;
    }
  }

  try {
    const addresses6 = await dns.resolve6(domain, { server: serverIP });
    if (addresses6.some((addr) => knownBlockIPs.includes(addr))) {
      return true;
    }
  } catch (err6) {
    if (err6.code !== 'ENOTFOUND' && err6.code !== 'SERVFAIL') {
      throw err6;
    }
  }

  return false;
};

const checkDomainAgainstDnsServers = async (domain) => {
  const results = [];

  for (const server of DNS_SERVERS) {
    const isBlocked = await isDomainBlocked(domain, server.ip);
    results.push({
      server: server.name,
      serverIp: server.ip,
      isBlocked,
    });
  }

  return results;
};

const handler = async (url) => {
  const domain = new URL(url).hostname;
  const results = await checkDomainAgainstDnsServers(domain);
  return { blocklists: results };
};

module.exports = middleware(handler);
