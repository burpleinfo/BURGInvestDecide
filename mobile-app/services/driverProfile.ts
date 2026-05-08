import { getIdTokenResult, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { firestore } from '@/services/firebase';

export type DriverRole = 'driver' | 'passenger' | 'admin';

export interface FirestoreDriverProfile {
  id: string;
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: DriverRole;
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

const asText = (value: unknown) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

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
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
};

const pickStatus = (...values: unknown[]): FirestoreDriverProfile['status'] => {
  const allowedStatuses: FirestoreDriverProfile['status'][] = ['active', 'inactive', 'on-duty', 'off-duty'];

  for (const value of values) {
    const text = asText(value) as FirestoreDriverProfile['status'];
    if (allowedStatuses.includes(text)) {
      return text;
    }
  }

  return 'active';
};

const normalizeRole = (value: unknown): DriverRole => {
  if (value === 'admin' || value === 'passenger' || value === 'driver') {
    return value;
  }

  return 'driver';
};

const mergeProfileData = (sources: Array<Record<string, unknown> | null | undefined>) => {
  return sources.reduce<Record<string, unknown>>((accumulator, source) => ({
    ...accumulator,
    ...(source || {}),
  }), {});
};

export async function fetchDriverProfile(firebaseUser: User): Promise<FirestoreDriverProfile> {
  const tokenResult = await getIdTokenResult(firebaseUser, true).catch(() => null);
  const claims = tokenResult?.claims ?? {};
  const uid = firebaseUser.uid;
  const institutionId = asText(claims.institutionId);

  const references = [
    doc(firestore, 'users', uid),
    doc(firestore, 'drivers', uid),
    institutionId ? doc(firestore, 'institutions', institutionId, 'drivers', uid) : null,
  ].filter(Boolean) as Array<ReturnType<typeof doc>>;

  const snapshots = await Promise.all(references.map((reference) => getDoc(reference)));
  const userData = snapshots[0]?.data();
  const globalDriverData = snapshots[1]?.data();
  const institutionDriverData = snapshots[2]?.data();
  const institutionSnap = institutionId ? await getDoc(doc(firestore, 'institutions', institutionId)) : null;

  const profileData = mergeProfileData([
    userData,
    globalDriverData,
    institutionDriverData,
  ]);

  return {
    id: uid,
    uid,
    email: pickText(profileData.email, firebaseUser.email),
    name: pickText(profileData.name, firebaseUser.displayName, firebaseUser.providerData[0]?.displayName) || 'Driver',
    phone: pickText(profileData.phone),
    role: normalizeRole(profileData.role ?? claims.role),
    institutionId: pickText(profileData.institutionId, institutionId) || undefined,
    institutionName: pickText(profileData.institutionName, institutionSnap?.data()?.name) || undefined,
    busId: pickText(profileData.busId, profileData.busNumber) || undefined,
    busNumber: pickText(profileData.busNumber, profileData.busId) || 'BUS-000',
    busType: pickText(profileData.busType) || 'School Bus',
    route: pickText(profileData.route, profileData.assignedRoute, profileData.routeName) || 'Assigned Route',
    routeId: pickText(profileData.routeId) || undefined,
    assignedRoute: pickText(profileData.assignedRoute) || undefined,
    status: pickStatus(profileData.status),
    licenseNumber: pickText(profileData.licenseNumber, profileData.licenseNo) || 'N/A',
    licenseExpiry: pickText(profileData.licenseExpiry) || 'N/A',
    profilePicture: pickText(profileData.profilePicture) || undefined,
    rating: pickNumber(profileData.rating),
    yearsExperience: pickNumber(profileData.yearsExperience),
    driverToken: pickText(profileData.driverToken) || undefined,
    createdAt: pickText(profileData.createdAt) || undefined,
  };
}

export async function saveDriverProfile(firebaseUser: User, updates: Partial<FirestoreDriverProfile>) {
  const currentProfile = await fetchDriverProfile(firebaseUser);
  const nextProfile: FirestoreDriverProfile = {
    ...currentProfile,
    ...updates,
    id: currentProfile.id,
    uid: currentProfile.uid,
    role: currentProfile.role,
    busNumber: updates.busNumber ?? currentProfile.busNumber,
    busType: updates.busType ?? currentProfile.busType,
    route: updates.route ?? currentProfile.route,
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
      role: nextProfile.role,
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