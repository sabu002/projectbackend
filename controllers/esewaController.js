// controllers/esewaController.js
import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";
import Transaction  from "../models/paymentModel.js";
import { v4 as uuidv4 } from "uuid";

// Initiate eSewa Payment
export const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId, productName, customerEmail, customerName } = req.body;
  

  if (!amount || !productId) {
    return res.status(400).json({ message: "Missing amount or productId" });
  }
    // Generate a unique transaction ID
  const transactionId = `txn_${uuidv4()}`;

  try {
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      transactionId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL
    );

    if (reqPayment?.status === 200 && reqPayment.request.res.responseUrl) {
      const transaction = new Transaction({
        transactionId,
        productId,
        productName,
        amount,
        customerEmail,
        customerName,
        paymentGateway: "esewa",
        status: "PENDING",
      });
      await transaction.save();

      return res.status(200).json({ url: reqPayment.request.res.responseUrl });
    } else {
      return res.status(400).json({ message: "Failed to initiate payment" });
    }
  } catch (error) {
    console.error("Esewa Initiation Error:", error.message);
    return res.status(500).json({ message: "Esewa initiation failed" });
  }
};

// Verify Payment
export const paymentStatus = async (req, res) => {
  console.log("paymentStatus request body:", req.body); 
  const { transactionId } = req.body;

  try {
    const transaction = await Transaction.findOne({  transactionId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const statusResponse = await EsewaCheckStatus(
      transaction.amount,
      transaction.transactionId,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (statusResponse?.status === 200) {
      transaction.status = statusResponse.data.status || 'COMPLETED';
      await transaction.save();
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Esewa did not return valid status" });
    }
  } catch (error) {
    console.error("Payment status error:", error.message);
    return res.status(500).json({ message: "Payment status check failed" });
  }
};
