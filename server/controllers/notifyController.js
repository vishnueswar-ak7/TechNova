const { sendFamilyNotification } = require('../services/notifyService');

/**
 * POST /api/notify
 *
 * Body: { summary: string, contactEmail?: string, contactPhone?: string }
 *
 * Sends a plain-text summary to the family contact.
 * The original screenshot is NEVER included — only the generated summary.
 */
async function sendNotification(req, res, next) {
  try {
    const { summary, contactEmail, contactPhone } = req.body;

    if (!summary || summary.trim().length === 0) {
      return res.status(400).json({ error: 'A summary is required to notify your family.' });
    }

    if (!contactEmail && !contactPhone) {
      return res.status(400).json({
        error: 'Please provide a contact email or phone number.',
      });
    }

    await sendFamilyNotification({ summary, contactEmail, contactPhone });

    return res.json({
      success: true,
      message: 'Your family has been notified.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendNotification };
