import Fuse from 'fuse.js';
import Product from '../models/product.js';

// /api/product/search?query=xxx
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ success: false, message: 'No search query provided.' });
    const products = await Product.find({});
    const fuse = new Fuse(products, {
      keys: ['name', 'category', 'description'],
      threshold: 0.3,
    });
    const result = fuse.search(query);
    const matchedProducts = result.map(r => r.item);
    res.json({ success: true, products: matchedProducts });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
