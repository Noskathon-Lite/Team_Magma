import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  // Create a transporter object using the default SMTP transport

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email, // Recipient email address
    subject, // Subject line
    text: message, // Plain text body
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
