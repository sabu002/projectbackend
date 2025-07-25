// controllers/recommendController.js
import Product from "../models/product.js";
import User from "../models/User.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("purchaseHistory.productId");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const lastPurchase = user.purchaseHistory.at(-1);

    // 🧠 Fallback for new users
    if (!lastPurchase || !lastPurchase.productId) {
      const fallbackProducts = await Product.find().sort({ createdAt: -1 }).limit(5); // new or random
      return res.json({ success: true, recommendations: fallbackProducts });
    }

    const category = lastPurchase.productId.category;

    let recommended = await Product.find({
      category,
      _id: { $ne: lastPurchase.productId._id },
    }).limit(5);

    // Optional: fallback if recommended is empty
    if (recommended.length === 0) {
      recommended = await Product.find().sort({ createdAt: -1 }).limit(5);
    }

    res.json({ success: true, recommendations: recommended });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
