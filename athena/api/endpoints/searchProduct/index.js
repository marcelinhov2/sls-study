const SQL = require('sql-template-strings');

const startQueryExecutionAthena = require("athena/helpers/startQueryExecutionAthena");
const getQueryResults = require("athena/helpers/getQueryResults");

const getMatcher = (key) => {
    if(key == 'product.maxPrice')
        return 'product.price <=';

    if(key == 'product.minPrice')
        return 'product.price >=';

    return `${key} =`;
}

const buildQuery = (querystring) => {
    let searchQuery = `SELECT url, source, product.name, product.price FROM products`;

    if(querystring) {
        Object.keys(querystring).forEach(function(key, i) {
            const matcher = getMatcher(key);
            const value = parseFloat(querystring[key]) || `'${querystring[key]}'`;
    
            if (i === 0) {
                searchQuery += ` WHERE ${matcher} ${value}`;
            } else {
                searchQuery += ` AND ${matcher} ${value}`;
            }
        });
    }

    searchQuery += ` LIMIT 10`;
    
    return searchQuery;
}

module.exports = async (event, context, callback) => {
    const searchQuery = buildQuery(event.queryStringParameters);
    const queryExecutionIdSearch = await startQueryExecutionAthena(searchQuery);

    const result = await getQueryResults(queryExecutionIdSearch);
    result.shift();

    return callback(null, {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true,
            "Vary": "Origin"
        },
        "body": JSON.stringify(result),
        "isBase64Encoded": false
    });
}