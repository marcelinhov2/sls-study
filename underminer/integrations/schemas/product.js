const yup = require('yup');

module.exports = async (name, currency, price, bestPrice, externalId) => {
  const parsePotentiallyGroupedFloat = (stringValue) => {
    if(!stringValue)
      return null;

    stringValue = stringValue.trim();
    var result = stringValue.replace(/[^0-9]/g, '');
    if (/[,\.]\d{2}$/.test(stringValue)) {
        result = result.replace(/(\d{2})$/, '.$1');
    }
    return parseFloat(result);
  }

  const schema = yup.object().shape({
    name: yup.string().required(),
    currency: yup.string().nullable(),
    bestPrice: yup.number().nullable(),
    price: yup.number().nullable(),
    externalId: yup.string().required(),
    createdOn: yup.date().default(function() {
      return new Date();
    })
  });

  return schema.cast({
    name,
    currency,
    externalId,
    bestPrice: parsePotentiallyGroupedFloat(bestPrice),
    price: parsePotentiallyGroupedFloat(price)
  });
};