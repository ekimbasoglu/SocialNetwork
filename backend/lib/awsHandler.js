const Aws = require("aws-sdk");

function awsParams(file) {
  const params = {
    Bucket: "partajmer", // bucket that we made earlier
    Key: file.originalname, // Name of the image
    Body: file.buffer, // Body which will contain the image in buffer format
    ACL: "public-read-write", // defining the permissions to get the public link
    ContentType: "image/jpeg", // Necessary to define the image content-type to view the photo in the browser with the link
  };

  return params;
}

function awsCred() {
  const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // secretAccessKey is also store in .env file
    region: process.env.AWS_REGION,
  });
  return s3;
}

async function awsService(file) {
  const params = {
    Bucket: "partajmer", // bucket that we made earlier
    Key: file.originalname, // Name of the image
    Body: file.buffer, // Body which will contain the image in buffer format
    ACL: "public-read-write", // defining the permissions to get the public link
    ContentType: "image/jpeg", // Necessary to define the image content-type to view the photo in the browser with the link
  };

  const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // secretAccessKey is also store in .env file
    region: process.env.AWS_REGION,
  });

  return s3.upload(params).promise();
}

module.exports = {
  awsParams,
  awsCred,
  awsService,
};
