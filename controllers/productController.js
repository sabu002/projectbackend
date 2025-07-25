

import{v2 as cloudinary} from 'cloudinary'
import Product from '../models/product.js'
import { response } from 'express'
// Add product :/api/product/add
export const addProduct = async (req,res)=>{
try{
let productData = JSON.parse(req.body.productData)
const images= req.files
let imagesUrl = await Promise.all(
    images.map(async(item)=>{
let result= await  cloudinary.uploader.upload(item.path,{resource_type:'image'});
return result.secure_url
    })
)
await Product.create({...productData,image:imagesUrl})
res.json({success:true,message:"product added"})
}catch(error){
  console.log(error.message)
  res.json({success: false, message:error.message})
}
}
//get product :api/product/list
export const productList = async (req,res)=>{
try{
const products = await Product.find({})
res.json({ success:true,products})
}catch(error){
console.log(error.message)
  res.json({success: false, message:error.message})
}
    
}
//get single product :api/product/id
export const productById = async (req,res)=>{
try{
  const product =  await Product.findById(id)
  res.json({ success:true,product})

}catch(error){
  console.log(error.message)
  res.json({success: false, message:error.message})
}



}
//change product in stock :api/product/stock
// Update stock by a given amount (positive or negative)
export const changeStock = async (req, res) => {
  try {
    const { id, amount } = req.body; // amount can be positive (add) or negative (subtract)
    const product = await Product.findById(id);
    if (!product) return res.json({ success: false, message: 'Product not found' });
    const newStock = (product.inStock || 0) + Number(amount);
    if (newStock < 0) return res.json({ success: false, message: 'Not enough stock' });
    product.inStock = newStock;
    await product.save();
    res.json({ success: true, message: 'Stock updated', inStock: product.inStock });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}