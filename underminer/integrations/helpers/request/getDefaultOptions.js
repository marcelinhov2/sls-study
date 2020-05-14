module.exports = (method, url, data) => {
  return {
    method,
    url,
    // proxy: "http://lum-customer-hl_fc961178-zone-static:vpfwu5jui5xp@zproxy.luminati.io:22225",
    gzip: true,
    headers: {
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
    }
  }
};