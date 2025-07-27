import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
  {
    transactionId:{
      type:String,
      unique: true,
      required: true,
      
    },
    customerEmail: {
      type: String,
      
    },
    customerName: {
      type: String,
     
    },
    paymentGateway: {
      type: String,
      
      enum: ["esewa"],
    },
    productId: {
      type: String,
      required:true
     
    },
    productName: {
      type: String,
      
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);
const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
