import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No token — redirecting to login");
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      console.log("⚠️ Token expired — redirecting to login");
      localStorage.removeItem("token");
      return <Navigate to="/" replace />; 
    }
  } catch (err) {
    console.error("Invalid token — redirecting to login");
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  // ✅ Only render protected component if token is valid
  return children;
};

export default ProtectedWrapper;
