import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Imported useParams to catch the real event ID
import './RegisterEvent.css';
import Footer from "../Components/ApplicantFooter";
import Navbar from "../Components/ApplicantNavbar";

const RegisterEvent = () => {
    const navigate = useNavigate(); // Initialize navigation
    const { eventId } = useParams(); // Capture dynamic event ID passed from the URL parameter

    // Sample state - in production, you'd fetch this based on the event ID
    const [selectedRole, setSelectedRole] = useState('');
    const [message, setMessage] = useState('');

    const eventDetails = {
        title: "Summer Music Festival",
        category: "Music",
        date: "2026-06-20",
        time: "02:00 PM - 11:00 PM",
        location: "Riverside Park",
        positionsFilled: "21/31",
        organizer: "LiveNation Events",
        description: "An outdoor music festival featuring local and international artists across multiple stages.",
        imageUrl: "https://via.placeholder.com/400x250"
    };

    const roles = [
        { id: 'stage-manager', name: 'Stage Manager', desc: 'Coordinate performances and stage transitions', spots: 1 },
        { id: 'security', name: 'Security Personnel', desc: 'Ensure safety and crowd control', spots: 5 },
        { id: 'cleaning', name: 'Cleaning Crew', desc: 'Maintain venue cleanliness throughout event', spots: 4 }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRole) {
            alert("Please select a role before registering!");
            return;
        }
        console.log("Registration Submitted:", { role: selectedRole, message });

        // 1. Success alert popup
        alert("You successfully registered to this event!");

        // 2. Redirect back to explore events and pass the true dynamic event ID down
        navigate('/events', {
            state: {
                pendingEventId: eventId
            }
        });
    };

    return (
        <div className="register-page-container">
            <Navbar />
            {/* Header Banner */}
            <header className="register-header">
                <button className="back-link" type="button" onClick={() => navigate('/events')}>
                    &lt; Back to Events
                </button>
                <h1>Register for Event</h1>
                <p>Confirm your registration details below</p>
            </header>

            {/* Main Content Split */}
            <main className="register-content">

                {/* Left Side: Event Summary Card */}
                <section className="event-summary-card">
                    <div className="card-image-wrapper">
                        <img src={eventDetails.imageUrl} alt={eventDetails.title} />
                        <span className="category-badge">{eventDetails.category}</span>
                    </div>
                    <div className="card-body">
                        <h2>{eventDetails.title}</h2>
                        <div className="meta-info">
                            <p><i className="icon-calendar"></i> {eventDetails.date} • {eventDetails.time}</p>
                            <p><i className="icon-location"></i> {eventDetails.location}</p>
                            <p><i className="icon-users"></i> {eventDetails.positionsFilled} positions filled</p>
                        </div>
                        <p className="event-desc">{eventDetails.description}</p>
                        <div className="organizer-info">
                            <span className="label">Organized by</span>
                            <p className="organizer-name">{eventDetails.organizer}</p>
                        </div>
                    </div>
                </section>

                {/* Right Side: Form Selection */}
                <section className="registration-form-wrapper">
                    <form onSubmit={handleSubmit} className="registration-form">
                        <h3>Your Application</h3>
                        <label className="section-label">Select a Role <span className="required">*</span></label>

                        {/* Roles Radio Group */}
                        <div className="roles-group">
                            {roles.map((role) => (
                                <label
                                    key={role.id}
                                    className={`role-option-card ${selectedRole === role.id ? 'active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="event-role"
                                        value={role.id}
                                        checked={selectedRole === role.id}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <div className="radio-custom-indicator"></div>
                                    <div className="role-text-details">
                                        <span className="role-name">{role.name}</span>
                                        <span className="role-desc">{role.desc}</span>
                                        <span className="role-spots-remaining">{role.spots} spot{role.spots > 1 ? 's' : ''} remaining</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Optional message to organizer */}
                        <div className="form-field">
                            <label htmlFor="organizer-message">Message to Organizer <span className="optional">(Optional)</span></label>
                            <textarea
                                id="organizer-message"
                                placeholder="Tell them why you are a great fit for this role..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={500}
                            />
                        </div>

                        {/* Terms/Notice Banner */}
                        <div className="notice-banner">
                            <p><strong>Please note:</strong> Cancellations are not permitted within 2 days of the event date.</p>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => navigate('/events')}>
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