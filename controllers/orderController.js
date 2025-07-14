import Order from "../models/oder.js";
import Product from "../models/product.js";

// place Order COD : /api/order/cod
 export const placeOrderCOD = async(req,res)=>
 {
    try{
const { items, address}= req.body;
const  userId = req.userId;
if(!address ||  items.length===0){
    return res.json({sucess:false , message:"invalid data"})
}
 // calculate amount using Items
 let amount = await items.reduce(async(acc,item)=>{
 const product = await Product.findById(item.product)
 return (await acc)+ product.offerPrice * item.quantity
 }, 0)
//Add tax Charge2%
amount += Math.floor(amount *0.02);
await Order.create({
    userId,
    items,
    amount,
    address,
    paymentType:"COD",
     status: "Processing" 

});
return res.json({success:true,message:"Order Placed Successfully"})



    }catch(error){
return res.json({success:false,message:error.message})
    }
 }
 // get oder by userId: /api/order/user
 export  const getUserOrder = async(req,res)=>{
    try{
         const userId= req.userId;
        const orders= await Order.find({
            userId,
            $or:[
            { paymentType:"COD"},{isPaid:true}
            ]
        }).populate("items.product address").sort({createdAt: -1})  
        res.json({ success:true,orders})
    }catch(error){
    return res.json({success:false,message:error.message})
    }
 }
 //get all Orsers for seller:/api/order/seller
 export  const getAllOrders = async(req,res)=>{
    try{
        
        const orders= await Order.find({
            
            $or:[
            { paymentType:"COD"},{isPaid:true}
            ]
        }).populate("items.product address").sort({cretedAt: -1})
        res.json({ success:true,orders})
        
    }catch(error){
    return res.json({success:false,message:error.message})
    }
 }
