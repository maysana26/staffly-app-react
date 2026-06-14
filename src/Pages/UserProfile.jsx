import React, { useState } from "react";
import { Star, Calendar, Briefcase, Award, Edit3, Check, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/ApplicantNavbar";
import Footer from "../Components/ApplicantFooter";
import FeedbackModal from "../Components/FeedbackModal";
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
    const [profile, setProfile] = useState(INITIAL_PROFILE_DATA);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [editAbout, setEditAbout] = useState(profile.about);
    const [editSkillsString, setEditSkillsString] = useState(profile.skills.join(", "));

    const handleSaveProfile = () => {
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

    const handleCancelEdit = () => {
        setEditAbout(profile.about);
        setEditSkillsString(profile.skills.join(", "));
        setIsEditing(false);
    };

    const handleLogout = () => {
        alert("Logging out...");
        navigate("/login");
    };

    return (
        <div className="profile-page-wrapper">
            <Navbar />

            <main className="profile-main-container">
                <div className="profile-card-cardboard">
                    <div className="profile-banner-hero" />

                    {/* Header Row Flex Container */}
                    <div className="profile-header-details">
                        <div className="profile-header-left">
                            <div className="profile-avatar-frame">
                                <img src={profile.avatar} alt={profile.name} />
                            </div>
                            <div className="profile-meta-identity">
                                <h1 className="profile-user-name">{profile.name}</h1>
                                <p className="profile-user-email">{profile.email}</p>
                            </div>
                        </div>

                        {/* Right side action layout block */}
                        <div className="profile-header-right">
                            {!isEditing ? (
                                <div className="profile-actions-group">
                                    <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                                        <Edit3 size={14} />
                                        <span>Edit Profile</span>
                                    </button>
                                    <button className="btn-logout-profile" onClick={handleLogout}>
                                        <LogOut size={14} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="profile-actions-group">
                                    <button className="btn-save-profile" onClick={handleSaveProfile}>
                                        <Check size={14} /> <span>Save</span>
                                    </button>
                                    <button className="btn-cancel-profile" onClick={handleCancelEdit}>
                                        <X size={14} /> <span>Cancel</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="metrics-summary-row">
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

                        <div className="metric-box box-events">
                            <div className="metric-icon-circle circle-events">
                                <Briefcase size={18} color="#2563eb" />
                            </div>
                            <div className="metric-txt-stack">
                                <span className="metric-lbl">Total Events</span>
                                <span className="metric-val">{profile.totalEvents}</span>
                            </div>
                        </div>

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

                    {/* Profile Information Blocks */}
                    <div className="profile-content-body">
                        <section className="body-data-block">
                            <h2 className="body-block-heading">About</h2>
                            {isEditing ? (
                                <textarea
                                    className="edit-profile-textarea"
                                    value={editAbout}
                                    onChange={(e) => setEditAbout(e.target.value)}
                                />
                            ) : (
                                <p className="body-block-paragraph">{profile.about}</p>
                            )}
                        </section>

                        <section className="body-data-block">
                            <h2 className="body-block-heading">Skills</h2>
                            {isEditing ? (
                                <div className="edit-skills-field-wrapper">
                                    <input
                                        type="text"
                                        className="edit-profile-input"
                                        value={editSkillsString}
                                        onChange={(e) => setEditSkillsString(e.target.value)}
                                    />
                                    <span className="edit-input-hint">Separate skills with commas (e.g. Hosting, Logistics)</span>
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

                    {/* Registered Events Section */}
                    <section className="registered-events-section">
                        <h2 className="registered-events-heading">
                            <Briefcase size={18} style={{ color: "#2563eb" }} />
                            <span>Current Registered Events</span>
                        </h2>

                        <div className="registered-events-vertical-list">
                            {profile.registeredEvents.map((event) => (
                                <div key={event.id} className="registered-event-card-item">
                                    <div className="reg-event-header">
                                        <div>
                                            <h3 className="reg-event-title">
                                                {event.title}
                                                <span className="badge-confirmed">
                                                    ● {event.status}
                                                </span>
                                            </h3>
                                            <p className="reg-event-role-text">
                                                Role: <span>{event.role}</span>
                                            </p>
                                        </div>
                                        <span className="reg-event-category-tag">
                                            {event.category}
                                        </span>
                                    </div>

                                    <p className="reg-event-location">📍 {event.location}</p>

                                    <div className="reg-event-meta-footer">
                                        <span><Calendar size={14} /> {event.date}</span>
                                        <span>⏱ {event.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Rendered cleanly above footer and locks screen viewport */}
            <FeedbackModal />

            <Footer />
        </div>
    );
}

export default UserProfile;