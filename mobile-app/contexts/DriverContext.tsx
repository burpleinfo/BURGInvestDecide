import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth as firebaseAuth } from '@/services/firebase';
import {
  DriverProfile,
  PassengerRosterItem,
  RouteData,
  fetchDriverProfile,
  saveDriverProfile,
  selectRouteForProfile,
  subscribeToAppProfile,
  subscribeToInstitutionPassengers,
  subscribeToInstitutionRoutes,
} from '@/services/profileStore';

/**
 * Driver Details Interface
 */
export interface DriverDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'driver' | 'passenger' | 'admin';
  uid?: string;
  institutionId?: string;
  institutionName?: string;
  busId?: string;
  busNumber: string;
  busType: string;
  route: string;
  routeId?: string;
  assignedRoute?: string;
  status: 'active' | 'inactive' | 'on-duty' | 'off-duty';
  licenseNumber: string;
  licenseExpiry: string;
  profilePicture?: string;
  rating?: number;
  yearsExperience?: number;
  driverToken?: string;
  createdAt?: string;
}

/**
 * Driver Context Type
 */
interface DriverContextType {
  driver: DriverDetails | null;
  route: RouteData | null;
  routes: RouteData[];
  passengers: PassengerRosterItem[];
  isLoading: boolean;
  error: string | null;
  fetchDriverDetails: (driverId: string) => Promise<void>;
  updateDriverProfile: (driverId: string, data: Partial<DriverDetails>) => Promise<void>;
  clearDriver: () => void;
}

// Create context
const DriverContext = createContext<DriverContextType | undefined>(undefined);

/**
 * Driver Context Provider Component
 */
export function DriverProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<DriverDetails | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [passengers, setPassengers] = useState<PassengerRosterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFirebaseUser = useCallback(() => firebaseAuth.currentUser, []);

  const syncDriverFromProfile = useCallback((profile: DriverProfile) => {
    setDriver({
      id: profile.id,
      uid: profile.uid,
      role: profile.role,
      institutionId: profile.institutionId,
      institutionName: profile.institutionName,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      busId: profile.busId,
      busNumber: profile.busNumber,
      busType: profile.busType,
      route: profile.route,
      routeId: profile.routeId,
      assignedRoute: profile.assignedRoute,
      status: profile.status,
      licenseNumber: profile.licenseNumber,
      licenseExpiry: profile.licenseExpiry,
      profilePicture: profile.profilePicture,
      rating: profile.rating,
      yearsExperience: profile.yearsExperience,
      driverToken: profile.driverToken,
      createdAt: profile.createdAt,
    });
  }, []);

  /**
   * Fetch driver details from server
   */
  const fetchDriverDetails = useCallback(async (driverId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const firebaseUser = getFirebaseUser();

      if (!firebaseUser) {
        throw new Error('Driver must be signed in to load profile data');
      }

      const profile = await fetchDriverProfile(firebaseUser);
      syncDriverFromProfile(profile);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch driver details';
      console.warn('[DriverContext] Firestore profile unavailable:', errorMessage);
      setError(errorMessage);
      setDriver((prev) => (prev ? prev : null));
    } finally {
      setIsLoading(false);
    }
  }, [getFirebaseUser, syncDriverFromProfile]);

  /**
   * Update driver profile
   */
  const updateDriverProfile = useCallback(async (driverId: string, data: Partial<DriverDetails>) => {
    setIsLoading(true);
    setError(null);
    try {
      const firebaseUser = getFirebaseUser();

      if (!firebaseUser) {
        throw new Error('Driver must be signed in to update profile data');
      }

      const savedProfile = await saveDriverProfile(firebaseUser, {
        id: driverId,
        ...data,
      });

      syncDriverFromProfile(savedProfile);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update profile';
      console.warn('[DriverContext] Firestore profile update failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getFirebaseUser, syncDriverFromProfile]);

  /**
   * Clear driver state (on logout)
   */
  const clearDriver = useCallback(() => {
    setDriver(null);
    setRoute(null);
    setRoutes([]);
    setPassengers([]);
    setError(null);
  }, []);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;
    let routeUnsubscribe: (() => void) | null = null;
    let passengerUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      profileUnsubscribe?.();
      routeUnsubscribe?.();
      passengerUnsubscribe?.();

      if (!firebaseUser) {
        clearDriver();
        return;
      }

      setIsLoading(true);
      profileUnsubscribe = subscribeToAppProfile(
        firebaseUser,
        'driver',
        (profile) => {
          if (profile.role !== 'driver') {
            clearDriver();
            return;
          }

          syncDriverFromProfile(profile);
          setIsLoading(false);
          setError(null);
        },
        (listenerError) => {
          console.warn('[DriverContext] Profile listener error:', listenerError.message);
          setError(listenerError.message);
          setIsLoading(false);
        },
      );
    });

    return () => {
      unsubscribe();
      profileUnsubscribe?.();
      routeUnsubscribe?.();
      passengerUnsubscribe?.();
    };
  }, [clearDriver, syncDriverFromProfile]);

  useEffect(() => {
    if (!driver?.institutionId) {
      setRoute(null);
      setRoutes([]);
      setPassengers([]);
      return;
    }

    const unsubRoutes = subscribeToInstitutionRoutes(
      driver.institutionId,
      (nextRoutes) => {
        setRoutes(nextRoutes);
        setRoute(selectRouteForProfile(nextRoutes, driver as DriverProfile));
      },
      (listenerError) => {
        console.warn('[DriverContext] Route listener error:', listenerError.message);
      },
    );

    const unsubPassengers = subscribeToInstitutionPassengers(
      driver.institutionId,
      (nextPassengers) => {
        if (!driver?.busId) {
          setPassengers(nextPassengers);
          return;
        }

        const filtered = nextPassengers.filter((passenger) =>
          passenger.busNumber === driver.busNumber
        );
        setPassengers(filtered);
      },
      (listenerError) => {
        console.warn('[DriverContext] Passenger listener error:', listenerError.message);
      },
    );

    return () => {
      unsubRoutes();
      unsubPassengers();
    };
  }, [driver?.institutionId, driver?.route, driver?.routeId, driver?.assignedRoute, driver?.busNumber]);

  useEffect(() => {
    if (!routes.length) {
      setRoute(null);
      return;
    }

    setRoute(selectRouteForProfile(routes, driver as DriverProfile));
  }, [routes, driver?.route, driver?.routeId, driver?.assignedRoute, driver?.busNumber]);

  const value: DriverContextType = {
    driver,
    route,
    routes,
    passengers,
    isLoading,
    error,
    fetchDriverDetails,
    updateDriverProfile,
    clearDriver,
  };

  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
}

/**
 * Hook to use Driver Context
 */
export function useDriver() {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
}
