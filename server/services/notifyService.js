/**
 * notifyService.js
 *
 * Sends family notifications via Nodemailer (using Ethereal email for testing).
 */

const nodemailer = require('nodemailer');

let testAccount = null;
let transporter = null;

async function setupTransporter() {
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[notifyService] Ethereal Email SMTP initialized');
  }
  return transporter;
}

/**
 * @param {Object} options
 * @param {string} [options.contactEmail]
 * @param {string} [options.contactPhone]
 * @param {string} options.summary
 */
async function sendNotification({ contactEmail, contactPhone, summary }) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const message = `[Trustwise] Family Alert — ${timestamp}\n\n${summary}\n\nThis message was sent by Trustwise on behalf of your family member.`;

  try {
    const mailer = await setupTransporter();
    
    // We send an email if contactEmail is provided, otherwise we fallback to contactPhone as a dummy email.
    const toAddress = contactEmail || `${contactPhone}@example.com`;
    
    const info = await mailer.sendMail({
      from: '"Trustwise Alerts" <alert@trustwise.app>',
      to: toAddress,
      subject: "Trustwise Alert: Family Member Needs Help",
      text: message,
    });

    console.log('[notifyService] Email sent successfully! ID:', info.messageId);
    console.log('[notifyService] 🌐 Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('[notifyService] Failed to send notification:', error);
    throw error;
  }
}

module.exports = { sendNotification };
