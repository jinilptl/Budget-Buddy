// import nodemailer from "nodemailer";

// please fix it with nodemailer and gmail password

// export const sendEmail = async (options) => {
//   console.log("user ", process.env.MAIL_USER);
//   console.log("pass ", process.env.MAIL_PASS);



  
//   // Transporter config
//   const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465, // ya 587
//   secure: true, // 465 ke liye true, 587 ke liye false
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

//   // Mail options
//   const mailOptions = {
//     from: `"BudgetBuddy 🪙" <${process.env.SMTP_USER}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message, // HTML template
//   };

//   // Send mail
//   await transporter.sendMail(mailOptions);
// };


import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ email, subject, message }) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject,
    html: message,
  };



  await sgMail.send(msg);
};
