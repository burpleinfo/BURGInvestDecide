import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import bgImage from "../assets/Background.png";

const AdminSignupPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signUpAdmin } = useAdminAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    inviteCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    if (form.password !== form.confirmPassword) {
      setApiError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signUpAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        inviteCode: form.inviteCode
      });

      addToast("Admin account created.", "success", 2500);
      navigate("/admin", { replace: true });
    } catch (error) {
      setApiError(error?.message || "Admin signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          opacity: 1
        }}
      />
      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-md">
            <div
              className="backdrop-blur-3xl border rounded-2xl p-8 shadow-2xl bg-white"
              style={{
                borderColor: "#e5e7eb",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div className="mb-8 flex overflow-hidden rounded-full border border-gray-200 bg-gray-100 p-1">
                <span className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm text-center">
                  Register
                </span>
                <Link
                  to="/admin/login"
                  className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900 text-center"
                >
                  Sign in
                </Link>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
                Create Admin Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {apiError && (
                  <div className="text-red-600 text-center font-medium mb-2">{apiError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Admin name"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-gray-300 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@burg.io"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-gray-300 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 99999 88888"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-gray-300 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Create password"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-gray-300 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-gray-300 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin invite code</label>
                  <input
                    type="text"
                    name="inviteCode"
                    value={form.inviteCode}
                    onChange={handleChange}
                    placeholder="Provided by BURG"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-gray-300 bg-gray-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {loading ? "Creating admin..." : "Create admin"}
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Already have access?{" "}
                <Link to="/admin/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSignupPage;
