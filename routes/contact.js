import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { username, email, number, message} = req.body;

    if (!username || !email || !number || !message) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const newContact = new Contact({
      username,
      email,
      number,
      message,
    });

    await newContact.save();
    res.status(201).json({ success: true, message: 'Contact saved successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;