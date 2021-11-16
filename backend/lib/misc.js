/* eslint-disable no-plusplus */
const bunyan = require('bunyan');

/**
 * Check if given id is valid ObjectId
 * @param id
 * @returns {boolean}
 */
function isValidId(id) {
  if (!id) {
    return false;
  }
  return !!id.toString().match(/^[0-9a-fA-F]{24}$/);
}

/**
 * Error logger
 * @param req
 * @param err
 */
function logError(req, err) {
  const logger = bunyan.createLogger({
    name: err && err.name ? err.name : 'unknown',
    streams: [
      {
        level: 'error',
        path: 'error.log',
      },
    ],
  });
  logger.error({ req, error: err.toString() });
}

/**
 * Return custom short ID with 6 digit
 * @param {Number} idLength length of the ID
 * @returns {string}
 */
function customShortId(idLength = 6) {
  const numbers = '0123456789';
  let data = '';
  for (let i = 0; i < idLength; i += 1) {
    data += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return data;
}

/**
 * Verification code
 * @param none
 * @param err
 */
function createVerificationToken() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let verificationCode = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 31; i++) {
    verificationCode += characters[Math.floor(Math.random() * characters.length)];
  }
  return verificationCode;
}
module.exports = {
  isValidId,
  logError,
  createVerificationToken,
  customShortId,
};
