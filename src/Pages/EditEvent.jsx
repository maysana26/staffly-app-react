import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, Plus, Save } from 'lucide-react';
import './EditEvent.css';
import Navbar from "../Components/AdminNavbar";
import Footer from "../Components/AdminFooter";

function EditEvent() {
    const navigate = useNavigate();
    const { id } = useParams(); // Retrieves the specific Event ID structure from the active route matching the schema

    // Controlled database collection state blocks
    const [eventData, setEventData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        category: 'Technology',
        description: '',
        imageUrl: ''
    });

    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial database fetch hook sequence on container mount
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                // Target endpoints specific to item records dynamically
                const response = await fetch(`/api/events/${id || 'mock-id'}`);
                if (response.ok) {
                    const data = await response.json();
                    setEventData({
                        title: data.title || '',
                        date: data.date || '',
                        time: data.time || '',
                        location: data.location || '',
                        category: data.category || 'Technology',
                        description: data.description || '',
                        imageUrl: data.imageUrl || ''
                    });
                    setRoles(data.roles || []);
                } else {
                    console.error("Failed to recover target database payload, initializing sandbox backup model.");
                    // Safe fallback structural container model mapping
                    setRoles([
                        { id: 1, name: 'Event Coordinator', slots: 2, description: 'Manage event flow and attendee' },
                        { id: 2, name: 'Registration Desk Staff', slots: 5, description: 'Handle attendee check-in and ba' },
                        { id: 3, name: 'AV Technician', slots: 3, description: 'Manage audio/visual equipment' },
                        { id: 4, name: 'Catering Staff', slots: 4, description: 'Serve food and beverages throug' }
                    ]);
                }
            } catch (err) {
                console.error("Database connection fault pipeline channel:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    // Handle updates to individual role row fields dynamically
    const handleRoleChange = (id, field, value) => {
        setRoles(roles.map(role => role.id === id ? { ...role, [field]: field === 'slots' ? (parseInt(value) || 0) : value } : role));
    };

    // Add a new blank role row
    const handleAddRole = () => {
        const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
        setRoles([...roles, { id: newId, name: '', slots: 1, description: '' }]);
    };

    // Delete a specific role row
    const handleDeleteRole = (id) => {
        setRoles(roles.filter(role => role.id !== id));
    };

    // Save changes via HTTP PUT or PATCH configuration to the linked database schema
    const handleSaveChanges = async (e) => {
        e.preventDefault();

        const updatedPayload = { ...eventData, roles };

        try {
            const response = await fetch(`/api/events/${id || 'mock-id'}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedPayload)
            });

            if (response.ok) {
                alert("Successfully edited and persistent to DB!");
                navigate("/admin/events");
            } else {
                alert("Error sending entity modifications parameters upstream.");
            }
        } catch (error) {
            console.error("Transmission stack failure:", error);
            alert("Database tracking error configuration exception handling channel.");
        }
    };

    const handleCancelChanges = () => {
        navigate("/admin/events");
    };

    if (isLoading) {
        return <div style={{ textItems: "center", padding: "100px", color: "#475569" }}>Retrieving Record Details from Database...</div>;
    }

    return (
        <>
            <div className="edit-event-container">
                <Navbar />

                {/* Top Hero Banner Matching Create Event Layout */}
                <div className="edit-event-hero">
                    <div className="edit-event-hero-container">
                        <button
                            type="button"
                            className="back-dashboard-btn"
                            onClick={() => navigate("/admin/events")}
                        >
                            ← Back to Events
                        </button>
                        <h1 className="edit-event-hero-title">Edit Event</h1>
                        <p className="edit-event-hero-subtitle">Update the details for "{eventData.title}"</p>
                    </div>
                </div>

                <div className="edit-event-content">
                    {/* Section 1: Event Information Card */}
                    <form onSubmit={handleSaveChanges}>
                        <section className="form-card">
                            <h2>Event Information</h2>

                            <div className="form-group full-width">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    value={eventData.title}
                                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row-2col">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="text"
                                        value={eventData.date}
                                        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input
                                        type="text"
                                        value={eventData.time}
                                        onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row-2col">
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={eventData.location}
                                        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={eventData.category}
                                        onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                                    >
                                        <option value="Technology">Technology</option>
                                        <option value="Music">Music</option>
                                        <option value="Business">Business</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    rows="4"
                                    value={eventData.description}
                                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={eventData.imageUrl}
                                    onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })}
                                />
                            </div>

                            {/* Banner Preview Block */}
                            {eventData.imageUrl && (
                                <div className="image-preview-box">
                                    <img src={eventData.imageUrl} alt="Event Preview" />
                                </div>
                            )}
                        </section>

                        {/* Section 2: Role Requirements Card */}
                        <section className="form-card role-section">
                            <div className="role-card-header">
                                <h2>Role Requirements</h2>
                                <button type="button" className="add-role-btn" onClick={handleAddRole}>
                                    <Plus size={16} /> Add Role
                                </button>
                            </div>

                            <div className="roles-list">
                                {roles.map((role, index) => (
                                    <div key={role.id || index} className="role-row-item">
                                        <div className="role-row-title-bar">
                                            <h3>Role #{index + 1}</h3>
                                            <button type="button" className="delete-role-btn" onClick={() => handleDeleteRole(role.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="role-fields-grid">
                                            <div className="form-group name-field">
                                                <label>Role Name</label>
                                                <input
                                                    type="text"
                                                    value={role.name}
                                                    onChange={(e) => handleRoleChange(role.id, 'name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group slots-field">
                                                <label>Total Slots</label>
                                                <input
                                                    type="number"
                                                    value={role.slots}
                                                    min={1}
                                                    onChange={(e) => handleRoleChange(role.id, 'slots', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group desc-field">
                                                <label>Description</label>
                                                <input
                                                    type="text"
                                                    value={role.description}
                                                    onChange={(e) => handleRoleChange(role.id, 'description', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Form Action Buttons Footer */}
                        <div className="form-actions-footer">
                            <button type="button" className="cancel-btn" onClick={handleCancelChanges}>
                                Cancel
                            </button>
                            <button type="submit" className="save-changes-btn">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default EditEvent;