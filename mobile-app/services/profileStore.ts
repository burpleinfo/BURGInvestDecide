import { getIdTokenResult, type User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import { firestore } from '@/services/firebase';

export type AppRole = 'driver' | 'passenger' | 'admin';

export interface RouteStop {
  id?: string;
  name: string;
  lat?: number;
  lng?: number;
  time?: string;
  passengers?: number;
  distance?: string;
}

export interface RouteData {
  id: string;
  name: string;
  institutionId?: string;
  institutionName?: string;
  stops: RouteStop[];
  createdAt?: string;
}

export interface PassengerRosterItem {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  parentPhone?: string;
  burgId?: string;
  busNumber: string;
  pickupStop?: string;
  dropoffStop?: string;
  status?: string;
  institutionId?: string;
  institutionName?: string;
  profilePicture?: string;
}

export interface CommonProfile {
  id: string;
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: AppRole;
  institutionId?: string;
  institutionName?: string;
  busId?: string;
  busNumber: string;
  route: string;
  routeId?: string;
  status: 'active' | 'inactive' | 'on-duty' | 'off-duty';
  profilePicture?: string;
  createdAt?: string;
}

export interface DriverProfile extends CommonProfile {
  role: 'driver';
  busType: string;
  assignedRoute?: string;
  licenseNumber: string;
  licenseExpiry: string;
  rating?: number;
  yearsExperience?: number;
  driverToken?: string;
}

export interface PassengerProfile extends CommonProfile {
  role: 'passenger';
  burgId: string;
  parentPhone?: string;
  pickupStop?: string;
  dropoffStop?: string;
  passengerToken?: string;
}

export type AppProfile = DriverProfile | PassengerProfile;

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const asNumber = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : undefined);

const pickText = (...values: unknown[]) => {
  for (const value of values) {
    const text = asText(value);
    if (text) {
      return text;
    }
  }

  return '';
};

const pickNumber = (...values: unknown[]) => {
  for (const value of values) {
    const numberValue = asNumber(value);
    if (numberValue !== undefined) {
      return numberValue;
    }
  }

  return undefined;
};

const pickStatus = (...values: unknown[]): AppProfile['status'] => {
  const allowedStatuses: AppProfile['status'][] = ['active', 'inactive', 'on-duty', 'off-duty'];

  for (const value of values) {
    const text = asText(value) as AppProfile['status'];
    if (allowedStatuses.includes(text)) {
      return text;
    }
  }

  return 'active';
};

const normalizeRole = (value: unknown, fallback: AppRole = 'driver'): AppRole => {
  if (value === 'driver' || value === 'passenger' || value === 'admin') {
    return value;
  }

  return fallback;
};

const mergeData = (sources: Array<Record<string, unknown> | null | undefined>) => {
  return sources.reduce<Record<string, unknown>>((accumulator, source) => ({
    ...accumulator,
    ...(source || {}),
  }), {});
};

const normalizeRouteStops = (stops: unknown): RouteStop[] => {
  if (!Array.isArray(stops)) {
    return [];
  }

  return stops
    .map((stop, index) => {
      if (!stop || typeof stop !== 'object') {
        return null;
      }

      const stopData = stop as Record<string, unknown>;
      const name = pickText(stopData.name, stopData.stopName, stopData.label) || `Stop ${index + 1}`;

      return {
        id: pickText(stopData.id, stopData.stopId) || undefined,
        name,
        lat: pickNumber(stopData.lat, stopData.latitude),
        lng: pickNumber(stopData.lng, stopData.longitude),
        time: pickText(stopData.time, stopData.arrivalTime) || undefined,
        passengers: pickNumber(stopData.passengers, stopData.passengerCount),
        distance: pickText(stopData.distance) || undefined,
      };
    })
    .filter((stop): stop is RouteStop => Boolean(stop));
};

const normalizeRoute = (id: string, routeData: Record<string, unknown> | null | undefined): RouteData | null => {
  if (!routeData) {
    return null;
  }

  return {
    id,
    name: pickText(routeData.name, routeData.routeName) || 'Route',
    institutionId: pickText(routeData.institutionId) || undefined,
    institutionName: pickText(routeData.institutionName) || undefined,
    stops: normalizeRouteStops(routeData.stops || routeData.routeStops),
    createdAt: pickText(routeData.createdAt) || undefined,
  };
};

const normalizePassenger = (id: string, passengerData: Record<string, unknown> | null | undefined): PassengerRosterItem | null => {
  if (!passengerData) {
    return null;
  }

  return {
    id,
    uid: pickText(passengerData.uid) || id,
    name: pickText(passengerData.name) || 'Passenger',
    email: pickText(passengerData.email),
    phone: pickText(passengerData.phone),
    parentPhone: pickText(passengerData.parentPhone) || undefined,
    burgId: pickText(passengerData.burgId) || undefined,
    busNumber: pickText(passengerData.busNumber, passengerData.busId) || 'BUS-000',
    pickupStop: pickText(passengerData.pickupStop, passengerData.assignedLocationName) || undefined,
    dropoffStop: pickText(passengerData.dropoffStop) || undefined,
    status: pickText(passengerData.status) || undefined,
    institutionId: pickText(passengerData.institutionId) || undefined,
    institutionName: pickText(passengerData.institutionName) || undefined,
    profilePicture: pickText(passengerData.profilePicture) || undefined,
  };
};

const getCollectionsForRole = (role: AppRole) => ({
  roleCollection: role === 'passenger' ? 'passengers' : 'drivers',
});

const getTokenContext = async (firebaseUser: User, roleHint?: AppRole) => {
  const tokenResult = await getIdTokenResult(firebaseUser, true).catch(() => null);
  const claims = tokenResult?.claims ?? {};

  return {
    role: normalizeRole(claims.role ?? roleHint, roleHint || 'driver'),
    institutionId: asText(claims.institutionId) || undefined,
    claims,
  };
};

const buildProfile = async (firebaseUser: User, roleHint?: AppRole): Promise<AppProfile> => {
  const tokenContext = await getTokenContext(firebaseUser, roleHint);
  const { role, institutionId } = tokenContext;
  const { roleCollection } = getCollectionsForRole(role);

  const references = [
    doc(firestore, 'users', firebaseUser.uid),
    doc(firestore, roleCollection, firebaseUser.uid),
    institutionId ? doc(firestore, 'institutions', institutionId, roleCollection, firebaseUser.uid) : null,
    institutionId ? doc(firestore, 'institutions', institutionId) : null,
  ].filter(Boolean) as Array<ReturnType<typeof doc>>;

  const snapshots = await Promise.all(references.map((reference) => getDoc(reference)));
  const userData = snapshots[0]?.data();
  const roleData = snapshots[1]?.data();
  const institutionRoleData = snapshots[2]?.data();
  const institutionData = snapshots[3]?.data();

  const merged = mergeData([userData, roleData, institutionRoleData]);

  const common: CommonProfile = {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: pickText(merged.email, firebaseUser.email),
    name: pickText(merged.name, firebaseUser.displayName, firebaseUser.providerData[0]?.displayName) || 'User',
    phone: pickText(merged.phone),
    role,
    institutionId: pickText(merged.institutionId, institutionId) || undefined,
    institutionName: pickText(merged.institutionName, institutionData?.name) || undefined,
    busId: pickText(merged.busId) || undefined,
    busNumber: pickText(merged.busNumber, merged.busId) || 'BUS-000',
    route: pickText(merged.route, merged.assignedRoute, merged.assignedRouteName, merged.routeName, merged.pickupStop) || 'Assigned Route',
    routeId: pickText(merged.routeId) || undefined,
    status: pickStatus(merged.status),
    profilePicture: pickText(merged.profilePicture) || undefined,
    createdAt: pickText(merged.createdAt) || undefined,
  };

  if (role === 'passenger') {
    return {
      ...common,
      role: 'passenger',
      burgId: pickText(merged.burgId) || `BURG-${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
      parentPhone: pickText(merged.parentPhone) || undefined,
      pickupStop: pickText(merged.pickupStop, merged.assignedLocationName) || undefined,
      dropoffStop: pickText(merged.dropoffStop) || undefined,
      passengerToken: pickText(merged.passengerToken) || undefined,
    };
  }

  return {
    ...common,
    role: 'driver',
    busType: pickText(merged.busType) || 'School Bus',
    assignedRoute: pickText(merged.assignedRoute, merged.assignedRouteName, common.route) || undefined,
    licenseNumber: pickText(merged.licenseNumber, merged.licenseNo) || 'N/A',
    licenseExpiry: pickText(merged.licenseExpiry) || 'N/A',
    rating: pickNumber(merged.rating),
    yearsExperience: pickNumber(merged.yearsExperience),
    driverToken: pickText(merged.driverToken) || undefined,
  };
};

export async function fetchDriverProfile(firebaseUser: User): Promise<DriverProfile> {
  const profile = await buildProfile(firebaseUser, 'driver');

  if (profile.role !== 'driver') {
    return {
      ...profile,
      role: 'driver',
      busType: 'School Bus',
      assignedRoute: profile.route,
      licenseNumber: 'N/A',
      licenseExpiry: 'N/A',
    } as DriverProfile;
  }

  return profile;
}

export async function fetchPassengerProfile(firebaseUser: User): Promise<PassengerProfile> {
  const profile = await buildProfile(firebaseUser, 'passenger');

  if (profile.role !== 'passenger') {
    return {
      ...profile,
      role: 'passenger',
      burgId: `BURG-${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
    } as PassengerProfile;
  }

  return profile;
}

export async function fetchAppProfile(firebaseUser: User, roleHint?: AppRole): Promise<AppProfile> {
  return buildProfile(firebaseUser, roleHint);
}

export async function saveDriverProfile(firebaseUser: User, updates: Partial<DriverProfile>) {
  const currentProfile = await fetchDriverProfile(firebaseUser);
  const nextProfile: DriverProfile = {
    ...currentProfile,
    ...updates,
    role: 'driver',
    busNumber: updates.busNumber ?? currentProfile.busNumber,
    busType: updates.busType ?? currentProfile.busType,
    route: updates.route ?? currentProfile.route,
    assignedRoute: updates.assignedRoute ?? currentProfile.assignedRoute,
    status: updates.status ?? currentProfile.status,
    licenseNumber: updates.licenseNumber ?? currentProfile.licenseNumber,
    licenseExpiry: updates.licenseExpiry ?? currentProfile.licenseExpiry,
  };

  const writes: Promise<unknown>[] = [
    setDoc(doc(firestore, 'users', firebaseUser.uid), {
      uid: nextProfile.uid,
      name: nextProfile.name,
      email: nextProfile.email,
      phone: nextProfile.phone,
      role: 'driver',
      institutionId: nextProfile.institutionId || null,
      institutionName: nextProfile.institutionName || null,
      busId: nextProfile.busId || null,
      busNumber: nextProfile.busNumber,
      routeId: nextProfile.routeId || null,
      assignedRoute: nextProfile.assignedRoute || null,
      createdAt: nextProfile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true }),
    setDoc(doc(firestore, 'drivers', firebaseUser.uid), {
      uid: nextProfile.uid,
      name: nextProfile.name,
      email: nextProfile.email,
      phone: nextProfile.phone,
      busId: nextProfile.busId || null,
      busNumber: nextProfile.busNumber,
      busType: nextProfile.busType,
      route: nextProfile.route,
      routeId: nextProfile.routeId || null,
      assignedRoute: nextProfile.assignedRoute || null,
      institutionId: nextProfile.institutionId || null,
      institutionName: nextProfile.institutionName || null,
      status: nextProfile.status,
      licenseNumber: nextProfile.licenseNumber,
      licenseExpiry: nextProfile.licenseExpiry,
      profilePicture: nextProfile.profilePicture || null,
      rating: nextProfile.rating ?? null,
      yearsExperience: nextProfile.yearsExperience ?? null,
      driverToken: nextProfile.driverToken || null,
      createdAt: nextProfile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true }),
  ];

  if (nextProfile.institutionId) {
    writes.push(setDoc(doc(firestore, 'institutions', nextProfile.institutionId, 'drivers', firebaseUser.uid), {
      uid: nextProfile.uid,
      name: nextProfile.name,
      email: nextProfile.email,
      phone: nextProfile.phone,
      busId: nextProfile.busId || null,
      busNumber: nextProfile.busNumber,
      busType: nextProfile.busType,
      route: nextProfile.route,
      routeId: nextProfile.routeId || null,
      assignedRoute: nextProfile.assignedRoute || null,
      institutionId: nextProfile.institutionId,
      institutionName: nextProfile.institutionName || null,
      status: nextProfile.status,
      licenseNumber: nextProfile.licenseNumber,
      licenseExpiry: nextProfile.licenseExpiry,
      profilePicture: nextProfile.profilePicture || null,
      rating: nextProfile.rating ?? null,
      yearsExperience: nextProfile.yearsExperience ?? null,
      driverToken: nextProfile.driverToken || null,
      createdAt: nextProfile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true }));
  }

  await Promise.all(writes);
  return nextProfile;
}

export async function savePassengerProfile(firebaseUser: User, updates: Partial<PassengerProfile>) {
  const currentProfile = await fetchPassengerProfile(firebaseUser);
  const nextProfile: PassengerProfile = {
    ...currentProfile,
    ...updates,
    role: 'passenger',
    busNumber: updates.busNumber ?? currentProfile.busNumber,
    route: updates.route ?? currentProfile.route,
    status: updates.status ?? currentProfile.status,
    burgId: updates.burgId ?? currentProfile.burgId,
  };

  const writes: Promise<unknown>[] = [
    setDoc(doc(firestore, 'users', firebaseUser.uid), {
      uid: nextProfile.uid,
      name: nextProfile.name,
      email: nextProfile.email,
      phone: nextProfile.phone,
      role: 'passenger',
      institutionId: nextProfile.institutionId || null,
      institutionName: nextProfile.institutionName || null,
      busId: nextProfile.busId || null,
      busNumber: nextProfile.busNumber,
      routeId: nextProfile.routeId || null,
      pickupStop: nextProfile.pickupStop || null,
      dropoffStop: nextProfile.dropoffStop || null,
      burgId: nextProfile.burgId,
      parentPhone: nextProfile.parentPhone || null,
      createdAt: nextProfile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true }),
    setDoc(doc(firestore, 'passengers', firebaseUser.uid), {
      uid: nextProfile.uid,
      name: nextProfile.name,
      email: nextProfile.email,
      phone: nextProfile.phone,
      parentPhone: nextProfile.parentPhone || null,
      burgId: nextProfile.burgId,
      busId: nextProfile.busId || null,
      busNumber: nextProfile.busNumber,
      pickupStop: nextProfile.pickupStop || null,
      dropoffStop: nextProfile.dropoffStop || null,
      institutionId: nextProfile.institutionId || null,
      institutionName: nextProfile.institutionName || null,
      status: nextProfile.status,
      passengerToken: nextProfile.passengerToken || null,
      profilePicture: nextProfile.profilePicture || null,
      createdAt: nextProfile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true }),
  ];

  if (nextProfile.institutionId) {
    writes.push(setDoc(doc(firestore, 'institutions', nextProfile.institutionId, 'passengers', firebaseUser.uid), {
      uid: nextProfile.uid,
      name: nextProfile.name,
      email: nextProfile.email,
      phone: nextProfile.phone,
      parentPhone: nextProfile.parentPhone || null,
      burgId: nextProfile.burgId,
      busId: nextProfile.busId || null,
      busNumber: nextProfile.busNumber,
      pickupStop: nextProfile.pickupStop || null,
      dropoffStop: nextProfile.dropoffStop || null,
      institutionId: nextProfile.institutionId,
      institutionName: nextProfile.institutionName || null,
      status: nextProfile.status,
      passengerToken: nextProfile.passengerToken || null,
      profilePicture: nextProfile.profilePicture || null,
      createdAt: nextProfile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true }));
  }

  await Promise.all(writes);
  return nextProfile;
}

export async function fetchRoutesForInstitution(institutionId: string) {
  const routesSnap = await getDoc(doc(firestore, 'institutions', institutionId));
  void routesSnap;

  const snapshot = await getDoc(doc(firestore, 'routes', institutionId)).catch(() => null);
  if (snapshot?.exists()) {
    const route = normalizeRoute(snapshot.id, snapshot.data());
    return route ? [route] : [];
  }

  return [];
}

export function selectRouteForProfile(routes: RouteData[], profile: Pick<CommonProfile, 'route' | 'routeId' | 'institutionId'> & Partial<PassengerProfile>) {
  if (!routes.length) {
    return null;
  }

  const exactId = routes.find((route) => route.id === profile.routeId);
  if (exactId) {
    return exactId;
  }

  const exactName = routes.find((route) => route.name === profile.route);
  if (exactName) {
    return exactName;
  }

  if (profile.pickupStop || profile.dropoffStop) {
    const stopMatch = routes.find((route) => route.stops.some((stop) => stop.name === profile.pickupStop || stop.name === profile.dropoffStop));
    if (stopMatch) {
      return stopMatch;
    }
  }

  return routes[0];
}

export async function fetchRouteById(routeId: string): Promise<RouteData | null> {
  const routeDoc = await getDoc(doc(firestore, 'routes', routeId));
  if (!routeDoc.exists()) {
    return null;
  }

  return normalizeRoute(routeDoc.id, routeDoc.data());
}

export function subscribeToAppProfile(
  firebaseUser: User,
  roleHint: AppRole | undefined,
  onNext: (profile: AppProfile) => void,
  onError?: (error: Error) => void,
) {
  let cancelled = false;
  const unsubscribers: Unsubscribe[] = [];

  const start = async () => {
    try {
      const tokenContext = await getTokenContext(firebaseUser, roleHint);
      const { role, institutionId } = tokenContext;
      const { roleCollection } = getCollectionsForRole(role);

      const emit = async () => {
        if (cancelled) {
          return;
        }

        try {
          const profile = await buildProfile(firebaseUser, roleHint ?? role);
          if (!cancelled) {
            onNext(profile);
          }
        } catch (error) {
          if (onError && error instanceof Error) {
            onError(error);
          }
        }
      };

      const refs = [
        doc(firestore, 'users', firebaseUser.uid),
        doc(firestore, roleCollection, firebaseUser.uid),
        institutionId ? doc(firestore, 'institutions', institutionId, roleCollection, firebaseUser.uid) : null,
        institutionId ? doc(firestore, 'institutions', institutionId) : null,
      ].filter(Boolean) as Array<ReturnType<typeof doc>>;

      refs.forEach((reference) => {
        const unsubscribe = onSnapshot(
          reference,
          () => {
            void emit();
          },
          (error) => {
            if (onError) {
              onError(error as Error);
            }
          },
        );

        unsubscribers.push(unsubscribe);
      });

      void emit();
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  void start();

  return () => {
    cancelled = true;
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

export function subscribeToInstitutionRoutes(
  institutionId: string,
  onNext: (routes: RouteData[]) => void,
  onError?: (error: Error) => void,
) {
  const routesQuery = query(collection(firestore, 'routes'), where('institutionId', '==', institutionId));

  return onSnapshot(
    routesQuery,
    (snapshot) => {
      const routes = snapshot.docs
        .map((routeDoc) => normalizeRoute(routeDoc.id, routeDoc.data()))
        .filter((route): route is RouteData => Boolean(route));

      onNext(routes);
    },
    (error) => {
      if (onError) {
        onError(error as Error);
      }
    },
  );
}

export function subscribeToInstitutionPassengers(
  institutionId: string,
  onNext: (passengers: PassengerRosterItem[]) => void,
  onError?: (error: Error) => void,
) {
  const passengersQuery = query(collection(firestore, 'institutions', institutionId, 'passengers'));

  return onSnapshot(
    passengersQuery,
    (snapshot) => {
      const passengers = snapshot.docs
        .map((passengerDoc) => {
          const data = passengerDoc.data() || {};
          if (data.isMetadata) {
            return null;
          }

          return normalizePassenger(passengerDoc.id, data);
        })
        .filter((passenger): passenger is PassengerRosterItem => Boolean(passenger));

      onNext(passengers);
    },
    (error) => {
      if (onError) {
        onError(error as Error);
      }
    },
  );
}
