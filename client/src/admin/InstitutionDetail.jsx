import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { getRidesafeApiUrl } from '../utils/apiUrl';
import '../styles/InstitutionDetail.css';

const InstitutionDetail = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { adminToken, adminUid } = useAdminAuth();

  const [institution, setInstitution] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);

  useEffect(() => {
    fetchInstitutionData();
  }, [institutionId, adminToken]);

  const fetchInstitutionData = async () => {
    try {
      setLoading(true);
      const [instRes, driversRes, passengersRes, routesRes] = await Promise.all([
        fetch(getRidesafeApiUrl(`/institution/institution/${institutionId}`), {
          headers: { Authorization: `Bearer ${adminToken}` }
        }),
        fetch(getRidesafeApiUrl(`/institution/institution/${institutionId}/drivers`), {
          headers: { Authorization: `Bearer ${adminToken}` }
        }),
        fetch(getRidesafeApiUrl(`/institution/institution/${institutionId}/passengers`), {
          headers: { Authorization: `Bearer ${adminToken}` }
        }),
        fetch(getRidesafeApiUrl(`/institution/institution/${institutionId}/routes`), {
          headers: { Authorization: `Bearer ${adminToken}` }
        })
      ]);

      if (instRes.ok) {
        setInstitution(await instRes.json());
      }

      if (driversRes.ok) {
        const data = await driversRes.json();
        setDrivers(data.drivers || []);
      }

      if (passengersRes.ok) {
        const data = await passengersRes.json();
        setPassengers(data.passengers || []);
      }

      if (routesRes.ok) {
        const data = await routesRes.json();
        setRoutes(data.routes || []);
      }
    } catch (error) {
      showToast('Failed to load institution data', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDriver = async (driverData) => {
    try {
      const response = await fetch(
        getRidesafeApiUrl(`/institution/institution/${institutionId}/drivers`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(driverData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const newDriver = await response.json();
      setDrivers([...drivers, newDriver.driver]);
      setShowDriverForm(false);
      showToast('Driver created successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleCreatePassenger = async (passengerData) => {
    try {
      const response = await fetch(
        getRidesafeApiUrl(`/institution/institution/${institutionId}/passengers`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(passengerData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const newPassenger = await response.json();
      setPassengers([...passengers, newPassenger.passenger]);
      setShowPassengerForm(false);
      showToast('Passenger created successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleCreateRoute = async (routeData) => {
    try {
      const response = await fetch(
        getRidesafeApiUrl(`/institution/institution/${institutionId}/routes`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(routeData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setShowRouteForm(false);
      showToast('Route created successfully', 'success');
      fetchInstitutionData();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      const response = await fetch(
        getRidesafeApiUrl(`/institution/institution/${institutionId}/drivers/${driverId}`),
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete driver');
      }

      setDrivers(drivers.filter(d => d.uid !== driverId));
      showToast('Driver deleted successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleDeletePassenger = async (passengerId) => {
    if (!window.confirm('Are you sure you want to delete this passenger?')) return;

    try {
      const response = await fetch(
        getRidesafeApiUrl(`/institution/institution/${institutionId}/passengers/${passengerId}`),
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete passenger');
      }

      setPassengers(passengers.filter(p => p.uid !== passengerId));
      showToast('Passenger deleted successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  if (loading) {
    return <div className="institution-detail-loading">Loading institution...</div>;
  }

  if (!institution) {
    return <div className="institution-detail-error">Institution not found</div>;
  }

  return (
    <div className="institution-detail-container">
      <div className="institution-detail-header">
        <button onClick={() => navigate('/admin/institutions')} className="back-btn">
          ← Back to Institutions
        </button>
        <h1>{institution.name}</h1>
        <div className="institution-stats">
          <div className="stat">
            <span className="stat-label">Drivers</span>
            <span className="stat-value">{drivers.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Passengers</span>
            <span className="stat-value">{passengers.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Routes</span>
            <span className="stat-value">{routes.length}</span>
          </div>
        </div>
      </div>

      <div className="institution-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          Drivers ({drivers.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'passengers' ? 'active' : ''}`}
          onClick={() => setActiveTab('passengers')}
        >
          Passengers ({passengers.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          Routes ({routes.length})
        </button>
      </div>

      <div className="institution-content">
        {activeTab === 'overview' && (
          <div className="tab-content overview">
            <h2>Institution Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Institution Name</label>
                <p>{institution.name}</p>
              </div>
              <div className="info-item">
                <label>Admin Name</label>
                <p>{institution.adminName}</p>
              </div>
              <div className="info-item">
                <label>Admin Email</label>
                <p>{institution.adminEmail}</p>
              </div>
              <div className="info-item">
                <label>Admin Phone</label>
                <p>{institution.adminPhone}</p>
              </div>
              <div className="info-item">
                <label>Status</label>
                <p>{institution.status || 'Active'}</p>
              </div>
              <div className="info-item">
                <label>Created</label>
                <p>{new Date(institution.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="tab-content drivers">
            <div className="section-header">
              <h2>Drivers</h2>
              <button className="add-btn" onClick={() => setShowDriverForm(!showDriverForm)}>
                {showDriverForm ? 'Cancel' : '+ Add Driver'}
              </button>
            </div>

            {showDriverForm && (
              <DriverForm
                onSubmit={handleCreateDriver}
                onCancel={() => setShowDriverForm(false)}
              />
            )}

            <div className="drivers-list">
              {drivers.length === 0 ? (
                <p className="empty-message">No drivers yet</p>
              ) : (
                drivers.map(driver => (
                  <div key={driver.uid} className="driver-card">
                    <div className="driver-info">
                      <h3>{driver.name}</h3>
                      <p>Email: {driver.email}</p>
                      <p>Phone: {driver.phone}</p>
                      <p>License: {driver.licenseNo}</p>
                      {driver.busNumber && <p>Bus: {driver.busNumber}</p>}
                      {driver.assignedRoute && <p>Route: {driver.assignedRoute}</p>}
                    </div>
                    <div className="driver-actions">
                      <button className="delete-btn" onClick={() => handleDeleteDriver(driver.uid)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'passengers' && (
          <div className="tab-content passengers">
            <div className="section-header">
              <h2>Passengers</h2>
              <button className="add-btn" onClick={() => setShowPassengerForm(!showPassengerForm)}>
                {showPassengerForm ? 'Cancel' : '+ Add Passenger'}
              </button>
            </div>

            {showPassengerForm && (
              <PassengerForm
                onSubmit={handleCreatePassenger}
                onCancel={() => setShowPassengerForm(false)}
              />
            )}

            <div className="passengers-list">
              {passengers.length === 0 ? (
                <p className="empty-message">No passengers yet</p>
              ) : (
                passengers.map(passenger => (
                  <div key={passenger.uid} className="passenger-card">
                    <div className="passenger-info">
                      <h3>{passenger.name}</h3>
                      <p>BURG ID: {passenger.burgId}</p>
                      <p>Email: {passenger.email}</p>
                      <p>Phone: {passenger.phone}</p>
                      {passenger.parentPhone && <p>Parent: {passenger.parentPhone}</p>}
                      {passenger.busNumber && <p>Bus: {passenger.busNumber}</p>}
                      {passenger.pickupStop && <p>Pickup: {passenger.pickupStop}</p>}
                      {passenger.dropoffStop && <p>Dropoff: {passenger.dropoffStop}</p>}
                    </div>
                    <div className="passenger-actions">
                      <button className="delete-btn" onClick={() => handleDeletePassenger(passenger.uid)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="tab-content routes">
            <div className="section-header">
              <h2>Routes</h2>
              <button className="add-btn" onClick={() => setShowRouteForm(!showRouteForm)}>
                {showRouteForm ? 'Cancel' : '+ Add Route'}
              </button>
            </div>

            {showRouteForm && (
              <RouteForm
                onSubmit={handleCreateRoute}
                onCancel={() => setShowRouteForm(false)}
              />
            )}

            <div className="routes-list">
              {routes.length === 0 ? (
                <p className="empty-message">No routes yet</p>
              ) : (
                routes.map(route => (
                  <div key={route.id} className="route-card">
                    <h3>{route.name}</h3>
                    <p>Start: {route.startStop}</p>
                    <p>End: {route.endStop}</p>
                    {route.pickupTime && <p>Pickup Time: {route.pickupTime}</p>}
                    {route.dropoffTime && <p>Dropoff Time: {route.dropoffTime}</p>}
                    {route.stops && <p>Stops: {route.stops.length}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DriverForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNo: '',
    busNumber: '',
    routeId: '',
    assignedRoute: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      licenseNo: '',
      busNumber: '',
      routeId: '',
      assignedRoute: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="driver-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Driver Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone *"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="licenseNo"
          placeholder="License Number *"
          value={formData.licenseNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="busNumber"
          placeholder="Bus Number"
          value={formData.busNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="assignedRoute"
          placeholder="Assigned Route"
          value={formData.assignedRoute}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">Create Driver</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const PassengerForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    parentPhone: '',
    busNumber: '',
    pickupStop: '',
    dropoffStop: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      parentPhone: '',
      busNumber: '',
      pickupStop: '',
      dropoffStop: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="passenger-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Passenger Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone *"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="tel"
          name="parentPhone"
          placeholder="Parent Phone"
          value={formData.parentPhone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="busNumber"
          placeholder="Bus Number"
          value={formData.busNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="pickupStop"
          placeholder="Pickup Stop"
          value={formData.pickupStop}
          onChange={handleChange}
        />
        <input
          type="text"
          name="dropoffStop"
          placeholder="Dropoff Stop"
          value={formData.dropoffStop}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">Create Passenger</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const RouteForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    startStop: '',
    endStop: '',
    pickupTime: '',
    dropoffTime: '',
    stops: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      stops: formData.stops ? formData.stops.split(',').map(s => s.trim()) : []
    };
    onSubmit(submitData);
    setFormData({
      name: '',
      startStop: '',
      endStop: '',
      pickupTime: '',
      dropoffTime: '',
      stops: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="route-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Route Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="startStop"
          placeholder="Start Stop *"
          value={formData.startStop}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="endStop"
          placeholder="End Stop *"
          value={formData.endStop}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="time"
          name="pickupTime"
          placeholder="Pickup Time"
          value={formData.pickupTime}
          onChange={handleChange}
        />
        <input
          type="time"
          name="dropoffTime"
          placeholder="Dropoff Time"
          value={formData.dropoffTime}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="stops"
          placeholder="Stops (comma separated)"
          value={formData.stops}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">Create Route</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default InstitutionDetail;
