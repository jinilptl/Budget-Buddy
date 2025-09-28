
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";

// import routers 
import { UserRouter } from "./routes/User.routes.js";
import { TransactionRouter } from "./routes/Transaction.routes.js";

const app = express();

const allowedOrigins = ["http://localhost:5173","http://192.168.1.114:5173"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/transaction", TransactionRouter);


app.use((err, req, res, next) => {
  console.error(err); // log the error for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
});



app.get("/", (req, res) => {
  res.send("this is default route");
});

export default app;
