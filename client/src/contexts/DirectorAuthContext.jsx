import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onIdTokenChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth } from "../services/firebaseClient";
import { getStoredDirectorToken, setStoredDirectorToken } from "../services/ridesafeDirectorApi";

const DirectorAuthContext = createContext(null);

export const DirectorAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(getStoredDirectorToken());
  const [isDirector, setIsDirector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setIsDirector(false);
        setIdToken("");
        setStoredDirectorToken("");
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await nextUser.getIdTokenResult();
        const role = tokenResult.claims?.role || null;

        setUser(nextUser);
        setIsDirector(role === "director");

        if (role === "director") {
          setIdToken(tokenResult.token || "");
          setStoredDirectorToken(tokenResult.token || "");
        } else {
          setIdToken("");
          setStoredDirectorToken("");
        }
      } catch (authError) {
        setError(authError?.message || "Failed to refresh director session.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInDirector = async ({ email, password }) => {
    setError("");
    const { user: signedInUser } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const tokenResult = await signedInUser.getIdTokenResult(true);
    const role = tokenResult.claims?.role || null;

    if (role !== "director") {
      await signOut(firebaseAuth);
      throw new Error("Access denied. Director role required.");
    }

    setStoredDirectorToken(tokenResult.token || "");
    setIdToken(tokenResult.token || "");
    setIsDirector(true);
    setUser(signedInUser);

    return signedInUser;
  };

  const signOutDirector = async () => {
    setError("");
    await signOut(firebaseAuth);
    setStoredDirectorToken("");
    setIdToken("");
    setIsDirector(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      directorUser: user,
      idToken,
      isDirector,
      loading,
      error,
      signInDirector,
      signOutDirector
    }),
    [user, idToken, isDirector, loading, error]
  );

  return <DirectorAuthContext.Provider value={value}>{children}</DirectorAuthContext.Provider>;
};

export const useDirectorAuth = () => {
  const context = useContext(DirectorAuthContext);
  if (!context) {
    throw new Error("useDirectorAuth must be used within DirectorAuthProvider");
  }
  return context;
};
