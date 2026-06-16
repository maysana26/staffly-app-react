import React, { useState, useEffect } from "react";
import { Calendar, Users, FileText, TrendingUp, Plus, Eye, Edit2, Trash2, Check, X, Star } from "lucide-react";
import "./AdminDashboard.css";
import AdminNavbar from "../Components/AdminNavbar";
import AdminFooter from "../Components/AdminFooter";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Database State Engines
    const [eventsList, setEventsList] = useState([]);
    const [applicationsData, setApplicationsData] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [metrics, setMetrics] = useState({ totalEvents: 0, totalApplications: 0, activeUsers: 0, upcomingCount: 0 });
    const [loading, setLoading] = useState(true);

    // 1. Fetch dashboard overview metrics and recent activity logs
    useEffect(() => {
        const fetchSummaryData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:5000/api/admin/summary", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data.metrics || metrics);
                    setActivityLogs(data.recentActivity || []);
                }
            } catch (error) {
                console.error("Error connecting to admin metrics backend:", error);
            }
        };

        fetchSummaryData();
    }, [eventsList]); // Dynamic reload if events count changes

    // 2. Fetch all system events for management matrix
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/events");
                if (!response.ok) throw new Error("Failed to sync structural dashboard logs.");
                const data = await response.json();
                setEventsList(data);
            } catch (error) {
                console.error("Error reading platform database events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // 3. Fetch user submitted application profiles
    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:5000/api/admin/applications", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setApplicationsData(data);
                }
            } catch (error) {
                console.error("Error synchronizing applicant forms directory:", error);
            }
        };
        if (activeTab === "applications" || activeTab === "overview") {
            fetchApplications();
        }
    }, [activeTab]);

    // Action Handlers
    const handleViewEvent = (id) => {
        navigate(`/admindashboard/view-event/${id}`);
    };

    const handleEditEvent = (id) => {
        navigate(`/admindashboard/edit-event/${id}`);
    };

    const handleDeleteEvent = async (id, title) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:5000/api/admin/events/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Deletion request rejected by DB layer.");

            setEventsList(eventsList.filter(event => (event.event_id || event.id || event._id) !== id));
            alert("Event deleted successfully!");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUpdateStatus = async (appId, newStatus) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:5000/api/admin/applications/${appId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error("Failed to update applicant state configuration.");

            // Refresh application mapping state locally
            setApplicationsData(applicationsData.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="admin-page-canvas">
            <AdminNavbar />

            <div className="admin-hero-banner">
                <div className="admin-hero-container">
                    <h1 className="admin-hero-title">Admin Dashboard</h1>
                    <p className="admin-hero-subtitle">Manage your events and applications</p>
                </div>
            </div>

            <div className="admin-sheet-wrapper">
                <div className="admin-sheet-card">

                    <div className="admin-tabs-row">
                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                            onClick={(e) => { e.preventDefault(); setActiveTab("overview"); }}
                        >
                            Overview
                        </button>
                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "events" ? "active" : ""}`}
                            onClick={(e) => { e.preventDefault(); setActiveTab("events"); }}
                        >
                            Events
                        </button>
                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "applications" ? "active" : ""}`}
                            onClick={(e) => { e.preventDefault(); setActiveTab("applications"); }}
                        >
                            Applications
                        </button>
                    </div>

                    {/* VIEW 1: OVERVIEW SUBTAB */}
                    {activeTab === "overview" && (
                        <>
                            <div className="admin-metrics-grid">
                                <div className="analytics-card blue-variant">
                                    <div className="analytics-icon-box blue-icon-bg">
                                        <Calendar size={22} color="#0052cc" />
                                    </div>
                                    <div className="analytics-text-group">
                                        <span className="analytics-label">Total Events</span>
                                        <h3 className="analytics-number">{eventsList.length || metrics.totalEvents}</h3>
                                    </div>
                                </div>
                                <div className="analytics-card orange-variant">
                                    <div className="analytics-icon-box orange-icon-bg">
                                        <FileText size={22} color="#e65c00" />
                                    </div>
                                    <div className="analytics-text-group">
                                        <span className="analytics-label">Applications</span>
                                        <h3 className="analytics-number">{metrics.totalApplications}</h3>
                                    </div>
                                </div>
                                <div className="analytics-card purple-variant">
                                    <div className="analytics-icon-box purple-icon-bg">
                                        <Users size={22} color="#8a2be2" />
                                    </div>
                                    <div className="analytics-text-group">
                                        <span className="analytics-label">Active Users</span>
                                        <h3 className="analytics-number">{metrics.activeUsers}</h3>
                                    </div>
                                </div>
                                <div className="analytics-card green-variant">
                                    <div className="analytics-icon-box green-icon-bg">
                                        <TrendingUp size={22} color="#00b074" />
                                    </div>
                                    <div className="analytics-text-group">
                                        <span className="analytics-label">Upcoming</span>
                                        <h3 className="analytics-number">{metrics.upcomingCount}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-activity-section">
                                <h2 className="tab-section-title">Recent Activity</h2>
                                <div className="activity-stack-list">
                                    {activityLogs.length === 0 ? (
                                        <p style={{ padding: "20px", color: "#64748b" }}>No system deployment activity logs discovered.</p>
                                    ) : (
                                        activityLogs.map((log) => (
                                            <div key={log.id || log._id} className="activity-log-strip">
                                                <div className="log-left-details">
                                                    <p className="log-main-announcement">
                                                        New application for <span className="highlight-text-bold">{log.eventTitle}</span>
                                                    </p>
                                                    <p className="log-sub-role-label">Role: {log.role}</p>
                                                </div>
                                                <div className="log-right-timestamp"><span>{log.date ? new Date(log.date).toLocaleDateString() : ""}</span></div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* VIEW 2: EVENTS MANAGEMENT TAB */}
                    {activeTab === "events" && (
                        <div className="subtab-content-container">
                            <div className="subtab-header-row">
                                <h2 className="tab-section-title">Manage Events</h2>
                                <button
                                    type="button"
                                    className="btn-create-event"
                                    onClick={() => navigate("/admindashboard/createevent")}
                                >
                                    <Plus size={18} /> Create Event
                                </button>
                            </div>
                            <div className="table-responsive-wrapper">
                                <table className="admin-dashboard-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "35%" }}>Event</th>
                                            <th>Date</th>
                                            <th>Category</th>
                                            <th>Applications</th>
                                            <th>Filled</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Syncing Engine Database Records...</td></tr>
                                        ) : eventsList.length === 0 ? (
                                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No event configurations discovered.</td></tr>
                                        ) : (
                                            eventsList.map((event) => {
                                                const currentId = event.event_id || event.id || event._id;
                                                return (
                                                    <tr key={currentId}>
                                                        <td>
                                                            <div className="table-media-cell">
                                                                <div className="table-event-thumb" style={{ backgroundImage: `url(${event.image || ''})`, backgroundSize: 'cover' }}></div>
                                                                <div className="table-cell-meta">
                                                                    <div className="cell-main-title">{event.title}</div>
                                                                    <div className="cell-sub-info">{event.location || "Remote"}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-neutral-dark">{event.date ? new Date(event.date).toLocaleDateString() : "TBD"}</td>
                                                        <td><span className="badge-pill category-pill">{event.category || "General"}</span></td>
                                                        <td className="text-neutral-dark">{event.apps || event.applicantCount || 0}</td>
                                                        <td className="text-neutral-dark">
                                                            {event.slots_filled || event.filledSpots || 0}/{event.slots_needed || event.totalSpots || 0}
                                                        </td>
                                                        <td>
                                                            <div className="table-actions-group">
                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn view-btn"
                                                                    title="View Details"
                                                                    onClick={() => handleViewEvent(currentId)}
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn edit-btn"
                                                                    title="Edit Event"
                                                                    onClick={() => handleEditEvent(currentId)}
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn delete-btn"
                                                                    title="Delete Event"
                                                                    onClick={() => handleDeleteEvent(currentId, event.title)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* VIEW 3: APPLICATION REVIEWS TAB */}
                    {activeTab === "applications" && (
                        <div className="subtab-content-container">
                            <div className="subtab-header-row">
                                <h2 className="tab-section-title">Manage Applications</h2>
                            </div>

                            <div className="table-responsive-wrapper">
                                <table className="admin-dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Event</th>
                                            <th>Role</th>
                                            <th>Applied</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicationsData.length === 0 ? (
                                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No candidate submission requests stored yet.</td></tr>
                                        ) : (
                                            applicationsData.map((app) => (
                                                <tr key={app.id || app._id}>
                                                    <td>
                                                        <div className="table-media-cell">
                                                            <img
                                                                src={app.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"}
                                                                alt="Applicant workspace representation"
                                                                className="table-avatar-img"
                                                            />
                                                            <div className="table-cell-meta">
                                                                <div className="cell-main-title">{app.applicant || app.applicantName}</div>
                                                                <div className="cell-sub-info rating-inline">
                                                                    <Star size={12} fill="#eab308" color="#eab308" /> {app.rating || "5.0"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-neutral-dark">{app.event || app.eventTitle}</td>
                                                    <td className="text-neutral-muted">{app.role || app.roleName}</td>
                                                    <td className="text-neutral-dark">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : ""}</td>
                                                    <td>
                                                        <span className={`badge-pill status-pill-${(app.status || "Pending").toLowerCase()}`}>
                                                            {app.status || "Pending"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="table-actions-group">
                                                            {(app.status === "Pending" || !app.status) && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="action-icon-btn approve-btn"
                                                                        title="Approve"
                                                                        onClick={() => handleUpdateStatus(app.id || app._id, "Accepted")}
                                                                    >
                                                                        <Check size={16} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="action-icon-btn reject-btn"
                                                                        title="Reject"
                                                                        onClick={() => handleUpdateStatus(app.id || app._id, "Rejected")}
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button type="button" className="action-icon-btn view-btn" title="View Applicant" onClick={() => navigate(`/admin/applicants/${app.applicantId || app.id}`)}><Eye size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <AdminFooter />
        </div>
    );
}

export default AdminDashboard;