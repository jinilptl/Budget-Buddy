import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx";
import TransactionContextProvider from "./context/TransactionContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <TransactionContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TransactionContextProvider>
  </AuthContextProvider>
);
