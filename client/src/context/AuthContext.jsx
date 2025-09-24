import { createContext, useEffect, useState } from "react";
import { registerApi, loginApi } from "../services/authServices";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))? JSON.parse(localStorage.getItem("user")): null);

  // for debugging
  useEffect(() => {
    if (user) {
      console.log("✅ User updated:", user);
      localStorage.setItem("user", JSON.stringify(user));
    }
 
    let token = localStorage.getItem("token");
  }, [user]);

  // register user function
  async function registerUser(formData) {
    try {
      const response = await registerApi(formData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  //login user
  async function loginUser(formData) {
    try {
      const response = await loginApi(formData);

      return response;
    } catch (error) {
      throw error;
    }
  }
 
  

  const AuthValue = { user, setUser, registerUser, loginUser };

  return (
    <AuthContext.Provider value={AuthValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
