import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../widgets/Navbar/Navbar";
import Footer from "../widgets/Footer/Footer";
import bgImage from "../assets/Background.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false, confirmPassword: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateFullName = (name) => {
    if (!name) return "Full name is required!";
    if (name.length < 3) return "Full name must be at least 3 characters long!";
    if (name.length > 100) return "Full name must be shorter than 100 characters!";
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) return "Full name must include first and last name with valid characters.";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required!";
    if (email.length < 6) return "Email must be at least 6 characters long!";
    if (email.length > 254) return "Email must be shorter than 254 characters!";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email. Make sure to use alphanumeric characters and @";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required!";
    if (password.length < 8) return "Password must be at least 8 characters long!";
    if (password.length > 64) return "Password must be shorter than 64 characters!";
    return "";
  };

  const validateConfirmPassword = (confirm) => {
    if (!confirm) return "Password confirmation is required!";
    if (confirm !== form.password) return "Passwords do not match!";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      if (name === "fullName") setErrors({ ...errors, fullName: validateFullName(value) });
      if (name === "email") setErrors({ ...errors, email: validateEmail(value) });
      if (name === "password") setErrors({ ...errors, password: validatePassword(value) });
      if (name === "confirmPassword") setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    if (name === "fullName") setErrors({ ...errors, fullName: validateFullName(value) });
    if (name === "email") setErrors({ ...errors, email: validateEmail(value) });
    if (name === "password") setErrors({ ...errors, password: validatePassword(value) });
    if (name === "confirmPassword") setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const fullNameError = validateFullName(form.fullName);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(form.confirmPassword);
    if (!fullNameError && !emailError && !passwordError && !confirmPasswordError) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            password: form.password
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setApiError(data.message || "Signup failed. Please try again.");
        } else {
          setSubmitted(true);
        }
      } catch {
        setApiError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors({ fullName: fullNameError, email: emailError, password: passwordError, confirmPassword: confirmPasswordError });
      setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">Register</h2>

            {submitted ? (
              <div className="text-center">
                <p className="text-green-600 font-semibold text-lg mb-4">Signup successful! You can now sign in.</p>
                <button 
                  onClick={() => navigate("/signin")}
                  className="text-blue-600 underline hover:text-blue-800 transition"
                >
                  Go to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {apiError && (
                  <div className="text-red-600 text-center font-medium mb-2">{apiError}</div>
                )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-300 ${
                    touched.fullName
                      ? errors.fullName
                        ? "border-2 border-red-500 bg-red-50"
                        : "border-2 border-green-500 bg-green-50"
                      : "border-2 border-gray-300 bg-gray-50"
                  }`}
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-gray-300 transition-all duration-300 bg-gray-50"
                />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-300 ${
                    touched.confirmPassword
                      ? errors.confirmPassword
                        ? "border-2 border-red-500 bg-red-50"
                        : "border-2 border-green-500 bg-green-50"
                      : "border-2 border-gray-300 bg-gray-50"
                  }`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !form.fullName || !form.email || !form.password || !form.confirmPassword || Object.values(errors).some(e => e)}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          )}

          <div className="text-center text-sm mt-6">
            <p className="text-gray-700">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Sign in
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

export default SignupPage;
