import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import { auth as firebaseAuth } from '@/services/firebase';
import { fetchAppProfile } from '@/services/profileStore';

/**
 * Auth User Interface
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'driver' | 'passenger' | 'admin';
}

/**
 * Auth Context Type
 */
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Context Provider Component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrateUserFromBackend = useCallback(async (firebaseUser) => {
    try {
      const profile = await fetchAppProfile(firebaseUser);

      return {
        id: profile.uid,
        email: profile.email,
        name: profile.name,
        role: profile.role,
      };
    } catch (err: any) {
      console.warn('[AuthContext] Firestore profile unavailable, using Firebase data:', err?.message);
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: 'driver',
      };
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const userData = await hydrateUserFromBackend(credential.user);
      setUser(userData);
      return userData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hydrateUserFromBackend]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut(firebaseAuth);
      setUser(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get current user
   */
  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const firebaseUser = firebaseAuth.currentUser;
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      const userData = await hydrateUserFromBackend(firebaseUser);
      setUser(userData);
    } catch (err: any) {
      console.error('Failed to get current user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [hydrateUserFromBackend]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          return;
        }

        const userData = await hydrateUserFromBackend(firebaseUser);
        setUser(userData);
      } catch (err) {
        console.error('Failed to hydrate auth state:', err);
        setUser(null);
      }
    });

    return unsubscribe;
  }, [hydrateUserFromBackend]);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use Auth Context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
