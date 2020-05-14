const startQueryExecutionAthena = require("athena/helpers/startQueryExecutionAthena");

const DATABASE_NAME = process.env.DATABASE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

const QUERY_TABLE = `
    CREATE EXTERNAL TABLE IF NOT EXISTS products (
        url string,
        source string,
        product struct<name:string,
                        price:float> 
    ) 
    ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe' 
    WITH SERDEPROPERTIES (
        'serialization.format' = ',',
        'field.delim' = ','
    ) LOCATION 's3://${BUCKET_NAME}/results/'
    TBLPROPERTIES ('has_encrypted_data'='false');
`;

const QUERY_DATABASE = `
    CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}
    LOCATION 's3://${BUCKET_NAME}/results/'
`;

module.exports.init = async (event) => {
    await startQueryExecutionAthena(QUERY_DATABASE);
    await startQueryExecutionAthena(QUERY_TABLE);
    return;
}