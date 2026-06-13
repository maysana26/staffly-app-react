import React, { useState } from "react";
import { Star, Calendar, Briefcase, Award, Edit3, Check, X } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./UserProfile.css";


const INITIAL_PROFILE_DATA = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: "4.8",
    totalEvents: 24,
    memberSince: "Jan 2024",
    about: "Experienced event staff with a passion for creating memorable experiences. Specialized in registration management and customer service.",
    skills: ["Event Coordination", "Customer Service", "Registration Management", "Problem Solving"],
    experience: [
        {
            id: 1,
            title: "Winter Tech Conference",
            role: "Registration Desk Staff",
            date: "February 10, 2026",
            rating: "5.0"
        },
        {
            id: 2,
            title: "Spring Music Festival",
            role: "Information Booth",
            date: "March 15, 2026",
            rating: "4.5"
        },
        {
            id: 3,
            title: "Corporate Team Building",
            role: "Event Coordinator",
            date: "December 5, 2025",
            rating: "5.0"
        },
        {
            id: 4,
            title: "Food & Wine Expo",
            role: "Registration Staff",
            date: "November 20, 2025",
            rating: "4.8"
        }
    ],

    // New Dataset object block added for currently registered events section at the bottom
    registeredEvents: [
        {
            id: 1,
            title: "Tech Innovation Summit 2026",
            role: "Registration Desk Staff",
            location: "Convention Center, Downtown",
            date: "May 15, 2026",
            time: "08:00 AM - 05:00 PM",
            status: "Confirmed",
            category: "Technology"
        },
        {
            id: 2,
            title: "Art Gallery Opening",
            role: "Reception Staff",
            location: "Modern Art Museum",
            date: "May 8, 2026",
            time: "05:00 PM - 09:00 PM",
            status: "Confirmed",
            category: "Arts"
        }
    ]
};



function UserProfile() {
    // 1. Core component state handlers
    const [profile, setProfile] = useState(INITIAL_PROFILE_DATA);
    const [isEditing, setIsEditing] = useState(false);

    // Form temporary states for edit session manipulation
    const [editAbout, setEditAbout] = useState(profile.about);
    const [editSkillsString, setEditSkillsString] = useState(profile.skills.join(", "));

    // 2. Action to persist changes and switch view mode
    const handleSaveProfile = () => {
        // Clean array mapping from comma-delimited list string inputs
        const processedSkills = editSkillsString
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        setProfile(prev => ({
            ...prev,
            about: editAbout,
            skills: processedSkills
        }));
        setIsEditing(false);
    };

    // Action to abort any ongoing profile updates safely
    const handleCancelEdit = () => {
        setEditAbout(profile.about);
        setEditSkillsString(profile.skills.join(", "));
        setIsEditing(false);
    };
    return (

        <div className="profile-page-wrapper">
            {/* Global Navbar Integration */}
            <Navbar />

            {/* Main Center Stage Container Layout */}
            <main className="profile-main-container">
                <div className="profile-card-cardboard">

                    {/* Top Decorative Brand Orange Banner Row */}
                    <div className="profile-banner-hero" />

                    {/* Bio Identity Summary Segment Block */}
                    <div className="profile-header-details" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
                        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
                            <div className="profile-avatar-frame">
                                <img src={profile.avatar} alt={profile.name} />
                            </div>

                            <div className="profile-meta-identity" style={{ marginBottom: "10px" }}>
                                {/* Fixed: Added user name element header block */}
                                <h1 className="profile-user-name" style={{ margin: "0 0 4px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>{profile.name}</h1>
                                <p className="profile-user-email" style={{ margin: 0, color: "#64748b" }}>{profile.email}</p>
                            </div>
                        </div>

                        <div className="profile-meta-identity" style={{ marginBottom: "15px", paddingLeft: "300px" }}>
                            <div >
                                {!isEditing ? (
                                    <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                                        <Edit3 size={14} />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <div className="edit-actions-cluster" style={{ display: "flex", gap: "8px" }}>
                                        <button className="btn-save-profile" onClick={handleSaveProfile} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}>
                                            <Check size={14} /> Save
                                        </button>
                                        <button className="btn-cancel-profile" onClick={handleCancelEdit} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}>
                                            <X size={14} /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Core Application Metrics Row Grid */}
                    <div className="metrics-summary-row">
                        {/* Metric Box: Rating */}
                        <div className="metric-box box-rating">
                            <div className="metric-icon-circle circle-rating">
                                <Star size={18} fill="#ff6b00" color="#ff6b00" />
                            </div>
                            <div className="metric-txt-stack">
                                <span className="metric-lbl">Rating</span>
                                <span className="metric-val">{profile.rating}</span>
                                <div className="stars-indicator-row">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill="#ff6b00" color="#ff6b00" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Metric Box: Total Events */}
                        <div className="metric-box box-events">
                            <div className="metric-icon-circle circle-events">
                                <Briefcase size={18} color="#2563eb" />
                            </div>
                            <div className="metric-txt-stack">
                                <span className="metric-lbl">Total Events</span>
                                <span className="metric-val">{profile.totalEvents}</span>
                            </div>
                        </div>

                        {/* Metric Box: Member Since */}
                        <div className="metric-box box-member">
                            <div className="metric-icon-circle circle-member">
                                <Calendar size={18} color="#a855f7" />
                            </div>
                            <div className="metric-txt-stack">
                                <span className="metric-lbl">Member Since</span>
                                <span className="metric-val">{profile.memberSince}</span>
                            </div>
                        </div>
                    </div>

                    {/* Information Sections Area */}
                    <div className="profile-content-body">
                        {/* Section 1: About */}
                        <section className="body-data-block">
                            <h2 className="body-block-heading">About</h2>

                            {isEditing ? (
                                <textarea
                                    className="edit-profile-textarea"
                                    value={editAbout}
                                    onChange={(e) => setEditAbout(e.target.value)}
                                    style={{ width: "100%", minHeight: "80px", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontFamily: "inherit", fontSize: "14px", resize: "vertical" }}
                                />
                            ) : (
                                <p className="body-block-paragraph">{profile.about}</p>
                            )}

                        </section>

                        {/* Section 2: Skills */}
                        <section className="body-data-block">
                            <h2 className="body-block-heading">Skills</h2>
                            {isEditing ? (
                                <div className="edit-skills-field-wrapper">
                                    <input
                                        type="text"
                                        className="edit-profile-input"
                                        value={editSkillsString}
                                        onChange={(e) => setEditSkillsString(e.target.value)}
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "4px" }}
                                    />
                                    <span style={{ fontSize: "12px", color: "#64748b" }}>Separate custom skills with commas (e.g. Hosting, Logistics, Multitasking)</span>
                                </div>
                            ) : (
                                <div className="profile-skills-flexbox">
                                    {profile.skills.map((skill, index) => (
                                        <span key={index} className="profile-skill-badge">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Section 3: Experience History Timeline */}
                        <section className="body-data-block">
                            <h2 className="body-block-heading heading-with-icon">
                                <Award size={18} className="heading-icon-award" />
                                <span>Experience History</span>
                            </h2>

                            <div className="experience-history-list">
                                {profile.experience.map((item) => (
                                    <div key={item.id} className="history-card-item">
                                        <div className="history-left-details">
                                            <h3 className="history-event-title">{item.title}</h3>
                                            <p className="history-event-role">{item.role}</p>
                                            <div className="history-meta-date">
                                                <Calendar size={14} />
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                        <div className="history-right-badge">
                                            <Star size={14} fill="#ff6b00" color="#ff6b00" />
                                            <span>{item.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                    {/* Fixed: Section 4 Added - Current Registered Events Block Area */}
                    <section className="body-data-block current-registered-events-section" style={{ marginTop: "32px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                        <h2 className="body-block-heading heading-with-icon" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#1e293b", paddingLeft: "20px" }}>
                            <Briefcase size={18} style={{ color: "#2563eb" }} />
                            <span>Current Registered Events</span>
                        </h2>

                        <div className="registered-events-vertical-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {profile.registeredEvents.map((event) => (
                                <div key={event.id} className="registered-event-card-item" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", background: "#f8fafc", position: "relative" }}>

                                    {/* Top Info Header Line */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                        <div>
                                            <h3 className="reg-event-title" style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
                                                {event.title}
                                                <span className="badge-confirmed" style={{ marginLeft: "10px", fontSize: "12px", background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "9999px", fontWeight: "500" }}>
                                                    ● {event.status}
                                                </span>
                                            </h3>
                                            <p style={{ margin: 0, fontSize: "14px", color: "#475569" }}>
                                                Role: <span style={{ fontWeight: "500", color: "#1e293b" }}>{event.role}</span>
                                            </p>
                                        </div>

                                        {/* Category Tag pill badge */}
                                        <span style={{ fontSize: "12px", background: "#dbeafe", color: "#1d4ed8", padding: "4px 10px", borderRadius: "6px", fontWeight: "500" }}>
                                            {event.category}
                                        </span>
                                    </div>

                                    {/* Subtext Location & Metadata Row Details */}
                                    <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#64748b" }}>
                                        📍 {event.location}
                                    </p>

                                    {/* Inline Date & Time Properties Wrapper layout */}
                                    <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#475569" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <Calendar size={14} /> {event.date}
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            ⏱ {event.time}
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Global Shareable Footer component alignment */}
            <Footer />
        </div>
    );


}
export default UserProfile;