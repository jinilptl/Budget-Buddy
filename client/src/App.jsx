import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedWrapper from "./pages/ProtectedWrapper";
import PublicWrapper from "./components/Publicwrapper";
import Logout from "./pages/Logout";
import AddTransaction from "./pages/AddTransaction";
import { MainApp } from "./pages/OutletPage";
import { Dashboard } from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics/Analytics";
import ProfilePage from "./pages/ProfilePage";
import ResetPassword from "./components/ResetPassword";
import EnterEmailForReset from "./components/EnterEmailForReset";

function App() {
  return (
    <Routes>
      {/* Public routes (only for not-logged in users) */}
      <Route
        path="/"
        element={
          <PublicWrapper>
            <Login />
          </PublicWrapper>
        }
      />
      <Route
        path="/register"
        element={
          <PublicWrapper>
            <Register />
          </PublicWrapper>
        }
      />

      {/* Protected routes (only for logged-in users) */}
      <Route
        path="/home"
        element={
          <ProtectedWrapper>
            <MainApp />
          </ProtectedWrapper>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="main" element={<Dashboard />} />
        <Route path="add-transaction" element={<AddTransaction isEdit={false} />} />
        <Route path="edit-transaction/:id" element={<AddTransaction isEdit={true} />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route
        path="/logout"
        element={
          <ProtectedWrapper>
            <Logout />
          </ProtectedWrapper>
        }
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/forget-password"
        element={<EnterEmailForReset />}
      />

      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-2xl">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
