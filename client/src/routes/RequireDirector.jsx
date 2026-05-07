import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDirectorAuth } from "../contexts/DirectorAuthContext";

const RequireDirector = ({ children }) => {
  const location = useLocation();
  const { directorUser, isDirector, loading } = useDirectorAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F2EB] text-[#2F2A26]">
        Loading director session...
      </div>
    );
  }

  if (!directorUser || !isDirector) {
    return <Navigate to="/director/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireDirector;
