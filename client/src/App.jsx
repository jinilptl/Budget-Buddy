import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedWrapper from "./pages/ProtectedWrapper";
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
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedWrapper>
              <MainApp />
            </ProtectedWrapper>
          }
        >
          {/* Default child route when /home is visited */}
          <Route index element={<Dashboard />} />

          {/* Other child routes */}
          <Route path="main" element={<Dashboard />} />
          <Route path="add-transaction" element={<AddTransaction isEdit={false} />} />
          <Route path="edit-transaction/:id" element={<AddTransaction isEdit={true}/>} />
          <Route path="history" element={<History/>} />
          <Route path="profile" element={<ProfilePage  />} />
          {/* <Route path="analytics" element={<Analytics/>} /> */}
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
          element={
            <ProtectedWrapper>
              <ResetPassword/>
            </ProtectedWrapper>
          }
        />
        
        <Route
          path="/forget-password"
          element={
            <ProtectedWrapper>
              <EnterEmailForReset/>
            </ProtectedWrapper>
          }
        />

        <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;

