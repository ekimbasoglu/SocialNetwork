const { PROJECT_WEB_ADDRESS } = require('../config/environments');
const { sendEmailSMTP } = require('./emailHandler');

const sendConformationEmail = async (email, token, name = '') => {
  const verificationLink = `${PROJECT_WEB_ADDRESS}/auth/email/confirm/${token}`;

  const html = `
        <h3> Poštovani/a ${name}, </h3>
        <br>
        <p>Dobrodošli/a u Partajmer.</p>
        <p>Da biste uspešno kompletirali proces registracije kliknite na sledeći link:</p>
        <br><br>
        ${verificationLink}
    `;

  // this function is giving me a error in node console that promise was't something
  await sendEmailSMTP(email, 'Registracija', '', html);
};

module.exports = {
  sendConformationEmail,
};
