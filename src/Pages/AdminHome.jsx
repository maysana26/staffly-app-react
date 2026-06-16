import React, { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Users, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar";
import FeatureCard from "../Components/FeatureCard";
import EventCard from "../Components/EventCard";
import "./AdminHome.css";
import AdminFooter from "../Components/AdminFooter";

const adminFeatures = [
    { icon: CalendarDays, title: "Manage Events", description: "Create new schedules, modify details, and coordinate logistical booking data directly", iconBg: "#ff6b00" },
    { icon: Users, title: "Track Applicants", description: "Review incoming talent forms, assign open roles, and oversee staff placement matrices", iconBg: "#2563eb" },
    { icon: ShieldCheck, title: "System Control", description: "Audit structural permissions, configure brand details, and maintain secure access configurations", iconBg: "#a855f7" }
];

function AdminHome() {
    const navigate = useNavigate();
    const [managedEvents, setManagedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pull high priority/active running deployments from DB
    useEffect(() => {
        const fetchActiveManagedEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/events");
                if (!response.ok) throw new Error("Error polling server logs.");
                const data = await response.json();

                // Show the top 3 most recent managed events on Home showcase
                setManagedEvents(data.slice(0, 3));
            } catch (error) {
                console.error("Could not fetch active managed events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveManagedEvents();
    }, []);

    return (
        <div className="admin-home-container">
            {/* 1. Global Navigation Bar */}
            <AdminNavbar />

            {/* 2. Hero Presentation Layout */}
            <header className="admin-hero-section">
                <h1 className="admin-hero-title">
                    Manage Your Next<br />
                    <span className="admin-text-event">Staffly</span>{" "}
                    <span className="admin-text-opportunity">Operation</span>
                </h1>
                <p className="admin-hero-subtitle">
                    Oversee top event organizers and build your system roster in real-time management. Create operations, verify experience parameters, and deploy crews.
                </p>
                <div className="admin-hero-buttons">
                    <button className="admin-btn-primary" onClick={() => navigate("/admindashboard")}>
                        Go To Dashboard <ArrowRight size={18} />
                    </button>
                    <button className="admin-btn-secondary" onClick={() => navigate("/admindashboard")}>
                        Review Live Events
                    </button>
                </div>
            </header>

            {/* 3. Highlight/Feature Grid */}
            <section className="admin-features-container">
                {adminFeatures.map((item, index) => (
                    <FeatureCard
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        iconBg={item.iconBg}
                    />
                ))}
            </section>

            {/* 4. Filtered Events Display Showcase */}
            <section className="admin-events-section">
                <h2 className="admin-section-title">Active Managed Events</h2>
                <p className="admin-section-subtitle">System deployments available for overview right now</p>

                <div className="admin-events-grid">
                    {loading ? (
                        <div style={{ textAlign: "center", gridColumn: "1/-1", padding: "20px", color: "#64748b" }}>
                            Synchronizing live rosters...
                        </div>
                    ) : managedEvents.length === 0 ? (
                        <div style={{ textAlign: "center", gridColumn: "1/-1", padding: "20px", color: "#64748b" }}>
                            No managed operations active in database.
                        </div>
                    ) : (
                        managedEvents.map((event, index) => {
                            const currentId = event.event_id || event.id || event._id;
                            return (
                                <div
                                    key={currentId || index}
                                    onClick={() => navigate(`/admindashboard`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <EventCard
                                        image={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600"}
                                        title={event.title}
                                        date={event.date ? new Date(event.date).toLocaleDateString() : "TBD"}
                                        location={event.location || "Remote"}
                                        roles={event.slots_needed || event.totalSpots || 0}
                                        category={event.category || "General"}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>

                <button className="admin-view-all-btn" onClick={() => navigate("/admindashboard")}>
                    Manage All Events →
                </button>
            </section>

            <AdminFooter />
        </div>
    );
}

export default AdminHome;