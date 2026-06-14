import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Save } from 'lucide-react';
import './EditEvent.css';
import Navbar from "../Components/AdminNavbar";
import Footer from "../Components/AdminFooter";

function EditEvent() {
    const navigate = useNavigate();

    // Mock state populated with the "Tech Innovation Summit 2026" details
    const [eventData, setEventData] = useState({
        title: 'Tech Innovation Summit 2026',
        date: '2026-05-15',
        time: '09:00 AM - 06:00 PM',
        location: 'Convention Center, Downtown',
        category: 'Technology',
        description: 'Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
    });

    const [roles, setRoles] = useState([
        { id: 1, name: 'Event Coordinator', slots: 2, description: 'Manage event flow and attendee' },
        { id: 2, name: 'Registration Desk Staff', slots: 5, description: 'Handle attendee check-in and ba' },
        { id: 3, name: 'AV Technician', slots: 3, description: 'Manage audio/visual equipment' },
        { id: 4, name: 'Catering Staff', slots: 4, description: 'Serve food and beverages throug' }
    ]);

    // Handle updates to individual role row fields dynamically
    const handleRoleChange = (id, field, value) => {
        setRoles(roles.map(role => role.id === id ? { ...role, [field]: value } : role));
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

    // Save action handler with notification alert
    const handleSaveChanges = (e) => {
        e.preventDefault();
        alert("Successfully edited");
        navigate("/admin/events");
    };

    // Direct layout structural alignment navigation cancel return
    const handleCancelChanges = () => {
        navigate("/admindashboard");
    };

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
                    <section className="form-card">
                        <h2>Event Information</h2>

                        <div className="form-group full-width">
                            <label>Event Title</label>
                            <input
                                type="text"
                                value={eventData.title}
                                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                            />
                        </div>

                        <div className="form-row-2col">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="text"
                                    value={eventData.date}
                                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <input
                                    type="text"
                                    value={eventData.time}
                                    onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
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
                                <div key={role.id} className="role-row-item">
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
                                            />
                                        </div>
                                        <div className="form-group slots-field">
                                            <label>Total Slots</label>
                                            <input
                                                type="number"
                                                value={role.slots}
                                                onChange={(e) => handleRoleChange(role.id, 'slots', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="form-group desc-field">
                                            <label>Description</label>
                                            <input
                                                type="text"
                                                value={role.description}
                                                onChange={(e) => handleRoleChange(role.id, 'description', e.target.value)}
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
                        <button type="submit" className="save-changes-btn" onClick={handleSaveChanges}>
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default EditEvent;