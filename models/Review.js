import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString() }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;