import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// POST: Create new review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ _id: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;