import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./RegisterEvent.css";

import ApplicantFooter from "../Components/ApplicantFooter";
import ApplicantNavbar from "../Components/ApplicantNavbar";
import AdminNavbar from "../Components/AdminNavbar";
import AdminFooter from "../Components/AdminFooter";

const RegisterEvent = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [eventDetails, setEventDetails] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState("");

    const [userRole, setUserRole] = useState("applicant");

    const isAdmin = userRole === "admin";

    useEffect(() => {
        try {
            const currentUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            setUserRole(
                String(currentUser.role || "applicant").toLowerCase()
            );
        } catch (error) {
            console.error("Could not read user role:", error);
            setUserRole("applicant");
        }
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setWeatherLoading(true);
                setWeatherError("");
                setWeatherData(null);

                const weatherResponse = await fetch(
                    `http://localhost:5000/api/applicant/events/${eventId}/weather`
                );

                const data = await weatherResponse
                    .json()
                    .catch(() => ({}));

                if (!weatherResponse.ok) {
                    setWeatherError(
                        data.message || "Weather unavailable."
                    );
                    return;
                }

                setWeatherData(data);
            } catch (error) {
                console.error("Weather API error:", error);

                setWeatherError(
                    "Could not connect to weather API."
                );
            } finally {
                setWeatherLoading(false);
            }
        };

        const fetchTargetEventDetails = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:5000/api/applicant/events/${eventId}`
                );

                const data = await response
                    .json()
                    .catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load event details."
                    );
                }

                setEventDetails({
                    title: data.title || "Untitled Event",
                    category: data.category || "General",
                    date: data.date || "",
                    time: data.time || "",
                    location:
                        data.location ||
                        "Location not specified",

                    positionsFilled: `${Number(
                        data.filledSpots ??
                        data.slots_filled
                    ) || 0
                        }/${Number(
                            data.totalSpots ??
                            data.slots_needed
                        ) || 0
                        }`,

                    organizer:
                        data.organizerName ||
                        "Organizer Management",

                    description:
                        data.description ||
                        data.event_description ||
                        data.eventDescription ||
                        "No description available.",

                    imageUrl:
                        data.image ||
                        data.image_url ||
                        data.imageUrl ||
                        "https://via.placeholder.com/400x250"
                });

                setRoles(
                    Array.isArray(data.availableRoles)
                        ? data.availableRoles
                        : Array.isArray(data.roles)
                            ? data.roles
                            : []
                );

                await fetchWeather();
            } catch (error) {
                console.error("Fetch event error:", error);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isAdmin) {
            return;
        }

        if (!selectedRole) {
            alert("Please select a role before registering!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const currentUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            if (!token || !currentUser.user_id) {
                alert("Please log in first.");
                navigate("/events", { replace: true });
                return;
            }

            const payload = {
                roleId: selectedRole,
                applicantId: currentUser.user_id,
                userNotes: message
            };

            console.log(
                "Sending registration payload to backend:",
                payload
            );

            const response = await fetch(
                "http://localhost:5000/api/applicant/register",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                console.error(
                    "Backend returned error status:",
                    response.status,
                    data
                );

                throw new Error(
                    data.message ||
                    `Registration failed with status: ${response.status}`
                );
            }

            alert(
                data.message ||
                "Request sent successfully!"
            );

            const pending = JSON.parse(
                localStorage.getItem("pendingEvents") || "[]"
            );

            if (!pending.includes(selectedRole)) {
                pending.push(selectedRole);

                localStorage.setItem(
                    "pendingEvents",
                    JSON.stringify(pending)
                );
            }

            navigate("/events", { replace: true });
        } catch (error) {
            console.error(
                "Registration network error:",
                error
            );

            alert(
                `Network Error: ${error.message}`
            );
        }
    };

    const handleBack = () => {
        navigate(
            isAdmin
                ? "/admindashboard"
                : "/events"
        );
    };

    if (loading) {
        return (
            <div className="loading-fallback">
                Loading event information...
            </div>
        );
    }

    if (!eventDetails) {
        return (
            <div className="error-fallback">
                Event details could not be loaded.
            </div>
        );
    }

    return (
        <div className="register-page-container">
            {isAdmin ? (
                <AdminNavbar />
            ) : (
                <ApplicantNavbar />
            )}

            <header className="register-header">
                <button
                    type="button"
                    className="back-link"
                    onClick={handleBack}
                >
                    &lt;{" "}
                    {isAdmin
                        ? "Back to Dashboard"
                        : "Back to Explore"}
                </button>

                <h1>
                    {isAdmin
                        ? "Event Details"
                        : "Register for Event"}
                </h1>

                <p>
                    {isAdmin
                        ? "Review the event information and available roles"
                        : "Confirm your registration details below"}
                </p>
            </header>

            <main
                className={`register-content ${isAdmin
                    ? "admin-event-view"
                    : ""
                    }`}
            >
                <section className="event-summary-card">
                    <div className="card-image-wrapper">
                        <img
                            src={eventDetails.imageUrl}
                            alt={eventDetails.title}
                        />

                        {eventDetails.category && (
                            <span className="category-badge">
                                {eventDetails.category}
                            </span>
                        )}
                    </div>

                    <div className="card-body">
                        <h2>{eventDetails.title}</h2>

                        <div className="meta-info">
                            <p className="event-date">
                                Date:{" "}
                                {eventDetails.date
                                    ? new Date(
                                        eventDetails.date
                                    ).toLocaleDateString()
                                    : "Not specified"}
                            </p>

                            {eventDetails.time && (
                                <p className="event-time">
                                    Time: {eventDetails.time}
                                </p>
                            )}

                            <p className="event-location">
                                Location:{" "}
                                {eventDetails.location}
                            </p>

                            <p className="event-positions">
                                Positions:{" "}
                                {eventDetails.positionsFilled} filled
                            </p>
                        </div>

                        <p className="event-desc">
                            {eventDetails.description}
                        </p>

                        <div className="organizer-info">
                            <span className="label">
                                Organized by
                            </span>

                            <p className="organizer-name">
                                {eventDetails.organizer}
                            </p>
                        </div>

                        {weatherLoading && (
                            <div className="weather-api-loading">
                                Loading weather from API...
                            </div>
                        )}

                        {!weatherLoading && weatherData && (
                            <div className="weather-api-card">
                                <div className="weather-api-header">
                                    <div className="weather-api-title">
                                        <strong>
                                            Event Weather
                                        </strong>

                                        <span>
                                            {
                                                weatherData
                                                    .resolvedLocation
                                                    ?.name
                                            }

                                            {weatherData
                                                .resolvedLocation
                                                ?.country
                                                ? `, ${weatherData.resolvedLocation.country}`
                                                : ""}
                                        </span>
                                    </div>

                                    <span className="weather-source-pill">
                                        {weatherData.source ||
                                            "Weather API"}
                                    </span>
                                </div>

                                <div className="weather-api-grid">
                                    <div className="weather-api-metric">
                                        <span className="weather-api-label">
                                            Max Temp
                                        </span>

                                        <span className="weather-api-value">
                                            {
                                                weatherData
                                                    .weather
                                                    ?.maxTemp
                                            }
                                            {
                                                weatherData
                                                    .units
                                                    ?.maxTemp
                                            }
                                        </span>
                                    </div>

                                    <div className="weather-api-metric">
                                        <span className="weather-api-label">
                                            Min Temp
                                        </span>

                                        <span className="weather-api-value">
                                            {
                                                weatherData
                                                    .weather
                                                    ?.minTemp
                                            }
                                            {
                                                weatherData
                                                    .units
                                                    ?.minTemp
                                            }
                                        </span>
                                    </div>

                                    <div className="weather-api-metric">
                                        <span className="weather-api-label">
                                            Rain Chance
                                        </span>

                                        <span className="weather-api-value">
                                            {
                                                weatherData
                                                    .weather
                                                    ?.rainChance
                                            }
                                            {
                                                weatherData
                                                    .units
                                                    ?.rainChance
                                            }
                                        </span>
                                    </div>

                                    <div className="weather-api-metric">
                                        <span className="weather-api-label">
                                            Wind
                                        </span>

                                        <span className="weather-api-value">
                                            {
                                                weatherData
                                                    .weather
                                                    ?.windSpeed
                                            }{" "}
                                            {
                                                weatherData
                                                    .units
                                                    ?.windSpeed
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!weatherLoading &&
                            weatherError && (
                                <div className="weather-api-error">
                                    <strong>
                                        Weather:
                                    </strong>{" "}
                                    {weatherError}
                                </div>
                            )}
                    </div>
                </section>

                {isAdmin ? (
                    <section className="registration-form-wrapper">
                        <div className="registration-form">
                            <h3>Available Roles</h3>

                            <span className="section-label">
                                Roles configured for this event
                            </span>

                            <div className="roles-group">
                                {roles.length === 0 ? (
                                    <div className="notice-banner">
                                        <p>
                                            No roles are currently
                                            configured for this
                                            event.
                                        </p>
                                    </div>
                                ) : (
                                    roles.map((role, index) => {
                                        const roleId =
                                            role.id ||
                                            role.role_id ||
                                            index;

                                        const roleName =
                                            role.name ||
                                            role.role_name ||
                                            "Unnamed Role";

                                        const roleDescription =
                                            role.desc ||
                                            role.description ||
                                            "";

                                        const roleSpots =
                                            role.spots ??
                                            role.remaining_spots ??
                                            role.slots_needed;

                                        return (
                                            <div
                                                key={roleId}
                                                className="role-option-card"
                                            >
                                                <div className="role-text-details">
                                                    <span className="role-name">
                                                        {
                                                            roleName
                                                        }
                                                    </span>

                                                    {roleDescription && (
                                                        <span className="role-desc">
                                                            {
                                                                roleDescription
                                                            }
                                                        </span>
                                                    )}

                                                    {roleSpots !==
                                                        undefined && (
                                                            <span className="role-spots-remaining">
                                                                {
                                                                    roleSpots
                                                                }{" "}
                                                                spot
                                                                {Number(
                                                                    roleSpots
                                                                ) !== 1
                                                                    ? "s"
                                                                    : ""}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="notice-banner">
                                <p>
                                    <strong>
                                        Administrator view:
                                    </strong>{" "}
                                    Registration controls are hidden.
                                    Use the Admin Dashboard to manage
                                    applications.
                                </p>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="registration-form-wrapper">
                        <form
                            className="registration-form"
                            onSubmit={handleSubmit}
                        >
                            <h3>Your Application</h3>

                            <span className="section-label">
                                Select a Role{" "}
                                <span className="required">
                                    *
                                </span>
                            </span>

                            <div className="roles-group">
                                {roles.map((role, index) => {
                                    const roleId =
                                        role.id ||
                                        role.role_id ||
                                        index;

                                    const roleName =
                                        role.name ||
                                        role.role_name ||
                                        "Unnamed Role";

                                    const roleDescription =
                                        role.desc ||
                                        role.description ||
                                        "";

                                    const roleSpots =
                                        role.spots ??
                                        role.remaining_spots ??
                                        role.slots_needed;

                                    return (
                                        <label
                                            key={roleId}
                                            className={`role-option-card ${String(
                                                selectedRole
                                            ) ===
                                                String(roleId)
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                setSelectedRole(
                                                    roleId
                                                )
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="eventRole"
                                                value={roleId}
                                                checked={
                                                    String(
                                                        selectedRole
                                                    ) ===
                                                    String(
                                                        roleId
                                                    )
                                                }
                                                onChange={() =>
                                                    setSelectedRole(
                                                        roleId
                                                    )
                                                }
                                            />

                                            <span className="radio-custom-indicator" />

                                            <div className="role-text-details">
                                                <span className="role-name">
                                                    {
                                                        roleName
                                                    }
                                                </span>

                                                {roleDescription && (
                                                    <span className="role-desc">
                                                        {
                                                            roleDescription
                                                        }
                                                    </span>
                                                )}

                                                {roleSpots !==
                                                    undefined && (
                                                        <span className="role-spots-remaining">
                                                            {
                                                                roleSpots
                                                            }{" "}
                                                            spot
                                                            {Number(
                                                                roleSpots
                                                            ) !== 1
                                                                ? "s"
                                                                : ""}{" "}
                                                            remaining
                                                        </span>
                                                    )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="form-field">
                                <label>
                                    Message to Organizer{" "}
                                    <span className="optional">
                                        (Optional)
                                    </span>
                                </label>

                                <textarea
                                    placeholder="Tell them why you are a great fit for this role..."
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="notice-banner">
                                <p>
                                    <strong>
                                        Please note:
                                    </strong>{" "}
                                    Cancellations are not permitted
                                    within 2 days of the event date.
                                </p>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() =>
                                        navigate("/events")
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn-submit"
                                >
                                    Confirm Registration
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </main>

            {isAdmin ? (
                <AdminFooter />
            ) : (
                <ApplicantFooter />
            )}
        </div>
    );
};

export default RegisterEvent;