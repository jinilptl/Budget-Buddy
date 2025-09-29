import express from "express"
import { VerifyToken } from "../middlewares/auth.middlewares.js";
import { register,login,forgotPassword,resetPassword,changePassword } from "../controllers/User.controllers.js";

const UserRouter =express.Router();


UserRouter.route('/register').post(register)
UserRouter.route('/login').post(login)
UserRouter.route("/forgot-password").post(forgotPassword);
UserRouter.route("/reset-password/:token").post(resetPassword);
console.log("change password route called");

UserRouter.route("/change-password").post(VerifyToken, changePassword);

export {UserRouter}