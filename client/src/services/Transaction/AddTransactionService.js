import axios from "axios";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_BASE_URL;



let token=localStorage.getItem('token')
axios.defaults.withCredentials = true;
console.log("add is ",API_URL);
export async function addTransactionApi(formData) {
  const payload = {
    amount: formData.amount,
    description: formData.description,
    category: formData.category,
    transactionType: formData.transactionType,
    transactionDate: formData.transactionDate
  };

  const response = await axios.post(`${API_URL}/transaction/create`, payload, {
    headers:{
      Authorization:`Bearer ${token}`
    },
    withCredentials: true,
  });
    console.log("response from add api",response);
    
  return response; 
}

export async function getAllTransaction(params) {
  
  
}
