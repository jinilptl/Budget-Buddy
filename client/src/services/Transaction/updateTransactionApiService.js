import axios from "axios";


const API_URL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

let token=localStorage.getItem('token')

export async function updateTransactionApi(formData) {
  const payload = {
    amount: formData.amount,
    description: formData.description,
    category: formData.category,
    transactionType: formData.transactionType,
    transactionDate: formData.transactionDate
  };

  const response = await axios.put(`${API_URL}/transaction/update/${formData._id}`, payload, {
    headers:{
      Authorization:`Bearer ${token}`
    },
    withCredentials: true,
  });

  return response; 
}