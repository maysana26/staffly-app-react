import React, { useState } from "react";
import { Calendar, CheckCircle2, Clock, Star, XCircle } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./MyEvents.css"

// Array matching the upcoming events data block from the mockup
const INITIAL_EVENTS = [
    {
        id: 1,
        title: "Tech Innovation Summit 2026",
        role: "Registration Desk Staff",
        date: "2026-05-15",
        location: "Convention Center, Downtown",
        daysLeft: "28 days until event",
        status: "Accepted",
        alertMessage: "Congratulations! Your application has been accepted. Please ensure your attendance."
    },
    {
        id: 2,
        title: "Startup Pitch Night",
        role: "Registration Staff",
        date: "2026-04-25",
        location: "Innovation Hub",
        daysLeft: "8 days until event",
        status: "Pending",
        alertMessage: null
    },
    {
        id: 3,
        title: "Art Gallery Opening",
        role: "Reception Staff",
        date: "2026-05-08",
        location: "Modern Art Museum",
        daysLeft: "21 days until event",
        status: "Accepted",
        alertMessage: "Congratulations! Your application has been accepted. Please ensure your attendance."
    }
];

function MyEvents() {
    const [eventsList, setEventsList] = useState(INITIAL_EVENTS);
    const totalApplications = eventsList.length;
    const acceptedCount = eventsList.filter(event => event.status === "Accepted").length;
    const pendingCount = eventsList.filter(event => event.status === "Pending").length;

    const handleCancelApplication = (id, title) => {
        const confirmCancel = window.confirm(`Are you sure you want to cancel your application for "${title}"?`);
        if (confirmCancel) {
            setEventsList(prevList => prevList.filter(event => event.id !== id));
        }
    };
    return (

        <>
            <Navbar />
            <div className="dashboard-page-content">

                <div className="dashboard-container">

                    {/* Header Welcome Banner Grid Title */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-main-title">My Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back, Sarah Johnson!</p>
                    </div>

                    {/* Performance Metrics Summary Ribbon Cards */}
                    <div className="stats-grid-row">

                        <div className="stat-card">
                            <span className="stat-label">Total Applications</span>
                            <h2 className="stat-value text-dark">{totalApplications}</h2>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">Accepted</span>
                            <h2 className="stat-value text-green">{acceptedCount}</h2>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">Pending</span>
                            <h2 className="stat-value text-orange">{pendingCount}</h2>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">Rating</span>
                            <h2 className="stat-value text-dark rating-display">
                                4.8 <Star size={24} fill="#eab308" color="#eab308" className="inline-star" />
                            </h2>
                        </div>

                    </div>

                    {/* Main Incoming Tracking Stream Cards Block */}
                    <div className="dashboard-section">
                        <h3 className="section-title-label">Upcoming Events</h3>

                        <div className="events-vertical-stack">
                            {eventsList.length === 0 ? (
                                <div className="no-applications-fallback" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                    <p>You currently have no active event applications.</p>
                                </div>
                            ) : (

                                eventsList.map((event) => (
                                    <div key={event.id} className="event-item-card">

                                        <div className="event-main-info-row">
                                            {/* Left Side: Mock Image Placeholder Core */}
                                            <div className="event-thumbnail-box">
                                                <div className="thumbnail-dark-overlay"></div>
                                            </div>

                                            {/* Center: Detailed Text Data Elements */}
                                            <div className="event-details-column">
                                                <h4 className="event-card-title">{event.title}</h4>
                                                <p className="event-card-role">Applied for: <span>{event.role}</span></p>

                                                <div className="event-meta-inline-info">
                                                    <div className="meta-item">
                                                        <Calendar size={14} />
                                                        <span>{event.date}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span>📍 {event.location}</span>
                                                    </div>
                                                    <div className="meta-item text-muted">
                                                        <Clock size={14} />
                                                        <span>{event.daysLeft}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Direct Action Status Handles */}
                                            <div className="event-actions-column">
                                                <span className={`status-pill-badge ${event.status.toLowerCase()}`}>
                                                    {event.status === "Accepted" ? (
                                                        <CheckCircle2 size={14} />
                                                    ) : (
                                                        <Clock size={14} />
                                                    )}
                                                    {event.status}
                                                </span>
                                                <button type="button" className="btn-cancel-application" onClick={() => handleCancelApplication(event.id, event.title)} >
                                                    <XCircle size={14} /> Cancel
                                                </button>
                                            </div>
                                        </div>

                                        {/* Bottom Condition: Glow Message Alerts (If Accepted) */}
                                        {event.alertMessage && (
                                            <div className="event-status-alert-banner">
                                                🎉 <span>{event.alertMessage}</span>
                                            </div>
                                        )}

                                    </div>
                                ))
                            )}
                        </div>

                    </div>

                </div>

            </div>
            <Footer />
        </>
    );
}
export default MyEvents;