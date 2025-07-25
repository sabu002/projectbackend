import Transaction from "../models/paymentModel.js";
import { generateHmacSha256Hash } from "../utils/transection.js";
import axios from "axios";
import Product from "../models/product.js";

const initiatePayment = async (req, res) => {
  const {
    amount,
    productId,
    paymentGateway,
    customerName,
    customerEmail,
    productName,
  } = req.body;

  if (!paymentGateway) {
    return res.status(400).json({ message: "Payment gateway is required" });
  }

  try {
    const transactionData = {
      customerEmail,
      customerName,
      paymentGateway,
      productId,
      productName,
      amount,
      // status will default to 'PENDING' in the model
    };

    let paymentConfig;
    if (paymentGateway === "esewa") {
      // Debug log for environment variables and paymentData
      ;
      console.log("[Esewa] SUCCESS_URL:", process.env.SUCCESS_URL);
      console.log("[Esewa] FAILURE_URL:", process.env.FAILURE_URL);
      const rawData = {
  transaction_uuid: productId,
  total_amount: amount,
  product_code: process.env.ESEWA_MERCHANT_ID,
};
const stringToEncode = JSON.stringify(rawData);
const encodedData = encodeURIComponent(stringToEncode);

      const paymentData = {
        amount,
        failure_url: process.env.FAILURE_URL,
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: process.env.ESEWA_MERCHANT_ID,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        // success_url: process.env.SUCCESS_URL,
        // success_url: `${process.env.SUCCESS_URL}?transaction_uuid=${productId}`,
          // success_url: `${process.env.SUCCESS_URL}?transaction_uuid=${productId}&data=${encodedData}`,
          success_url: `${process.env.SUCCESS_URL}?transaction_uuid=${productId}&data=${someEncodedData}`,

        tax_amount: "0",
        total_amount: amount,
        transaction_uuid: productId,
      };
      console.log("[Esewa] paymentData:", paymentData)  

      const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
      const signature = generateHmacSha256Hash(data, process.env.ESEWA_SECRET);

      paymentConfig = {
        url: process.env.ESEWA_PAYMENT_URL,
        data: { ...paymentData, signature },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        responseHandler: (response) => response.request?.res?.responseUrl,
      };
    } else if (paymentGateway === "khalti") {
      paymentConfig = {
        url: process.env.KHALTI_PAYMENT_URL,
        data: {
          amount: amount * 100, // Convert to paisa
          mobile: customerDetails?.phone,
          product_identity: productId,
          product_name: productName,
          return_url: process.env.SUCCESS_URL,
          failure_url: process.env.FAILURE_URL,
          public_key: process.env.KHALTI_PUBLIC_KEY,
          website_url: "http://localhost:5173",
          purchase_order_id: productId,
          purchase_order_name: productName,
        },
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        responseHandler: (response) => response.data?.payment_url,
      };
    } else {
      return res.status(400).json({ message: "Invalid payment gateway" });
    }

    // Make payment request
    const payment = await axios.post(paymentConfig.url, paymentConfig.data, {
      headers: paymentConfig.headers,
    });

    const paymentUrl = paymentConfig.responseHandler(payment);
    if (!paymentUrl) {
      throw new Error("Payment URL is missing in the response");
    }

    // Save transaction record
    const transaction = new Transaction(transactionData);
    await transaction.save();

    return res.send({ url: paymentUrl });
  } catch (error) {
    console.error(
      "Error during payment initiation:",
      error.response?.data || error.message
    );
    res.status(500).send({
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};

const paymentStatus = async (req, res) => {
  const { productId, pidx, status } = req.body;
  try {
    const transaction = await Transaction.findOne({ productId });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const { paymentGateway } = transaction;

    if (status === "FAILED") {
      // Directly update status when failure is reported
      await Transaction.updateOne(
        { productId },
        { $set: { status: "FAILED", updatedAt: new Date() } }
      );

      return res.status(200).json({
        message: "Transaction status updated to FAILED",
        status: "FAILED",
      });
    }

    let paymentStatusCheck;

    if (paymentGateway === "esewa") {
      const paymentData = {
        product_code: process.env.ESEWA_MERCHANT_ID,
        total_amount: transaction.amount,
        transaction_uuid: transaction.productId,
      };

      const response = await axios.get(
        process.env.ESEWA_PAYMENT_STATUS_CHECK_URL,
        {
          params: paymentData,
        }
      );

      paymentStatusCheck = response.data;

      if (paymentStatusCheck.status === "COMPLETE") {
        await Transaction.updateOne(
          { productId },
          { $set: { status: "COMPLETED", updatedAt: new Date() } }
        );
        //Decrease product stock
  const product = await Product.findById(productId);
  if (product) {
    product.inStock = Math.max(0, (product.inStock || 0) - 1);
    await product.save();
  }

        return res.status(200).json({
          message: "Transaction status updated successfully",
          status: "COMPLETED",
        });
      } else {
        await Transaction.updateOne(
          { productId },
          { $set: { status: "FAILED", updatedAt: new Date() } }
        );

        return res.status(200).json({
          message: "Transaction status updated to FAILED",
          status: "FAILED",
        });
      }
    }

    if (paymentGateway === "khalti") {
      try {
        const response = await axios.post(
          process.env.KHALTI_VERIFICATION_URL,
          { pidx },
          {
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        paymentStatusCheck = response.data;
      } catch (error) {
        if (error.response?.status === 400) {
          paymentStatusCheck = error.response.data;
        } else {
          console.error(
            "Error verifying Khalti payment:",
            error.response?.data || error.message
          );
          throw error;
        }
      }

      if (paymentStatusCheck.status === "Completed") {
        await Transaction.updateOne(
          { productId },
          { $set: { status: "COMPLETED", updatedAt: new Date() } }
        );

        // Decrement product stock by 1 (or by quantity if available)
        const product = await Product.findById(productId);
        if (product) {
          product.inStock = Math.max(0, (product.inStock || 0) - 1);
          await product.save();
        }

        return res.status(200).json({
          message: "Transaction status updated successfully",
          status: "COMPLETED",
        });
      } else {
        await Transaction.updateOne(
          { productId },
          { $set: { status: "FAILED", updatedAt: new Date() } }
        );

        return res.status(200).json({
          message: "Transaction status updated to FAILED",
          status: "FAILED",
        });
      }
    }

    return res.status(400).json({ message: "Invalid payment gateway" });
  } catch (error) {
    console.error("Error during payment status check:", error);
    res.status(500).send({
      message: "Payment status check failed",
      error: error.response?.data || error.message,
    });
  }
};

export { initiatePayment, paymentStatus };
