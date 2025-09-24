import express from "express";

import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getAllRecentTransactions,
} from "../controllers/Transactions.controllers.js";
import { VerifyToken ,VerifyTokenTest} from "../middlewares/auth.middlewares.js";

const TransactionRouter = express.Router();

// All routes protected by auth
TransactionRouter.use(VerifyToken);

TransactionRouter.route("/create").post(VerifyToken,createTransaction);
TransactionRouter.route("/list").get(VerifyToken,getAllTransactions);

TransactionRouter.route("/summary").get(VerifyToken,getTransactionSummary);
TransactionRouter.route("/get/:id").get(VerifyToken,getTransactionById);
TransactionRouter.route("/update/:id").put(VerifyToken,updateTransaction);
TransactionRouter.route("/delete/:id").delete(VerifyToken,deleteTransaction);

TransactionRouter.route("/latest").get(VerifyTokenTest,getAllRecentTransactions);

export {TransactionRouter};
