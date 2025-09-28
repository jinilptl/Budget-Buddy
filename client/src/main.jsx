import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx";
import TransactionContextProvider from "./context/TransactionContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <TransactionContextProvider>
      <BrowserRouter>

        <App />
         <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "14px",
            padding: "8px 12px",
            borderRadius: "10px",
            maxWidth: "90%", // ✅ Mobile friendly (will not overflow)
          },
          // Responsive breakpoints
          className: "custom-toast",
        }}
      />
      </BrowserRouter>
    </TransactionContextProvider>
  </AuthContextProvider>
);
