import React, { useState } from "react";
import { Calendar, Users, FileText, TrendingUp, Plus, Eye, Edit2, Trash2, Check, X, Star } from "lucide-react";
import "./AdminDashboard.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    // Local state to manage active inner tab view
    const [activeTab, setActiveTab] = useState("overview");

    const [eventsList, setEventsList] = useState([
        { id: 1, title: "Tech Innovation Summit 2026", location: "Convention Center, Downtown", date: "2026-05-15", category: "Technology", apps: 1, filled: "6/14" },
        { id: 2, title: "Summer Music Festival", location: "Riverside Park", date: "2026-06-20", category: "Music", apps: 0, filled: "21/31" },
        { id: 3, title: "Corporate Gala Dinner", location: "Grand Hotel Ballroom", date: "2026-05-01", category: "Corporate", apps: 0, filled: "12/19" },
        { id: 4, title: "Startup Pitch Night", location: "Innovation Hub", date: "2026-04-25", category: "Business", apps: 1, filled: "3/6" },
        { id: 5, title: "Charity Marathon", location: "City Center Route", date: "2026-07-10", category: "Sports", apps: 0, filled: "29/39" },
        { id: 6, title: "Art Gallery Opening", location: "Modern Art Museum", date: "2026-05-08", category: "Arts", apps: 1, filled: "5/9" }
    ]);

    const activityLogs = [
        { id: 1, eventTitle: "Tech Innovation Summit 2026", role: "Registration Desk Staff", date: "2026-04-10" },
        { id: 2, eventTitle: "Startup Pitch Night", role: "Registration Staff", date: "2026-04-15" },
        { id: 3, eventTitle: "Art Gallery Opening", role: "Reception Staff", date: "2026-04-12" }
    ];

    const applicationsData = [
        { id: 1, applicant: "Sarah Johnson", rating: "4.8", event: "Tech Innovation Summit 2026", role: "Registration Desk Staff", appliedDate: "2026-04-10", status: "Accepted" },
        { id: 2, applicant: "Sarah Johnson", rating: "4.8", event: "Startup Pitch Night", role: "Registration Staff", appliedDate: "2026-04-15", status: "Pending" },
        { id: 3, applicant: "Sarah Johnson", rating: "4.8", event: "Art Gallery Opening", role: "Reception Staff", appliedDate: "2026-04-12", status: "Accepted" }
    ];

    // 2. Action Handlers
    const handleViewEvent = (id) => {
        // Navigate to a dedicated viewing page
        navigate(`/admindashboard/view-event/${id}`);
    };

    const handleEditEvent = (id) => {
        // Navigate to the edit/form workspace page
        navigate(`/admindashboard/edit-event/${id}`);
    };

    const handleDeleteEvent = (id, title) => {
        // Basic confirmation dialogue box before item deletion
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (confirmDelete) {
            setEventsList(eventsList.filter(event => event.id !== id));
            alert("Event deleted successfully!");
        }
    };

    return (
        <div className="admin-page-canvas">
            <Navbar />
            {/* Dark Tech-Blue Top Hero Banner Layout */}
            <div className="admin-hero-banner">
                <div className="admin-hero-container">
                    <h1 className="admin-hero-title">Admin Dashboard</h1>
                    <p className="admin-hero-subtitle">Manage your events and applications</p>
                </div>
            </div>

            {/* Central Overlay Workspace Sheet Panel */}
            <div className="admin-sheet-wrapper">
                <div className="admin-sheet-card">

                    {/* Local Navigation Tabs - Modifying only local state */}
                    <div className="admin-tabs-row">
                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab("overview");
                            }}
                        >
                            Overview
                        </button>
                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "events" ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab("events");
                            }}
                        >
                            Events
                        </button>
                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "applications" ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab("applications");
                            }}
                        >
                            Applications
                        </button>
                    </div>

                    {/* --- CONDITIONAL VIEWS RENDERING BLOCK --- */}

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
                                        <h3 className="analytics-number">{eventsList.length}</h3>
                                    </div>
                                </div>
                                <div className="analytics-card orange-variant">
                                    <div className="analytics-icon-box orange-icon-bg">
                                        <FileText size={22} color="#e65c00" />
                                    </div>
                                    <div className="analytics-text-group">
                                        <span className="analytics-label">Applications</span>
                                        <h3 className="analytics-number">89</h3>
                                    </div>
                                </div>
                                <div className="analytics-card purple-variant">
                                    <div className="analytics-icon-box purple-icon-bg">
                                        <Users size={22} color="#8a2be2" />
                                    </div>
                                    <div className="analytics-text-group">
                                        <span className="analytics-label">Active Users</span>
                                        <h3 className="analytics-number">156</h3>
                                    </div>
                                </div>
                                <div className="analytics-card green-variant">
                                    <div className="analytics-icon-box green-icon-bg">
                                        <TrendingUp size={22} color="#00b074" />
                                    </div>
                                    <div className="analytics-text-group">
                                        <span className="analytics-label">Upcoming</span>
                                        <h3 className="analytics-number">5</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-activity-section">
                                <h2 className="tab-section-title">Recent Activity</h2>
                                <div className="activity-stack-list">
                                    {activityLogs.map((log) => (
                                        <div key={log.id} className="activity-log-strip">
                                            <div className="log-left-details">
                                                <p className="log-main-announcement">
                                                    New application for <span className="highlight-text-bold">{log.eventTitle}</span>
                                                </p>
                                                <p className="log-sub-role-label">Role: {log.role}</p>
                                            </div>
                                            <div className="log-right-timestamp"><span>{log.date}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* VIEW 2: EVENTS MANAGEMENT TAB */}
                    {activeTab === "events" && (
                        <div className="subtab-content-container">
                            <div className="subtab-header-row">
                                <h2 className="tab-section-title">Manage Events</h2>

                                {/* UPDATE THIS BUTTON WITH THE ONCLICK ATTRIBUTE */}
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
                                        {eventsData.map((event) => (
                                            <tr key={event.id}>
                                                <td>
                                                    <div className="table-media-cell">
                                                        <div className="table-event-thumb"></div>
                                                        <div className="table-cell-meta">
                                                            <div className="cell-main-title">{event.title}</div>
                                                            <div className="cell-sub-info">{event.location}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-neutral-dark">{event.date}</td>
                                                <td><span className="badge-pill category-pill">{event.category}</span></td>
                                                <td className="text-neutral-dark">{event.apps}</td>
                                                <td className="text-neutral-dark">{event.filled}</td>
                                                <td>
                                                    <div className="table-actions-group">
                                                        {/* Added onClick listeners here */}
                                                        <button
                                                            type="button"
                                                            className="action-icon-btn view-btn"
                                                            title="View Details"
                                                            onClick={() => handleViewEvent(event.id)}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="action-icon-btn edit-btn"
                                                            title="Edit Event"
                                                            onClick={() => handleEditEvent(event.id)}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="action-icon-btn delete-btn"
                                                            title="Delete Event"
                                                            onClick={() => handleDeleteEvent(event.id, event.title)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
                                        {applicationsData.map((app) => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className="table-media-cell">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                                                            alt="Applicant workspace representation"
                                                            className="table-avatar-img"
                                                        />
                                                        <div className="table-cell-meta">
                                                            <div className="cell-main-title">{app.applicant}</div>
                                                            <div className="cell-sub-info rating-inline">
                                                                <Star size={12} fill="#eab308" color="#eab308" /> {app.rating}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-neutral-dark">{app.event}</td>
                                                <td className="text-neutral-muted">{app.role}</td>
                                                <td className="text-neutral-dark">{app.appliedDate}</td>
                                                <td>
                                                    <span className={`badge-pill status-pill-${app.status.toLowerCase()}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions-group">
                                                        {app.status === "Pending" && (
                                                            <>
                                                                <button type="button" className="action-icon-btn approve-btn" title="Approve"><Check size={16} /></button>
                                                                <button type="button" className="action-icon-btn reject-btn" title="Reject"><X size={16} /></button>
                                                            </>
                                                        )}
                                                        <button type="button" className="action-icon-btn view-btn" title="View Applicant"><Eye size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
}
export default AdminDashboard;