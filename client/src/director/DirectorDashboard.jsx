import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useDirectorAuth } from "../contexts/DirectorAuthContext";
import { approveAdminRequest, fetchDirectorSnapshot } from "../services/ridesafeDirectorApi";
import "./directorTheme.css";

const formatDateTime = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const DirectorDashboard = () => {
  const { addToast } = useToast();
  const { directorUser, idToken, signOutDirector } = useDirectorAuth();
  const [snapshot, setSnapshot] = useState(null);
  const [loadState, setLoadState] = useState({ loading: false, error: "" });
  const [actionState, setActionState] = useState({ approvingId: "", error: "" });
  const [showFirestore, setShowFirestore] = useState(false);
  const [showRealtime, setShowRealtime] = useState(false);

  const loadSnapshot = useCallback(async () => {
    if (!idToken) {
      return;
    }

    setLoadState({ loading: true, error: "" });

    try {
      const data = await fetchDirectorSnapshot(idToken);
      setSnapshot(data);
    } catch (error) {
      setLoadState({ loading: false, error: error?.message || "Failed to load director snapshot." });
      return;
    }

    setLoadState({ loading: false, error: "" });
  }, [idToken]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const firestore = snapshot?.firestore || {};
  const realtime = snapshot?.realtime || {};

  const pendingRequests = useMemo(() => {
    const requests = firestore.adminRequests || [];
    return requests.filter((request) => request.status !== "approved");
  }, [firestore.adminRequests]);

  const adminRoster = useMemo(() => {
    const users = firestore.users || [];
    const admins = users.filter((user) => user.role === "admin");
    return admins.length ? admins : firestore.admins || [];
  }, [firestore.users, firestore.admins]);

  const institutions = firestore.institutions || [];

  const stats = useMemo(
    () => [
      { label: "Users", value: (firestore.users || []).length, hint: "All profiles" },
      { label: "Admins", value: adminRoster.length, hint: "Approved admins" },
      { label: "Admin Requests", value: pendingRequests.length, hint: "Awaiting approval" },
      { label: "Institutions", value: institutions.length, hint: "Active orgs" },
      { label: "Buses", value: (firestore.buses || []).length, hint: "Fleet" },
      { label: "Routes", value: (firestore.routes || []).length, hint: "Active routes" },
      { label: "Drivers", value: (firestore.drivers || []).length, hint: "Active drivers" },
      { label: "Passengers", value: (firestore.passengers || []).length, hint: "Riders" },
      { label: "Trips", value: (firestore.trips || []).length, hint: "Live and history" },
      { label: "Payments", value: (firestore.payments || []).length, hint: "Payment records" }
    ],
    [firestore, adminRoster, pendingRequests.length, institutions.length]
  );

  const handleApprove = async (requestId) => {
    if (!requestId || actionState.approvingId) {
      return;
    }

    setActionState({ approvingId: requestId, error: "" });

    try {
      await approveAdminRequest(requestId, idToken);
      addToast("Admin request approved.", "success", 2500);
      await loadSnapshot();
    } catch (error) {
      setActionState({ approvingId: "", error: error?.message || "Approval failed." });
      return;
    }

    setActionState({ approvingId: "", error: "" });
  };

  return (
    <div className="director-shell">
      <div className="director-content">
        <header className="director-hero director-animate">
          <div>
            <p className="director-kicker">Director Control Room</p>
            <h1 className="director-title">RideSafe Command Hub</h1>
            <p className="director-subtitle">
              Live visibility into every Firestore collection and realtime feed, with direct approval of new
              administrators.
            </p>
            <div className="director-actions">
              <button className="director-btn" onClick={loadSnapshot} disabled={loadState.loading}>
                {loadState.loading ? "Refreshing..." : "Refresh snapshot"}
              </button>
              <button className="director-btn director-btn-outline" onClick={signOutDirector}>
                Sign out
              </button>
            </div>
          </div>
          <div className="director-card director-meta">
            <div>
              <strong>Signed in as</strong>
              <span>{directorUser?.email || "Director"}</span>
            </div>
            <div>
              <strong>Last synced</strong>
              <span>{formatDateTime(snapshot?.fetchedAt)}</span>
            </div>
            <div>
              <strong>Realtime root keys</strong>
              <span>{Object.keys(realtime || {}).length}</span>
            </div>
            {loadState.error && <span>{loadState.error}</span>}
            {actionState.error && <span>{actionState.error}</span>}
          </div>
        </header>

        <section className="director-section">
          <div className="director-section-header">
            <h2 className="director-section-title">Network snapshot</h2>
          </div>
          <div className="director-grid">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="director-card director-animate"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="director-stat-label">{stat.label}</div>
                <div className="director-stat-value">{stat.value}</div>
                <div className="director-stat-hint">{stat.hint}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="director-section">
          <div className="director-section-header">
            <h2 className="director-section-title">Admin approval queue</h2>
          </div>
          <div className="director-card">
            {pendingRequests.length === 0 ? (
              <p>No pending admin requests.</p>
            ) : (
              <div className="scrollbar-hide" style={{ overflowX: "auto" }}>
                <table className="director-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Institution</th>
                      <th>Status</th>
                      <th>Requested</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((request) => (
                      <tr key={request.id || request.uid}>
                        <td>{request.name || "-"}</td>
                        <td>{request.email || "-"}</td>
                        <td>{request.institutionName || request.institutionId || "-"}</td>
                        <td>
                          <span className="director-pill">{request.status || "pending"}</span>
                        </td>
                        <td>{formatDateTime(request.createdAt)}</td>
                        <td>
                          <button
                            className="director-btn"
                            onClick={() => handleApprove(request.id || request.uid)}
                            disabled={actionState.approvingId === (request.id || request.uid)}
                          >
                            {actionState.approvingId === (request.id || request.uid)
                              ? "Approving..."
                              : "Approve"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="director-section">
          <div className="director-section-header">
            <h2 className="director-section-title">Admin roster</h2>
          </div>
          <div className="director-card">
            {adminRoster.length === 0 ? (
              <p>No approved admins yet.</p>
            ) : (
              <div className="scrollbar-hide" style={{ overflowX: "auto" }}>
                <table className="director-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Institution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminRoster.map((admin) => (
                      <tr key={admin.id || admin.uid}>
                        <td>{admin.name || "-"}</td>
                        <td>{admin.email || "-"}</td>
                        <td>{admin.phone || "-"}</td>
                        <td>{admin.institutionName || admin.institutionId || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="director-section">
          <div className="director-section-header">
            <h2 className="director-section-title">Institutions</h2>
          </div>
          <div className="director-card">
            {institutions.length === 0 ? (
              <p>No institutions found.</p>
            ) : (
              <div className="scrollbar-hide" style={{ overflowX: "auto" }}>
                <table className="director-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>City</th>
                      <th>Contact</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutions.map((institution) => (
                      <tr key={institution.id}>
                        <td>{institution.name || "-"}</td>
                        <td>{institution.city || "-"}</td>
                        <td>{institution.contactEmail || institution.contact || "-"}</td>
                        <td>
                          <span className="director-pill director-pill--approved">
                            {institution.status || "active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="director-section">
          <div className="director-section-header">
            <h2 className="director-section-title">Firestore export</h2>
            <button className="director-toggle" onClick={() => setShowFirestore((prev) => !prev)}>
              {showFirestore ? "Hide JSON" : "Show JSON"}
            </button>
          </div>
          {showFirestore && <pre className="director-code">{JSON.stringify(firestore, null, 2)}</pre>}
        </section>

        <section className="director-section">
          <div className="director-section-header">
            <h2 className="director-section-title">Realtime DB export</h2>
            <button className="director-toggle" onClick={() => setShowRealtime((prev) => !prev)}>
              {showRealtime ? "Hide JSON" : "Show JSON"}
            </button>
          </div>
          {showRealtime && <pre className="director-code">{JSON.stringify(realtime, null, 2)}</pre>}
        </section>
      </div>
    </div>
  );
};

export default DirectorDashboard;
