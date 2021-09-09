const { PROJECT_WEB_ADDRESS } = require('../config/environments');
const { sendEmailSMTP } = require('./emailHandler');

const sendForgetPasswordEmail = async (email, resetToken) => {
  const resetPasswordLink = `${PROJECT_WEB_ADDRESS}/auth/password/reset/${resetToken}`;

  const html = `
        <h3> Poštovani/a, </h3>
        <br>
        <p>Da biste uspešno resetovali lozinku kliknite na sledeći link:</p>
        <br><br>
        ${resetPasswordLink}
    `;

  // this function is giving me a error in node console that promise was't something
  await sendEmailSMTP(email, 'Reset Lozinke', '', html);
};

module.exports = {
  sendForgetPasswordEmail,
};
