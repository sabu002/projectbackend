import express from 'express'
import { sellerLogin, sellerLogout, issellerAuth } from '../controllers/sellerController.js';
import authseller from '../middleware/authseller.js';
const sellerRouter = express.Router();
sellerRouter.post('/login',sellerLogin)
sellerRouter.get('/is-auth',authseller, issellerAuth)
sellerRouter.get('/logout',sellerLogout)
export default sellerRouter;