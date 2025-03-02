const nodemailer = require("nodemailer");
// package => nodemailer

const sendEmail =async (optins) => {
  // 1) create transporter (service that will send email like "gemail","mailgun","mailtrap can be use in dev:mode","sendgrid")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // 2) define email option (like from ,to ,subject ,content)
  const mailOptions = {
    from: 'Glow Era <yahmed9131@gmail.com>',
    to: optins.email,
    subject: optins.subject,
    text: optins.message,
  };
  // 3) send email using transporter
  await transporter.sendMail(mailOptions)
  
    
};
module.exports = sendEmail;
