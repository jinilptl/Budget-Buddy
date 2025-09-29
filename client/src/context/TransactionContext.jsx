import { createContext, useEffect, useState } from "react";
import { addTransactionApi } from "../services/Transaction/AddTransactionService";
import { getSummeryApi } from "../services/Transaction/getSummeryService";
import { getAllTransactionsApi } from "../services/Transaction/getAllTransactionsService";
import { updateTransactionApi } from "../services/Transaction/updateTransactionApiService";
import { deleteTransactionApi } from "../services/Transaction/deleteTransactionService";
import toast from "react-hot-toast"; // <- toast import

export const TransactionContext = createContext();

const TransactionContextProvider = ({ children }) => {
  const [Transactions, setTransactions] = useState([]);

  async function getAllTransactions() {
    try {
      const response = await getAllTransactionsApi();
      if (response) {
        return response;
      } else {
        toast.error("❌ Failed to fetch all transactions in context");
      }
    } catch (error) {
      toast.error("❌ Error fetching transactions");
      throw error;
    }
  }

  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchTransactions() {
      const response = await getAllTransactions();
      if (response.status === 201) {
        let data = response.data.data;
        setTransactions(data.allTransactions);
      }
    }
    if (!token) {
      // toast.error("Please login to continue in transaction context");
      return;
    }
    fetchTransactions();
  }, []);

  async function addTransaction(formData) {
    try {
      const response = await addTransactionApi(formData);
      toast.success("✅ Transaction added successfully");
      console.log("response from context",response);
      
      return response;
    } catch (error) {
      console.log("error in context",error);
      
      toast.error(error.response?.data?.message || "❌ Failed to add transaction");
      throw error;
    }
  }

  async function updateTransaction(formData) {
    try {
      const response = await updateTransactionApi(formData);
      toast.success("✅ Transaction updated successfully");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to update transaction");
      throw error;
    }
  }

  async function deleteTransaction(id) {
    try {
      const response = await deleteTransactionApi(id);
      toast.success("✅ Transaction deleted successfully");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to delete transaction");
      throw error;
    }
  }

  async function getSummery() {
    try {
      const response = await getSummeryApi();
      if (response) {
        return response;
      } else {
        toast.error("❌ Failed to fetch summary in context");
      }
    } catch (error) {
      toast.error("❌ Error fetching summary");
      throw error;
    }
  }

  let TransactionValue = {
    addTransaction,
    getSummery,
    Transactions,
    setTransactions,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={TransactionValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContextProvider;
