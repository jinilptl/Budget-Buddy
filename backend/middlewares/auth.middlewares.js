import jwt from "jsonwebtoken";
import "dotenv/config";
import ApiError from "../utils/ApiError.js";

const VerifyToken = (req, res, next) => {
  
  
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    return next(new ApiError(401, "Unauthorized at finding token"));
  }

  console.log("fronted sended token is ", token);

  console.log("___________________________________________________________");

  console.log("procerss .env secret is ", process.env.JWT_SECRET);
  
  
  

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ApiError(401, "Unauthorized at verifying token"));
    }

    console.log("decode token is ", decoded);

    req.user = decoded;

    next();
  });
};


const VerifyTokenTest = (req, res, next) => {
  console.log("test token middleware called");
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  console.log("test token middleware token is", token);
  if (!token) {
    return next(new ApiError(401, "Unauthorized at finding token in test middleware"));
  }

  console.log("after checking token");


  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ApiError(401, "Unauthorized at verifying token in test middleware"));
    }

    console.log("decode token is ", decoded);

    req.user = decoded;

    next();
  });
};

export { VerifyToken ,VerifyTokenTest};
