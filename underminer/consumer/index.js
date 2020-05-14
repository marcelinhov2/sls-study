const AWS = require('aws-sdk');
const filenamifyUrl = require('filenamify-url');

module.exports.handler = async (event, context, callback) => {
  let s3 = null;

  // TODO: esse if/else precisa ser arrumado. não está da melhor maneira possível
  if(process.env.STEP_IS_OFFLINE) {
    s3 = new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
      endpoint: new AWS.Endpoint('http://localhost:4569')
    });
  }
  else {
    s3 = new AWS.S3();
  }

  await s3.upload({
    Body: JSON.stringify(event),
    Bucket: process.env.BUCKET_NAME,
    Key: `results/${filenamifyUrl(event.url, {replacement: '_'})}-${new Date().getTime()}.json`,
    ContentType: "application/json"
  }).promise().then(function() {
    return callback(null, "success");
  }, function (error) {
    return callback(error);
  });
};