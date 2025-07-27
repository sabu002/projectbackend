import express from 'express'
import { AdminLogout, AdminLogin, isAdminAuth } from '../controllers/adminController.js';
import  { authAdmin } from '../middleware/authAdmin.js';
const adminRouter = express.Router();
adminRouter.post('/login',AdminLogin)
adminRouter.get('/is-auth',authAdmin, isAdminAuth)
adminRouter.get('/logout',AdminLogout)
export default adminRouter;
