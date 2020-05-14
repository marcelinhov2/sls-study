global.URL = require('url').URL;

const getLdJson = require("underminer/integrations/helpers/parsers/getLdJson");
const navigate = require("underminer/integrations/helpers/puppeteer/navigate");

const ProductSchema = require("underminer/integrations/schemas/product");

module.exports = async (event, context, callback) => {
	const data = await navigate(event.url, true);	
	
	try {
		const json = getLdJson(data.body, 'Product');
		const product = await ProductSchema(json.name, json.offers.priceCurrency, json.offers.price);

		const result = {
			...event,
			product
		};

		return callback(null, result);
	} catch (error) {
		return callback(error);
	}
};