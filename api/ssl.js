const tls = require('tls');
const { url, URL } = require('url');

const handler = async (options) => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(options, () => {
      if (!socket.authorized) {
        return reject(new Error(`SSL handshake not authorized. Reason: ${socket.authorizationError}`));
      }

      const cert = socket.getPeerCertificate();
      if (!cert || Object.keys(cert).length === 0) {
        return reject(new Error(`
          No certificate presented by the server.
          This may be due to an invalid SSL certificate, or an incomplete SSL handshake at the time the cert is being read.`));
      }

      const certWithoutRaw = { ...cert };
      delete certWithoutRaw.raw;
      resolve(certWithoutRaw);
      socket.end();
    });

    socket.on('error', (error) => {
      if (error.code === 'ENOENT') {
        // Ignore ENOENT errors, which occur when the server doesn't present a certificate
        return;
      }
      reject(new Error(`Error fetching site certificate: ${error.message}`));
    });
  });
};

const middleware = (handler) => (req, res, next) => {
  const parsedUrl = new URL(req.url, req.headers.origin);
  const options = {
    host: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    servername: parsedUrl.hostname,
    rejectUnauthorized: false,
  };

  handler(options)
    .then((cert) => {
      req.cert = cert;
      next();
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

module.exports = { handler, middleware };
