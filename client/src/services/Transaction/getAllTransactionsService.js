import axios from "axios";

let token = localStorage.getItem("token");
axios.defaults.withCredentials = true;
export async function getAllTransactionsApi() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/transaction/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
}
