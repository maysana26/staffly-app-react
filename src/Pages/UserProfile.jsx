import React, { useState, useEffect } from "react";
import { Star, Calendar, Briefcase, Award, Edit3, Check, X, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/ApplicantNavbar";
import Footer from "../Components/ApplicantFooter";
import FeedbackModal from "../Components/FeedbackModal";
import "./UserProfile.css";

function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [editAbout, setEditAbout] = useState("");
    const [editSkillsString, setEditSkillsString] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userSession = JSON.parse(localStorage.getItem("user"));

                if (!token || !userSession) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/applicant/profile?email=${encodeURIComponent(userSession.email)}`, {
                    method: "GET"
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setEditAbout(data.about || "");

                    if (data.skills) {
                        if (Array.isArray(data.skills)) {
                            setEditSkillsString(data.skills.join(", "));
                        } else if (typeof data.skills === "string") {
                            setEditSkillsString(data.skills);
                        }
                    } else {
                        setEditSkillsString("");
                    }
                } else {
                    console.error("Failed to fetch profile details");
                }
            } catch (error) {
                console.error("Database connection error:", error);
            } finally {
                loading && setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleSaveProfile = async () => {
        const processedSkills = editSkillsString
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        try {
            const token = localStorage.getItem("token");
            const userSession = JSON.parse(localStorage.getItem("user"));

            // Absolute identifier backup configuration setup
            const targetEmail = userSession?.email || profile?.email;

            const response = await fetch("http://localhost:5000/api/applicant/profile/update", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: targetEmail,
                    about: editAbout,
                    skills: processedSkills
                })
            });

            if (response.ok) {
                const updatedData = await response.json();
                const finalSkills = Array.isArray(updatedData.skills) ? updatedData.skills : processedSkills;

                setProfile(prev => ({
                    ...prev,
                    about: updatedData.about !== undefined ? updatedData.about : editAbout,
                    skills: finalSkills
                }));
                setIsEditing(false);
            } else {
                alert("Failed to update profile info in database.");
            }
        } catch (error) {
            console.error("Error saving profile update:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditAbout(profile?.about || "");
        setEditSkillsString(profile?.skills ? (Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills) : "");
        setIsEditing(false);
    };
    const handleLogout = () => {
        // Clear out everything completely from your user session storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("pendingEvents");

        alert("Logged out successfully!");
        navigate("/login"); // bounce back to the login page cleanly
    };

    if (loading) {
        return <div className="loading-fallback" style={{ textAlign: "center", padding: "120px", color: "#64748b" }}>Loading profile metrics safely...</div>;
    }

    if (!profile) {
        return <div className="error-fallback" style={{ textAlign: "center", padding: "120px", color: "#ef4444" }}>Error parsing profile connection.</div>;
    }

    return (
        <div className="profile-page-wrapper">
            <Navbar />

            <main className="profile-main-container">
                <div className="profile-card-cardboard">
                    <div className="profile-banner-hero" />

                    <div className="profile-header-details">
                        <div className="profile-header-left">
                            <div className="profile-avatar-frame" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt={profile.name} />
                                ) : (
                                    <div className="profile-avatar-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "#94a3b8", fontSize: "1.5rem", fontWeight: "bold" }}>
                                        {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={32} />}
                                    </div>
                                )}
                            </div>
                            <div className="profile-meta-identity">
                                <h1 className="profile-user-name">{profile.name}</h1>
                                <p className="profile-user-email">{profile.email}</p>
                            </div>
                        </div>

                        <div className="profile-header-right">
                            {!isEditing ? (
                                <div className="profile-actions-group">
                                    <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                                        <Edit3 size={14} /> <span>Edit Profile</span>
                                    </button>
                                    <button className="btn-logout-profile" onClick={handleLogout}>
                                        <LogOut size={14} /> <span>Logout</span>
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

                    <div className="metrics-summary-row">
                        <div className="metric-box box-rating">
                            <div className="metric-icon-circle circle-rating">
                                <Star size={18} fill="#ff6b00" color="#ff6b00" />
                            </div>
                            <div className="metric-txt-stack">
                                <span className="metric-lbl">Rating</span>
                                <span className="metric-val">{profile.rating || "N/A"}</span>
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
                                <span className="metric-val">{profile.total_events || 0}</span>
                            </div>
                        </div>

                        <div className="metric-box box-member">
                            <div className="metric-icon-circle circle-member">
                                <Calendar size={18} color="#a855f7" />
                            </div>
                            <div className="metric-txt-stack">
                                <span className="metric-lbl">Member Since</span>
                                <span className="metric-val">{profile.member_since || "2026"}</span>
                            </div>
                        </div>
                    </div>

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
                                <p className="body-block-paragraph">{profile.about || "No professional overview summary registered yet."}</p>
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
                                    {(Array.isArray(profile.skills) ? profile.skills : []).map((skill, index) => (
                                        <span key={index} className="profile-skill-badge">{skill}</span>
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
                                {(profile.experience && profile.experience.length > 0) ? (
                                    profile.experience.map((item) => (
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
                                    ))
                                ) : (
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No verification records found in feedback history registry rows.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <section className="registered-events-section">
                        <h2 className="registered-events-heading">
                            <Briefcase size={18} style={{ color: "#2563eb" }} />
                            <span>Current Registered Events</span>
                        </h2>

                        <div className="registered-events-vertical-list">
                            {(profile.registeredEvents && profile.registeredEvents.length > 0) ? (
                                profile.registeredEvents.map((event) => (
                                    <div key={event.id} className="registered-event-card-item">
                                        <div className="reg-event-header">
                                            <div>
                                                <h3 className="reg-event-title">
                                                    {event.title}
                                                    <span className="badge-confirmed">● {event.status}</span>
                                                </h3>
                                                <p className="reg-event-role-text">Role: <span>{event.role}</span></p>
                                            </div>
                                            <span className="reg-event-category-tag">{event.category}</span>
                                        </div>
                                        <p className="reg-event-location">📍 {event.location}</p>
                                        <div className="reg-event-meta-footer">
                                            <span><Calendar size={14} /> {event.date}</span>
                                            <span>⏱ {event.time}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', paddingLeft: '10px' }}>Not signed up for any active roles currently.</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <FeedbackModal />
            <Footer />
        </div>
    );
}

export default UserProfile;