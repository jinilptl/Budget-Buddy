import { createContext, useEffect, useState } from "react";
import { addTransactionApi } from "../services/Transaction/AddTransactionService";
import { getSummeryApi } from "../services/Transaction/getSummeryService";
import { getAllTransactionsApi } from "../services/Transaction/getAllTransactionsService";
import { updateTransactionApi } from "../services/Transaction/updateTransactionApiService";
import { deleteTransactionApi } from "../services/Transaction/deleteTransactionService";

export const TransactionContext = createContext();

const TransactionContextProvider = ({ children }) => {
  const [Transactions, setTransactions] = useState([]);

  async function getAllTransactions() {
    try {
      const response = await getAllTransactionsApi();
      if (response) {
        return response;
      } else {
        alert("Failed to fetch all transactions in context");
      }
    } catch (error) {
      throw error;
    }
  }

  const token = localStorage.getItem('token');
  useEffect(() => {
    async function fetchTransactions() {
      const response = await getAllTransactions();
      if (response.status === 201) {
        let data = response.data.data;
        setTransactions(data.allTransactions);
      }
    }
   if(!token){
    // alert("Please login to continue in transaction context");
    return
   }
    fetchTransactions();

    
    
  }, []);

  async function addTransaction(formData) {
    try {
      const response = await addTransactionApi(formData);
      return response;
    } catch (error) {
      throw error;
    }
  }
// console.log("all transactions in context ", Transactions);

  async function updateTransaction(formData) {
    try {
      const response = await updateTransactionApi(formData);
      // console.log("response in context of editing ",response);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function deleteTransaction(id) {
    try {
      const response = await deleteTransactionApi(id);
      // console.log("response in context of deleting ",response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function getSummery() {
    try {
      const response = await getSummeryApi();
      if (response) {
        return response;
      } else {
        alert("Failed to fetch summary in context");
      }
    } catch (error) {
      throw error;
    }
  }

  let TransactionValue = { addTransaction, getSummery, Transactions ,setTransactions,updateTransaction,deleteTransaction};

  return (
    <TransactionContext.Provider value={TransactionValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContextProvider;
