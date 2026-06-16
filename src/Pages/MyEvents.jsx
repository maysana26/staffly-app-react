import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle2, Clock, Star, XCircle } from "lucide-react";
import Navbar from "../Components/ApplicantNavbar";
import Footer from "../Components/ApplicantFooter";
import "./MyEvents.css";

function MyEvents() {
    const getLoggedInUser = () => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch (error) {
            console.error("Error reading user session storage:", error);
            return null;
        }
    };

    const currentUser = getLoggedInUser();

    const [eventsList, setEventsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState({
        name: currentUser?.name || "User",
        rating: currentUser?.rating !== undefined ? currentUser.rating : 0
    });

    const totalApplications = eventsList.length;
    const acceptedCount = eventsList.filter(event => event.status === "Accepted" || event.status === "Approved" || event.status === "Confirmed").length;
    const pendingCount = eventsList.filter(event => event.status === "Pending").length;

    useEffect(() => {
        const fetchUserDashboardData = async () => {
            if (!currentUser) {
                setIsLoading(false);
                return;
            }

            const applicantId = currentUser.user_id;
            const email = currentUser.email;

            try {
                const eventsResponse = await fetch(`http://localhost:5000/api/applicant/myevents?applicantId=${applicantId}`);
                if (eventsResponse.ok) {
                    const eventsData = await eventsResponse.json();
                    setEventsList(eventsData || []);
                }

                const profileResponse = await fetch(`http://localhost:5000/api/applicant/profile?email=${encodeURIComponent(email)}`);
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setUserProfile({
                        name: profileData.name || currentUser.name,
                        rating: profileData.rating !== undefined ? profileData.rating : 0
                    });
                }
            } catch (err) {
                console.error("Database tracker stream link issue:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDashboardData();
    }, []);

    const handleCancelApplication = async (id, title) => {
        const confirmCancel = window.confirm(`Are you sure you want to cancel your application for "${title}"?`);
        if (!confirmCancel) return;

        try {
            const response = await fetch(`http://localhost:5000/api/applicant/my-applications/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setEventsList(prevList => prevList.filter(event => event.application_id !== id));
                alert("Application canceled successfully.");
            } else {
                alert("Failed to confirm cancel request changes on server logs.");
            }
        } catch (error) {
            console.error("Cancellation transmission failure error handle:", error);
        }
    };

    if (isLoading) {
        return <div style={{ textAlign: "center", padding: "120px", color: "#64748b" }}>Loading Dashboard Matrix...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-page-content">
                <div className="dashboard-container">

                    <div className="dashboard-header">
                        <h1 className="dashboard-main-title">My Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back, {userProfile.name}!</p>
                    </div>

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
                                {userProfile.rating && Number(userProfile.rating) > 0 ? (
                                    <>
                                        {Number(userProfile.rating).toFixed(1)} <Star size={24} fill="#eab308" color="#eab308" className="inline-star" />
                                    </>
                                ) : (
                                    <span style={{ color: "#94a3b8", fontSize: "1.5rem" }}>No Ratings</span>
                                )}
                            </h2>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h3 className="section-title-label">Upcoming Events</h3>

                        <div className="events-vertical-stack">
                            {eventsList.length === 0 ? (
                                <div className="no-applications-fallback" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                    <p>You currently have no active event applications.</p>
                                </div>
                            ) : (
                                eventsList.map((event) => (
                                    <div key={event.application_id || event.id} className="event-item-card">
                                        <div className="event-main-info-row">
                                            <div className="event-thumbnail-box">
                                                <div className="thumbnail-dark-overlay"></div>
                                            </div>

                                            <div className="event-details-column">
                                                <h4 className="event-card-title">{event.title}</h4>
                                                <p className="event-card-role">Applied for: <span>{event.role || event.role_name}</span></p>

                                                <div className="event-meta-inline-info">
                                                    <div className="meta-item">
                                                        <Calendar size={14} />
                                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span>📍 {event.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="event-actions-column">
                                                <span className={`status-pill-badge ${event.status ? event.status.toLowerCase() : "pending"}`}>
                                                    {event.status === "Accepted" || event.status === "Approved" || event.status === "Confirmed" ? (
                                                        <CheckCircle2 size={14} />
                                                    ) : (
                                                        <Clock size={14} />
                                                    )}
                                                    {event.status || "Pending"}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn-cancel-application"
                                                    onClick={() => handleCancelApplication(event.application_id, event.title)}
                                                >
                                                    <XCircle size={14} /> Cancel
                                                </button>
                                            </div>
                                        </div>
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