import mongoose from "mongoose";
const connectdb = async()=>{
    try{
        mongoose.connection.on('connected',()=>
        console.log("database connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/onlinegrocery`)
 } catch(error){
        console.error (error.message);
    }
    

    }
    export default connectdb
