const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

function createTransport() {
  if (process.env.NODE_ENV === 'production') {
    // TODO: swap to a transactional email provider (SendGrid/Mailgun)
  }

  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.MAILTRAP_PORT || 2525),
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });
}

app.post('/send-verification', async (req, res) => {
  const { user, verificationUrl } = req.body;
  if (!user || !user.email || !verificationUrl) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Missing required fields' });
  }

  const transport = createTransport();

  const html = `
    <p>Hi ${user.firstName || user.fullName || ''},</p>
    <p>Thank you for registering.</p>
    <p>Please verify your email address by clicking the link below:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>If you did not create this account, you can ignore this email.</p>
  `;

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to: user.email,
      subject: 'Verify your email address',
      html,
      text: html.replace(/<[^>]+>/g, ''),
    });

    return res.json({ status: 'success', message: 'Verification email sent' });
  } catch (err) {
    console.error('send-verification failed:', err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Failed to send email' });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Email service listening on port ${port}`));
