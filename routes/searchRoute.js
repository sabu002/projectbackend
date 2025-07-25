import express from 'express';
import { searchProducts } from '../controllers/searchController.js';

const router = express.Router();

// GET /api/product/search?query=xxx
router.get('/search', searchProducts);

export default router;
