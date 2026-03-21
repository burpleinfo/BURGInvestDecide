import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../widgets/Navbar/Navbar";
import Footer from "../widgets/Footer/Footer";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    if (!email) return "Email is required!";
    if (email.length < 6) return "Email must be at least 6 characters long!";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address!";
    return "";
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setForm({ email: value });
    if (touched) {
      setErrors({ email: validateEmail(value) });
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setErrors({ email: validateEmail(form.email) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(form.email);
    
    if (!emailError) {
      setSuccessMessage(`Password reset link sent to ${form.email}. Please check your email.`);
      setErrorMessage("");
      setSubmitted(true);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } else {
      setErrors({ email: emailError });
      setTouched(true);
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div 
            className="backdrop-blur-3xl border rounded-2xl p-8 shadow-2xl bg-white text-center"
            style={{
              borderColor: "#e5e7eb",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Reset Password</h2>
            <p className="text-gray-600 text-sm mb-8">Enter your email to receive a reset link</p>

          {submitted && successMessage ? (
            <div className="text-center">
              <p className="text-green-600 font-semibold flex items-center justify-center gap-2 text-lg mb-4">
                <i className="fas fa-check-circle"></i>
                {successMessage}
              </p>
              <p className="text-gray-600 text-sm">Redirecting to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 pr-10 rounded-lg text-white placeholder-gray-400 transition-all duration-300 ${
                    touched
                      ? errors.email
                        ? "border-2 border-red-500 bg-red-500/10"
                        : "border-2 border-green-500 bg-green-500/10"
                      : "border-2 border-gray-600"
                  }`}
                  style={{ backgroundColor: touched && !errors.email ? "rgba(132, 201, 38, 0.1)" : touched && errors.email ? "rgba(217, 4, 41, 0.1)" : "rgba(15, 43, 64, 0.4)" }}
                />
                <i className="fas fa-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>

              {touched && errors.email && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.email}
                </p>
              )}

              <button
                type="submit"
                disabled={!form.email || errors.email}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center gap-2"
              >
                <i className="fas fa-paper-plane"></i>
                Send Reset Link
              </button>

              {errorMessage && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  {errorMessage}
                </p>
              )}
            </form>
          )}

          <div className="text-center text-sm mt-6">
            <p className="text-gray-700">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
