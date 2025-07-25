import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectdb from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import addressRouter from './routes/addressRoute.js';
import recommendRouter from './routes/recomendRoutes.js';
import router from './routes/recomendRoutes.js';
import paymentRouter from './routes/paymentRoute.js';
import searchRoute from './routes/searchRoute.js';
import { transporter } from "./utils/SendEmail.js"; // must export it

transporter.verify((err) => {
  if (err) console.error("SMTP ERROR:", err);
  else console.log("SMTP ready ✅");
});

const app = express(); 

await connectdb()
await connectCloudinary()
 //middleware configuration 
 app.use(express.json())
 
 app.use(cookieParser())


transporter.verify((err) => {
  if (err) console.error("SMTP ERROR:", err);
  else console.log("SMTP ready ✅");
});

const port = process.env.PORT || 2000;
await connectdb();
await connectCloudinary();
//allow multiple origin
const allowdedOrigin = ['http://localhost:5175', 'http://localhost:5173', 'http://localhost:5174'];
//middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowdedOrigin, credentials: true
}));

app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/product', searchRoute);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use("/api", router);
app.use('/payment', paymentRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});
