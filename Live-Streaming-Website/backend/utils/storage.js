const s3 = require("../config/aws");
const config = require("../config/env");
const path = require("path");

async function uploadFile(filePath, key) {
  // Placeholder: Read file and upload to S3
  // const fileContent = fs.readFileSync(filePath);
  // await s3.upload({ Bucket: config.aws.bucket, Key: key, Body: fileContent }).promise();
  return `s3://${config.aws.bucket}/${key}`;
}

function getFileUrl(key) {
  return s3.getSignedUrl("getObject", {
    Bucket: config.aws.bucket,
    Key: key,
    Expires: 60 * 60, // 1 hour
  });
}

module.exports = { uploadFile, getFileUrl };
