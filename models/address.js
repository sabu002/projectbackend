import mongoose  from "mongoose";
 const addressSchema  = new mongoose.Schema({
userId:{type:String,required:true,ref:'user'},
firstName:{type:String,required:true},
lastName:{type:String, required:true},
email:{type:String, required:true},
area:{type:String, required:true},
city:{type:String, required:true},
path:{type:String, required:true},
phone:{type:String, required:true},
 })
 const Address = mongoose.models.address || mongoose.model('address',addressSchema)
 export default Address