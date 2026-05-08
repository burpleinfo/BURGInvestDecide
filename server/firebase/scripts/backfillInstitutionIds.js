const { firestoreDb } = require('../config/firebase');

const COLLECTIONS = [
  'users',
  'admins',
  'drivers',
  'passengers',
  'buses',
  'routes',
  'trips',
  'schedules',
  'payments',
  'sosAlerts',
  'adminRequests'
];

const ENTITY_FIELDS = {
  users: ['institutionId', 'institutionName', 'createdBy'],
  admins: ['institutionId', 'institutionName', 'createdBy'],
  drivers: ['institutionId', 'institutionName', 'createdBy', 'busId', 'assignedBusId', 'assignedRouteId', 'assignedLocationId'],
  passengers: ['institutionId', 'institutionName', 'createdBy', 'busId', 'assignedBusId', 'assignedRouteId', 'assignedLocationId'],
  buses: ['institutionId', 'createdBy', 'routeId'],
  routes: ['institutionId', 'createdBy'],
  trips: ['institutionId', 'createdBy', 'busId'],
  schedules: ['institutionId', 'createdBy', 'passengerUid'],
  payments: ['institutionId', 'createdBy', 'busId', 'passengerUid'],
  sosAlerts: ['institutionId', 'createdBy', 'busId', 'driverUid'],
  adminRequests: ['institutionId', 'institutionName']
};

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const readCollection = async (collectionName) => {
  const snap = await firestoreDb.collection(collectionName).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const resolveStopMatch = (stops, stopId) => {
  if (!Array.isArray(stops) || !stopId) {
    return null;
  }

  return stops.find((stop) => stop?.id === stopId || stop?.name === stopId) || null;
};

const buildAdminInstitutionMap = (admins, adminRequests) => {
  const map = new Map();

  admins.forEach((admin) => {
    if (admin?.uid && admin?.institutionId) {
      map.set(admin.uid, {
        institutionId: admin.institutionId,
        institutionName: admin.institutionName || null
      });
    }
  });

  adminRequests.forEach((request) => {
    if (request?.uid && request?.institutionId) {
      map.set(request.uid, {
        institutionId: request.institutionId,
        institutionName: request.institutionName || null
      });
    }
  });

  return map;
};

const main = async () => {
  const [users, admins, drivers, passengers, buses, routes, trips, schedules, payments, sosAlerts, adminRequests] = await Promise.all(
    COLLECTIONS.map((collectionName) => readCollection(collectionName))
  );

  const adminMap = buildAdminInstitutionMap(admins, adminRequests);
  const busMap = new Map(buses.map((bus) => [bus.id, bus]));
  const routeMap = new Map(routes.map((route) => [route.id, route]));
  const passengerMap = new Map(passengers.map((passenger) => [passenger.id, passenger]));
  const driverMap = new Map(drivers.map((driver) => [driver.id, driver]));

  const updates = [];

  const resolveInstitution = (entity) => {
    if (!entity) return null;

    if (entity.institutionId && !force) {
      return entity.institutionId;
    }

    if (entity.createdBy && adminMap.has(entity.createdBy)) {
      return adminMap.get(entity.createdBy).institutionId;
    }

    if (entity.busId && busMap.has(entity.busId)) {
      const bus = busMap.get(entity.busId);
      if (bus.institutionId) return bus.institutionId;

      if (bus.createdBy && adminMap.has(bus.createdBy)) {
        return adminMap.get(bus.createdBy).institutionId;
      }

      if (bus.routeId && routeMap.has(bus.routeId)) {
        const route = routeMap.get(bus.routeId);
        if (route.institutionId) return route.institutionId;
        if (route.createdBy && adminMap.has(route.createdBy)) {
          return adminMap.get(route.createdBy).institutionId;
        }
      }
    }

    if (entity.routeId && routeMap.has(entity.routeId)) {
      const route = routeMap.get(entity.routeId);
      if (route.institutionId) return route.institutionId;
      if (route.createdBy && adminMap.has(route.createdBy)) {
        return adminMap.get(route.createdBy).institutionId;
      }
    }

    if (entity.passengerUid && passengerMap.has(entity.passengerUid)) {
      const passenger = passengerMap.get(entity.passengerUid);
      if (passenger.institutionId) return passenger.institutionId;
      if (passenger.createdBy && adminMap.has(passenger.createdBy)) {
        return adminMap.get(passenger.createdBy).institutionId;
      }
      if (passenger.busId && busMap.has(passenger.busId)) {
        const bus = busMap.get(passenger.busId);
        if (bus.institutionId) return bus.institutionId;
      }
    }

    if (entity.driverUid && driverMap.has(entity.driverUid)) {
      const driver = driverMap.get(entity.driverUid);
      if (driver.institutionId) return driver.institutionId;
      if (driver.createdBy && adminMap.has(driver.createdBy)) {
        return adminMap.get(driver.createdBy).institutionId;
      }
      if (driver.busId && busMap.has(driver.busId)) {
        const bus = busMap.get(driver.busId);
        if (bus.institutionId) return bus.institutionId;
      }
    }

    return null;
  };

  const resolveAssignment = (entity) => {
    if (!entity) return {
      assignedBusId: null,
      assignedBusNumber: null,
      assignedRouteId: null,
      assignedRouteName: null,
      assignedLocationId: null,
      assignedLocationName: null
    };

    const bus = firstDefined(
      entity.assignedBusId && busMap.get(entity.assignedBusId),
      entity.busId && busMap.get(entity.busId)
    );

    const route = firstDefined(
      entity.assignedRouteId && routeMap.get(entity.assignedRouteId),
      bus?.routeId && routeMap.get(bus.routeId)
    );

    const routeStops = Array.isArray(route?.stops) ? route.stops : [];
    const stop = resolveStopMatch(routeStops, entity.assignedLocationId || entity.stopId);

    const assignedBusId = entity.assignedBusId || bus?.id || entity.busId || null;
    const assignedBusNumber = entity.assignedBusNumber || bus?.busNumber || null;
    const assignedRouteId = entity.assignedRouteId || route?.id || bus?.routeId || null;
    const assignedRouteName = entity.assignedRouteName || route?.name || null;
    const assignedLocationId = entity.assignedLocationId || stop?.id || entity.stopId || assignedRouteId;
    const assignedLocationName = entity.assignedLocationName || stop?.name || entity.stopId || assignedRouteName;

    return {
      assignedBusId,
      assignedBusNumber,
      assignedRouteId,
      assignedRouteName,
      assignedLocationId,
      assignedLocationName
    };
  };

  const queueUpdate = (collectionName, entity) => {
    const institutionId = resolveInstitution(entity);
    if (!institutionId) return;

    const institutionName =
      entity.institutionName ||
      adminMap.get(entity.createdBy || '')?.institutionName ||
      null;

    const patch = { institutionId };
    if (institutionName) {
      patch.institutionName = institutionName;
    }

    if (collectionName === 'drivers' || collectionName === 'passengers') {
      const assignment = resolveAssignment(entity);
      Object.assign(patch, assignment);
    }

    if (collectionName === 'users' && (entity.role === 'driver' || entity.role === 'passenger')) {
      const roleEntity = entity.role === 'driver' ? driverMap.get(entity.id) : passengerMap.get(entity.id);
      if (roleEntity) {
        Object.assign(patch, resolveAssignment(roleEntity));
        if (!patch.institutionName && roleEntity.institutionName) {
          patch.institutionName = roleEntity.institutionName;
        }
      }
    }

    updates.push({ collectionName, id: entity.id, patch });
  };

  users.forEach((entity) => queueUpdate('users', entity));
  admins.forEach((entity) => queueUpdate('admins', entity));
  drivers.forEach((entity) => queueUpdate('drivers', entity));
  passengers.forEach((entity) => queueUpdate('passengers', entity));
  buses.forEach((entity) => queueUpdate('buses', entity));
  routes.forEach((entity) => queueUpdate('routes', entity));
  trips.forEach((entity) => queueUpdate('trips', entity));
  schedules.forEach((entity) => queueUpdate('schedules', entity));
  payments.forEach((entity) => queueUpdate('payments', entity));
  sosAlerts.forEach((entity) => queueUpdate('sosAlerts', entity));
  adminRequests.forEach((entity) => queueUpdate('adminRequests', entity));

  console.log(`Planned updates: ${updates.length}`);

  if (dryRun) {
    console.log(JSON.stringify(updates.slice(0, 25), null, 2));
    return;
  }

  const batchSize = 400;
  for (let index = 0; index < updates.length; index += batchSize) {
    const batch = firestoreDb.batch();
    const slice = updates.slice(index, index + batchSize);

    slice.forEach(({ collectionName, id, patch }) => {
      batch.set(firestoreDb.collection(collectionName).doc(id), patch, { merge: true });
    });

    await batch.commit();
    console.log(`Committed ${Math.min(index + batchSize, updates.length)} / ${updates.length}`);
  }

  console.log('Institution backfill complete.');
};

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});