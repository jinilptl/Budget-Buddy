import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import ProtectedWrapper from "./components/Wrapper/ProtectedWrapper";
import PublicWrapper from "./components/Wrapper/Publicwrapper";
import Logout from "./pages/Auth/Logout";
import AddTransaction from "./pages/Navigations/AddTransaction";
import { MainApp } from "./pages/main/MainApp";
import {  Homepage } from "./pages/Navigations/Homepage";
import History from "./pages/Navigations/History";
import Analytics from "./pages/Analytics/Analytics";
import ProfilePage from "./pages/Navigations/ProfilePage";
import ResetPassword from "./components/passwordReset/ResetPassword";
import EnterEmailForReset from "./components/passwordReset/EnterEmailForReset";

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
        <Route index element={<Homepage />} />
        <Route path="main" element={<Homepage />} />
        <Route path="add-transaction" element={<AddTransaction isEdit={false}/>} />
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
