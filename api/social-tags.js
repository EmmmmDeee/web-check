const middleware = require('./_common/middleware');
const axios = require('axios');
const cheerio = require('cheerio');
const urlJoin = require('url-join');
const validateUrl = require('validate-url');

const handler = async (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const metadata = {
      // Basic meta tags
      title: $('head title').text(),
      description: getMetaContent($, 'description'),
      keywords: getMetaContent($, 'keywords'),
      canonicalUrl: getMetaContent($, 'canonical'),

      // OpenGraph Protocol
      ogTitle: getMetaContent($, 'og:title'),
      ogType: getMetaContent($, 'og:type'),
      ogImage: getMetaContent($, 'og:image'),
      ogUrl: getMetaContent($, 'og:url'),
      ogDescription: getMetaContent($, 'og:description'),
      ogSiteName: getMetaContent($, 'og:site_name'),

      // Twitter Cards
      twitterCard: getMetaContent($, 'twitter:card'),
      twitterSite: getMetaContent($, 'twitter:site'),
      twitterCreator: getMetaContent($, 'twitter:creator'),
      twitterTitle: getMetaContent($, 'twitter:title'),
      twitterDescription: getMetaContent($, 'twitter:description'),
      twitterImage: getMetaContent($, 'twitter:image'),

      // Misc
      themeColor: getMetaContent($, 'theme-color'),
      robots: getMetaContent($, 'robots'),
      googlebot: getMetaContent($, 'googlebot'),
      generator: getMetaContent($, 'generator'),
      viewport: getMetaContent($, 'viewport'),
      author: getMetaContent($, 'author'),
      publisher: $('link[rel="publisher"]').attr('href'),
      favicon: $('link[rel="icon"]').attr('href')
    };

    validateMetadata(metadata);

    if (Object.keys(metadata).length === 0) {
      return { skipped: 'No metadata found' };
    }
    return metadata;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

function getMetaContent($, name) {
  const content = $('meta[property="og:' + name + '"], meta[name="' + name + '"]').attr('content');
  return content || '';
}

function validateMetadata(metadata) {
  for (const [key, value] of Object.entries(metadata)) {
    if (key === 'canonicalUrl' || key === 'ogUrl' || key === 'publisher' || key === 'favicon') {
      if (value && !validateUrl(value)) {
        throw new Error(`Invalid ${key}: ${value}`);
      }
    }
    if (key === 'themeColor' || key === 'ogType') {
      if (value && !isValidHexColor(value)) {
        throw new Error(`Invalid ${key}: ${value}`);
      }
    }
  }
}

function isValidHexColor(hexColor) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor);
}

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

