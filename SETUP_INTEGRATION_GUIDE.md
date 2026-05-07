# Institution Management System - Setup & Integration Guide

## ✅ Files Created

### Backend Files
1. **controllers/institutionController.js** - All CRUD operations for institutions
   - getInstitution()
   - getInstitutionDrivers()
   - getInstitutionPassengers()
   - createInstitutionDriver()
   - createInstitutionPassenger()
   - updateInstitutionDriver()
   - updateInstitutionPassenger()
   - deleteInstitutionDriver()
   - deleteInstitutionPassenger()
   - addInstitutionRoute()
   - getInstitutionRoutes()

2. **routes/institutionRoutes.js** - Express routes for institution API
   - All endpoints configured with adminOnly middleware

3. **Updated controllers/directorController.js**
   - Enhanced approveAdminRequest() to create institution structure
   - Added generateAdminToken() function
   - Creates subcollections: drivers, passengers, routes, buses

4. **Updated server/firebase/index.js**
   - Added institution routes: `app.use('/institution', ...)`

### Frontend Files
1. **admin/InstitutionsList.jsx** - List all institutions admin has access to
   - Search functionality
   - Statistics display
   - Click to view details

2. **admin/InstitutionDetail.jsx** - Main institution management page
   - 4 tabs: Overview, Drivers, Passengers, Routes
   - DriverForm component
   - PassengerForm component
   - RouteForm component
   - CRUD operations for all entities

3. **styles/InstitutionsList.css** - Styling for list view
4. **styles/InstitutionDetail.css** - Styling for detail view

5. **services/institutionApi.js** - API client functions
   - All fetch operations for institution endpoints
   - Token management
   - Batch operations support

## 🔧 Integration Steps

### Step 1: Update Firestore Security Rules
Add this to your `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Institutions and subcollections
    match /institutions/{institutionId} {
      allow read, write: if request.auth.uid == resource.data.adminId;
      match /{collection}/{document=**} {
        allow read, write: if request.auth.uid == get(/databases/$(database)/documents/institutions/$(institutionId)).data.adminId;
      }
    }

    // Keep existing rules for other collections...
  }
}
```

### Step 2: Update React Router Configuration
Add these routes to your router setup:
```jsx
// In your route configuration
import InstitutionsList from './admin/InstitutionsList';
import InstitutionDetail from './admin/InstitutionDetail';

<Route path="/admin/institutions" element={<InstitutionsList />} />
<Route path="/admin/institution/:institutionId" element={<InstitutionDetail />} />
```

### Step 3: Add Navigation Links
Update your admin navigation:
```jsx
<nav>
  <Link to="/admin/institutions">My Institutions</Link>
  <Link to="/admin/dashboard">Dashboard</Link>
  {/* other links */}
</nav>
```

### Step 4: Update AdminAuthContext
Ensure your auth context stores and provides:
```jsx
{
  adminToken,        // JWT token for API requests
  adminProfile: {
    institutionId,   // Current institution ID
    institutionName, // Current institution name
    adminUid         // Admin's UID
  }
}
```

### Step 5: Environment Variables
Add to your `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
```

## 🔐 Authentication Flow

### For Existing Admin
1. Admin logs in → JWT token issued
2. Custom claim `role: 'admin'` is present
3. Custom claim `institutionId: 'xxx'` is present
4. Frontend stores token in localStorage
5. All API requests include Authorization header

### For New Admin Signup
1. Admin fills signup form with institution name
2. Admin signup endpoint creates:
   - Firebase Auth user
   - User profile with role: 'pendingAdmin'
   - AdminRequest document
3. Director reviews and approves
4. Approval endpoint creates:
   - Admin role assigned
   - Institution document created
   - Subcollections initialized
   - Admin token generated and returned

## 🚀 Testing Checklist

### Create Institution
- [ ] Director logs in
- [ ] Sees pending admin requests
- [ ] Clicks approve
- [ ] Institution document created in Firestore
- [ ] Subcollections created (drivers, passengers, routes, buses)

### Admin Access
- [ ] Admin logs in with their credentials
- [ ] Sees "My Institutions" page
- [ ] Institution card displays all stats correctly
- [ ] Clicks to view institution details

### Create Driver
- [ ] Admin clicks "Add Driver"
- [ ] Form appears with all fields
- [ ] Submits driver creation
- [ ] Driver appears in drivers list
- [ ] Driver token is generated (shown in response)
- [ ] Document appears in both `drivers/` and `institutions/{id}/drivers/`

### Create Passenger
- [ ] Admin clicks "Add Passenger"
- [ ] Form appears with all fields
- [ ] Submits passenger creation
- [ ] Passenger appears in passengers list
- [ ] BURG ID is generated and displayed
- [ ] Document appears in both `passengers/` and `institutions/{id}/passengers/`

### Create Route
- [ ] Admin clicks "Add Route"
- [ ] Form appears with all fields
- [ ] Submits route creation
- [ ] Route appears in routes list

### Update Operations
- [ ] Click edit on driver/passenger
- [ ] Update form opens
- [ ] Changes save successfully
- [ ] Updates reflect in list immediately

### Delete Operations
- [ ] Click delete on driver/passenger
- [ ] Confirmation dialog appears
- [ ] Item deleted from Firestore
- [ ] List updates immediately

## 📊 Database Verification

To verify your setup, check in Firestore:

```
institutions/
├── lakeside-international/
│   ├── id: "lakeside-international"
│   ├── name: "Lakeside International School"
│   ├── adminId: "admin-uid"
│   ├── driverCount: 0
│   ├── passengerCount: 0
│   ├── status: "active"
│   ├── drivers/ (collection)
│   │   └── _metadata
│   ├── passengers/ (collection)
│   │   └── _metadata
│   ├── routes/ (collection)
│   │   └── _metadata
│   └── buses/ (collection)
│       └── _metadata
```

## 🔄 API Response Examples

### Get Institution
```json
{
  "id": "lakeside-international",
  "name": "Lakeside International School",
  "adminId": "admin-uid",
  "adminName": "Riya Menon",
  "adminEmail": "admin@lakeside.edu",
  "driverCount": 2,
  "passengerCount": 5,
  "routeCount": 3,
  "busCount": 2,
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Create Driver Response
```json
{
  "message": "Driver created successfully",
  "uid": "driver-uid",
  "driverToken": "DRIVER_LAKESIDE_INTERNATIONAL_DRV123_1697453627_K7X9V2M",
  "driver": {
    "uid": "driver-uid",
    "name": "Rajesh Kumar",
    "email": "driver1@lakeside.edu",
    "phone": "+919888888888",
    "licenseNo": "KA123456",
    "institutionId": "lakeside-international"
  }
}
```

### Create Passenger Response
```json
{
  "message": "Passenger created successfully",
  "uid": "passenger-uid",
  "burgId": "BURG-123456",
  "passengerToken": "PASSENGER_LAKESIDE_INTERNATIONAL_PSG123_1697453627_K7X9V2M",
  "passenger": {
    "uid": "passenger-uid",
    "name": "Anya Rao",
    "email": "passenger1@lakeside.edu",
    "burgId": "BURG-123456",
    "institutionId": "lakeside-international"
  }
}
```

## ⚠️ Important Notes

1. **Backward Compatibility**: Drivers and passengers are saved in both:
   - Global `drivers/` and `passengers/` collections
   - Institution-specific subcollections
   - This maintains compatibility with existing code

2. **Token Management**: Tokens are returned on creation and should be:
   - Displayed to admin for record keeping
   - Provided to driver/passenger for login
   - Stored securely in app storage

3. **Subcollection Metadata**: Each subcollection has a `_metadata` document
   - This is created on institution approval
   - It's filtered out in list queries with `where('isMetadata', '!=', true)`
   - It tracks total count of items

4. **Admin Permissions**: Admin can only manage their own institution
   - All endpoints verify `adminId == request.auth.uid`
   - Firestore rules enforce this at database level

5. **Institution ID Generation**: Created automatically from name
   - Format: lowercase, hyphens instead of spaces
   - Example: "Lakeside International" → "lakeside-international"

## 🐛 Troubleshooting

### Driver/Passenger not appearing in list
```javascript
// Check that documents don't have isMetadata: true
db.collection('institutions')
  .doc(institutionId)
  .collection('drivers')
  .where('isMetadata', '!=', true)
  .get()
```

### Admin can't create driver/passenger
1. Check admin has correct institutionId in JWT
2. Verify admin role is 'admin' (not 'pendingAdmin')
3. Check Firestore rules allow write to subcollections

### Token not being generated
1. Verify generateAdminToken() called in directorController
2. Check token is being returned in approveAdminRequest response
3. Ensure admin stores token from response

## 📱 Next Steps

After integration, consider:
1. Export drivers/passengers to CSV
2. Import bulk drivers/passengers
3. Institution dashboard with analytics
4. Real-time location tracking per institution
5. Route optimization
6. Mobile app integration
7. Payment tracking per institution
8. Emergency SOS system per institution
