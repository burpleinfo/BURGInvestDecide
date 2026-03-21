import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../widgets/Navbar/Navbar";
import Footer from "../widgets/Footer/Footer";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password) => {
    if (!password) return "Password is required!";
    if (password.length < 8) return "Password must be at least 8 characters long!";
    if (password.length > 64) return "Password cannot exceed 64 characters!";
    return "";
  };

  const validateConfirmPassword = (confirm) => {
    if (!confirm) return "You must confirm your password!";
    if (confirm !== form.password) return "Passwords do not match!";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      if (name === "password") setErrors({ ...errors, password: validatePassword(value) });
      if (name === "confirmPassword") setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    if (name === "password") setErrors({ ...errors, password: validatePassword(value) });
    if (name === "confirmPassword") setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(form.confirmPassword);
    
    if (!passwordError && !confirmPasswordError) {
      setSuccessMessage("Password reset successful! Redirecting to login...");
      setErrorMessage("");
      setSubmitted(true);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } else {
      setErrors({ password: passwordError, confirmPassword: confirmPasswordError });
      setTouched({ password: true, confirmPassword: true });
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">Set New Password</h2>

          {submitted && successMessage ? (
            <div className="text-center">
              <p className="text-green-600 font-semibold text-lg">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="New password"
                  className={`w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-300 ${
                    touched.password
                      ? errors.password
                        ? "border-2 border-red-500 bg-red-50"
                        : "border-2 border-green-500 bg-green-50"
                      : "border-2 border-gray-300 bg-gray-50"
                  }`}
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">New Password</label>
                {touched.password && errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-300 ${
                    touched.confirmPassword
                      ? errors.confirmPassword
                        ? "border-2 border-red-500 bg-red-50"
                        : "border-2 border-green-500 bg-green-50"
                      : "border-2 border-gray-300 bg-gray-50"
                  }`}
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Confirm Password</label>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!form.password || !form.confirmPassword || Object.values(errors).some(e => e)}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Reset Password
              </button>

              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
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

export default ResetPasswordPage;
