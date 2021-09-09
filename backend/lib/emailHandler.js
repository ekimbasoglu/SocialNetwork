const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const { logError } = require('./misc');
const {
  EMAIL_FROM, EMAIL_HOST, GMAIL_PROVIDER_PASSWORD, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, NODE_ENV, EMAIL_HOST_SERVICE, EMAIL_SERVICE
} = require('../config/environments');

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

/**
 * Send Email with AWS SES
 * @param {String} typeOfEmail Type of email template to send
 * @param {String} subject Email Subject to appear in email
 * @param {String[]} emailsToSend Array of email strings, ex: ['john@edu.com', 'michael@gmail.com']
 * @param {String[]} ccEmails Array of email strings to send as CC, ex: ['john@edu.com', 'michael@gmail.com']
 * @param {Object} params Extra parameters to be included in email template
 * @returns {Promise}
 */
function sendEmail(typeOfEmail, subject, emailsToSend, ccEmails = [], params = '') {
  const emailService = new AWS.SES();

  if (NODE_ENV === 'test') {
    return Promise.resolve();
  }

  return emailService.sendEmail({
    Destination: {
      ToAddresses: emailsToSend,
      CcAddresses: ccEmails,
    },
    Message: {
      Body: {
        Html: {
          Data: `<h1>Hello ${params}</h1>`, // Replace with email template
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: EMAIL_FROM,
  })
    .promise();
}

/**
 * Send Email using SMTP
 * @param {String[]} recipients Array of email strings, ex: ['john@edu.com', 'michael@gmail.com']
 * @param {String} subject Email Subject to appear in email
 * @param {String[]} text Email body message
 * @param {String[]} html Email body message as html
 * @param {Object[]} [attachments] Optional attachments for email to send
 * @returns {Promise}
 */
function sendEmailSMTP(recipients, subject, text = '', html = '', attachments) {
  if (NODE_ENV === 'test') {
    return Promise.resolve();
  }

  const transported = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    host: EMAIL_HOST_SERVICE,
    auth: {
      user: EMAIL_HOST,
      pass: GMAIL_PROVIDER_PASSWORD,
    },
  });

  const options = {
    to: recipients,
    from: EMAIL_FROM,
    subject,
    text,
    html,
  };

  if (attachments) {
    options.attachments = attachments;
  }

  transported.sendMail(options).then(() => null).catch((err) => {
    logError(err);
    return null;
  });
}

module.exports = {
  sendEmail,
  sendEmailSMTP,
};
