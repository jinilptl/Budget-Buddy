import {User as UserModel} from "../models/User.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { sendEmail } from "../utils/SendEmail.js"
import crypto from "crypto";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import "dotenv/config"

export const register = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
    console.log(`name is ${name} with email is ${email} with this password ${password}`);
  

  let trimeName=name.trim()
  // check fields
  if (!trimeName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists
  let user = await UserModel.findOne({ email });
  if (user) {
    throw new ApiError(400, "User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  // create user
 user = await UserModel.create({ name:trimeName, email, password: hashedPassword });

  const userfind = await UserModel.findById(user._id).select("-password");
  const loginUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  console.log(loginUrl);
  
const message = `
    <div style="font-family: Arial, sans-serif; padding:20px; background:#f4f4f4;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 8px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(90deg,#22c55e,#3b82f6);padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;">Welcome to BudgetBuddy! 🪙</h1>
        </div>
        <div style="padding:20px;">
          <p>Hi <b>${userfind?.name}</b>,</p>
          <p>🎉 Welcome aboard! We're thrilled to have you join the <b>BudgetBuddy</b> community.</p>
          <p>You've just taken the first step toward smarter financial management. With BudgetBuddy, you can:</p>
          <ul style="line-height:1.8;color:#333;">
            <li>📊 Track your expenses effortlessly</li>
            <li>💰 Set and achieve your financial goals</li>
            <li>📈 Get insights into your spending habits</li>
            <li>🎯 Stay on top of your budget</li>
          </ul>
          <p>Ready to get started?</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${loginUrl}" style="background:#22c55e;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Go to Dashboard</a>
          </div>
          <p style="background:#f0f9ff;border-left:4px solid #3b82f6;padding:12px;margin:20px 0;border-radius:4px;">
            <b>💡 Quick Tip:</b> Start by adding your first expense or setting up your monthly budget to see BudgetBuddy in action!
          </p>
          <p>If you have any questions or need help getting started, we're here for you. Just reply to this email!</p>
          <p style="color:#6b7280;font-size:14px;">If you have any problem, feel free to mail us at <a href="mailto:team.budgetbuddy10@gmail.com" style="color:#3b82f6;text-decoration:none;">team.budgetbuddy10@gmail.com</a></p>
          <p style="margin-top:30px;">Here's to your financial success! 🚀<br/>The BudgetBuddy Team</p>
        </div>
        <div style="background:#f9fafb;padding:15px;text-align:center;color:#6b7280;font-size:12px;">
          <p style="margin:0;">Follow us for tips and updates</p>
        </div>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: userfind.email,
      subject: "Welcome to BudgetBuddy!",
      message: message,
    });
  } catch (error) {
    console.log("mailer error while registration:", error);
  }


  return res
    .status(201)
    .json(new ApiResponse(201, { user: userfind}, "User registered successfully"));
});


export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`email is ${email} with this password ${password}`);

  // check fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // check if user exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  // generate JWT
  const token = jwt.sign(
    { id: user._id , name: user.name, email: user.email},
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );


  const NewFindUser=await UserModel.findById(user._id).select("-password")

  return res
    .status(200)
    .cookie("token", token, { httpOnly: true, secure: true })
    .json(new ApiResponse(200, { token , user:NewFindUser}, "Login successful"));
});





export const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await UserModel.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // HTML email template
  const message = `
    <div style="font-family: Arial, sans-serif; padding:20px; background:#f4f4f4;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 8px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(90deg,#22c55e,#3b82f6);padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;">BudgetBuddy 🪙</h1>
        </div>
        <div style="padding:20px;">
          <p>Hi <b>${user.name}</b>,</p>
          <p>You recently requested to reset your password for your <b>BudgetBuddy</b> account.</p>
          <p>Click the button below to reset it (valid for 15 minutes):</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${resetUrl}" style="background:#22c55e;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
          </div>
          <p>If you did not request this, ignore this email.</p>
          <p style="margin-top:30px;">Best Regards,<br/>BudgetBuddy Team</p>
        </div>
      </div>
    </div>
  `;

;

  try {
    await sendEmail({ email: user.email, subject: "BudgetBuddy Password Reset", message });
    res.status(200).json(new ApiResponse(200, {}, "Password reset email sent successfully"));
  } catch (error) {
    // clear token if sending fails
        console.error("SendGrid Error:", error.response ? error.response.body : error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new ApiError(500, "Email could not be sent");
  }
});

// Reset Password
export const resetPassword = AsyncHandler(async (req, res) => {
  const { token } = req.params; // from URL
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "New password is required");
  }

  // Hash token again and find user
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});


export const changePassword = AsyncHandler(async (req, res) => {
 
  
  const userId = req.user?.id; // from verifyJWT
  const { oldPassword, newPassword } = req.body;

   
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Compare old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  // Hash and update password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  // Styled Email
  const message = `
    <div style="font-family: Arial, sans-serif; padding:20px; background:#f4f4f4;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 8px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(90deg,#22c55e,#3b82f6);padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;">BudgetBuddy 🪙</h1>
        </div>
        <div style="padding:20px;">
          <p>Hi <b>${user.name}</b>,</p>
          <p>This is to confirm that the password for your <b>BudgetBuddy</b> account was changed successfully.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
          <p style="margin-top:30px;">Best Regards,<br/>BudgetBuddy Team</p>
        </div>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "BudgetBuddy Password Changed Successfully",
      message,
    });
  } catch (error) {
    console.error("Email Error:", error.response ? error.response.body : error);
    // We won’t rollback password if email fails (since password change is primary)
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});