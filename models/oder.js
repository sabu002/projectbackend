import mongoose  from "mongoose";
 const orderSchema  = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    items:[{
        product: {type: mongoose.Schema.Types.ObjectId,required:true,ref:'product'},
         quantity: {type:Number,required:true},
    }],
    amount: {type:Number,required:true},
    address:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'address'},
    status:{type:String,required:true},
    paymentMethod:{type:String,required:true,enum:["cod","esewa"]},
     isPaid:{type:Boolean,required:true,default:false},
    
 },{timestamps:true})
 const Order = mongoose.models.Order|| mongoose.model('Order',orderSchema)
 export default Order