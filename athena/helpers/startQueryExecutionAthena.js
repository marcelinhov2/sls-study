const AWS = require('aws-sdk');
const athena = new AWS.Athena();
const crypto = require('crypto');

const DATABASE_NAME = process.env.DATABASE_NAME;
const ATHENA_BUCKET_NAME = process.env.ATHENA_BUCKET_NAME;

module.exports = async(query) => {
    const queryHash = crypto.createHash('md5').update(query).digest('hex');

    const params = {
        QueryString: query,
        QueryExecutionContext: {
            Database: DATABASE_NAME
        },
        ResultConfiguration: {
            OutputLocation: `s3://${ATHENA_BUCKET_NAME}/${queryHash}/`
        }
    };

    return athena.startQueryExecution(params).promise();
};