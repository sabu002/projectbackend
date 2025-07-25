import mongoose  from "mongoose";
 const orderSchema  = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    items:[{
        product: {type: mongoose.Schema.Types.ObjectId,required:true,ref:'product'},
         quantity: {type:String,required:true},
    }],
    amount: {type:String,required:true},
    address:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'address'},
    status:{type:String,required:true},
    paymentType:{type:String,required:true},
     isPaid:{type:Boolean,required:true,default:false},
    
 },{timestamps:true})
 const Order = mongoose.model.order|| mongoose.model('order',orderSchema)
 export default Order