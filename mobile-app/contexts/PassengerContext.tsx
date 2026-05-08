import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth as firebaseAuth } from '@/services/firebase';
import {
  PassengerProfile,
  RouteData,
  fetchPassengerProfile,
  savePassengerProfile,
  selectRouteForProfile,
  subscribeToAppProfile,
  subscribeToInstitutionRoutes,
} from '@/services/profileStore';

export interface PassengerDetails {
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
  route: string;
  routeId?: string;
  status: 'active' | 'inactive' | 'on-duty' | 'off-duty';
  profilePicture?: string;
  createdAt?: string;
  burgId: string;
  parentPhone?: string;
  pickupStop?: string;
  dropoffStop?: string;
  passengerToken?: string;
}

interface PassengerContextType {
  passenger: PassengerDetails | null;
  route: RouteData | null;
  routes: RouteData[];
  isLoading: boolean;
  error: string | null;
  fetchPassengerDetails: (passengerId: string) => Promise<void>;
  updatePassengerProfile: (passengerId: string, data: Partial<PassengerDetails>) => Promise<void>;
  clearPassenger: () => void;
}

const PassengerContext = createContext<PassengerContextType | undefined>(undefined);

export function PassengerProvider({ children }: { children: ReactNode }) {
  const [passenger, setPassenger] = useState<PassengerDetails | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFirebaseUser = useCallback(() => firebaseAuth.currentUser, []);

  const syncPassengerFromProfile = useCallback((profile: PassengerProfile) => {
    setPassenger({
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
      route: profile.route,
      routeId: profile.routeId,
      status: profile.status,
      profilePicture: profile.profilePicture,
      createdAt: profile.createdAt,
      burgId: profile.burgId,
      parentPhone: profile.parentPhone,
      pickupStop: profile.pickupStop,
      dropoffStop: profile.dropoffStop,
      passengerToken: profile.passengerToken,
    });
  }, []);

  const fetchPassengerDetails = useCallback(async (passengerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const firebaseUser = getFirebaseUser();

      if (!firebaseUser) {
        throw new Error('Passenger must be signed in to load profile data');
      }

      const profile = await fetchPassengerProfile(firebaseUser);
      syncPassengerFromProfile(profile);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch passenger details';
      console.warn('[PassengerContext] Firestore profile unavailable:', errorMessage);
      setError(errorMessage);
      setPassenger((prev) => prev ? prev : {
        id: passengerId,
        uid: passengerId,
        role: 'passenger',
        name: 'Passenger',
        email: '',
        phone: '',
        busId: '',
        busNumber: 'BUS-000',
        route: 'Assigned Route',
        status: 'active',
        burgId: `BURG-${passengerId.slice(0, 6).toUpperCase()}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [getFirebaseUser, syncPassengerFromProfile]);

  const updatePassengerProfile = useCallback(async (passengerId: string, data: Partial<PassengerDetails>) => {
    setIsLoading(true);
    setError(null);
    try {
      const firebaseUser = getFirebaseUser();

      if (!firebaseUser) {
        throw new Error('Passenger must be signed in to update profile data');
      }

      const savedProfile = await savePassengerProfile(firebaseUser, {
        id: passengerId,
        ...data,
      });

      syncPassengerFromProfile(savedProfile);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update profile';
      console.warn('[PassengerContext] Firestore profile update failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getFirebaseUser, syncPassengerFromProfile]);

  const clearPassenger = useCallback(() => {
    setPassenger(null);
    setRoute(null);
    setRoutes([]);
    setError(null);
  }, []);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      profileUnsubscribe?.();

      if (!firebaseUser) {
        clearPassenger();
        return;
      }

      setIsLoading(true);
      profileUnsubscribe = subscribeToAppProfile(
        firebaseUser,
        'passenger',
        (profile) => {
          if (profile.role !== 'passenger') {
            clearPassenger();
            return;
          }

          syncPassengerFromProfile(profile);
          setIsLoading(false);
          setError(null);
        },
        (listenerError) => {
          console.warn('[PassengerContext] Profile listener error:', listenerError.message);
          setError(listenerError.message);
          setIsLoading(false);
        },
      );
    });

    return () => {
      unsubscribe();
      profileUnsubscribe?.();
    };
  }, [clearPassenger, syncPassengerFromProfile]);

  useEffect(() => {
    if (!passenger?.institutionId) {
      setRoute(null);
      setRoutes([]);
      return;
    }

    const unsubRoutes = subscribeToInstitutionRoutes(
      passenger.institutionId,
      (nextRoutes) => {
        setRoutes(nextRoutes);
        setRoute(selectRouteForProfile(nextRoutes, passenger as PassengerProfile));
      },
      (listenerError) => {
        console.warn('[PassengerContext] Route listener error:', listenerError.message);
      },
    );

    return () => unsubRoutes();
  }, [passenger?.institutionId, passenger?.pickupStop, passenger?.dropoffStop, passenger?.route, passenger?.routeId]);

  useEffect(() => {
    if (!routes.length) {
      setRoute(null);
      return;
    }

    setRoute(selectRouteForProfile(routes, passenger as PassengerProfile));
  }, [routes, passenger?.pickupStop, passenger?.dropoffStop, passenger?.route, passenger?.routeId]);

  const value: PassengerContextType = {
    passenger,
    route,
    routes,
    isLoading,
    error,
    fetchPassengerDetails,
    updatePassengerProfile,
    clearPassenger,
  };

  return <PassengerContext.Provider value={value}>{children}</PassengerContext.Provider>;
}

export function usePassenger() {
  const context = useContext(PassengerContext);
  if (context === undefined) {
    throw new Error('usePassenger must be used within a PassengerProvider');
  }
  return context;
}