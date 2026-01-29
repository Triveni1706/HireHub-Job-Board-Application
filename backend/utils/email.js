const nodemailer = require('nodemailer');

// Configure transporter (use Gmail SMTP or your own SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any email provider
  auth: {
    user: 'youremail@gmail.com',    // replace with your email
    pass: 'yourpassword'            // replace with App Password if using Gmail
  }
});

// Send email function
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'youremail@gmail.com',
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.log('Error sending email:', err);
  }
};

module.exports = sendEmail;
