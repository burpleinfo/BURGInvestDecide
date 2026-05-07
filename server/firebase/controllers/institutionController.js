// controllers/institutionController.js

const { firebaseAuth, firestoreDb } = require('../config/firebase');

// ── Get Institution by ID ─────────────────────────
const getInstitution = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();

    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json({
      id: instDoc.id,
      ...instDoc.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Get All Drivers for Institution ───────────────
const getInstitutionDrivers = async (req, res) => {
  try {
    const { institutionId } = req.params;

    // Verify institution exists
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const driversSnap = await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('drivers')
      .where('isMetadata', '!=', true)
      .get();

    const drivers = driversSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      institutionId,
      drivers,
      count: drivers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Get All Passengers for Institution ────────────
const getInstitutionPassengers = async (req, res) => {
  try {
    const { institutionId } = req.params;

    // Verify institution exists
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const passengersSnap = await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('passengers')
      .where('isMetadata', '!=', true)
      .get();

    const passengers = passengersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      institutionId,
      passengers,
      count: passengers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Create Driver in Institution ──────────────────
const createInstitutionDriver = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { email, password, name, phone, licenseNo, busNumber, routeId, assignedRoute } = req.body;
    const adminUid = req.user?.uid;

    // Verify institution exists
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Verify admin owns institution
    const instData = instDoc.data();
    if (instData.adminId !== adminUid) {
      return res.status(403).json({ error: 'You do not have permission to manage this institution' });
    }

    // Create Firebase Auth user
    const user = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    // Set custom claim
    await firebaseAuth.setCustomUserClaims(user.uid, { 
      role: 'driver',
      institutionId 
    });

    // Save to institution driver subcollection
    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('drivers')
      .doc(user.uid)
      .set({
        uid: user.uid,
        name,
        email,
        phone,
        licenseNo,
        busNumber: busNumber || null,
        routeId: routeId || null,
        assignedRoute: assignedRoute || null,
        institutionId,
        createdAt: new Date().toISOString(),
        createdBy: adminUid,
        status: 'active',
        driverToken: generateToken('DRIVER', institutionId, user.uid)
      });

    // Also save to global drivers collection for backward compatibility
    await firestoreDb
      .collection('drivers')
      .doc(user.uid)
      .set({
        uid: user.uid,
        name,
        email,
        phone,
        licenseNo,
        busNumber: busNumber || null,
        routeId: routeId || null,
        assignedRoute: assignedRoute || null,
        institutionId,
        createdAt: new Date().toISOString(),
        createdBy: adminUid
      });

    // Update user profile
    await firestoreDb.collection('users').doc(user.uid).set({
      uid: user.uid,
      name,
      email,
      phone,
      role: 'driver',
      institutionId,
      institutionName: instData.name,
      busNumber: busNumber || null,
      routeId: routeId || null,
      createdAt: new Date().toISOString(),
      createdBy: adminUid
    });

    // Update institution driver count
    await firestoreDb.collection('institutions').doc(institutionId).update({
      driverCount: (instData.driverCount || 0) + 1
    });

    res.status(201).json({
      message: 'Driver created successfully',
      uid: user.uid,
      driverToken: generateToken('DRIVER', institutionId, user.uid),
      driver: {
        uid: user.uid,
        name,
        email,
        phone,
        licenseNo,
        institutionId
      }
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: error.message });
  }
};

// ── Create Passenger in Institution ───────────────
const createInstitutionPassenger = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { email, password, name, phone, parentPhone, busNumber, pickupStop, dropoffStop } = req.body;
    const adminUid = req.user?.uid;

    // Verify institution exists
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Verify admin owns institution
    const instData = instDoc.data();
    if (instData.adminId !== adminUid) {
      return res.status(403).json({ error: 'You do not have permission to manage this institution' });
    }

    // Create Firebase Auth user
    const user = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    // Generate BURG ID
    const burgId = `BURG-${Math.floor(100000 + Math.random() * 900000)}`;

    // Set custom claim
    await firebaseAuth.setCustomUserClaims(user.uid, { 
      role: 'passenger',
      institutionId 
    });

    // Save to institution passenger subcollection
    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('passengers')
      .doc(user.uid)
      .set({
        uid: user.uid,
        name,
        email,
        phone,
        parentPhone: parentPhone || null,
        burgId,
        busNumber: busNumber || null,
        pickupStop: pickupStop || null,
        dropoffStop: dropoffStop || null,
        institutionId,
        createdAt: new Date().toISOString(),
        createdBy: adminUid,
        status: 'active',
        passengerToken: generateToken('PASSENGER', institutionId, user.uid)
      });

    // Also save to global passengers collection for backward compatibility
    await firestoreDb
      .collection('passengers')
      .doc(user.uid)
      .set({
        uid: user.uid,
        name,
        email,
        phone,
        parentPhone: parentPhone || null,
        burgId,
        busNumber: busNumber || null,
        pickupStop: pickupStop || null,
        dropoffStop: dropoffStop || null,
        institutionId,
        createdAt: new Date().toISOString(),
        createdBy: adminUid
      });

    // Update user profile
    await firestoreDb.collection('users').doc(user.uid).set({
      uid: user.uid,
      name,
      email,
      phone,
      role: 'passenger',
      institutionId,
      institutionName: instData.name,
      burgId,
      parentPhone: parentPhone || null,
      busNumber: busNumber || null,
      createdAt: new Date().toISOString(),
      createdBy: adminUid
    });

    // Update institution passenger count
    await firestoreDb.collection('institutions').doc(institutionId).update({
      passengerCount: (instData.passengerCount || 0) + 1
    });

    res.status(201).json({
      message: 'Passenger created successfully',
      uid: user.uid,
      burgId,
      passengerToken: generateToken('PASSENGER', institutionId, user.uid),
      passenger: {
        uid: user.uid,
        name,
        email,
        phone,
        burgId,
        institutionId
      }
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: error.message });
  }
};

// ── Update Driver ─────────────────────────────────
const updateInstitutionDriver = async (req, res) => {
  try {
    const { institutionId, driverId } = req.params;
    const { name, phone, licenseNo, busNumber, routeId, assignedRoute } = req.body;
    const adminUid = req.user?.uid;

    // Verify institution and admin permission
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const instData = instDoc.data();
    if (instData.adminId !== adminUid) {
      return res.status(403).json({ error: 'You do not have permission to manage this institution' });
    }

    // Verify driver exists in institution
    const driverDoc = await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('drivers')
      .doc(driverId)
      .get();

    if (!driverDoc.exists) {
      return res.status(404).json({ error: 'Driver not found in this institution' });
    }

    // Update driver data
    const updateData = { updatedAt: new Date().toISOString() };
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (licenseNo) updateData.licenseNo = licenseNo;
    if (busNumber !== undefined) updateData.busNumber = busNumber;
    if (routeId !== undefined) updateData.routeId = routeId;
    if (assignedRoute !== undefined) updateData.assignedRoute = assignedRoute;

    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('drivers')
      .doc(driverId)
      .update(updateData);

    // Also update global drivers collection
    await firestoreDb.collection('drivers').doc(driverId).update(updateData);

    res.json({
      message: 'Driver updated successfully',
      uid: driverId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Update Passenger ──────────────────────────────
const updateInstitutionPassenger = async (req, res) => {
  try {
    const { institutionId, passengerId } = req.params;
    const { name, phone, parentPhone, busNumber, pickupStop, dropoffStop } = req.body;
    const adminUid = req.user?.uid;

    // Verify institution and admin permission
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const instData = instDoc.data();
    if (instData.adminId !== adminUid) {
      return res.status(403).json({ error: 'You do not have permission to manage this institution' });
    }

    // Verify passenger exists in institution
    const passengerDoc = await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('passengers')
      .doc(passengerId)
      .get();

    if (!passengerDoc.exists) {
      return res.status(404).json({ error: 'Passenger not found in this institution' });
    }

    // Update passenger data
    const updateData = { updatedAt: new Date().toISOString() };
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (parentPhone !== undefined) updateData.parentPhone = parentPhone;
    if (busNumber !== undefined) updateData.busNumber = busNumber;
    if (pickupStop !== undefined) updateData.pickupStop = pickupStop;
    if (dropoffStop !== undefined) updateData.dropoffStop = dropoffStop;

    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('passengers')
      .doc(passengerId)
      .update(updateData);

    // Also update global passengers collection
    await firestoreDb.collection('passengers').doc(passengerId).update(updateData);

    res.json({
      message: 'Passenger updated successfully',
      uid: passengerId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Delete Driver ─────────────────────────────────
const deleteInstitutionDriver = async (req, res) => {
  try {
    const { institutionId, driverId } = req.params;
    const adminUid = req.user?.uid;

    // Verify institution and admin permission
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const instData = instDoc.data();
    if (instData.adminId !== adminUid) {
      return res.status(403).json({ error: 'You do not have permission to manage this institution' });
    }

    // Delete from auth
    await firebaseAuth.deleteUser(driverId);

    // Delete from institution subcollection
    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('drivers')
      .doc(driverId)
      .delete();

    // Delete from global collections
    await firestoreDb.collection('drivers').doc(driverId).delete();
    await firestoreDb.collection('users').doc(driverId).delete();

    // Update institution count
    await firestoreDb.collection('institutions').doc(institutionId).update({
      driverCount: Math.max(0, (instData.driverCount || 1) - 1)
    });

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Delete Passenger ──────────────────────────────
const deleteInstitutionPassenger = async (req, res) => {
  try {
    const { institutionId, passengerId } = req.params;
    const adminUid = req.user?.uid;

    // Verify institution and admin permission
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const instData = instDoc.data();
    if (instData.adminId !== adminUid) {
      return res.status(403).json({ error: 'You do not have permission to manage this institution' });
    }

    // Delete from auth
    await firebaseAuth.deleteUser(passengerId);

    // Delete from institution subcollection
    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('passengers')
      .doc(passengerId)
      .delete();

    // Delete from global collections
    await firestoreDb.collection('passengers').doc(passengerId).delete();
    await firestoreDb.collection('users').doc(passengerId).delete();

    // Update institution count
    await firestoreDb.collection('institutions').doc(institutionId).update({
      passengerCount: Math.max(0, (instData.passengerCount || 1) - 1)
    });

    res.json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Add Route to Institution ──────────────────────
const addInstitutionRoute = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { name, startStop, endStop, stops, pickupTime, dropoffTime } = req.body;
    const adminUid = req.user?.uid;

    // Verify institution and admin permission
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const instData = instDoc.data();
    if (instData.adminId !== adminUid) {
      return res.status(403).json({ error: 'You do not have permission to manage this institution' });
    }

    // Create route
    const routeRef = firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('routes')
      .doc();

    await routeRef.set({
      id: routeRef.id,
      name,
      startStop: startStop || null,
      endStop: endStop || null,
      stops: stops || [],
      pickupTime: pickupTime || null,
      dropoffTime: dropoffTime || null,
      institutionId,
      createdAt: new Date().toISOString(),
      createdBy: adminUid,
      status: 'active'
    });

    // Update institution route count
    await firestoreDb.collection('institutions').doc(institutionId).update({
      routeCount: (instData.routeCount || 0) + 1
    });

    res.status(201).json({
      message: 'Route created successfully',
      routeId: routeRef.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Get Institution Routes ────────────────────────
const getInstitutionRoutes = async (req, res) => {
  try {
    const { institutionId } = req.params;

    // Verify institution exists
    const instDoc = await firestoreDb.collection('institutions').doc(institutionId).get();
    if (!instDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const routesSnap = await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('routes')
      .where('isMetadata', '!=', true)
      .get();

    const routes = routesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      institutionId,
      routes,
      count: routes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── Generate Tokens ──────────────────────────────
const generateToken = (type, institutionId, userId) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${type}_${institutionId}_${userId.substring(0, 6)}_${timestamp}_${randomStr}`.toUpperCase();
};

module.exports = {
  getInstitution,
  getInstitutionDrivers,
  getInstitutionPassengers,
  createInstitutionDriver,
  createInstitutionPassenger,
  updateInstitutionDriver,
  updateInstitutionPassenger,
  deleteInstitutionDriver,
  deleteInstitutionPassenger,
  addInstitutionRoute,
  getInstitutionRoutes
};
