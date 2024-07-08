// utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ajithkanagasabai17@gmail.com',
      pass: 'eoma jjcm wrhv mlfb'
    }
  });

  const mailOptions = {
    from: '',
    to,
    subject: 'Ramsy Health Care Password Reset Link',
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
