// controllers/directorController.js

const { firebaseAuth, firestoreDb, realtimeDb } = require('../config/firebase');

const COLLECTIONS = [
  'users',
  'admins',
  'adminRequests',
  'drivers',
  'passengers',
  'buses',
  'routes',
  'trips',
  'institutions'
];

const readCollection = async (collectionName) => {
  const snap = await firestoreDb.collection(collectionName).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getDirectorSnapshot = async (req, res) => {
  try {
    const collectionPairs = await Promise.all(
      COLLECTIONS.map(async (collectionName) => [collectionName, await readCollection(collectionName)])
    );

    const firestore = collectionPairs.reduce((acc, [collectionName, docs]) => {
      acc[collectionName] = docs;
      return acc;
    }, {});

    const realtimeSnap = await realtimeDb.ref('/').once('value');

    res.json({
      firestore,
      realtime: realtimeSnap.val() || {},
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveAdminRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const requestRef = firestoreDb.collection('adminRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ error: 'Admin request not found' });
    }

    const requestData = requestDoc.data() || {};

    if (requestData.status === 'approved') {
      return res.status(409).json({ error: 'Admin request already approved' });
    }

    const uid = requestData.uid || requestId;
    if (!uid) {
      return res.status(400).json({ error: 'Admin request is missing a user id.' });
    }

    await firebaseAuth.setCustomUserClaims(uid, { role: 'admin' });

    const approvedAt = new Date().toISOString();
    const approvedBy = req.user?.uid || null;

    // Generate institution ID
    const institutionId = requestData.institutionId || String(requestData.institutionName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const institutionName = requestData.institutionName || 'Unnamed Institution';

    // Merge institution information into the user's profile
    await firestoreDb.collection('users').doc(uid).set({
      role: 'admin',
      institutionId,
      institutionName
    }, { merge: true });

    await firestoreDb.collection('admins').doc(uid).set(
      {
        uid,
        name: requestData.name || '',
        email: requestData.email || '',
        phone: requestData.phone || '',
        role: 'admin',
        institutionId,
        institutionName,
        adminToken: generateAdminToken(uid, institutionId),
        createdAt: requestData.createdAt || approvedAt,
        approvedAt,
        approvedBy
      },
      { merge: true }
    );

    // CREATE INSTITUTION WITH SUBCOLLECTIONS STRUCTURE
    await firestoreDb.collection('institutions').doc(institutionId).set({
      id: institutionId,
      name: institutionName,
      adminId: uid,
      adminName: requestData.name || '',
      adminEmail: requestData.email || '',
      adminPhone: requestData.phone || '',
      approvedAt,
      approvedBy,
      createdAt: requestData.createdAt || approvedAt,
      driverCount: 0,
      passengerCount: 0,
      busCount: 0,
      routeCount: 0,
      status: 'active'
    });

    // Create empty subcollections by adding initial metadata
    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('drivers')
      .doc('_metadata')
      .set({
        totalCount: 0,
        lastUpdated: new Date().toISOString()
      });

    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('passengers')
      .doc('_metadata')
      .set({
        totalCount: 0,
        lastUpdated: new Date().toISOString()
      });

    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('routes')
      .doc('_metadata')
      .set({
        totalCount: 0,
        lastUpdated: new Date().toISOString()
      });

    await firestoreDb
      .collection('institutions')
      .doc(institutionId)
      .collection('buses')
      .doc('_metadata')
      .set({
        totalCount: 0,
        lastUpdated: new Date().toISOString()
      });

    await requestRef.set(
      {
        status: 'approved',
        institutionId,
        approvedAt,
        approvedBy
      },
      { merge: true }
    );

    res.json({
      message: 'Admin request approved and institution created',
      uid,
      institutionId,
      adminToken: requestData.adminToken || generateAdminToken(uid, institutionId)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate unique admin token for institution
const generateAdminToken = (uid, institutionId) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `ADM_${institutionId}_${uid.substring(0, 8)}_${timestamp}_${randomStr}`.toUpperCase();
};

module.exports = { getDirectorSnapshot, approveAdminRequest };
