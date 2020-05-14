const cheerio = require("cheerio");
const request = require("request-promise-native");

const requestDefaultOptions = require("underminer/integrations/helpers/request/getDefaultOptions");
const getLdJson = require("underminer/integrations/helpers/parsers/getLdJson");

const ProductSchema = require("underminer/integrations/schemas/product");

module.exports = async (event, context, callback) => {
	console.log(`extracting: ${event.url}`)

	const options = requestDefaultOptions("GET", event.url);
	const html = await request(options);

	try {
		const $ = cheerio.load(html);
		const json = getLdJson(html, 'Product') || JSON.parse($("div[data-product]").attr("data-product"));

		const name = json.fullTitle;
		const price = json.listPrice.trim();
		const bestPrice = json.bestPriceTemplate.trim();

		const product = await ProductSchema(name, null, price, bestPrice);

		const result = {
			...event,
			product
		};

		return callback(null, result);
	} catch (error) {
		return callback(error)
	}
};