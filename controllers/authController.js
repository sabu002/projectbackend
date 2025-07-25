// controllers/authController.js
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/SendEmail.js"; // You'll create this next

// [POST] /api/user/forgot-password
// export const forgotPassword = async (req, res) => {
//      console.log("REQ BODY:", req.body); 
//   const { email } = req.body;
// console.log(`Email found: ${email}`);
//   try {
//     // Lookup user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
//     }

//     // Create and save token (implement this in model)
//     const resetToken = user.generateResetToken();
//     await user.save({ validateBeforeSave: false });

//     // Build reset URL
//     const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

//     // Send email
//     await sendEmail({
//       to: user.email,
//       subject: "Password Reset Request",
//       html: `<p>Reset your password here: <a href="${resetURL}">${resetURL}</a></p>`,
//     });

//     return res.json({ success: true, message: "Reset link sent." });
//   } catch (err) {
//     console.error("ForgotPassword Error:", err);
//     res.status(500).json({ success: false, message: "Server error." });
//   }
// };


// [POST] /api/user/reset-password/:token
export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ success: true, message: "Password has been reset. You can now log in." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error resetting password." });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(`Email found: ${email}`);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: "If the email exists, an OTP has been sent.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP & expiry
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save({ validateBeforeSave: false });

    // Send OTP via email
    await sendEmail({
      to: user.email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    return res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("OTP Send Error:", err);
    return res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};
// [POST] /api/user/verify-otp
export const verifyOtpAndReset = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!otp || !password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP or password.",
    });
  }

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error resetting password.",
    });
  }
};

