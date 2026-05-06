import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminMetricCard from './AdminMetricCard';
import AdminSectionHeader from './AdminSectionHeader';
import { useToast } from '../contexts/ToastContext';
import {
  broadcastAlert,
  createDriver,
  createPassenger,
  fetchAdminSnapshot,
  fetchLiveLocations,
  getAdminProfile,
  getStoredAdminToken,
  notifyDelay,
  setStoredAdminToken
} from '../services/ridesafeAdminApi';

const fallbackInstitutions = [
  {
    id: 'lakeside-international',
    name: 'Lakeside International School',
    city: 'Bangalore East',
    adminName: 'Riya Menon',
    contactEmail: 'transport@lakeside.edu',
    sync: '42 seconds',
    stats: {
      vehicles: 22,
      routes: 14,
      drivers: 28,
      passengers: 912,
      alerts: 2,
      onTime: '96% on time',
    },
    vehicles: [
      {
        id: 'KA01AB1023',
        route: 'North Loop',
        driver: 'R. Kumar',
        status: 'On Route',
        speed: '34 km/h',
        occupancy: '38/45',
        phone: '+919812345670',
        position: { lat: 12.9719, lng: 77.6412 },
      },
      {
        id: 'KA02CD8841',
        route: 'Tech Park Express',
        driver: 'S. Iyer',
        status: 'Boarding',
        speed: '12 km/h',
        occupancy: '42/45',
        phone: '+919812345671',
        position: { lat: 12.9876, lng: 77.6374 },
      },
      {
        id: 'KA04EF9072',
        route: 'Green Gate',
        driver: 'M. Joseph',
        status: 'On Route',
        speed: '29 km/h',
        occupancy: '31/40',
        phone: '+919812345672',
        position: { lat: 12.9584, lng: 77.6599 },
      },
      {
        id: 'KA03GH2210',
        route: 'Lakefront East',
        driver: 'P. Shah',
        status: 'Idle',
        speed: '0 km/h',
        occupancy: '0/40',
        phone: '+919812345673',
        position: { lat: 12.9463, lng: 77.6507 },
      },
    ],
    routes: [
      { name: 'North Loop', vehicles: 4, eta: '07:55 AM', status: 'Running', updated: '2 mins ago' },
      { name: 'Tech Park Express', vehicles: 3, eta: '08:10 AM', status: 'Running', updated: '1 min ago' },
      { name: 'Green Gate', vehicles: 2, eta: '08:25 AM', status: 'Delayed', updated: '4 mins ago' },
      { name: 'Lakefront East', vehicles: 1, eta: '09:00 AM', status: 'Standby', updated: '6 mins ago' },
    ],
    passengers: [
      {
        name: 'Anya Rao',
        grade: 'Grade 6',
        stop: 'Indiranagar Gate 2',
        feeStatus: 'Paid - April',
        guardian: 'Kiran Rao',
        phone: '+919900112233',
        medical: 'Asthma - inhaler in bag',
      },
      {
        name: 'Arjun Das',
        grade: 'Grade 8',
        stop: 'RMZ Junction',
        feeStatus: 'Due - May',
        guardian: 'S. Das',
        phone: '+919900112244',
        medical: 'None',
      },
      {
        name: 'Mira Joseph',
        grade: 'Grade 4',
        stop: 'Old Airport Road',
        feeStatus: 'Paid - April',
        guardian: 'T. Joseph',
        phone: '+919900112255',
        medical: 'Peanut allergy',
      },
    ],
    staff: [
      { name: 'R. Kumar', role: 'Driver', phone: '+919812345670', license: 'Valid to 2027', shift: 'Morning' },
      { name: 'N. Bhat', role: 'Conductor', phone: '+919812345680', license: 'ID verified', shift: 'Morning' },
      { name: 'S. Iyer', role: 'Driver', phone: '+919812345671', license: 'Valid to 2026', shift: 'Morning' },
      { name: 'A. Paul', role: 'Conductor', phone: '+919812345690', license: 'ID verified', shift: 'Midday' },
    ],
    alerts: [
      { title: 'Route deviation - Green Gate', status: 'Open', time: '08:14 AM', channel: 'SMS + WhatsApp' },
      { title: 'SOS pressed - KA04EF9072', status: 'Resolved', time: '07:48 AM', channel: 'Call + SMS' },
    ],
    finance: {
      feesCollected: 'INR 18.6L',
      feesOutstanding: 'INR 2.1L',
      busEmi: 'INR 5.4L',
      busRent: 'INR 1.8L',
      salaries: 'INR 3.2L',
      payoutsDue: 'INR 0.6L',
    },
    medical: [
      { name: 'Anya Rao', note: 'Asthma - keep inhaler ready', contact: '+919900112233' },
      { name: 'Mira Joseph', note: 'Peanut allergy - avoid snacks', contact: '+919900112255' },
    ],
  },
  {
    id: 'northfield-academy',
    name: 'Northfield Academy',
    city: 'Bangalore North',
    adminName: 'Vikram Shah',
    contactEmail: 'fleet@northfield.ac.in',
    sync: '55 seconds',
    stats: {
      vehicles: 15,
      routes: 9,
      drivers: 19,
      passengers: 640,
      alerts: 1,
      onTime: '93% on time',
    },
    vehicles: [
      {
        id: 'KA05JK5511',
        route: 'Ring Road Shuttle',
        driver: 'A. Nair',
        status: 'On Route',
        speed: '31 km/h',
        occupancy: '26/40',
        phone: '+919812345681',
        position: { lat: 13.0351, lng: 77.597 },
      },
      {
        id: 'KA03LM9934',
        route: 'Hebbal Link',
        driver: 'D. Roy',
        status: 'Boarding',
        speed: '8 km/h',
        occupancy: '34/40',
        phone: '+919812345682',
        position: { lat: 13.055, lng: 77.5905 },
      },
      {
        id: 'KA06NP2048',
        route: 'Yelahanka Spur',
        driver: 'C. Patel',
        status: 'On Route',
        speed: '27 km/h',
        occupancy: '30/45',
        phone: '+919812345683',
        position: { lat: 13.0739, lng: 77.5699 },
      },
    ],
    routes: [
      { name: 'Ring Road Shuttle', vehicles: 3, eta: '07:50 AM', status: 'Running', updated: '3 mins ago' },
      { name: 'Hebbal Link', vehicles: 2, eta: '08:05 AM', status: 'Running', updated: '2 mins ago' },
      { name: 'Yelahanka Spur', vehicles: 2, eta: '08:30 AM', status: 'Delayed', updated: '5 mins ago' },
    ],
    passengers: [
      {
        name: 'Sara Khan',
        grade: 'Grade 5',
        stop: 'Esteem Mall',
        feeStatus: 'Paid - April',
        guardian: 'Imran Khan',
        phone: '+919911223344',
        medical: 'None',
      },
      {
        name: 'Rohan Verma',
        grade: 'Grade 7',
        stop: 'Manyata Gate 1',
        feeStatus: 'Due - May',
        guardian: 'Meera Verma',
        phone: '+919911223355',
        medical: 'Diabetes - keep glucose tabs',
      },
      {
        name: 'Neha Raj',
        grade: 'Grade 9',
        stop: 'Sahakar Nagar',
        feeStatus: 'Paid - April',
        guardian: 'K. Raj',
        phone: '+919911223366',
        medical: 'None',
      },
    ],
    staff: [
      { name: 'A. Nair', role: 'Driver', phone: '+919812345681', license: 'Valid to 2028', shift: 'Morning' },
      { name: 'D. Roy', role: 'Driver', phone: '+919812345682', license: 'Valid to 2026', shift: 'Morning' },
      { name: 'S. Dutta', role: 'Conductor', phone: '+919812345692', license: 'ID verified', shift: 'Morning' },
      { name: 'T. Bose', role: 'Conductor', phone: '+919812345693', license: 'ID verified', shift: 'Midday' },
    ],
    alerts: [
      { title: 'Parent query - Hebbal Link', status: 'Open', time: '08:02 AM', channel: 'WhatsApp' },
    ],
    finance: {
      feesCollected: 'INR 12.4L',
      feesOutstanding: 'INR 1.3L',
      busEmi: 'INR 3.9L',
      busRent: 'INR 1.4L',
      salaries: 'INR 2.6L',
      payoutsDue: 'INR 0.4L',
    },
    medical: [
      { name: 'Rohan Verma', note: 'Diabetes - carry glucose tabs', contact: '+919911223355' },
    ],
  },
];

const defaultMapCenter = { lat: 12.9716, lng: 77.5946 };
const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#EDEFF0' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#2A3D53' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#EFF3FA' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#DFE2EF' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#5F84AF' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#BACCEC' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#305CB5' }] },
];
const STALE_MS = 30000;

const formatTime = (value) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

let googleMapsLoader;
const loadGoogleMaps = (apiKey) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps is unavailable on the server.'));
  }
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }
  if (googleMapsLoader) {
    return googleMapsLoader;
  }

  googleMapsLoader = new Promise((resolve, reject) => {
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps.')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Failed to load Google Maps.'));
    document.head.appendChild(script);
  });

  return googleMapsLoader;
};

const statusTone = (status) => {
  if (status === 'On Route' || status === 'Running') return 'border-[#305CB5] bg-[#BACCEC] text-[#1C3A77]';
  if (status === 'Boarding') return 'border-[#87A6DF] bg-[#EBF0F6] text-[#1C3A77]';
  if (status === 'Delayed') return 'border-[#8894C4] bg-[#E5E9F0] text-[#2A3D53]';
  if (status === 'Standby' || status === 'Idle') return 'border-[#C2C9CC] bg-[#EDEFF0] text-[#7B8285]';
  return 'border-[#6371B1] bg-[#DFE2EF] text-[#1C3A77]';
};

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [adminToken, setAdminToken] = useState(() => getStoredAdminToken());
  const [tokenInput, setTokenInput] = useState(() => getStoredAdminToken());
  const [useLiveData, setUseLiveData] = useState(false);
  const [loadState, setLoadState] = useState({ loading: false, error: '' });
  const [adminProfile, setAdminProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    buses: [],
    routes: [],
    drivers: [],
    passengers: [],
    liveLocations: {},
    sosAlerts: [],
    revenue: { totalRevenue: '0.00', totalPayments: 0 }
  });
  const [institutionId, setInstitutionId] = useState(fallbackInstitutions[0].id);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mapStatus, setMapStatus] = useState({ status: 'idle', error: '' });
  const [actionPanel, setActionPanel] = useState('');
  const [actionStatus, setActionStatus] = useState({ loading: false, error: '' });
  const [driverForm, setDriverForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNo: '',
    busId: ''
  });
  const [passengerForm, setPassengerForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    busId: '',
    stopId: '',
    parentPhone: ''
  });
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    targetRole: 'all'
  });
  const [delayForm, setDelayForm] = useState({
    busId: '',
    delayMinutes: '',
    reason: ''
  });
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const didFitRef = useRef(false);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const refreshDashboard = useCallback(async (tokenOverride) => {
    const token = tokenOverride || adminToken;
    if (!token) {
      setUseLiveData(false);
      setLoadState({ loading: false, error: 'Admin token required to load live data.' });
      return;
    }

    setLoadState({ loading: true, error: '' });

    try {
      const [profileResult, snapshotResult] = await Promise.allSettled([
        getAdminProfile(token),
        fetchAdminSnapshot(token)
      ]);

      if (snapshotResult.status === 'rejected') {
        throw snapshotResult.reason;
      }

      setDashboardData(snapshotResult.value);
      if (profileResult.status === 'fulfilled') {
        setAdminProfile(profileResult.value.user || null);
      }
      setLastUpdate(new Date());
      setUseLiveData(true);
    } catch (error) {
      setUseLiveData(false);
      setLoadState({ loading: false, error: error?.message || 'Failed to load admin data.' });
      return;
    }

    setLoadState((prev) => ({ ...prev, loading: false }));
  }, [adminToken]);

  useEffect(() => {
    if (!adminToken) {
      setUseLiveData(false);
      return;
    }
    refreshDashboard();
  }, [adminToken, refreshDashboard]);

  useEffect(() => {
    if (!adminToken || !useLiveData) {
      return;
    }

    let isMounted = true;

    const updateLocations = async () => {
      try {
        const data = await fetchLiveLocations(adminToken);
        if (!isMounted) return;
        setDashboardData((prev) => ({
          ...prev,
          liveLocations: data.locations || {}
        }));
        setLastUpdate(new Date());
      } catch (error) {
        if (!isMounted) return;
        setLoadState((prev) => ({
          ...prev,
          error: prev.error || error?.message || 'Failed to refresh live locations.'
        }));
      }
    };

    updateLocations();
    const intervalId = setInterval(updateLocations, 6000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [adminToken, useLiveData]);

  const { buses, routes, drivers, passengers, liveLocations, sosAlerts, revenue } = dashboardData;

  const derivedInstitution = useMemo(() => {
    const now = Date.now();
    const routesById = new Map(routes.map((route) => [route.id, route]));
    const driversById = new Map(drivers.map((driver) => [driver.uid || driver.id, driver]));

    const vehicles = buses.map((bus) => {
      const route = routesById.get(bus.routeId);
      const driver = driversById.get(bus.driverId);
      const location = liveLocations?.[bus.id];
      const timestamp = location?.timestamp || 0;
      const isStale = !location || now - timestamp > STALE_MS;
      const speedValue = Number.isFinite(location?.speed) ? Math.round(location.speed) : 0;

      return {
        id: bus.busNumber || bus.id,
        busId: bus.id,
        route: route?.name || 'Unassigned route',
        driver: driver?.name || 'Unassigned',
        status: !location ? 'Idle' : isStale ? 'Idle' : 'On Route',
        speed: `${speedValue} km/h`,
        occupancy: bus.capacity ? `0/${bus.capacity}` : '0/0',
        phone: driver?.phone || '',
        position: location ? { lat: location.lat, lng: location.lng } : null,
      };
    });

    const routeCards = routes.map((route) => {
      const assignedBuses = buses.filter((bus) => bus.routeId === route.id);
      const online = assignedBuses.some((bus) => {
        const location = liveLocations?.[bus.id];
        if (!location) return false;
        return now - (location.timestamp || 0) <= STALE_MS;
      });

      return {
        name: route.name || 'Unnamed route',
        vehicles: assignedBuses.length,
        eta: online ? 'Live' : 'Offline',
        status: online ? 'Running' : 'Standby',
        updated: formatTime(route.updatedAt || route.createdAt || now)
      };
    });

    const passengerCards = passengers.map((passenger) => {
      const bus = buses.find((item) => item.id === passenger.busId);
      const route = bus ? routesById.get(bus.routeId) : null;
      const stop = route?.stops?.find?.((item) => item.id === passenger.stopId || item.name === passenger.stopId);

      return {
        name: passenger.name || 'Passenger',
        grade: passenger.grade || 'Grade N/A',
        stop: stop?.name || passenger.stopId || 'Stop not assigned',
        feeStatus: passenger.feeStatus || 'Status not tracked',
        guardian: passenger.parentName || 'Parent/Guardian',
        phone: passenger.parentPhone || passenger.phone || 'N/A',
        medical: passenger.medical || 'None'
      };
    });

    const staffCards = drivers.map((driver) => ({
      name: driver.name || 'Driver',
      role: 'Driver',
      phone: driver.phone || 'N/A',
      license: driver.licenseNo ? `License ${driver.licenseNo}` : 'License on file',
      shift: driver.shift || 'On duty'
    }));

    const alertCards = sosAlerts.map((alert) => ({
      title: alert.message ? `SOS - ${alert.message}` : `SOS alert - Bus ${alert.busId || 'Unknown'}`,
      status: alert.status === 'active' ? 'Open' : 'Resolved',
      time: formatTime(alert.createdAt),
      channel: 'FCM + SMS'
    }));

    const onlineCount = vehicles.filter((vehicle) => vehicle.status === 'On Route').length;

    return {
      id: 'burg-ridesafe',
      name: 'BURG RideSafe',
      city: 'Fleet Operations',
      adminName: adminProfile?.name || 'Admin operator',
      contactEmail: adminProfile?.email || 'admin@burg.io',
      stats: {
        vehicles: buses.length,
        routes: routes.length,
        drivers: drivers.length,
        passengers: passengers.length,
        alerts: sosAlerts.length,
        onTime: `${onlineCount}/${buses.length || 0} buses live`
      },
      vehicles,
      routes: routeCards,
      passengers: passengerCards,
      staff: staffCards,
      alerts: alertCards,
      finance: {
        feesCollected: revenue?.totalRevenue ? `INR ${revenue.totalRevenue}` : 'INR 0.00',
        feesOutstanding: 'Not configured',
        busEmi: 'Not configured',
        busRent: 'Not configured',
        salaries: 'Not configured',
        payoutsDue: 'Not configured'
      },
      medical: []
    };
  }, [adminProfile, buses, drivers, liveLocations, passengers, revenue, routes, sosAlerts]);

  const institutions = useMemo(() => (
    useLiveData ? [derivedInstitution] : fallbackInstitutions
  ), [derivedInstitution, useLiveData]);

  const institution = useMemo(() => {
    return institutions.find((item) => item.id === institutionId) || institutions[0];
  }, [institutionId, institutions]);

  const liveVehicles = useMemo(() => institution?.vehicles || [], [institution]);
  const onlineVehicleCount = useMemo(
    () => liveVehicles.filter((vehicle) => vehicle.status === 'On Route').length,
    [liveVehicles]
  );
  const onlineLabel = liveVehicles.length
    ? `${onlineVehicleCount} of ${liveVehicles.length} vehicles online`
    : 'No vehicles online';

  const stopOptions = useMemo(() => {
    if (!passengerForm.busId) return [];
    const bus = buses.find((item) => item.id === passengerForm.busId);
    const route = routes.find((item) => item.id === bus?.routeId);
    return Array.isArray(route?.stops) ? route.stops : [];
  }, [buses, passengerForm.busId, routes]);

  useEffect(() => {
    if (!institutions.length) return;
    if (!institutions.find((item) => item.id === institutionId)) {
      setInstitutionId(institutions[0].id);
    }
  }, [institutionId, institutions]);

  useEffect(() => {
    didFitRef.current = false;
  }, [institutionId, liveVehicles]);

  const openActionPanel = (panel) => {
    setActionStatus({ loading: false, error: '' });
    setActionPanel(panel);
  };

  const handleSaveToken = () => {
    const trimmedToken = tokenInput.trim();
    setStoredAdminToken(trimmedToken);
    setAdminToken(trimmedToken);
    addToast('Admin token saved.', 'success', 2500);
    if (!trimmedToken) {
      setUseLiveData(false);
      setLoadState({ loading: false, error: 'Admin token required to load live data.' });
      return;
    }
  };

  const handleCreateDriver = async (event) => {
    event.preventDefault();
    setActionStatus({ loading: true, error: '' });

    try {
      await createDriver({
        name: driverForm.name,
        email: driverForm.email,
        password: driverForm.password,
        phone: driverForm.phone,
        licenseNo: driverForm.licenseNo,
        busId: driverForm.busId
      }, adminToken);

      addToast('Driver created successfully.', 'success', 3000);
      setDriverForm({ name: '', email: '', password: '', phone: '', licenseNo: '', busId: '' });
      setActionPanel('');
      refreshDashboard();
    } catch (error) {
      setActionStatus({ loading: false, error: error?.message || 'Failed to create driver.' });
      return;
    }

    setActionStatus((prev) => ({ ...prev, loading: false }));
  };

  const handleCreatePassenger = async (event) => {
    event.preventDefault();
    setActionStatus({ loading: true, error: '' });

    try {
      await createPassenger({
        name: passengerForm.name,
        email: passengerForm.email,
        password: passengerForm.password,
        phone: passengerForm.phone,
        busId: passengerForm.busId,
        stopId: passengerForm.stopId,
        parentPhone: passengerForm.parentPhone
      }, adminToken);

      addToast('Passenger created successfully.', 'success', 3000);
      setPassengerForm({ name: '', email: '', password: '', phone: '', busId: '', stopId: '', parentPhone: '' });
      setActionPanel('');
      refreshDashboard();
    } catch (error) {
      setActionStatus({ loading: false, error: error?.message || 'Failed to create passenger.' });
      return;
    }

    setActionStatus((prev) => ({ ...prev, loading: false }));
  };

  const handleBroadcastAlert = async (event) => {
    event.preventDefault();
    setActionStatus({ loading: true, error: '' });

    try {
      await broadcastAlert({
        title: broadcastForm.title,
        message: broadcastForm.message,
        targetRole: broadcastForm.targetRole
      }, adminToken);

      addToast('Broadcast alert sent.', 'success', 3000);
      setBroadcastForm({ title: '', message: '', targetRole: 'all' });
      setActionPanel('');
    } catch (error) {
      setActionStatus({ loading: false, error: error?.message || 'Failed to send alert.' });
      return;
    }

    setActionStatus((prev) => ({ ...prev, loading: false }));
  };

  const handleNotifyDelay = async (event) => {
    event.preventDefault();
    setActionStatus({ loading: true, error: '' });

    try {
      await notifyDelay({
        busId: delayForm.busId,
        delayMinutes: Number(delayForm.delayMinutes || 0),
        reason: delayForm.reason
      }, adminToken);

      addToast('Delay notification sent.', 'success', 3000);
      setDelayForm({ busId: '', delayMinutes: '', reason: '' });
      setActionPanel('');
    } catch (error) {
      setActionStatus({ loading: false, error: error?.message || 'Failed to send delay alert.' });
      return;
    }

    setActionStatus((prev) => ({ ...prev, loading: false }));
  };

  useEffect(() => {
    if (!googleMapsApiKey) {
      setMapStatus({ status: 'error', error: 'Google Maps API key is missing.' });
      return;
    }

    setMapStatus({ status: 'loading', error: '' });
    loadGoogleMaps(googleMapsApiKey)
      .then(() => setMapStatus({ status: 'ready', error: '' }))
      .catch((error) => {
        setMapStatus({ status: 'error', error: error?.message || 'Failed to load Google Maps.' });
      });
  }, [googleMapsApiKey]);

  useEffect(() => {
    if (mapStatus.status !== 'ready' || !mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultMapCenter,
      zoom: 12,
      styles: mapStyles,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy',
    });
  }, [mapStatus.status]);

  useEffect(() => {
    if (mapStatus.status !== 'ready' || !mapInstanceRef.current || !window.google?.maps) {
      return;
    }

    const map = mapInstanceRef.current;
    const googleMaps = window.google.maps;
    const markers = markersRef.current;
    const activeIds = new Set();

    liveVehicles.forEach((vehicle) => {
      if (!vehicle.position) {
        return;
      }

      activeIds.add(vehicle.id);

      const existingMarker = markers.get(vehicle.id);
      if (existingMarker) {
        existingMarker.setPosition(vehicle.position);
        return;
      }

      const marker = new googleMaps.Marker({
        map,
        position: vehicle.position,
        title: `${vehicle.id} - ${vehicle.route}`,
        icon: {
          path: googleMaps.SymbolPath.CIRCLE,
          fillColor: '#305CB5',
          fillOpacity: 0.95,
          strokeColor: '#1C3A77',
          strokeWeight: 2,
          scale: 6,
        },
      });

      markers.set(vehicle.id, marker);
    });

    markers.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.setMap(null);
        markers.delete(id);
      }
    });

    if (!didFitRef.current && liveVehicles.length) {
      const bounds = new googleMaps.LatLngBounds();
      liveVehicles.forEach((vehicle) => {
        if (vehicle.position) {
          bounds.extend(vehicle.position);
        }
      });
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 72);
        didFitRef.current = true;
      }
    }
  }, [mapStatus.status, liveVehicles]);

  return (
    <div className="admin-shell min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap');

        .admin-shell {
          font-family: 'Inter', 'Roboto', sans-serif;
          background: #EFF3FA;
          color: #2A3D53;
        }
        .admin-title {
          font-family: 'Poppins', 'Inter', sans-serif;
          color: #1C3A77;
        }
        .admin-label {
          font-family: 'Roboto', 'Inter', sans-serif;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-size: 0.7rem;
          color: #8B9DBE;
        }
        .admin-muted {
          color: #8B9DBE;
        }
        .admin-card {
          border: 1px solid #B8C3D7;
          background: #EBF0F6;
          box-shadow: 0 16px 36px rgba(28, 58, 119, 0.08);
        }
        .admin-card-compact {
          border: 1px solid #B8C3D7;
          background: #EBF0F6;
        }
        .admin-chip {
          border: 1px solid #87A6DF;
          background: #EBF0F6;
          color: #1C3A77;
        }
        .admin-input {
          border: 1px solid #B8C3D7;
          background: #EFF3FA;
          color: #1C3A77;
        }
        .admin-button {
          border: 1px solid #86A5CB;
          background: #EFF3FA;
          color: #1C3A77;
        }
        .admin-button:hover {
          border-color: #305CB5;
        }
        .admin-button-primary {
          border: 1px solid #1C3A77;
          background: #1C3A77;
          color: #EBF0F6;
        }
        .admin-button-primary:hover {
          border-color: #305CB5;
          background: #305CB5;
        }
        .admin-button-secondary {
          border: 1px solid #B8C3D7;
          background: #E5E9F0;
          color: #2A3D53;
        }
        .admin-button-alert {
          border: 1px solid #6371B1;
          background: #242C5C;
          color: #EBF0F6;
        }
        .admin-grid {
          background-image:
            linear-gradient(rgba(184, 195, 215, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184, 195, 215, 0.5) 1px, transparent 1px);
          background-size: 56px 56px;
          background-color: #E5E9F0;
        }
        .admin-kpi {
          border-left-width: 4px;
        }
        .admin-fade-up {
          animation: adminFadeUp 0.8s ease both;
        }
        .admin-stagger > * {
          animation: adminFadeUp 0.8s ease both;
        }
        .admin-stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .admin-stagger > *:nth-child(2) { animation-delay: 0.12s; }
        .admin-stagger > *:nth-child(3) { animation-delay: 0.18s; }
        .admin-stagger > *:nth-child(4) { animation-delay: 0.24s; }
        .admin-stagger > *:nth-child(5) { animation-delay: 0.3s; }
        @keyframes adminFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-10">
          <header className="admin-fade-up admin-card rounded-3xl p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="admin-label">Admin Panel</p>
                <h1 className="admin-title text-3xl font-semibold sm:text-4xl">{institution.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm admin-muted">
                  <span className="admin-chip rounded-full px-3 py-1 text-xs">Credentials verified</span>
                  <span>{institution.city}</span>
                  <span>Last sync {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-sm admin-muted">Admin in charge: {institution.adminName} - {institution.contactEmail}</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="admin-card-compact flex items-center gap-3 rounded-2xl px-4 py-3">
                  <label className="admin-label text-[0.62rem]" htmlFor="institution">Institution</label>
                  <select
                    id="institution"
                    value={institutionId}
                    onChange={(event) => setInstitutionId(event.target.value)}
                    className="admin-input rounded-xl px-3 py-2 text-sm"
                  >
                    {institutions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="admin-button rounded-xl px-4 py-2 text-sm"
                    onClick={() => openActionPanel('passenger')}
                  >
                    Add passenger
                  </button>
                  <button
                    type="button"
                    className="admin-button rounded-xl px-4 py-2 text-sm"
                    onClick={() => openActionPanel('driver')}
                  >
                    Add driver
                  </button>
                  <button
                    type="button"
                    className="admin-button-alert rounded-xl px-4 py-2 text-sm"
                    onClick={() => {
                      setBroadcastForm({ title: 'Broadcast update', message: '', targetRole: 'all' });
                      openActionPanel('broadcast');
                    }}
                  >
                    Send alert
                  </button>
                </div>
              </div>
            </div>
          </header>

          <section className="admin-card mt-6 rounded-3xl p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="admin-label">Connection</p>
                <p className="admin-title text-xl font-semibold">
                  {useLiveData ? 'Live data connected' : 'Sample data mode'}
                </p>
                <p className="text-sm admin-muted">
                  Paste a Firebase admin ID token to load live data from the RideSafe backend.
                </p>
                {loadState.error ? (
                  <p className="text-sm text-[#9B1C1C]">{loadState.error}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-col">
                  <label className="admin-label text-[0.62rem]" htmlFor="admin-token">Admin token</label>
                  <input
                    id="admin-token"
                    type="password"
                    value={tokenInput}
                    onChange={(event) => setTokenInput(event.target.value)}
                    placeholder="Paste Firebase ID token"
                    className="admin-input rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="admin-button rounded-xl px-4 py-2 text-sm"
                    onClick={handleSaveToken}
                    disabled={loadState.loading}
                  >
                    {loadState.loading ? 'Loading...' : 'Save token'}
                  </button>
                  <button
                    type="button"
                    className="admin-button-primary rounded-xl px-4 py-2 text-sm"
                    onClick={() => refreshDashboard(tokenInput.trim())}
                    disabled={loadState.loading || !tokenInput.trim()}
                  >
                    Refresh data
                  </button>
                </div>
              </div>
            </div>
          </section>

          {actionPanel ? (
            <section className="admin-card mt-6 rounded-3xl p-6">
              <AdminSectionHeader
                title={
                  actionPanel === 'driver'
                    ? 'Create driver'
                    : actionPanel === 'passenger'
                      ? 'Create passenger'
                      : actionPanel === 'delay'
                        ? 'Notify delay'
                        : 'Broadcast alert'
                }
                subtitle="Quick actions"
                action={
                  <button
                    type="button"
                    className="admin-button-secondary rounded-xl px-3 py-1.5 text-xs"
                    onClick={() => setActionPanel('')}
                  >
                    Close
                  </button>
                }
              />
              {actionStatus.error ? (
                <p className="mt-3 text-sm text-[#9B1C1C]">{actionStatus.error}</p>
              ) : null}

              {actionPanel === 'driver' ? (
                <form onSubmit={handleCreateDriver} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="admin-label">Driver name</label>
                    <input
                      value={driverForm.name}
                      onChange={(event) => setDriverForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Email</label>
                    <input
                      type="email"
                      value={driverForm.email}
                      onChange={(event) => setDriverForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="driver@school.com"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Password</label>
                    <input
                      type="password"
                      value={driverForm.password}
                      onChange={(event) => setDriverForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="Temporary password"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Phone</label>
                    <input
                      value={driverForm.phone}
                      onChange={(event) => setDriverForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="+91 99999 88888"
                    />
                  </div>
                  <div>
                    <label className="admin-label">License number</label>
                    <input
                      value={driverForm.licenseNo}
                      onChange={(event) => setDriverForm((prev) => ({ ...prev, licenseNo: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="DL-12345"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Assign bus</label>
                    <select
                      value={driverForm.busId}
                      onChange={(event) => setDriverForm((prev) => ({ ...prev, busId: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                    >
                      <option value="">Select bus</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.busNumber || bus.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    <button type="button" className="admin-button-secondary rounded-xl px-4 py-2 text-sm" onClick={() => setActionPanel('')}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-button-primary rounded-xl px-4 py-2 text-sm"
                      disabled={actionStatus.loading || !driverForm.name || !driverForm.email || !driverForm.password || !driverForm.busId}
                    >
                      {actionStatus.loading ? 'Creating...' : 'Create driver'}
                    </button>
                  </div>
                </form>
              ) : null}

              {actionPanel === 'passenger' ? (
                <form onSubmit={handleCreatePassenger} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="admin-label">Passenger name</label>
                    <input
                      value={passengerForm.name}
                      onChange={(event) => setPassengerForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Email</label>
                    <input
                      type="email"
                      value={passengerForm.email}
                      onChange={(event) => setPassengerForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="student@school.com"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Password</label>
                    <input
                      type="password"
                      value={passengerForm.password}
                      onChange={(event) => setPassengerForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="Temporary password"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Phone</label>
                    <input
                      value={passengerForm.phone}
                      onChange={(event) => setPassengerForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="+91 98888 77777"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Bus assignment</label>
                    <select
                      value={passengerForm.busId}
                      onChange={(event) => setPassengerForm((prev) => ({ ...prev, busId: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                    >
                      <option value="">Select bus</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.busNumber || bus.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Stop</label>
                    {stopOptions.length ? (
                      <select
                        value={passengerForm.stopId}
                        onChange={(event) => setPassengerForm((prev) => ({ ...prev, stopId: event.target.value }))}
                        className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      >
                        <option value="">Select stop</option>
                        {stopOptions.map((stop) => (
                          <option key={stop.id || stop.name} value={stop.id || stop.name}>
                            {stop.name || stop.id}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={passengerForm.stopId}
                        onChange={(event) => setPassengerForm((prev) => ({ ...prev, stopId: event.target.value }))}
                        className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                        placeholder="Stop ID"
                      />
                    )}
                  </div>
                  <div>
                    <label className="admin-label">Parent phone</label>
                    <input
                      value={passengerForm.parentPhone}
                      onChange={(event) => setPassengerForm((prev) => ({ ...prev, parentPhone: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="+91 97777 66666"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    <button type="button" className="admin-button-secondary rounded-xl px-4 py-2 text-sm" onClick={() => setActionPanel('')}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-button-primary rounded-xl px-4 py-2 text-sm"
                      disabled={actionStatus.loading || !passengerForm.name || !passengerForm.email || !passengerForm.password || !passengerForm.busId}
                    >
                      {actionStatus.loading ? 'Creating...' : 'Create passenger'}
                    </button>
                  </div>
                </form>
              ) : null}

              {actionPanel === 'broadcast' ? (
                <form onSubmit={handleBroadcastAlert} className="mt-6 grid grid-cols-1 gap-4">
                  <div>
                    <label className="admin-label">Title</label>
                    <input
                      value={broadcastForm.title}
                      onChange={(event) => setBroadcastForm((prev) => ({ ...prev, title: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="Alert title"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Message</label>
                    <textarea
                      value={broadcastForm.message}
                      onChange={(event) => setBroadcastForm((prev) => ({ ...prev, message: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Share the update for drivers or parents"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Target audience</label>
                    <select
                      value={broadcastForm.targetRole}
                      onChange={(event) => setBroadcastForm((prev) => ({ ...prev, targetRole: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                    >
                      <option value="all">All users</option>
                      <option value="driver">Drivers</option>
                      <option value="passenger">Passengers</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="admin-button-secondary rounded-xl px-4 py-2 text-sm" onClick={() => setActionPanel('')}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-button-alert rounded-xl px-4 py-2 text-sm"
                      disabled={actionStatus.loading || !broadcastForm.title || !broadcastForm.message}
                    >
                      {actionStatus.loading ? 'Sending...' : 'Send broadcast'}
                    </button>
                  </div>
                </form>
              ) : null}

              {actionPanel === 'delay' ? (
                <form onSubmit={handleNotifyDelay} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="admin-label">Bus</label>
                    <select
                      value={delayForm.busId}
                      onChange={(event) => setDelayForm((prev) => ({ ...prev, busId: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                    >
                      <option value="">Select bus</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.busNumber || bus.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Delay minutes</label>
                    <input
                      type="number"
                      value={delayForm.delayMinutes}
                      onChange={(event) => setDelayForm((prev) => ({ ...prev, delayMinutes: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="10"
                      min="0"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="admin-label">Reason</label>
                    <input
                      value={delayForm.reason}
                      onChange={(event) => setDelayForm((prev) => ({ ...prev, reason: event.target.value }))}
                      className="admin-input mt-2 w-full rounded-xl px-3 py-2 text-sm"
                      placeholder="Traffic near main gate"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    <button type="button" className="admin-button-secondary rounded-xl px-4 py-2 text-sm" onClick={() => setActionPanel('')}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-button-alert rounded-xl px-4 py-2 text-sm"
                      disabled={actionStatus.loading || !delayForm.busId || !delayForm.delayMinutes}
                    >
                      {actionStatus.loading ? 'Sending...' : 'Notify delay'}
                    </button>
                  </div>
                </form>
              ) : null}
            </section>
          ) : null}

          <section className="admin-stagger mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <AdminMetricCard label="Active vehicles" value={institution.stats.vehicles} helper="GPS online" tone="teal" />
            <AdminMetricCard label="Routes live" value={institution.stats.routes} helper="Realtime sync" tone="sky" />
            <AdminMetricCard label="Drivers on shift" value={institution.stats.drivers} helper="Verified IDs" tone="teal" />
            <AdminMetricCard label="Passengers" value={institution.stats.passengers} helper="Registered" tone="slate" />
            <AdminMetricCard label="Alerts today" value={institution.stats.alerts} helper={institution.stats.onTime} tone="amber" />
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader
                title="Live GPS map"
                subtitle="Fleet tracking"
                action={
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="admin-button-secondary rounded-xl px-3 py-1.5 text-xs">Share link</button>
                    <button
                      type="button"
                      className="admin-button-primary rounded-xl px-3 py-1.5 text-xs"
                      onClick={() => {
                        setBroadcastForm({ title: 'Broadcast update', message: '', targetRole: 'all' });
                        openActionPanel('broadcast');
                      }}
                    >
                      Broadcast to dashboards
                    </button>
                  </div>
                }
              />

              <div className="admin-grid relative mt-6 h-[360px] overflow-hidden rounded-2xl border border-[#B8C3D7]">
                <div ref={mapContainerRef} className="h-full w-full" />

                {mapStatus.status === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#EBF0F6]/90 text-sm text-[#5F84AF]">
                    Loading Google Maps...
                  </div>
                )}
                {mapStatus.status === 'error' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#EBF0F6]/95 px-6 text-center text-sm text-[#2A3D53]">
                    {mapStatus.error} Add VITE_GOOGLE_MAPS_API_KEY in your environment (.env.local or .env.production).
                  </div>
                )}

                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-[#B8C3D7] bg-[#EBF0F6] px-3 py-1 text-xs text-[#5F84AF]">
                  {onlineLabel}
                </div>
                <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-[#B8C3D7] bg-[#EBF0F6] px-3 py-1 text-xs text-[#5F84AF]">
                  Updated {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="pointer-events-none absolute left-6 bottom-4 text-xs admin-muted">
                  Live GPS updates every 6 seconds.
                </div>
              </div>
            </div>

            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader title="Fleet status" subtitle="Vehicle list" />
              <div className="mt-5 space-y-4">
                {institution.vehicles.length ? (
                  institution.vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="admin-card-compact rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="admin-title text-lg font-semibold">{vehicle.id}</p>
                          <p className="text-sm admin-muted">{vehicle.route} - {vehicle.driver}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs ${statusTone(vehicle.status)}`}>{vehicle.status}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs admin-muted">
                        <span>Speed: {vehicle.speed}</span>
                        <span>Occupancy: {vehicle.occupancy}</span>
                        {vehicle.phone ? (
                          <a href={`tel:${vehicle.phone}`} className="admin-button-secondary rounded-full px-3 py-1 text-xs">Call driver</a>
                        ) : (
                          <span className="text-xs admin-muted">Phone unavailable</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm admin-muted">No vehicles available.</p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader
                title="Passengers and guardians"
                subtitle="Add or remove passengers"
                action={
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="admin-button rounded-xl px-3 py-1.5 text-xs"
                      onClick={() => openActionPanel('passenger')}
                    >
                      Add passenger
                    </button>
                    <button type="button" className="admin-button rounded-xl px-3 py-1.5 text-xs" disabled>
                      Remove selected
                    </button>
                  </div>
                }
              />

              <div className="mt-5 space-y-3">
                {institution.passengers.length ? (
                  institution.passengers.map((passenger) => (
                    <div key={passenger.name} className="admin-card-compact rounded-2xl p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="admin-title text-lg font-semibold">{passenger.name}</p>
                          <p className="text-sm admin-muted">{passenger.grade} - {passenger.stop}</p>
                        </div>
                        <span className="admin-chip rounded-full px-3 py-1 text-xs">{passenger.feeStatus}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs admin-muted">
                        <span>Guardian: {passenger.guardian}</span>
                        <span>Phone: {passenger.phone}</span>
                        <span>Medical: {passenger.medical}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm admin-muted">No passengers registered yet.</p>
                )}
              </div>
            </div>

            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader
                title="Drivers and conductors"
                subtitle="Add or remove staff"
                action={
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="admin-button rounded-xl px-3 py-1.5 text-xs"
                      onClick={() => openActionPanel('driver')}
                    >
                      Add staff
                    </button>
                    <button type="button" className="admin-button rounded-xl px-3 py-1.5 text-xs" disabled>
                      Remove staff
                    </button>
                  </div>
                }
              />

              <div className="mt-5 space-y-3">
                {institution.staff.length ? (
                  institution.staff.map((member) => (
                    <div key={`${member.name}-${member.role}`} className="admin-card-compact rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="admin-title text-lg font-semibold">{member.name}</p>
                          <p className="text-sm admin-muted">{member.role} - {member.shift}</p>
                        </div>
                        {member.phone ? (
                          <a href={`tel:${member.phone}`} className="admin-button-secondary rounded-full px-3 py-1 text-xs">Call</a>
                        ) : (
                          <span className="text-xs admin-muted">Phone unavailable</span>
                        )}
                      </div>
                      <div className="mt-3 text-xs admin-muted">{member.license}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm admin-muted">No staff records found.</p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader
                title="Route assignments"
                subtitle="Dynamic updates to all dashboards"
                action={
                  <button
                    type="button"
                    className="admin-button-primary rounded-xl px-3 py-1.5 text-xs"
                    onClick={() => refreshDashboard()}
                  >
                    Push updates now
                  </button>
                }
              />

              <div className="mt-5 space-y-3">
                {institution.routes.length ? (
                  institution.routes.map((route) => (
                    <div key={route.name} className="admin-card-compact rounded-2xl p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="admin-title text-lg font-semibold">{route.name}</p>
                          <p className="text-xs admin-muted">Vehicles assigned: {route.vehicles} - ETA {route.eta}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs ${statusTone(route.status)}`}>{route.status}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs admin-muted">
                        <span>Last update: {route.updated}</span>
                        <button type="button" className="admin-button-secondary rounded-full px-3 py-1 text-xs" disabled>Assign vehicle</button>
                        <button type="button" className="admin-button-secondary rounded-full px-3 py-1 text-xs" disabled>Edit stops</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm admin-muted">No routes configured yet.</p>
                )}
              </div>
            </div>

            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader title="Alerts and notifications" subtitle="Send alerts" />

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[#B8C3D7] bg-[#DFE2EF] p-4 text-sm text-[#2A3D53]">
                  Draft a broadcast message to parents, drivers, or all dashboards. Notifications sync to the driver app and passenger display instantly.
                </div>
                <div className="space-y-3">
                  {institution.alerts.length ? (
                    institution.alerts.map((alert) => (
                      <div key={alert.title} className="admin-card-compact rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <p className="admin-title text-base font-semibold">{alert.title}</p>
                          <span className={`rounded-full border px-3 py-1 text-xs ${statusTone(alert.status)}`}>{alert.status}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs admin-muted">
                          <span>{alert.time}</span>
                          <span>{alert.channel}</span>
                          <button
                            type="button"
                            className="admin-button-secondary rounded-full px-3 py-1 text-xs"
                            onClick={() => {
                              setBroadcastForm({
                                title: `Escalation: ${alert.title}`,
                                message: 'Please review the alert and respond immediately.',
                                targetRole: 'all'
                              });
                              openActionPanel('broadcast');
                            }}
                          >
                            Escalate
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm admin-muted">No active alerts right now.</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="admin-button-alert rounded-xl px-4 py-2 text-sm"
                    onClick={() => {
                      setBroadcastForm({ title: 'Emergency alert', message: '', targetRole: 'all' });
                      openActionPanel('broadcast');
                    }}
                  >
                    Send emergency alert
                  </button>
                  <button
                    type="button"
                    className="admin-button-secondary rounded-xl px-4 py-2 text-sm"
                    onClick={() => openActionPanel('delay')}
                  >
                    Send ETA update
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader title="Finance overview" subtitle="Fees, EMI, and salaries" />
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AdminMetricCard label="Fees collected" value={institution.finance.feesCollected} helper="This month" tone="teal" />
                <AdminMetricCard label="Fees outstanding" value={institution.finance.feesOutstanding} helper="Follow up" tone="amber" />
                <AdminMetricCard label="Bus EMI" value={institution.finance.busEmi} helper="Monthly" tone="sky" />
                <AdminMetricCard label="Bus rent" value={institution.finance.busRent} helper="Monthly" tone="slate" />
                <AdminMetricCard label="Salaries" value={institution.finance.salaries} helper="Drivers + conductors" tone="rose" />
                <AdminMetricCard label="Payouts due" value={institution.finance.payoutsDue} helper="Vendors" tone="amber" />
              </div>
              <div className="mt-4 rounded-2xl border border-[#B8C3D7] bg-[#E5E9F0] p-4 text-xs text-[#2A3D53]">
                Payments can be filtered by route, passenger, or vendor. Export GST-ready statements directly to accounting.
              </div>
            </div>

            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader title="Emergency and medical needs" subtitle="Safety" />
              <div className="mt-5 space-y-3">
                {institution.medical.length ? (
                  institution.medical.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-[#B3BBD9] bg-[#E5E9F0] p-4">
                      <div className="flex items-center justify-between">
                        <p className="admin-title text-lg font-semibold">{item.name}</p>
                        <a href={`tel:${item.contact}`} className="admin-button-secondary rounded-full px-3 py-1 text-xs">Call guardian</a>
                      </div>
                      <p className="mt-2 text-xs admin-muted">{item.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm admin-muted">No medical notes available.</p>
                )}
              </div>
              <div className="mt-4 rounded-2xl border border-[#B8C3D7] bg-[#E5E9F0] p-4 text-xs text-[#2A3D53]">
                Medical notes are visible to drivers, conductors, and dispatch operators only.
              </div>
            </div>
          </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
