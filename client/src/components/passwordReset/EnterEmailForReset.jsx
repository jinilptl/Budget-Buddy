import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast"; // ✅ import toast
import MainLogo from "../logo/MainLogo";
import IconOnly from "../logo/IconOnly";

const EnterEmailForReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BASE_URL;
      const res = await axios.post(
        `${backendUrl}/users/forgot-password`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success(
          "✅ Password reset link sent! Check your email (including spam/junk). Valid for 15 minutes."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <div className=" mt-2 mb-3">
          <IconOnly size="small"/>
        </div>
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your <b>registered email address</b> below.  
          We will send you a link to reset your password.  
          <br />
          <span className="text-emerald-600 font-medium">
            Do you want to change your password?
          </span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
             className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white h-12 rounded-md font-medium transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Go Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
        >
          ⬅ Go Back
        </button>
      </div>
    </div>
  );
};

export default EnterEmailForReset;
