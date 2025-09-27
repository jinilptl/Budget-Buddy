import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const PasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;
  let bakendurl = import.meta.env.VITE_BASE_URL;
  console.log("token",localStorage.getItem("token"));

  let token=JSON.parse(localStorage.getItem("token"));
  const payload={ oldPassword:currentPassword, newPassword };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const { data } = await axios.post(`${bakendurl}/users/change-password`,payload,{
        headers:{
            Authorization: `Bearer ${token}`
        }
      });

      setMessage({ type: "success", text: data?.message || "Password changed successfully" });

      // reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // auto-close modal after success
      setTimeout(() => {
        onClose();
       

        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Overlay with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/20"
        onClick={onClose}
      >
        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 text-center"
        >
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Change Password
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your current and new password below.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              required
            />

            {/* Message */}
            {message && (
              <p
                className={`text-sm ${
                  message.type === "error" ? "text-red-500" : "text-emerald-600"
                }`}
              >
                {message.text}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordModal;
