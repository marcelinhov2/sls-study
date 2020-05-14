const JSON5 = require('json5');
const cheerio = require("cheerio");

module.exports = (html, type) => {
  const $ = cheerio.load(html, {decodeEntities: true});
  const obj = $('script[type="application/ld+json"]');

  if(type) {
    for(let i = 0; i < obj.length; i++) {
      let data = obj[i].children[0].data;
      
      if(data.indexOf("&quot") > -1)
        data = data.replace(/&quot;/g,'"')

      const current = JSON5.parse(JSON.stringify(data));

      if(current['@type'] == type)
        return current;
    }
  }
  
  if(!obj.length)
    return;

  for(let i in obj) {
    for(let j in obj[i].children) {
      const data = obj[i].children[j].data;
      if(data)
        return JSON5.parse(data);
    }
  }
};