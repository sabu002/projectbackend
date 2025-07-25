import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // role‑based access
    role: {
      type: String,
      enum: ["admin", "seller", "user"],
      default: "user",
    },

    purchaseHistory: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        date: { type: Date, default: Date.now },
      },
    ],

    cartItems: { type: Object, default: {} },
      otp: String,
   otpExpires: Date,

    /* ----------  NEW FIELDS for password‑reset flow ---------- */
    resetPasswordToken:   String,
    resetPasswordExpires: Date,
    /* --------------------------------------------------------- */
  },
  

  { minimize: false }
);

/* 🔐 Hash the password whenever it’s changed */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* 🔑 Helper to create a reset token */
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
