const AWS = require("aws-sdk");
const config = require("./env");

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

module.exports = s3;
