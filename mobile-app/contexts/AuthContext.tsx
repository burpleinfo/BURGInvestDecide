import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import { auth as firebaseAuth } from '@/services/firebase';
import { fetchAppProfile } from '@/services/profileStore';
import { registerAndSavePushToken } from '@/services/notifications';
import * as SecureStore from 'expo-secure-store';

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

const STORAGE_KEY = 'ridesafe_auth_user_v1';

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

  const syncPushToken = useCallback(async () => {
    try {
      const result = await registerAndSavePushToken();
      if (!result.ok && result.reason !== 'web-not-supported' && result.reason !== 'expo-go-not-supported') {
        console.log('[AuthContext] Push token sync skipped:', result.reason);
      }
    } catch (error) {
      console.warn('[AuthContext] push token sync failed', error);
    }
  }, []);

  // hydrate from local storage immediately so app can show cached user while Firebase verifies
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!raw) return;
        const cached = JSON.parse(raw);
        if (mounted && cached?.id) {
          setUser(cached);
        }
      } catch (err) {
        console.warn('[AuthContext] failed to read cached user', err);
      }
    })();
    return () => { mounted = false; };
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
      try {
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(userData));
      } catch (err) {
        console.warn('[AuthContext] failed to persist user', err);
      }
      await syncPushToken();
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
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
      } catch (err) {
        console.warn('[AuthContext] failed to remove cached user', err);
      }
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
        try { await SecureStore.deleteItemAsync(STORAGE_KEY); } catch {}
        return;
      }

      const userData = await hydrateUserFromBackend(firebaseUser);
      setUser(userData);
      try {
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(userData));
      } catch (err) {
        console.warn('[AuthContext] failed to persist user on getCurrentUser', err);
      }
      await syncPushToken();
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
          try { await SecureStore.deleteItemAsync(STORAGE_KEY); } catch {}
          return;
        }

        const userData = await hydrateUserFromBackend(firebaseUser);
        setUser(userData);
        try { await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(userData)); } catch (err) { console.warn('[AuthContext] failed to persist user from onAuthStateChanged', err); }
        await syncPushToken();
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
