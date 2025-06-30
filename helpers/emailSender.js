import nodemailer from 'nodemailer';
import 'dotenv/config';

const config = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'GoIT email Verification',
    html: `Please verify your email <a target="_blank" href="${process.env.BASE_URL}/api/auth/verify/${verificationToken}">by clicking the link</a>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export default { sendVerificationEmail };
