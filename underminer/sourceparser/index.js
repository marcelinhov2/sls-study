const parseDomain = require('parse-domain').parseDomain;
const Url = require('url-parse');

module.exports.handler = async (event, context, callback) => {
  const url = new Url(event.url);
  const {domain} = parseDomain(url.hostname);
  
  const result = {
    url: url.href,
    source: domain
  };

  return callback(null, result);
};