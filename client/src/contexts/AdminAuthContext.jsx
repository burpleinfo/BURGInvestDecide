import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { firebaseAuth } from "../services/firebaseClient";
import {
  adminSignup,
  endAdminSession,
  getStoredAdminToken,
  setStoredAdminToken,
  startAdminSession
} from "../services/ridesafeAdminApi";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(getStoredAdminToken());
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setIsAdmin(false);
        setIdToken("");
        setStoredAdminToken("");
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await nextUser.getIdTokenResult();
        const role = tokenResult.claims?.role || null;

        setUser(nextUser);
        setIsAdmin(role === "admin");
        setIdToken(tokenResult.token || "");
        setStoredAdminToken(tokenResult.token || "");
      } catch (authError) {
        setError(authError?.message || "Failed to refresh admin session.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInAdmin = async ({ email, password }) => {
    setError("");
    const { user: signedInUser } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const tokenResult = await signedInUser.getIdTokenResult(true);
    const role = tokenResult.claims?.role || null;

    if (role !== "admin") {
      await firebaseSignOut(firebaseAuth);
      throw new Error("Access denied. Admin role required.");
    }

    setStoredAdminToken(tokenResult.token || "");
    setIdToken(tokenResult.token || "");
    setIsAdmin(true);
    setUser(signedInUser);

    if (tokenResult.token) {
      await startAdminSession(tokenResult.token);
    }

    return signedInUser;
  };

  const signUpAdmin = async ({ name, email, password, phone, inviteCode }) => {
    setError("");
    await adminSignup({ name, email, password, phone, inviteCode });
    return signInAdmin({ email, password });
  };

  const signOutAdmin = async () => {
    setError("");
    try {
      await endAdminSession(idToken || undefined);
    } catch (logoutError) {
      console.warn("[AdminAuth] Session logout failed", logoutError);
    }

    await firebaseSignOut(firebaseAuth);
    setStoredAdminToken("");
    setIdToken("");
    setIsAdmin(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      adminUser: user,
      idToken,
      isAdmin,
      loading,
      error,
      signInAdmin,
      signUpAdmin,
      signOutAdmin
    }),
    [user, idToken, isAdmin, loading, error]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
