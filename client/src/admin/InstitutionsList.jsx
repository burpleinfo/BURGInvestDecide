import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { getRidesafeApiUrl } from '../utils/apiUrl';
import '../styles/InstitutionsList.css';

const InstitutionsList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { adminToken, adminProfile } = useAdminAuth();

  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const fetchInstitutions = useCallback(async () => {
    try {
      setLoading(true);

      const institutionId = adminProfile?.institutionId;

      // If admin has an institution, fetch only that institution
      if (institutionId) {
        const res = await fetch(getRidesafeApiUrl(`/institution/institution/${institutionId}`), {
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (res.ok) {
          const data = await res.json();
          setInstitutions([data]);
        } else {
          showToast('Unable to load your institution', 'error');
        }
      } else {
        // Director can see all institutions
        // This would require adding a new endpoint
        showToast('Please contact your administrator for institution access', 'info');
      }
    } catch (error) {
      showToast('Failed to load institutions', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [adminToken, adminProfile, showToast]);

  const handleInstitutionClick = (institutionId) => {
    navigate(`/admin/institution/${institutionId}`);
  };

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="institutions-loading">Loading institutions...</div>;
  }

  return (
    <div className="institutions-container">
      <div className="institutions-header">
        <h1>My Institutions</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search institutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="institutions-grid">
        {filteredInstitutions.length === 0 ? (
          <div className="empty-state">
            <p>No institutions found</p>
            <p className="empty-description">
              {institutions.length === 0
                ? 'You are not assigned to any institution yet.'
                : 'No institutions match your search.'}
            </p>
          </div>
        ) : (
          filteredInstitutions.map(institution => (
            <div
              key={institution.id}
              className="institution-card"
              onClick={() => handleInstitutionClick(institution.id)}
            >
              <div className="card-header">
                <h2>{institution.name}</h2>
                <div className="status-badge">{institution.status || 'Active'}</div>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <span className="label">Admin:</span>
                  <span className="value">{institution.adminName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{institution.adminEmail}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{institution.adminPhone}</span>
                </div>
              </div>

              <div className="card-stats">
                <div className="stat">
                  <span className="stat-number">{institution.driverCount || 0}</span>
                  <span className="stat-label">Drivers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{institution.passengerCount || 0}</span>
                  <span className="stat-label">Passengers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{institution.routeCount || 0}</span>
                  <span className="stat-label">Routes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{institution.busCount || 0}</span>
                  <span className="stat-label">Buses</span>
                </div>
              </div>

              <div className="card-footer">
                <span className="created-date">
                  Created {new Date(institution.createdAt).toLocaleDateString()}
                </span>
                <button className="view-btn">View Details →</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstitutionsList;
