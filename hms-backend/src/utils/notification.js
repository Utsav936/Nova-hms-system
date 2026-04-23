const nodemailer = require('nodemailer');

/**
 * ZERO-COST EMAIL CONFIGURATION
 * To use this for free:
 * 1. Go to your Google Account -> Security -> 2-Step Verification -> App Passwords.
 * 2. Generate a 'Mail' password for your 'Windows Computer'.
 * 3. Add the email and the 16-digit code below.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.novahms@gmail.com',
    pass: 'owvt ahsg doxm ockz'
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nova HMS" <noreply.novahms@gmail.com>`,
      to,
      subject,
      text,
      html
    });
    console.log(`📧 [ZERO COST] Email dispatched via Gmail: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('❌ Email dispatch failed:', err);
    // Fallback: Still log to console for development
    console.log(`✉️ Fallback Log - To: ${to}, OTP Body: ${text}`);
    return false;
  }
};

const sendSMS = async (phone, message) => {
  // SMS usually requires a gateway, but for zero-cost, 
  // we recommend using WhatsApp Web API or simple console logs for now.
  console.log(`📱 [MOCK] SMS to ${phone}: ${message}`);
  return true;
};

const sendOTP = async ({ identifier, otp, type = 'email' }) => {
  const subject = 'Your Nova HMS Verification Code';
  const message = `Your verification code is: ${otp}. It will expire in 10 minutes.`;
  const html = `
    <div style="font-family: sans-serif; padding: 30px; background: #f8fafc; color: #1e293b; border-radius: 20px;">
      <h2 style="color: #10b981;">Nova HMS Verification</h2>
      <p>Please use the following 6-digit code to securely access your hospital portal:</p>
      <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; display: inline-block;">
        <h1 style="color: #10b981; font-size: 48px; letter-spacing: 10px; margin: 0;">${otp}</h1>
      </div>
      <p style="margin-top: 20px; font-size: 14px; color: #64748b;">This code is valid for 10 minutes. Do not share this with anyone.</p>
    </div>
  `;

  if (type === 'phone') {
    return await sendSMS(identifier, message);
  }
  
  return await sendEmail(identifier, subject, message, html);
};

module.exports = {
  sendOTP,
  sendEmail,
  sendSMS
};
