// utils/s3Uploader.js
const aws = require('aws-sdk');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// AWS S3 Configuration
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Upload file to AWS S3.
 * @param {Object} file - The file object from multer.
 * @returns {Promise} - Promise with S3 upload response.
 */
const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`, // Save the file with a unique name
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read', // Make the file publicly accessible
  };

  // Return a promise for the upload
  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };
