



import nodemailer from "nodemailer";


export const sendEmail = async ({ email, subject, message }) => {
  console.log("sendEmail called with:", { email, subject, message });

  console.log("MAIL_USER:", process.env.MAIL_USER);
  console.log("MAIL_PASS:", process.env.MAIL_PASS )
  
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465
      auth: {
        user: process.env.MAIL_USER, // your Gmail
        pass: process.env.MAIL_PASS, // 16-character App Password
      },
    });

    // Email options
    const mailOptions = {
      from: `"BudgetBuddy 🪙" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: message,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email could not be sent");
  }
};



// import sgMail from "@sendgrid/mail";
// import "dotenv/config";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendEmail = async ({ email, subject, message }) => {
//   const msg = {
//     to: email,
//     from: process.env.EMAIL_FROM,
//     subject,
//     html: message,
//   };



//   await sgMail.send(msg);
// };
