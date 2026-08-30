/**
 * notifyService.js
 *
 * Sends a plain-text summary to a family contact.
 * The original screenshot is NEVER included — only the AI-generated summary.
 *
 * MVP: Logs to console. Structured for easy Twilio/SendGrid/NodeMailer extension.
 * To add real email: install nodemailer and replace the stub below.
 * To add SMS: install twilio and replace the stub below.
 */

/**
 * @param {Object} options
 * @param {string} options.summary - Plain text summary of the situation (never the image)
 * @param {string} [options.contactEmail] - Family member's email
 * @param {string} [options.contactPhone] - Family member's phone number
 */
async function sendFamilyNotification({ summary, contactEmail, contactPhone }) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const message = `[ScreenSaathi] Family Alert — ${timestamp}\n\n${summary}\n\nThis message was sent by ScreenSaathi on behalf of your family member.`;

  // ── Console stub (replace with real integration) ──────────────────────
  console.log('='.repeat(60));
  console.log('[ScreenSaathi] FAMILY NOTIFICATION SENT');
  if (contactEmail) console.log('To (email):', contactEmail);
  if (contactPhone) console.log('To (phone):', contactPhone);
  console.log('Message:\n', message);
  console.log('='.repeat(60));

  // ── Extend here with SendGrid ──────────────────────────────────────────
  // if (contactEmail && process.env.SENDGRID_API_KEY) {
  //   const sgMail = require('@sendgrid/mail');
  //   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //   await sgMail.send({ to: contactEmail, from: 'notify@screensaathi.app', subject: 'ScreenSaathi Family Alert', text: message });
  // }

  // ── Extend here with Twilio SMS ────────────────────────────────────────
  // if (contactPhone && process.env.TWILIO_ACCOUNT_SID) {
  //   const twilio = require('twilio');
  //   const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  //   await client.messages.create({ body: message, from: process.env.TWILIO_FROM_NUMBER, to: contactPhone });
  // }

  return true;
}

module.exports = { sendFamilyNotification };
