# Institution Management System - Complete Guide

## 📋 Overview

This is a complete institution management system that allows:
- **Directors** to approve admin requests and create institutions
- **Admins** to manage their institution's drivers, passengers, and routes
- **Drivers & Passengers** to have institution-specific accounts with tokens

## 🏗️ Architecture

### Database Structure (Firestore)

```
institutions/{institutionId}
├── drivers/ (subcollection)
│   ├── {driverId} (driver document)
│   └── _metadata (collection metadata)
├── passengers/ (subcollection)
│   ├── {passengerId} (passenger document)
│   └── _metadata (collection metadata)
├── routes/ (subcollection)
│   ├── {routeId} (route document)
│   └── _metadata (collection metadata)
└── buses/ (subcollection)
    ├── {busId} (bus document)
    └── _metadata (collection metadata)

admins/{adminId} - Admin profile with adminToken
users/{userId} - User accounts for all roles
adminRequests/{requestId} - Pending admin approval requests
```

### Token System

**Admin Token Format:**
```
ADM_{institutionId}_{uid_prefix}_{timestamp}_{randomStr}
Example: ADM_LAKESIDE_INT_ABC123DE_1697453627_K7X9V2M
```

**Driver Token Format:**
```
DRIVER_{institutionId}_{uid_prefix}_{timestamp}_{randomStr}
```

**Passenger Token Format:**
```
PASSENGER_{institutionId}_{uid_prefix}_{timestamp}_{randomStr}
```

## 🔄 Complete Workflow

### Step 1: Admin Signup Request
Admin signs up through the app with institution name:
```
POST /auth/admin-signup
Body: {
  "email": "admin@lakeside.edu",
  "password": "secure123",
  "name": "Riya Menon",
  "phone": "+919999999999",
  "institutionName": "Lakeside International School"
}
Response: 
- Status: 202 (Pending approval)
- adminRequest created with status: "pending"
```

### Step 2: Director Reviews Request
Director logs in and sees pending admin requests:
```
GET /director/snapshot
Returns all adminRequests with status: "pending"
```

### Step 3: Director Approves Request
```
POST /director/approve-request/{requestId}
Response:
{
  "message": "Admin request approved and institution created",
  "uid": "admin-uid",
  "institutionId": "lakeside-international",
  "adminToken": "ADM_LAKESIDE_INTERNATIONAL_ABC123DE_..."
}
```

**What happens automatically:**
- ✅ Admin role granted via custom claims
- ✅ Institution document created with subcollections:
  - drivers/
  - passengers/
  - routes/
  - buses/
- ✅ Admin profile updated with adminToken
- ✅ Request status changed to "approved"

### Step 4: Admin Creates Drivers
```
POST /institution/institution/{institutionId}/drivers
Headers: Authorization: Bearer {adminToken}
Body: {
  "name": "Rajesh Kumar",
  "email": "driver1@lakeside.edu",
  "password": "secure123",
  "phone": "+919888888888",
  "licenseNo": "KA123456",
  "busNumber": "KA01AB1023",
  "assignedRoute": "North Loop"
}
Response:
{
  "message": "Driver created successfully",
  "uid": "driver-uid",
  "driverToken": "DRIVER_LAKESIDE_INTERNATIONAL_DRV123_...",
  "driver": {
    "uid": "driver-uid",
    "name": "Rajesh Kumar",
    ...
  }
}
```

**What happens:**
- ✅ Firebase Auth account created for driver
- ✅ Document in `institutions/{institutionId}/drivers/{driverId}`
- ✅ Document in global `drivers/{driverId}` (for backward compatibility)
- ✅ User profile updated with institution info
- ✅ Driver token generated and returned

### Step 5: Admin Creates Passengers
```
POST /institution/institution/{institutionId}/passengers
Headers: Authorization: Bearer {adminToken}
Body: {
  "name": "Anya Rao",
  "email": "passenger1@lakeside.edu",
  "password": "secure123",
  "phone": "+919777777777",
  "parentPhone": "+919111111111",
  "busNumber": "KA01AB1023",
  "pickupStop": "Indiranagar Gate 2",
  "dropoffStop": "Lakeside Campus"
}
Response:
{
  "message": "Passenger created successfully",
  "uid": "passenger-uid",
  "burgId": "BURG-123456",
  "passengerToken": "PASSENGER_LAKESIDE_INTERNATIONAL_PSG123_..."
}
```

**What happens:**
- ✅ Firebase Auth account created for passenger
- ✅ BURG ID generated (BURG-XXXXXX)
- ✅ Document in `institutions/{institutionId}/passengers/{passengerId}`
- ✅ Document in global `passengers/{passengerId}`
- ✅ User profile updated with institution info
- ✅ Passenger token generated and returned

### Step 6: Admin Manages Drivers/Passengers
```
// Get all drivers
GET /institution/institution/{institutionId}/drivers

// Update driver
PUT /institution/institution/{institutionId}/drivers/{driverId}
Body: { "busNumber": "KA02CD8841" }

// Delete driver
DELETE /institution/institution/{institutionId}/drivers/{driverId}

// Same for passengers
GET /institution/institution/{institutionId}/passengers
PUT /institution/institution/{institutionId}/passengers/{passengerId}
DELETE /institution/institution/{institutionId}/passengers/{passengerId}
```

## 🎨 React Components

### 1. InstitutionsList.jsx
```jsx
import InstitutionsList from './admin/InstitutionsList';

// Usage:
<InstitutionsList />
```
**Features:**
- Lists all institutions admin can access
- Search functionality
- Shows stats (drivers, passengers, routes, buses)
- Click to view institution details

### 2. InstitutionDetail.jsx
```jsx
import InstitutionDetail from './admin/InstitutionDetail';

// Usage with routing:
<Route path="/admin/institution/:institutionId" element={<InstitutionDetail />} />
```
**Features:**
- 4 tabs: Overview, Drivers, Passengers, Routes
- Create new drivers with form
- Create new passengers with form
- Create new routes with form
- Edit driver/passenger details
- Delete driver/passenger
- Display institution statistics

**Embedded Forms:**
- `<DriverForm />` - Create driver with license number, bus assignment
- `<PassengerForm />` - Create passenger with parent phone, pickup/dropoff stops
- `<RouteForm />` - Create route with stops and timing

## 🔌 API Endpoints

### Institution Management
```
GET    /institution/institution/:institutionId
```

### Driver Management
```
GET    /institution/institution/:institutionId/drivers
POST   /institution/institution/:institutionId/drivers
PUT    /institution/institution/:institutionId/drivers/:driverId
DELETE /institution/institution/:institutionId/drivers/:driverId
```

### Passenger Management
```
GET    /institution/institution/:institutionId/passengers
POST   /institution/institution/:institutionId/passengers
PUT    /institution/institution/:institutionId/passengers/:passengerId
DELETE /institution/institution/:institutionId/passengers/:passengerId
```

### Route Management
```
GET    /institution/institution/:institutionId/routes
POST   /institution/institution/:institutionId/routes
```

## 🔒 Security & Authorization

### Middleware Checks
- `adminOnly` middleware verifies admin role from JWT
- Institution ownership verified on each request
- Admin can only manage their own institution

### Firestore Rules
```javascript
// Admin can read/write their institution and subcollections
match /institutions/{institutionId} {
  allow read, write: if request.auth.uid == resource.data.adminId;
  match /{document=**} {
    allow read, write: if request.auth.uid == get(/databases/$(database)/documents/institutions/$(institutionId)).data.adminId;
  }
}
```

## 📊 Database Operations

### Creating Institution (Auto on Admin Approval)
```javascript
// In directorController.js - approveAdminRequest()
await firestoreDb.collection('institutions').doc(institutionId).set({
  id: institutionId,
  name: institutionName,
  adminId: uid,
  adminName, adminEmail, adminPhone,
  driverCount: 0,
  passengerCount: 0,
  // ... other fields
});

// Create subcollection metadata
await firestoreDb
  .collection('institutions')
  .doc(institutionId)
  .collection('drivers')
  .doc('_metadata')
  .set({ totalCount: 0, lastUpdated: new Date() });
```

### Adding Driver to Institution
```javascript
// In institutionController.js - createInstitutionDriver()
// 1. Create in institution subcollection
await firestoreDb
  .collection('institutions')
  .doc(institutionId)
  .collection('drivers')
  .doc(driverId)
  .set({ ... });

// 2. Also save to global drivers collection
await firestoreDb.collection('drivers').doc(driverId).set({ ... });

// 3. Update institution driver count
await firestoreDb
  .collection('institutions')
  .doc(institutionId)
  .update({ driverCount: increment(1) });
```

## 🚀 Integration with Existing System

### Global Collections (Backward Compatible)
- Drivers are saved in both `drivers/{driverId}` and `institutions/{institutionId}/drivers/{driverId}`
- Passengers are saved in both `passengers/{passengerId}` and `institutions/{institutionId}/passengers/{passengerId}`
- This allows existing code to continue working

### Admin Context Setup
```jsx
// In your AdminAuthContext.jsx or similar
export const useAdminAuth = () => {
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('adminToken') || '';
  });

  const [adminProfile, setAdminProfile] = useState(() => {
    const stored = localStorage.getItem('adminProfile');
    return stored ? JSON.parse(stored) : null;
  });

  return { adminToken, adminProfile };
};
```

## 📝 Usage Examples

### Frontend: Display Institution List
```jsx
import { useEffect, useState } from 'react';
import { getInstitution } from '../services/institutionApi';

function MyApp() {
  const [institution, setInstitution] = useState(null);
  const { adminToken } = useAdminAuth();

  useEffect(() => {
    getInstitution('lakeside-international', adminToken)
      .then(inst => setInstitution(inst))
      .catch(err => console.error(err));
  }, []);

  return <div>{institution?.name}</div>;
}
```

### Frontend: Create Driver
```jsx
async function handleCreateDriver(driverData) {
  try {
    const response = await createInstitutionDriver(
      'lakeside-international',
      driverData,
      adminToken
    );
    console.log('Driver created:', response.driver);
    console.log('Driver token:', response.driverToken);
  } catch (error) {
    console.error('Failed to create driver:', error);
  }
}
```

### Backend: Get All Drivers in Institution
```javascript
// GET /institution/institution/lakeside-international/drivers
const drivers = await firestoreDb
  .collection('institutions')
  .doc('lakeside-international')
  .collection('drivers')
  .where('isMetadata', '!=', true)
  .get();
```

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:8000
VITE_INSTITUTION_ADMIN_TOKEN=your_token_here
```

### Server Setup
```javascript
// In server/firebase/index.js
app.use('/institution', auditLogger('institution.request'), 
  require('./routes/institutionRoutes'));
```

## 📈 Future Enhancements

- [ ] Bulk import drivers/passengers from CSV
- [ ] Route optimization and scheduling
- [ ] Real-time location tracking per institution
- [ ] Institution dashboard with analytics
- [ ] Payment management per institution
- [ ] Attendance tracking per institution
- [ ] Emergency alert system per institution
- [ ] Mobile app integration

## ❓ Common Issues & Solutions

### Issue: "Institution not found"
**Solution:** Ensure institutionId matches in Firestore. Check in `/director/snapshot`.

### Issue: "You do not have permission to manage this institution"
**Solution:** Verify admin owns the institution. Check adminId matches in request.

### Issue: Drivers not appearing in institution
**Solution:** Check driver was created in the correct subcollection. Verify query excludes _metadata doc.

### Issue: Token not being returned
**Solution:** Ensure adminToken is being generated in directorController.js approveAdminRequest().

## 📞 Support

For issues or questions, check:
1. Firestore rules are correctly configured
2. JWT custom claims include institutionId
3. Admin middleware is allowing the request
4. Institution document exists in Firestore
