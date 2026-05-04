import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminMetricCard from './AdminMetricCard';
import AdminSectionHeader from './AdminSectionHeader';

const institutions = [
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

const getJitteredPosition = (position) => {
  if (!position) return position;
  const drift = 0.0008;
  return {
    lat: position.lat + (Math.random() - 0.5) * drift,
    lng: position.lng + (Math.random() - 0.5) * drift,
  };
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
  const [institutionId, setInstitutionId] = useState(institutions[0].id);
  const [liveVehicles, setLiveVehicles] = useState(institutions[0].vehicles);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mapStatus, setMapStatus] = useState({ status: 'idle', error: '' });
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const didFitRef = useRef(false);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const institution = useMemo(() => {
    return institutions.find((item) => item.id === institutionId) || institutions[0];
  }, [institutionId]);

  useEffect(() => {
    setLiveVehicles(institution.vehicles);
    didFitRef.current = false;
  }, [institution]);

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
    const intervalId = setInterval(() => {
      setLiveVehicles((prev) => prev.map((vehicle) => ({
        ...vehicle,
        position: getJitteredPosition(vehicle.position),
      })));
      setLastUpdate(new Date());
    }, 6000);

    return () => clearInterval(intervalId);
  }, [institutionId]);

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
                  <button type="button" className="admin-button rounded-xl px-4 py-2 text-sm">Add passenger</button>
                  <button type="button" className="admin-button rounded-xl px-4 py-2 text-sm">Add driver</button>
                  <button type="button" className="admin-button-alert rounded-xl px-4 py-2 text-sm">Send alert</button>
                </div>
              </div>
            </div>
          </header>

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
                    <button type="button" className="admin-button-primary rounded-xl px-3 py-1.5 text-xs">Broadcast to dashboards</button>
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
                    {mapStatus.error} Add VITE_GOOGLE_MAPS_API_KEY in .env.local.
                  </div>
                )}

                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-[#B8C3D7] bg-[#EBF0F6] px-3 py-1 text-xs text-[#5F84AF]">
                  All vehicles online
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
                {institution.vehicles.map((vehicle) => (
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
                      <a href={`tel:${vehicle.phone}`} className="admin-button-secondary rounded-full px-3 py-1 text-xs">Call driver</a>
                    </div>
                  </div>
                ))}
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
                    <button type="button" className="admin-button rounded-xl px-3 py-1.5 text-xs">Add passenger</button>
                    <button type="button" className="admin-button rounded-xl px-3 py-1.5 text-xs">Remove selected</button>
                  </div>
                }
              />

              <div className="mt-5 space-y-3">
                {institution.passengers.map((passenger) => (
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
                ))}
              </div>
            </div>

            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader
                title="Drivers and conductors"
                subtitle="Add or remove staff"
                action={
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="admin-button rounded-xl px-3 py-1.5 text-xs">Add staff</button>
                    <button type="button" className="admin-button rounded-xl px-3 py-1.5 text-xs">Remove staff</button>
                  </div>
                }
              />

              <div className="mt-5 space-y-3">
                {institution.staff.map((member) => (
                  <div key={`${member.name}-${member.role}`} className="admin-card-compact rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="admin-title text-lg font-semibold">{member.name}</p>
                        <p className="text-sm admin-muted">{member.role} - {member.shift}</p>
                      </div>
                      <a href={`tel:${member.phone}`} className="admin-button-secondary rounded-full px-3 py-1 text-xs">Call</a>
                    </div>
                    <div className="mt-3 text-xs admin-muted">{member.license}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader
                title="Route assignments"
                subtitle="Dynamic updates to all dashboards"
                action={
                  <button type="button" className="admin-button-primary rounded-xl px-3 py-1.5 text-xs">Push updates now</button>
                }
              />

              <div className="mt-5 space-y-3">
                {institution.routes.map((route) => (
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
                      <button type="button" className="admin-button-secondary rounded-full px-3 py-1 text-xs">Assign vehicle</button>
                      <button type="button" className="admin-button-secondary rounded-full px-3 py-1 text-xs">Edit stops</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card rounded-3xl p-6">
              <AdminSectionHeader title="Alerts and notifications" subtitle="Send alerts" />

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[#B8C3D7] bg-[#DFE2EF] p-4 text-sm text-[#2A3D53]">
                  Draft a broadcast message to parents, drivers, or all dashboards. Notifications sync to the driver app and passenger display instantly.
                </div>
                <div className="space-y-3">
                  {institution.alerts.map((alert) => (
                    <div key={alert.title} className="admin-card-compact rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <p className="admin-title text-base font-semibold">{alert.title}</p>
                        <span className={`rounded-full border px-3 py-1 text-xs ${statusTone(alert.status)}`}>{alert.status}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs admin-muted">
                        <span>{alert.time}</span>
                        <span>{alert.channel}</span>
                        <button type="button" className="admin-button-secondary rounded-full px-3 py-1 text-xs">Escalate</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="admin-button-alert rounded-xl px-4 py-2 text-sm">Send emergency alert</button>
                  <button type="button" className="admin-button-secondary rounded-xl px-4 py-2 text-sm">Send ETA update</button>
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
                {institution.medical.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-[#B3BBD9] bg-[#E5E9F0] p-4">
                    <div className="flex items-center justify-between">
                      <p className="admin-title text-lg font-semibold">{item.name}</p>
                      <a href={`tel:${item.contact}`} className="admin-button-secondary rounded-full px-3 py-1 text-xs">Call guardian</a>
                    </div>
                    <p className="mt-2 text-xs admin-muted">{item.note}</p>
                  </div>
                ))}
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
