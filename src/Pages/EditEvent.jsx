import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import "./EditEvent.css";
import Navbar from "../Components/AdminNavbar";
import Footer from "../Components/AdminFooter";

function EditEvent() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [eventData, setEventData] = useState({
        title: "",
        date: "",
        location: "",
        category: "Technology",
        description: ""
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const formatDateForInput = (dateValue) => {
        if (!dateValue) {
            return "";
        }

        const parsedDate = new Date(dateValue);

        if (Number.isNaN(parsedDate.getTime())) {
            return String(dateValue).slice(0, 10);
        }

        return parsedDate.toISOString().slice(0, 10);
    };

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) {
                setError("Event ID is missing.");
                setIsLoading(false);
                return;
            }

            try {
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/events/${id}`
                );

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        data.message ||
                        `Failed to load event. Status: ${response.status}`
                    );
                }

                setEventData({
                    title: data.title || "",
                    date: formatDateForInput(data.date),
                    location: data.location || "",
                    category: data.category || "Technology",
                    description: data.description || ""
                });
            } catch (err) {
                console.error("Failed to fetch event:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setEventData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSaveChanges = async (event) => {
        event.preventDefault();

        if (!token) {
            setError("Admin token is missing. Please log in again.");
            return;
        }

        if (!id) {
            setError("Event ID is missing.");
            return;
        }

        const updatedPayload = {
            title: eventData.title.trim(),
            location: eventData.location.trim(),
            date: eventData.date,
            category: eventData.category,
            description: eventData.description.trim()
        };

        try {
            setIsSaving(true);
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/admin/events/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedPayload)
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error("Backend update response:", {
                    status: response.status,
                    data
                });

                throw new Error(
                    data.detail ||
                    data.message ||
                    `Failed to update event. Status: ${response.status}`
                );
            }

            alert(data.message || "Event updated successfully!");
            navigate("/admindashboard");
        } catch (err) {
            console.error("Save failure:", err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelChanges = () => {
        navigate("/admindashboard");
    };

    if (isLoading) {
        return (
            <>
                <Navbar />

                <div
                    style={{
                        textAlign: "center",
                        padding: "100px",
                        color: "#475569"
                    }}
                >
                    Retrieving event details...
                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="edit-event-container">
                <Navbar />

                <div className="edit-event-hero">
                    <div className="edit-event-hero-container">
                        <button
                            type="button"
                            className="back-dashboard-btn"
                            onClick={() => navigate("/admindashboard")}
                        >
                            &lt; Back to Dashboard
                        </button>

                        <h1 className="edit-event-hero-title">
                            Edit Event
                        </h1>

                        <p className="edit-event-hero-subtitle">
                            Update the details for "
                            {eventData.title || "Selected Event"}"
                        </p>
                    </div>
                </div>

                <div className="edit-event-content">
                    {error && (
                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "14px",
                                borderRadius: "8px",
                                backgroundColor: "#fee2e2",
                                color: "#991b1b"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSaveChanges}>
                        <section className="form-card">
                            <h2>Event Information</h2>

                            <div className="form-group full-width">
                                <label htmlFor="title">
                                    Event Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={eventData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-row-2col">
                                <div className="form-group">
                                    <label htmlFor="date">
                                        Date
                                    </label>

                                    <input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={eventData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="location">
                                        Location
                                    </label>

                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={eventData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="category">
                                    Category
                                </label>

                                <select
                                    id="category"
                                    name="category"
                                    value={eventData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="Technology">
                                        Technology
                                    </option>

                                    <option value="Music">
                                        Music
                                    </option>

                                    <option value="Business">
                                        Business
                                    </option>

                                    <option value="General">
                                        General
                                    </option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    rows="5"
                                    value={eventData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </section>

                        <div className="form-actions-footer">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancelChanges}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-changes-btn"
                                disabled={isSaving}
                            >
                                <Save size={16} />

                                {isSaving
                                    ? "Saving..."
                                    : "Save Changes"}
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