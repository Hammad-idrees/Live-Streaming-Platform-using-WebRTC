const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const s3 = require("../config/aws"); // Initialized s3 client

// Upload a single file to S3
const uploadFileToS3 = async (filePath, s3Key) => {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || "application/octet-stream";

  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // ✅ Corrected env var name
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
  };

  return s3.upload(params).promise();
};

// Upload all files in a directory to S3
const uploadDirectoryToS3 = async (localDir, s3BaseKey) => {
  const files = fs.readdirSync(localDir);
  const uploadPromises = [];

  for (const file of files) {
    const fullPath = path.join(localDir, file);
    const s3Key = `${s3BaseKey}/${file}`;

    if (fs.statSync(fullPath).isFile()) {
      uploadPromises.push(uploadFileToS3(fullPath, s3Key));
    }
  }

  await Promise.all(uploadPromises);
};

module.exports = { uploadFileToS3, uploadDirectoryToS3 };
