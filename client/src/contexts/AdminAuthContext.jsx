import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { firebaseAuth } from "../services/firebaseClient";
import { getAdminProfile } from "../services/ridesafeAdminApi";
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
  const [adminProfile, setAdminProfile] = useState(null);

  const loadAdminProfile = async (token) => {
    if (!token) {
      setAdminProfile(null);
      return null;
    }

    try {
      const profileResult = await getAdminProfile(token);
      const profile = profileResult?.user || null;
      setAdminProfile(profile);
      return profile;
    } catch (profileError) {
      console.warn("[AdminAuth] Failed to load admin profile", profileError);
      setAdminProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setIsAdmin(false);
        setIdToken("");
        setStoredAdminToken("");
        setAdminProfile(null);
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await nextUser.getIdTokenResult();
        const role = tokenResult.claims?.role || null;

        setUser(nextUser);
        setIsAdmin(role === "admin");

        if (role === "admin") {
          setIdToken(tokenResult.token || "");
          setStoredAdminToken(tokenResult.token || "");
          await loadAdminProfile(tokenResult.token || "");
        } else {
          setIdToken("");
          setStoredAdminToken("");
          setAdminProfile(null);
        }
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

    if (role === "pendingAdmin") {
      await firebaseSignOut(firebaseAuth);
      throw new Error("Your admin request is pending director approval.");
    }

    if (role !== "admin") {
      await firebaseSignOut(firebaseAuth);
      throw new Error("Access denied. Admin role required.");
    }

    setStoredAdminToken(tokenResult.token || "");
    setIdToken(tokenResult.token || "");
    setIsAdmin(true);
    setUser(signedInUser);
    await loadAdminProfile(tokenResult.token || "");

    if (tokenResult.token) {
      await startAdminSession(tokenResult.token);
    }

    return signedInUser;
  };

  const signUpAdmin = async ({ name, email, password, phone, inviteCode, institutionId, institutionName }) => {
    setError("");
    await adminSignup({ name, email, password, phone, inviteCode, institutionId, institutionName });
    return { email };
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
      adminProfile,
      idToken,
      // Backward-compatible keys used by components
      adminToken: idToken,
      adminUid: user?.uid || null,
      isAdmin,
      loading,
      error,
      signInAdmin,
      signUpAdmin,
      signOutAdmin
    }),
    [user, adminProfile, idToken, isAdmin, loading, error]
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
