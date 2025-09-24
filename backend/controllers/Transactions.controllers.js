import { Transaction as TransactionModel } from "../models/Transaction.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User, User as UserModel } from "../models/User.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createTransaction = AsyncHandler(async (req, res) => {
  // take data from body
  const { amount, transactionType, category, description, transactionDate } =
    req.body;

  //user are registered or nor
  const UserId = req.user.id;

  const user = await UserModel.findById(UserId);

  if (!user) {
    throw new ApiError(404, "User not found,invalid Credentials");
  }

  // data validation
  if (!amount || amount <= 0 || !transactionType || !category) {
    throw new ApiError(400, "all fields are required");
  }

  if (transactionType !== "income" && transactionType !== "expense") {
    throw new ApiError(400, "Transaction type must be income or expense");
  }

  const transaction = await TransactionModel.create({
    userId: UserId,
    amount,
    transactionType,
    category,
    description: description || "",
    transactionDate: transactionDate || Date.now(),
  });

  // return response

  return res
    .status(201)
    .json(
      new ApiResponse(200, transaction, "Transaction created successfully")
    );
});

const getAllTransactions = AsyncHandler(async (req, res) => {
  const userId = req.user.id;

  // console.log("user is in getall ", userId);

  const { category, startDate, endDate } = req.query;

  if (!userId) {
    throw new ApiError(404, "User not found");
  }
  let QueryObj = { userId: userId };
  if (category) {
    QueryObj.category = category;
  }

  if (startDate && endDate) {
    QueryObj.transactionDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // console.log("query obj is ", QueryObj);

  const Transactions = await TransactionModel.find(QueryObj).sort({
    transactionDate: -1,
  });
  // console.log("transactions is ", Transactions);

  if (!Transactions) {
    throw new ApiError(400, "invalid credentials");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { allTransactions: Transactions, count: Transactions.length },
        "Transactions fetched succesfully"
      )
    );
});

const getTransactionById = AsyncHandler(async (req, res) => {
  //transaction id fetch from params

  const { id } = req.params;

  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(400, "user not found, not authorized");
  }

  if (!id) {
    throw new ApiError(400, "invalid params, no Transaction id coming");
  }

  // console.log("is valid id ", mongoose.Types.ObjectId.isValid(id));

  const Transaction = await TransactionModel.findOne({
    _id: id,
    userId: userId,
  });

  if (!Transaction) {
    throw new ApiError(400, "Transaction not found");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { transaction: Transaction },
        "Transaction fetched successfully"
      )
    );
});

const updateTransaction = AsyncHandler(async (req, res) => {
  // fetch user id

  const userId = req.user.id;

  //fetch transaction id

  const { id } = req.params;

  // fetch field from body

  const { amount, transactionType, category, transactionDate, description } =
    req.body;

  if (!amount || !transactionType || !category) {
    throw new ApiError(400, "all fields are required");
  }

  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0 ");
  }

  // console.log("transactionType is", transactionType);

  if (transactionType !== "income" && transactionType !== "expense") {
    throw new ApiError(400, "Transaction type must be income or expense");
  }

  if (category && category.trim() === "") {
    throw new ApiError(400, "Category is required");
  }

  const updateFields = {
    amount,
    transactionType,
    category,
    transactionDate,
    description,
  };

  // Remove undefined fields
  Object.keys(updateFields).forEach((key) => {
    if (updateFields[key] === undefined) {
      delete updateFields[key];
    }
  });

  //remove optional field if those are empty string

  if (description !== undefined && description.trim() === "") {
    delete updateFields.description;
  }

  if (transactionDate !== undefined && transactionDate.trim() === "") {
    delete updateFields.transactionDate; // empty string ignore karo
  }

  // console.log("updateFields are", updateFields);

  const updatedTransaction = await TransactionModel.findOneAndUpdate(
    { _id: id, userId: userId },
    { $set: updateFields },
    { new: true }
  );

  if (!updatedTransaction) {
    throw new ApiError(404, "Transaction not found or not authorized");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTransaction,
        "Transaction updated successfully"
      )
    );
});

const deleteTransaction = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;

  const deletedTransaction = await TransactionModel.findOneAndDelete({
    _id: transactionId,
    userId: userId,
  });

  if (!deletedTransaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedTransaction,
        "Transaction deleted successfully"
      )
    );
});

const getTransactionSummary = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  // console.log("userId is", userId);

  if (!userId) {
    throw new ApiError(400, "User not authorized");
  }

  // Extract optional query params for date filtering

  const { startDate, endDate } = req.query;

  // Build match query for aggregation

  const objectId = new mongoose.Types.ObjectId(userId);
  let matchQuery = { userId: objectId };

  if (startDate && endDate) {
    matchQuery.transactionDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // console.log("match query is ", matchQuery);

  // ----- Step 1: Aggregate total income & total expense -----

  const totals = await TransactionModel.aggregate([
    //stage 1
    { $match: matchQuery },

    //stage 2 for grouping by transactionType
    {
      $group: {
        _id: "$transactionType",
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  // Extract totalIncome and totalExpense

  let totalIncome = 0;
  let totalExpense = 0;

  // console.log("totals are", totals);

  totals.forEach((item) => {
    if (item._id === "income") {
      // console.log("total income is", item.totalAmount);
      totalIncome = item.totalAmount;
    } else if (item._id === "expense") {
      // console.log("total expense is", item.totalAmount);
      totalExpense = item.totalAmount;
    }
  });

  // Calculate balance

  let balance = totalIncome - totalExpense;
  // console.log("balance is", balance);

  // ----- Step 2: Aggregate category-wise totals -----
  const categoryWiseData = await TransactionModel.aggregate([
    { $match: matchQuery }, // Filter again by user & optional date
    {
      $group: {
        _id: "$category", // Group by category
        totalAmount: { $sum: "$amount" }, // Sum amounts for each category
      },
    },
  ]);

  // Convert categoryWiseData to object format

  const categoryWise = categoryWiseData.reduce((acc, curr) => {
    acc[curr._id] = curr.totalAmount;
    return acc;
  }, {});

  // console.log("category wise data is", categoryWise);

  // send response

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        totalIncome,
        totalExpense,
        balance,
        categoryWise,
      },
      "Transaction summary fetched successfully"
    )
  );
});

const getAllRecentTransactions = AsyncHandler(async (req, res) => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
   const userId = req.user.id;
  // console.log("userId is", userId);

  if (!userId) {
    throw new ApiError(400, "User not authorized");
  }
  
  console.log("recent calll");
  

  const recentTransactions = await TransactionModel.find({
    userId: userId,
    createdAt: { $gte: last24Hours },
  }).sort({ createdAt: -1 });

  console.log("recent Transactions is ", recentTransactions);

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { data: recentTransactions, count: recentTransactions.length },
        "Transactions fetched succesfully"
      )
    );
});

export {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getAllRecentTransactions
};
