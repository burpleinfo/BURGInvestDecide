import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const { adminUser, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF3FA] text-[#1C3A77]">
        Loading admin session...
      </div>
    );
  }

  if (!adminUser || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAdmin;
