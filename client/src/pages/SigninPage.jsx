import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../widgets/Navbar/Navbar";
import Footer from "../widgets/Footer/Footer";
import bgImage from "../assets/Background.png";

const SigninPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateEmail = (email) => {
    if (!email) return "Email is required!";
    if (email.length < 6) return "Email must be at least 6 characters long!";
    if (email.length > 254) return "Email must be shorter than 254 characters!";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required!";
    if (password.length < 8) return "Password must be at least 8 characters long!";
    if (password.length > 64) return "Password must be shorter than 64 characters!";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      if (name === "email") setErrors({ ...errors, email: validateEmail(value) });
      if (name === "password") setErrors({ ...errors, password: validatePassword(value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    if (name === "email") setErrors({ ...errors, email: validateEmail(value) });
    if (name === "password") setErrors({ ...errors, password: validatePassword(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    if (!emailError && !passwordError) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setApiError(data.message || "Signin failed. Please try again.");
        } else {
          setSubmitted(true);
        }
      } catch {
        setApiError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          opacity: 1,
        }}
      />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-md">
            <div 
              className="backdrop-blur-3xl border rounded-2xl p-8 shadow-2xl bg-white"
              style={{
                borderColor: "#e5e7eb",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
              }}
            >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">Log In</h2>

            {submitted ? (
              <div className="text-center">
                <p className="text-green-600 font-semibold text-lg mb-4">Sign in successful!</p>
                <button 
                  onClick={() => navigate("/")}
                  className="text-blue-600 underline hover:text-blue-800 transition"
                >
                  Go to Home
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {apiError && (
                  <div className="text-red-600 text-center font-medium mb-2">{apiError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="johndoe@example.com"
                    className={`w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-300 ${
                      touched.email
                        ? errors.email
                          ? "border-2 border-red-500 bg-red-50"
                          : "border-2 border-green-500 bg-green-50"
                        : "border-2 border-gray-300 bg-gray-50"
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-300 ${
                      touched.password
                        ? errors.password
                          ? "border-2 border-red-500 bg-red-50"
                          : "border-2 border-green-500 bg-green-50"
                        : "border-2 border-gray-300 bg-gray-50"
                    }`}
                  />
                  {touched.password && errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.email || !form.password || Object.values(errors).some(e => e)}
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {loading ? "Logging In..." : "Log In"}
                </button>
              </form>
            )}

            <div className="flex items-center my-6 gap-4">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-600 text-sm font-medium">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-700">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-blue-600 font-semibold hover:text-blue-800 transition"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SigninPage;
