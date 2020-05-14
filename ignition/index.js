const neatCsv = require('neat-csv');
const fs = require('fs')
const batchPromises = require('batch-promises');

const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

module.exports.handler = async (event, context, callback) => {
	const sleep = (delay) => {
		const start = new Date().getTime();
		while (new Date().getTime() < start + delay);
	}
	
	const forEachPromise = async (items, fn) => {
		const result = await batchPromises(200, items, fn)
		await sleep(2000)
		return result;
	}
	
	const callStepFunction = async(url) => {
		try {
			console.log(`callStepFunction for: ${url}`)

			const params = {    
				stateMachineArn: process.env.UNDERMINER_ARN, 
				input: JSON.stringify({url})  
			}

			return new Promise((resolve, reject) => {
				stepfunctions.startExecution(params, (err, data) => { 
					return resolve(data);
				});
			});
		} catch (e) {
			return null;
		}
	}

	const parseCsv = async () => {
		return new Promise((resolve, reject) => {
			fs.readFile('ignition/offers.csv', async (err, data) => {
				if (err)
					return err
	
				const result = await neatCsv(data, {headers:false});
				return resolve(result.map(val => Object.values(val)[0]));
			})
		});
	}
	
	try {
		const result = await parseCsv();
		await forEachPromise(result, callStepFunction)

		return callback(null, 'success');
	} catch (e) {
		return callback(e)
	}
};