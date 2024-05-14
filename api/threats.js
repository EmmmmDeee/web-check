const axios = require('axios');
const xml2js = require('xml2js');
const { validateUrl, parseUrl } = require('./_common/url-utils');
const { getApiKey } = require('./_common/api-keys');

const getGoogleSafeBrowsingResult = async (url) => {
  const apiKey = getApiKey('GOOGLE_CLOUD_API_KEY');
  if (!apiKey) {
    return { error: 'GOOGLE_CLOUD_API_KEY is required for the Google Safe Browsing check' };
  }

  const apiEndpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const requestBody = {
    threatInfo: {
      threatTypes: [
        'MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION', 'API_ABUSE'
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };

  try {
    const response = await axios.post(apiEndpoint, requestBody);
    if (response.data && response.data.matches) {
      return {
        unsafe: true,
        details: response.data.matches
      };
    } else {
      return { unsafe: false };
    }
  } catch (error) {
    return { error: `Request failed: ${error.message}` };
  }
};

const getUrlHausResult = async (url) => {
  if (!validateUrl(url)) {
    return { error: 'Invalid URL' };
  }

  const domain = parseUrl(url).hostname;

  try {
    const response = await axios.post('https://urlhaus-api.abuse.ch/v1/host/', `host=${domain}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    return { error: `Request to URLHaus failed, ${error.message}` };
  }
};

const getPhishTankResult = async (url) => {
  if (!validateUrl(url)) {
    return { error: 'Invalid URL' };
  }

  const encodedUrl = Buffer.from(url).toString('base64');
  const endpoint = `https://checkurl.phishtank.com/checkurl/?url=${encodedUrl}`;
  const headers = {
    'User-Agent': 'phishtank/web-check',
  };

  try {
    const response = await axios.post(endpoint, null, { headers, timeout: 3000 });
    const parsed = await xml2js.parseStringPromise(response.data, { explicitArray: false });
    return parsed.response.results;
  } catch (error) {
    return { error: `Request to PhishTank failed: ${error.message}` };
  }
};

const getCloudmersiveResult = async (url) => {
  const apiKey = getApiKey('CLOUDMERSIVE_API_KEY');
  if (!apiKey) {
    return { error: 'CLOUDMERSIVE_API_KEY is required for the Cloudmersive check' };
  }

  const endpoint = 'https://api.cloudmersive.com/virus/scan/website';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Apikey': apiKey,
  };
  const data = `Url=${encodeURIComponent(url)}`;

  try {
    const response = await axios.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    return { error: `Request to Cloudmersive failed: ${error.message}` };
  }
};

const handler = async (url) => {
  if (!validateUrl(url)) {
    throw new Error('Invalid URL');
  }

  const urlHaus = await getUrlHausResult(url);
  const phishTank = await getPhishTankResult(url);
  const cloudmersive = await getCloudmersiveResult(url);
  const safeBrowsing = await getGoogleSafeBrowsingResult(url);

  if (urlHaus.error || phishTank.error || cloudmersive.error || safeBrowsing.error) {
    throw new Error(`One or more requests failed - ${urlHaus.error} ${phishTank.error} ${cloudmersive.error} ${safeBrowsing.error}`);
  }

  return JSON.stringify({ urlHaus, phishTank, cloudmersive, safeBrowsing });
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

