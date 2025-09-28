import { createContext, useEffect, useState } from "react";
import { registerApi, loginApi } from "../services/authServices";
import toast from "react-hot-toast"; // <- toast import

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))? JSON.parse(localStorage.getItem("user")): null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    let token = localStorage.getItem("token");
  }, [user]);

  // register user function
  async function registerUser(formData) {
    try {
      const response = await registerApi(formData);
      toast.success("✅ Registration successful"); // toast success
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Registration failed"); // toast error
      throw error;
    }
  }

  // login user
  async function loginUser(formData) {
    try {
      const response = await loginApi(formData);
      toast.success("✅ Login successful"); // toast success
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Login failed"); // toast error
      throw error;
    }
  }

  const AuthValue = { user, setUser, registerUser, loginUser };

  return (
    <AuthContext.Provider value={AuthValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
