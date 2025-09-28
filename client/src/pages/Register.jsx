import React, { useState, useContext } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { data, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import IconOnly from "../components/logo/IconOnly";
import { toast } from "react-hot-toast"; // ✅ Only toast import

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, setUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match ❌"); // ✅ Toast
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(formData);

      if (response.status === 201) {
        let data = response.data.data;
        setUser(data.user);
        toast.success("Account created successfully! 🎉"); // ✅ Toast
        navigate("/");
      } else {
        toast.error("Registration failed. Try again."); // ✅ fallback
      }
    } catch (err) {
      console.log(err.response?.data?.message);

      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message + " ❌"); // ✅ Toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-6 py-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full opacity-100 translate-y-0">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <IconOnly size="small" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Join Budget Buddy
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-lg border-0">
          <div className="p-6 pb-2 pt-3">
            <h2 className="text-xl font-semibold text-center">
              Create Account
            </h2>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium leading-none"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-green-600 underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-green-600 underline">
                    Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white h-12 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-gray-600">
                Already have an account?
                <Link
                  to="/"
                  className="ml-2 text-green-600 hover:underline font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          
          </div>
           
        </div>
        <footer class="w-full mt-5">
          <p class="text-center text-gray-500 text-sm md:text-base">
            Designed & Developed by{" "}
            <span class="font-semibold text-gray-800">Jinil Patel</span>
          </p>
          <p class="text-center text-gray-400 text-xs md:text-sm mt-1">
            © 2025 All Rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
}
