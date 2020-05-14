const AWS = require('aws-sdk');
const athena = new AWS.Athena();

const sleep = (delay) => {
  const start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

const isExecutionDone = async(queryExecutionId) => {
  const result = await athena.getQueryExecution(queryExecutionId).promise();

  return Promise.resolve(result.QueryExecution.Status.State === 'SUCCEEDED'); 
}

const formatResults = (results) => {
  let formattedResults = [];
  const rows = results.ResultSet.Rows;

  rows.forEach(function(row) {    
      const value = {
          url: row.Data[0].VarCharValue,
          source: row.Data[1].VarCharValue,
          product: {
            name: row.Data[2].VarCharValue,
            price: parseFloat(row.Data[3].VarCharValue)
          }
      };

      formattedResults.push(value);
  });

  return formattedResults;
}

module.exports = async(queryExecutionId) => {
  let executionDone = false;

  while (!executionDone) {
      executionDone = await isExecutionDone(queryExecutionId);
      console.log('waiting...')
      sleep(1000);
  }
  
  const results = await athena.getQueryResults(queryExecutionId).promise();    
  
  return Promise.resolve(formatResults(results));
};