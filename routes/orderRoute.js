import express from 'express'
import { getAllOrders, getUserOrder, placeOrderCOD } from '../controllers/orderController.js';
import authUser from '../middleware/authUser.js';
import authseller from '../middleware/authseller.js';
const orderRouter = express.Router();
orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.get('/user',authUser,getUserOrder)
orderRouter.get('/seller',authseller,getAllOrders)
export default orderRouter