const net = require('net');
const url = require('url');
const util = require('util');

// A list of commonly used ports.
const PORTS = [
  20, 21, 22, 23, 25, 53, 80, 67, 68, 69,
  110, 119, 123, 143, 156, 161, 162, 179, 194,
  389, 443, 587, 993, 995,
  3000, 3306, 3389, 5060, 5900, 8000, 8080, 8888
];

// Check for duplicate ports
const uniquePorts = [...new Set(PORTS)];
if (uniquePorts.length !== PORTS.length) {
  console.error('PORTS array contains duplicate values, please remove them.');
  process.exit(1);
}

async function checkPort(port, domain) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    socket.setTimeout(1500);

    socket.once('connect', () => {
      socket.destroy();
      resolve(port);
    });

    socket.once('timeout', () => {
      socket.destroy();
      reject(new Error(`Timeout at port: ${port}`));
    });

    socket.once('error', (e) => {
      socket.destroy();
      reject(e);
    });

    socket.connect(port, domain);
  });
}

function isValidUrl(string) {
  try {
    return url.parse(string).hostname !== null;
  } catch (e) {
    return false;
  }
}

function isValidIp(ip) {
  const segments = ip.split('.');
  if (segments.length === 4) {
    return segments.every(segment => parseInt(segment, 10) >= 0 && parseInt(segment, 10) <= 255);
  }
  return false;
}

async function checkDomain(domain) {
  if (!domain) {
    return Promise.reject(new Error('Empty domain'));
  }

  if (isValidIp(domain)) {
    return domain;
  }

  if (isValidUrl(domain)) {
    return domain.replace(/(^\w+:|^)\/\//, '');
  }

  try {
    const result = await util.promisify(require('dns').resolve)(domain);
    return result.address;
  } catch (e) {
    return Promise.reject(new Error(`Invalid domain: ${domain}`));
  }
}

const handler = async (url, event, context) => {
  const parsedUrl = url;
  let domain;

  try {
    domain = await checkDomain(parsedUrl.hostname);
  } catch (e) {
    return errorResponse(e.message, 400);
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const timeout = delay(9000);

  const openPorts = [];
  const failedPorts = [];

  const promises = uniquePorts.map(port => checkPort(port, domain)
    .then(port => {
      openPorts.push(port);
      return { status: 'fulfilled', port };
    })
    .catch(e => {
      failedPorts.push(port);
      return { status: 'rejected', port: e.code };
    }));

  let timeoutReached = false;

  for (const promise of promises) {
    const result = await Promise.race([promise, timeout.then(() => ({ status: 'timeout', timeout: true }))]);
    if (result.status === 'timeout') {
      timeoutReached = true;
      if (result.timeout) {
        // Add the ports not checked yet to the failedPorts array
        const checkedPorts = [...openPorts, ...failedPorts];
        const portsNotChecked = uniquePorts.filter(port => !checkedPorts.includes(port));
        failedPorts.push(...portsNotChecked);
      }
      break;
    }
  }

  if (timeoutReached) {
    return errorResponse('The function timed out before completing.', 408);
  }

  return { openPorts, failedPorts };
};

function errorResponse(message, statusCode = 444) {
  return { error: message, statusCode };
}

module.exports = handler;
