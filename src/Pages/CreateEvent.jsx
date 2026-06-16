import React, { useState } from "react";
import { Calendar, MapPin, Tag, Building2, Plus, CheckCircle } from "lucide-react";
import "./CreateEvent.css";
import Navbar from "../Components/AdminNavbar";
import Footer from "../Components/AdminFooter";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
    const navigate = useNavigate();

    // Database state fields for event information
    const [eventData, setEventData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "",
        companyName: "",
        imageUrl: ""
    });

    // Database state fields for nested roles
    const [roles, setRoles] = useState([
        { name: "", slots: 1, description: "" }
    ]);

    // Update event data fields dynamically
    const handleEventChange = (field, value) => {
        setEventData(prev => ({ ...prev, [field]: value }));
    };

    // Update individual nested dynamic roles
    const handleRoleChange = (index, field, value) => {
        const updatedRoles = [...roles];
        updatedRoles[index][field] = field === "slots" ? (parseInt(value) || 1) : value;
        setRoles(updatedRoles);
    };

    // Add a new blank nested database role row object
    const handleAddRole = () => {
        setRoles([...roles, { name: "", slots: 1, description: "" }]);
    };

    // Remove a dynamic role row object from array state
    const handleRemoveRole = (index) => {
        if (roles.length > 1) {
            setRoles(roles.filter((_, i) => i !== index));
        }
    };

    // Database HTTP POST submission lifecycle handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...eventData,
            roles: roles
        };

        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Event successfully created and published!");
                navigate("/admin");
            } else {
                const errorData = await response.json();
                alert(`Error publishing event: ${errorData.message || "Unknown error occured"}`);
            }
        } catch (error) {
            console.error("Database connection failure:", error);
            alert("Failed to connect to the database server.");
        }
    };

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
                <form className="create-event-form" onSubmit={handleSubmit}>

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
                                    value={eventData.title}
                                    onChange={(e) => handleEventChange("title", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Date - Half Width */}
                            <div className="form-group half-width">
                                <label className="form-input-label">Date *</label>
                                <input
                                    type="date"
                                    className="form-text-input"
                                    value={eventData.date}
                                    onChange={(e) => handleEventChange("date", e.target.value)}
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
                                    value={eventData.time}
                                    onChange={(e) => handleEventChange("time", e.target.value)}
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
                                        value={eventData.location}
                                        onChange={(e) => handleEventChange("location", e.target.value)}
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
                                    value={eventData.description}
                                    onChange={(e) => handleEventChange("description", e.target.value)}
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
                                        value={eventData.category}
                                        onChange={(e) => handleEventChange("category", e.target.value)}
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
                                        value={eventData.companyName}
                                        onChange={(e) => handleEventChange("companyName", e.target.value)}
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
                                        value={eventData.imageUrl}
                                        onChange={(e) => handleEventChange("imageUrl", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ROLES & POSITIONS CARD */}
                    <div className="form-section-card">
                        <div className="section-card-header-row">
                            <h2 className="section-card-title">Roles & Positions</h2>
                            <button type="button" className="btn-add-role" onClick={handleAddRole}>
                                <Plus size={16} /> Add Role
                            </button>
                        </div>

                        {/* Dynamic Database Role Input Blueprint Block */}
                        {roles.map((role, index) => (
                            <div key={index} className="nested-role-blueprint-box" style={{ marginBottom: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
                                    <h3 className="role-index-heading">Role #{index + 1}</h3>
                                    {roles.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRole(index)}
                                            style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontSize: "14px" }}
                                        >
                                            Remove Role Block
                                        </button>
                                    )}
                                </div>

                                <div className="form-grid">
                                    {/* Role Name */}
                                    <div className="form-group custom-three-quarters">
                                        <label className="form-input-label">Role Name *</label>
                                        <input
                                            type="text"
                                            className="form-text-input"
                                            placeholder="e.g., Event Coordinator"
                                            value={role.name}
                                            onChange={(e) => handleRoleChange(index, "name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Positions Needed */}
                                    <div className="form-group custom-one-quarter">
                                        <label className="form-input-label">Positions Needed *</label>
                                        <input
                                            type="number"
                                            className="form-text-input"
                                            value={role.slots}
                                            min={1}
                                            onChange={(e) => handleRoleChange(index, "slots", e.target.value)}
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
                                            value={role.description}
                                            onChange={(e) => handleRoleChange(index, "description", e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SECTION 3: DISCLAIMER CALLOUT NOTE */}
                    <div className="form-disclaimer-callout">
                        <p className="disclaimer-text">
                            I confirm that all event details are accurate and I have the authority to post this event on behalf of my organization.
                        </p>
                    </div>

                    {/* BOTTOM ACTION BUTTONS ROW */}
                    <div className="form-submit-actions-row">
                        <button type="button" className="btn-cancel-action" onClick={() => navigate("/admin")}>
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