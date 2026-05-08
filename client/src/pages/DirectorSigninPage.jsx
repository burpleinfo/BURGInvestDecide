import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useDirectorAuth } from "../contexts/DirectorAuthContext";
import "../director/directorTheme.css";

const DirectorSigninPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { signInDirector } = useDirectorAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    setLoading(true);

    try {
      await signInDirector({ email: form.email, password: form.password });
      addToast("Director sign in successful.", "success", 2500);
      const redirectTo = location.state?.from?.pathname || "/director";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setApiError(error?.message || "Director sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="director-shell">
      <div className="director-content">
        <header className="director-hero">
          <div>
            <p className="director-kicker">Director Access</p>
            <h1 className="director-title">Secure Command Sign-In</h1>
            <p className="director-subtitle">
              Authenticate with your director credentials to review approvals and oversee live data.
            </p>
          </div>
          <div className="director-card" style={{ maxWidth: "420px", width: "100%" }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && <div className="text-red-600 text-sm">{apiError}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="director@burg.io"
                  className="w-full px-4 py-3 rounded-xl border border-[#d7cbbd] bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-[#d7cbbd] bg-white"
                />
              </div>
              <button
                type="submit"
                className="director-btn w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </header>
      </div>
    </div>
  );
};

export default DirectorSigninPage;
