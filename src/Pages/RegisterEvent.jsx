import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RegisterEvent.css';
import Footer from "../Components/ApplicantFooter";
import Navbar from "../Components/ApplicantNavbar";

const RegisterEvent = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [eventDetails, setEventDetails] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTargetEventDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/applicant/events/${eventId}`
                );

                if (response.ok) {
                    const data = await response.json();

                    setEventDetails({
                        title: data.title,
                        category: data.category,
                        date: data.date,
                        time: data.time,
                        location: data.location,
                        positionsFilled: `${data.filledSpots || 0}/${data.totalSpots || 0}`,
                        organizer: data.organizerName || "Organizer Management",
                        description: data.description,
                        imageUrl: data.image || "https://via.placeholder.com/400x250"
                    });

                    setRoles(data.availableRoles || []);
                } else {
                    console.error("Failed to load event details");
                    setEventDetails(null);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setEventDetails(null);
            } finally {
                setLoading(false);
            }
        };

        if (!eventId || eventId === "undefined") {
            console.error("Invalid eventId:", eventId);
            setLoading(false);
            return;
        }

        fetchTargetEventDetails();

    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedRole) {
            alert("Please select a role before registering!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Session expired. Please log in again.");
                navigate('/login');
                return;
            }

            // Decode the token carefully
            let applicantId = null;
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = JSON.parse(window.atob(base64));

                console.log("Decoded Token Data:", decoded);

                applicantId = decoded.user_id || decoded.id || decoded.userId || decoded._id;
            } catch (jwtErr) {
                console.error("JWT decoding problem:", jwtErr);
            }

            if (!applicantId) {
                alert("Could not identify your user account. Try logging out and back in.");
                return;
            }

            const payload = {
                roleId: selectedRole,
                applicantId: applicantId,
                userNotes: message
            };

            console.log("Sending registration payload to backend:", payload);

            const response = await fetch(
                `http://localhost:5000/api/applicant/register`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (response.ok) {
                const data = await response.json();
                alert(data.message || "Request sent successfully!");

                // Save eventId to pending storage array registry
                const pending = JSON.parse(localStorage.getItem("pendingEvents") || "[]");
                if (!pending.includes(eventId)) {
                    pending.push(eventId);
                    localStorage.setItem("pendingEvents", JSON.stringify(pending));
                }

                // Redirect cleanly back to explore events dashboard layout instead of crashing into login
                navigate('/explore-events');
            } else {
                const errData = await response.json().catch(() => ({}));
                console.error("Backend returned error status:", response.status, errData);
                alert(errData.message || `Registration failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error("CRITICAL NETWORK/FETCH ERROR:", error);
            alert(`Network Error: Cannot connect to backend server. ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="loading-fallback">
                Loading context event dynamic configuration items...
            </div>
        );
    }

    if (!eventDetails) {
        return (
            <div className="error-fallback">
                Targeted event item details could not be matched.
            </div>
        );
    }

    return (
        <div className="register-page-container">
            <Navbar />

            <header className="register-header">
                <button className="back-link" onClick={() => navigate('/events')}>
                    &lt; Back to Explore
                </button>
                <h1>Register for Event</h1>
                <p>Confirm your registration details below</p>
            </header>

            <main className="register-content">
                <section className="event-summary-card">
                    <div className="card-image-wrapper">
                        <img src={eventDetails.imageUrl} alt={eventDetails.title} />
                        {eventDetails.category && (
                            <span className="category-badge">{eventDetails.category}</span>
                        )}
                    </div>
                    <div className="card-body">
                        <h2>{eventDetails.title}</h2>
                        <div className="meta-info">
                            <p className="event-date">📅 {eventDetails.date}</p>
                            <p className="event-location">📍 {eventDetails.location}</p>
                            <p className="event-positions">👥 {eventDetails.positionsFilled} positions filled</p>
                        </div>
                        <p className="event-desc">{eventDetails.description}</p>
                        <div className="organizer-info">
                            <span className="label">Organized by</span>
                            <p className="organizer-name">{eventDetails.organizer}</p>
                        </div>
                    </div>
                </section>

                <section className="registration-form-wrapper">
                    <form className="registration-form" onSubmit={handleSubmit}>
                        <h3>Your Application</h3>

                        <span className="section-label">
                            Select a Role <span className="required">*</span>
                        </span>

                        <div className="roles-group">
                            {roles.map(role => (
                                <label
                                    key={role.id}
                                    className={`role-option-card ${selectedRole === role.id ? 'active' : ''}`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    <input
                                        type="radio"
                                        name="eventRole"
                                        value={role.id}
                                        checked={selectedRole === role.id}
                                        onChange={() => setSelectedRole(role.id)}
                                    />
                                    <span className="radio-custom-indicator"></span>
                                    <div className="role-text-details">
                                        <span className="role-name">{role.name}</span>
                                        {role.desc && <span className="role-desc">{role.desc}</span>}
                                        {role.spots !== undefined && (
                                            <span className="role-spots-remaining">
                                                {role.spots} spot{role.spots !== 1 ? 's' : ''} remaining
                                            </span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="form-field">
                            <label>
                                Message to Organizer <span className="optional">(Optional)</span>
                            </label>
                            <textarea
                                placeholder="Tell them why you are a great fit for this role..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <div className="notice-banner">
                            <p><strong>Please note:</strong> Cancellations are not permitted within 2 days of the event date.</p>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => navigate('/explore-events')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit">
                                Confirm Registration
                            </button>
                        </div>
                    </form>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default RegisterEvent;