import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import { forgotPassword, resetPassword, verifyOtpAndReset } from "../controllers/authController.js";

const router = express.Router();

// 👇 Include all routes in one router
router.post('/register', register);
router.post('/login', login);
router.get('/is-auth', authUser, isAuth);
router.get('/logout', authUser, logout);

// 👇 Add forgot/reset password routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtpAndReset);
router.post("/reset-password/:token", resetPassword);

export default router;
