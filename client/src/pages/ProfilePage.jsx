import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { TransactionContext } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";
import PasswordModal from "../components/PasswordChangeModal";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { Transactions } = useContext(TransactionContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  let totalTransactions = Transactions ? Transactions.length : 0;

  const dateFormatted = (dateString) => {
    return dateString?.split("T")[0];
  };

  function logoutNavigate() {
    if (confirm("are you sure you want to logout?")) {
      navigate("/logout");
    }
  }

  // fallback if user data missing
  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-32">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        {/* Avatar */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {getInitial(user?.name?.trim())}
        </div>

        {/* Name */}
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">
          {user?.name
            ? user?.name[0].toUpperCase() +
              user?.name.slice(1).toLowerCase()
            : "User Name"}
        </h1>

        {/* Email */}
        <p className="text-gray-500 text-sm">
          {user?.email || "example@email.com"}
        </p>

        {/* Info Section */}
        <div className="mt-6 space-y-3 text-left text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Username:</span>
            <span className="font-medium">
              {user?.name
                ? user?.name[0].toUpperCase() +
                  user?.name.slice(1).toLowerCase()
                : "budget_buddy"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Total Transactions:</span>
            <span className="font-medium">{totalTransactions || 0}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Joined:</span>
            <span className="font-medium">{dateFormatted(user?.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
          >
            Change Password
          </button>
          <button
            onClick={logoutNavigate}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        

<footer class="w-full py-4 mt-8">
  <p class="text-center text-gray-500 text-sm md:text-base">
    Designed & Developed by <span class="font-semibold text-gray-800">Jinil Patel</span>
  </p>
  <p class="text-center text-gray-400 text-xs md:text-sm mt-1">
    © 2025 All Rights Reserved
  </p>
</footer>


      </div>
      

      {/* Modal */}
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          console.log("Password reset email sent!");
          setIsModalOpen(false);
        }}
      />
    </div>
    
  );
};

export default ProfilePage;
