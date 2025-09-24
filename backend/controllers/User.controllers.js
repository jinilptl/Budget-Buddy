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
  console.log("name is ", name);
  console.log("email is ", email);
  console.log("password is ", password);

  // check fields
  if (!name || !email || !password) {
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
 user = await UserModel.create({ name, email, password: hashedPassword });

  const userfind = await UserModel.findById(user._id).select("-password");


  return res
    .status(201)
    .json(new ApiResponse(201, { user: userfind}, "User registered successfully"));
});


export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

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
