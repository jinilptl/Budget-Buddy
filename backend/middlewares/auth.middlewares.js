import jwt from "jsonwebtoken";
import "dotenv/config";
import ApiError from "../utils/ApiError.js";

const VerifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    return next(new ApiError(401, "Unauthorized at finding token"));
  }

  let cleanedToken = token.replace(/^"|"$/g, "");
  console.log("cleaned token is ", cleanedToken);

  console.log("fronted sended token is ", token);

  console.log("___________________________________________________________");

  console.log("procerss .env secret is ", process.env.JWT_SECRET);

  jwt.verify(cleanedToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ApiError(401, "Unauthorized at verifying token"));
    }

    console.log("decode token is ", decoded);

    req.user = decoded;

    next();
  });
};

export { VerifyToken };
