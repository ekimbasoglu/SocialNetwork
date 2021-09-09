const path = require('path');

const envPath = path.join(__dirname, `./environments/${process.env.NODE_ENV}.env`);
require('dotenv').config({ path: envPath });

/*
 * Project wide enviroment variables
 * If a new environment variable is added to the project,
 * add it to the respective .env file and to the object below.
 */
const environmentVariables = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ALGORITHMS: process.env.JWT_ALGORITHMS.split(' '),
  // AWS and S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  // If using SMTP for emails, EMAIL_FROM and EMAIL_HOST are required
  // EMAIL_FROM: process.env.EMAIL_FROM,
  // EMAIL_HOST: process.env.EMAIL_HOST,
  // GMAIL_PROVIDER_PASSWORD: process.env.GMAIL_PROVIDER_PASSWORD,
  // EMAIL_HOST_SERVICE: process.env.EMAIL_HOST_SERVICE,
  // EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  MONGO_DB: process.env.MONGO_DB,
  // It gives web adress for conformation email
  // PROJECT_WEB_ADDRESS: process.env.PROJECT_WEB_ADDRESS,
  // It gives how long beare token should last,
  BEARER_TOKEN_DURATION: process.env.BEARER_TOKEN_DURATION,
};

/**
 * Returns Project environment variables based on NODE_ENV
 * @returns {Object}
 */
const getEnvVariables = () => {
  if (!environmentVariables.NODE_ENV) {
    throw new Error('Missing NODE_ENV environment variable');
  }

  if (environmentVariables.NODE_ENV === 'test') {
    return {
      NODE_ENV: environmentVariables.NODE_ENV,
      PORT: environmentVariables.PORT,
      JWT_SECRET: environmentVariables.JWT_SECRET,
      JWT_ALGORITHMS: environmentVariables.JWT_ALGORITHMS,
      PROJECT_WEB_ADDRESS: environmentVariables.PROJECT_WEB_ADDRESS,
      BEARER_TOKEN_DURATION: process.env.BEARER_TOKEN_DURATION,
    };
  }
  return environmentVariables;
};

// Check for missing environment variables
Object.entries(getEnvVariables()).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing ${key} environment variable`);
  }
});

module.exports = getEnvVariables();
