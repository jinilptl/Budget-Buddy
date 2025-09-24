import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relation with User model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["income", "expense"], // Only these 2 allowed
      required: true,
    },
    category: {
      type: String, // Example: Food, Rent, Salary, Shopping, etc.
      required: true,
    },
    description: {
      type: String, // Optional note about transaction
      default: "",
    },
    transactionDate: {     // for when user actually made the transaction
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
