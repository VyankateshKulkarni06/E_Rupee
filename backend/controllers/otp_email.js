const nodemailer = require('nodemailer');

// In-memory OTP store: { email: { otp: 123456, expiresAt: Date } }
const otpStore = {};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: 'erupee2025@gmail.com',
      pass: 'yahu kkwu fuzu lutv'
    }
  });
  

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

function send_otp(email) {
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore[email] = { otp, expiresAt };

  const mailOptions = {
    from: 'erupee2025@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

function verify_otp(email, enteredOtp) {
  const record = otpStore[email];
  if (!record) return false;

  const isExpired = Date.now() > record.expiresAt;
  const isMatch = parseInt(enteredOtp) === record.otp;

  return isMatch && !isExpired;
}

module.exports={send_otp,verify_otp};
// qkhc edeu qgzx haxy