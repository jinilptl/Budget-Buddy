import React, { useContext, useState } from "react";
import { Mail, Lock, Eye, EyeOff, PiggyBank } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import IconOnly from "../components/logo/IconOnly";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here

    console.log("login data ", formData);

    const response = await loginUser(formData);

    console.log("response is ", response);

    if (response.status === 200) {
      console.log("data is ", response.data.data);
      let data = response.data.data;

      let token = data.token;
      console.log("logion data", data);
      
      setUser(data.user);
      localStorage.setItem("token", JSON.stringify(token));
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-6 py-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full opacity-100 translate-y-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-3">
              <PiggyBank className="w-8 h-8 text-white" />
              
            </div> */}
            <IconOnly size="small"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Sign in to continue managing your finances
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg border-0">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="p-6 pb-4">
              <h2 className="text-xl font-semibold text-center">Sign In</h2>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
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
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
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
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Link
                      to={"/forget-password"}
                      className=" mt-2 text-blue-500 inline-block  hover:text-gray-600"
                    >
                      Forgot Password?
                    </Link>
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

                {/* Forgot Password
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white h-12 rounded-md font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>

              {/* Switch to Register */}
              <div className="text-center mt-6 pt-4 border-t">
                <p className="text-gray-600">
                  Don't have an account?
                  <Link
                    to={"/register"}
                    className="ml-2 text-green-600 hover:underline font-medium"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
