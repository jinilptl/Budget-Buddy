import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export async function registerApi(formData) {
  const payload = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
  };

  const response = await axios.post(`${API_URL}/users/register`, payload, {
    withCredentials: true,
  });

  return response; // Assuming backend sends { data: { user: ... } }
}

export async function loginApi(formData) {
  const payload = {
    email: formData.email,
    password: formData.password,
  };

 
  
  const response = await axios.post(`${API_URL}/users/login`, payload, {
    withCredentials: true,
  });
  
  return response; 
}
