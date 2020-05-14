const request = require("request-promise-native");

const getLdJson = require("underminer/integrations/helpers/parsers/getLdJson");
const requestDefaultOptions = require("underminer/integrations/helpers/request/getDefaultOptions");

const ProductSchema = require("underminer/integrations/schemas/product");

module.exports = async (event, context, callback) => {
	console.log(`extracting: ${event.url}`)

	const options = requestDefaultOptions("GET", event.url);
	const html = await request(options);

	try {
		const json = getLdJson(html, 'Product');

		const price = (json && json.offers) ? json.offers.price.toString() : null;
		const priceCurrency = (json && json.offers) ? json.offers.priceCurrency.toString() : null;

		const product = await ProductSchema(json.name, priceCurrency, price, null);

		const result = {
			...event,
			product
		};

		return callback(null, result);
	} catch (error) {
		return callback(error)
	}
};