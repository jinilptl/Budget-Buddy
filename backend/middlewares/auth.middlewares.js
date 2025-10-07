import jwt from "jsonwebtoken";
import "dotenv/config";
import ApiError from "../utils/ApiError.js";

const VerifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized at finding token"));
  }

  let cleanedToken = token.replace(/^"|"$/g, "");

  jwt.verify(cleanedToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ApiError(401, "Unauthorized at verifying token"));
    }

    req.user = decoded;

    next();
  });
};

export { VerifyToken };
