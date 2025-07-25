// utils/sendEmail.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🔹 Add this block once to confirm credentials
transporter.verify((error, success) => {
  if (error) console.error("SMTP ERROR:", error);
  else console.log("SMTP ready ✅");
});

export const sendEmail = async ({ to, subject, html }) =>
  transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
