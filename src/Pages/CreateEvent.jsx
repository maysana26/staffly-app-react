import React, { useState } from "react";
import { MapPin, Tag, Building2, Plus, CheckCircle } from "lucide-react";
import "./CreateEvent.css";
import Navbar from "../Components/AdminNavbar";
import Footer from "../Components/AdminFooter";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
    const navigate = useNavigate();

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

    const [roles, setRoles] = useState([
        { name: "", slots: 1, description: "" }
    ]);

    const handleEventChange = (field, value) => {
        setEventData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRoleChange = (index, field, value) => {
        const updatedRoles = [...roles];
        updatedRoles[index][field] = field === "slots" ? Number(value) || 1 : value;
        setRoles(updatedRoles);
    };

    const handleAddRole = () => {
        setRoles([...roles, { name: "", slots: 1, description: "" }]);
    };

    const handleRemoveRole = (index) => {
        if (roles.length > 1) {
            setRoles(roles.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const payload = {
            title: eventData.title,
            date: eventData.date,
            time: eventData.time,
            location: eventData.location,
            description: eventData.description,
            category: eventData.category,
            companyName: eventData.companyName,
            imageUrl: eventData.imageUrl,
            roles
        };

        try {
            const response = await fetch("http://localhost:5000/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Error publishing event.");
            }

            alert("Event successfully created and published!");
            navigate("/admindashboard");
        } catch (error) {
            console.error("Database connection failure:", error);
            alert(error.message);
        }
    };

    return (
        <div className="create-event-canvas">
            <Navbar />

            <div className="create-event-hero">
                <div className="create-event-hero-container">
                    <button
                        type="button"
                        className="back-dashboard-btn"
                        onClick={() => navigate("/admindashboard")}
                    >
                        &lt; Back to Admin Dashboard
                    </button>

                    <h1 className="create-event-hero-title">Create New Event</h1>
                    <p className="create-event-hero-subtitle">
                        Fill in the details and add roles for your event
                    </p>
                </div>
            </div>

            <div className="create-event-form-wrapper">
                <form className="create-event-form" onSubmit={handleSubmit}>
                    <div className="form-section-card">
                        <h2 className="section-card-title">
                            <span className="title-icon-orange">Calendar</span> Event Information
                        </h2>

                        <div className="form-grid">
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

                            <div className="form-group half-width">
                                <label className="form-input-label">Time *</label>
                                <input
                                    type="time"
                                    className="form-text-input"
                                    value={eventData.time}
                                    onChange={(e) => handleEventChange("time", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group full-width icon-input-wrapper">
                                <label className="form-input-label">Location *</label>
                                <div className="input-with-icon">
                                    <MapPin size={16} className="input-inner-icon" />
                                    <input
                                        type="text"
                                        className="form-text-input padded-left"
                                        placeholder="e.g., Khalda, Amman, Jordan"
                                        value={eventData.location}
                                        onChange={(e) => handleEventChange("location", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="form-group half-width icon-input-wrapper">
                                <label className="form-input-label">Company Name</label>
                                <div className="input-with-icon">
                                    <Building2 size={16} className="input-inner-icon" />
                                    <input
                                        type="text"
                                        className="form-text-input padded-left"
                                        placeholder="Your Company Name"
                                        value={eventData.companyName}
                                        onChange={(e) => handleEventChange("companyName", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width icon-input-wrapper">
                                <label className="form-input-label">Event Image URL</label>
                                <div className="input-with-icon">
                                    <input
                                        type="url"
                                        className="form-text-input"
                                        placeholder="https://example.com/image.jpg"
                                        value={eventData.imageUrl}
                                        onChange={(e) => handleEventChange("imageUrl", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section-card">
                        <div className="section-card-header-row">
                            <h2 className="section-card-title">Roles & Positions</h2>

                            <button type="button" className="btn-add-role" onClick={handleAddRole}>
                                <Plus size={16} /> Add Role
                            </button>
                        </div>

                        {roles.map((role, index) => (
                            <div key={index} className="nested-role-blueprint-box" style={{ marginBottom: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h3 className="role-index-heading">Role #{index + 1}</h3>

                                    {roles.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRole(index)}
                                            style={{
                                                color: "#ef4444",
                                                border: "none",
                                                background: "none",
                                                cursor: "pointer",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Remove Role
                                        </button>
                                    )}
                                </div>

                                <div className="form-grid">
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

                                    <div className="form-group full-width">
                                        <label className="form-input-label">Role Description</label>
                                        <textarea
                                            className="form-textarea-input"
                                            placeholder="Describe responsibilities..."
                                            rows={3}
                                            value={role.description}
                                            onChange={(e) => handleRoleChange(index, "description", e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-disclaimer-callout">
                        <p className="disclaimer-text">
                            I confirm that all event details are accurate.
                        </p>
                    </div>

                    <div className="form-submit-actions-row">
                        <button
                            type="button"
                            className="btn-cancel-action"
                            onClick={() => navigate("/admindashboard")}
                        >
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