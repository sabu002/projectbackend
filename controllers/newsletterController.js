import Newsletter from '../models/Newsletter.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.json({ success: false, message: 'Email is required' });

    const exists = await Newsletter.findOne({ email });
    if (exists) return res.json({ success: false, message: 'Already subscribed' });

    await Newsletter.create({ email });
    return res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};