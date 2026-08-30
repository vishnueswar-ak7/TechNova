import nodemailer from 'nodemailer';

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { summary, contactEmail, contactPhone } = req.body;
    
    // For Vercel demo purposes, we will dynamically create a test account on the fly
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Trust Wise Alerts" <alert@trustwise.app>',
      to: contactEmail || 'family@example.com',
      subject: '🚨 Trust Wise Alert: Assistance Needed',
      text: `Trust Wise Alert:\n\nThe user might need help.\nAI Analysis: ${summary}\n\nPhone contact: ${contactPhone || 'Not provided'}`,
    });

    console.log('[notify] Ethereal URL:', nodemailer.getTestMessageUrl(info));

    res.json({ success: true, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error('[notify] Error sending alert:', error);
    res.status(500).json({ error: 'Failed to send alert.' });
  }
};
