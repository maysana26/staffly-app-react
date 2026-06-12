import React from "react";
import { Calendar, MapPin, Tag, Building2, Plus, CheckCircle } from "lucide-react";
import "./CreateEvent.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
    const navigate = useNavigate();

    return (
        <div className="create-event-canvas">
            <Navbar />
            {/* Top Hero Banner with Back Navigation Link */}
            <div className="create-event-hero">
                <div className="create-event-hero-container">
                    <button
                        type="button"
                        className="back-dashboard-btn"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Admin Dashboard
                    </button>
                    <h1 className="create-event-hero-title">Create New Event</h1>
                    <p className="create-event-hero-subtitle">Fill in the details and add roles for your event</p>
                </div>
            </div>

            {/* Central Form Container Wrapper */}
            <div className="create-event-form-wrapper">
                <form className="create-event-form" onSubmit={(e) => e.preventDefault()}>

                    {/* SECTION 1: EVENT INFORMATION CARD */}
                    <div className="form-section-card">
                        <h2 className="section-card-title">
                            <span className="title-icon-orange">📅</span> Event Information
                        </h2>

                        <div className="form-grid">
                            {/* Event Title - Full Width */}
                            <div className="form-group full-width">
                                <label className="form-input-label">Event Title *</label>
                                <input
                                    type="text"
                                    className="form-text-input"
                                    placeholder="e.g., Tech Innovation Summit 2026"
                                    required
                                />
                            </div>

                            {/* Date - Half Width */}
                            <div className="form-group half-width">
                                <label className="form-input-label">Date *</label>
                                <input
                                    type="date"
                                    className="form-text-input"
                                    required
                                />
                            </div>

                            {/* Time - Half Width */}
                            <div className="form-group half-width">
                                <label className="form-input-label">Time *</label>
                                <input
                                    type="text"
                                    className="form-text-input"
                                    placeholder="e.g., 09:00 AM - 06:00 PM"
                                    required
                                />
                            </div>

                            {/* Location - Full Width */}
                            <div className="form-group full-width icon-input-wrapper">
                                <label className="form-input-label">Location *</label>
                                <div className="input-with-icon">
                                    <MapPin size={16} className="input-inner-icon" />
                                    <input
                                        type="text"
                                        className="form-text-input padded-left"
                                        placeholder="e.g., Convention Center, Downtown"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description - Full Width Textarea */}
                            <div className="form-group full-width">
                                <label className="form-input-label">Description *</label>
                                <textarea
                                    className="form-textarea-input"
                                    placeholder="Provide a detailed description of the event..."
                                    rows={5}
                                    required
                                ></textarea>
                            </div>

                            {/* Category - Half Width */}
                            <div className="form-group half-width icon-input-wrapper">
                                <label className="form-input-label">Category *</label>
                                <div className="input-with-icon">
                                    <Tag size={16} className="input-inner-icon" />
                                    <input
                                        type="text"
                                        className="form-text-input padded-left"
                                        placeholder="Category"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Company Name - Half Width */}
                            <div className="form-group half-width icon-input-wrapper">
                                <label className="form-input-label">Company Name *</label>
                                <div className="input-with-icon">
                                    <Building2 size={16} className="input-inner-icon" />
                                    <input
                                        type="text"
                                        className="form-text-input padded-left"
                                        placeholder="Your Company Name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Event Image URL - Full Width */}
                            <div className="form-group full-width icon-input-wrapper">
                                <label className="form-input-label">Event Image URL</label>
                                <div className="input-with-icon">
                                    <span className="input-inner-icon image-placeholder-icon">🖼️</span>
                                    <input
                                        type="url"
                                        className="form-text-input padded-left"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ROLES & POSITIONS CARD */}
                    <div className="form-section-card">
                        <div className="section-card-header-row">
                            <h2 className="section-card-title">Roles & Positions</h2>
                            <button type="button" className="btn-add-role">
                                <Plus size={16} /> Add Role
                            </button>
                        </div>

                        {/* Role Segment Block nested inner box */}
                        <div className="nested-role-blueprint-box">
                            <h3 className="role-index-heading">Role #1</h3>

                            <div className="form-grid">
                                {/* Role Name */}
                                <div className="form-group custom-three-quarters">
                                    <label className="form-input-label">Role Name *</label>
                                    <input
                                        type="text"
                                        className="form-text-input"
                                        placeholder="e.g., Event Coordinator"
                                        required
                                    />
                                </div>

                                {/* Positions Needed */}
                                <div className="form-group custom-one-quarter">
                                    <label className="form-input-label">Positions Needed *</label>
                                    <input
                                        type="number"
                                        className="form-text-input"
                                        defaultValue={1}
                                        min={1}
                                        required
                                    />
                                </div>

                                {/* Role Description */}
                                <div className="form-group full-width">
                                    <label className="form-input-label">Role Description *</label>
                                    <textarea
                                        className="form-textarea-input"
                                        placeholder="Describe the responsibilities and requirements..."
                                        rows={3}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: DISCLAIMER CALLOUT NOTE */}
                    <div className="form-disclaimer-callout">
                        <p className="disclaimer-text">
                            I confirm that all event details are accurate and I have the authority to post this event on behalf of my organization.
                        </p>
                    </div>

                    {/* BOTTOM ACTION BUTTONS ROW */}
                    <div className="form-submit-actions-row">
                        <button type="button" className="btn-cancel-action">
                            Cancel
                        </button>
                        <button type="submit" className="btn-publish-submit">
                            <CheckCircle size={16} /> Publish Event
                        </button>
                    </div>

                </form>
            </div>
            <Footer />
        </div>

    );
}

export default CreateEvent;