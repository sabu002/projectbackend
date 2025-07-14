import express from 'express'
import { upload } from '../configs/multer.js'
import authseller from '../middleware/authseller.js'
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js'
const productRouter = express.Router()
productRouter.post('/add',upload.array(["images"]),authseller,addProduct)
productRouter.get('/list',productList)
productRouter.get('/id',productById)
productRouter.post('/stock' ,authseller,changeStock)
export default productRouter

