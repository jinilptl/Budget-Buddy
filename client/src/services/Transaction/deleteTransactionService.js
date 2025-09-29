import axios from "axios";


const API_URL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

let token=localStorage.getItem('token')

export async function deleteTransactionApi(id) {
  const response = await axios.delete(`${API_URL}/transaction/delete/${id}`, {
    headers:{
      Authorization:`Bearer ${token}`
    },
    withCredentials: true,
  });

  return response; 
}