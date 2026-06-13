import React, { useState } from 'react';
import { ChevronLeft, Trash2, Plus, Save, X } from 'lucide-react'; // Assumes you use lucide-react for icons, swap if using another library
import './EditEvent.css';

function EditEvent() {
    // Mock state populated with the "Tech Innovation Summit 2026" details from your screenshot
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

    return (
        <div className="edit-event-container">
            {/* Top Admin Mode Banner */}
            <div className="admin-mode-banner">
                <span>🛡️ Admin Mode - You have full access to event management</span>
            </div>

            <div className="edit-event-content">
                {/* Back Navigation Link */}
                <a href="/admin-dashboard" className="back-link">
                    <ChevronLeft size={16} /> Back to Dashboard
                </a>

                {/* Header Block */}
                <header className="edit-event-header">
                    <h1>Edit Event</h1>
                    <p>Update the details for "{eventData.title}"</p>
                </header>

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
                        <button type="button" className="add-role-btn">
                            <Plus size={16} /> Add Role
                        </button>
                    </div>

                    <div className="roles-list">
                        {roles.map((role, index) => (
                            <div key={role.id} className="role-row-item">
                                <div className="role-row-title-bar">
                                    <h3>Role #{index + 1}</h3>
                                    <button type="button" className="delete-role-btn">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="role-fields-grid">
                                    <div className="form-group name-field">
                                        <label>Role Name</label>
                                        <input type="text" value={role.name} />
                                    </div>
                                    <div className="form-group slots-field">
                                        <label>Total Slots</label>
                                        <input type="number" value={role.slots} />
                                    </div>
                                    <div className="form-group desc-field">
                                        <label>Description</label>
                                        <input type="text" value={role.description} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Form Action Buttons Footer */}
                <div className="form-actions-footer">
                    <button type="button" className="cancel-btn">Cancel</button>
                    <button type="submit" className="save-changes-btn">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditEvent;