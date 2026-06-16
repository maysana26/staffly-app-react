import React, { useEffect, useState } from "react";
import {
    Calendar,
    Users,
    FileText,
    TrendingUp,
    Plus,
    Eye,
    Edit2,
    Trash2,
    Check,
    X,
    Star
} from "lucide-react";

import "./AdminDashboard.css";
import AdminNavbar from "../Components/AdminNavbar";
import AdminFooter from "../Components/AdminFooter";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("overview");
    const [eventsList, setEventsList] = useState([]);
    const [applicationsData, setApplicationsData] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);

    const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
    const [metrics, setMetrics] = useState({
        totalEvents: 0,
        totalApplications: 0,
        activeUsers: 0,
        upcomingCount: 0
    });

    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // Load all admin events
    const fetchEvents = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/events",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json().catch(() => []);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    `Failed to load events. Status: ${response.status}`
                );
            }

            console.log("Admin events response:", data);

            setEventsList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading events:", error);
            setError(error.message);
            setEventsList([]);
        }
    };

    // Load dashboard numbers and recent applications
    const fetchSummaryData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/summary",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    `Failed to load summary. Status: ${response.status}`
                );
            }

            console.log("Admin summary response:", data);

            setMetrics({
                totalEvents: Number(data.totalEventsCreated) || 0,
                totalApplications:
                    Number(data.totalIncomingApplications) || 0,
                activeUsers: Number(data.activeUsers) || 0,
                upcomingCount: Number(data.upcomingCount) || 0
            });

            setActivityLogs(
                Array.isArray(data.recentApplications)
                    ? data.recentApplications
                    : []
            );
        } catch (error) {
            console.error("Error loading dashboard summary:", error);
            setError(error.message);

            setMetrics({
                totalEvents: 0,
                totalApplications: 0,
                activeUsers: 0,
                upcomingCount: 0
            });

            setActivityLogs([]);
        }
    };

    // Load applications
    const fetchApplications = async () => {
        try {
            setApplicationsLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/admin/applications",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json().catch(() => []);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    `Failed to load applications. Status: ${response.status}`
                );
            }

            console.log("Admin applications response:", data);

            setApplicationsData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading applications:", error);
            setError(error.message);
            setApplicationsData([]);
        } finally {
            setApplicationsLoading(false);
        }
    };

    // Load all dashboard data once
    useEffect(() => {
        const loadDashboardData = async () => {
            if (!token) {
                setError("Admin authentication token is missing.");
                setLoading(false);
                setApplicationsLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                await Promise.all([
                    fetchEvents(),
                    fetchSummaryData(),
                    fetchApplications()
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);
    const handleViewEvent = (id) => {
        navigate(`/register-event/${id}`);
    };
    const handleEditEvent = (id) => {
        navigate(`/admindashboard/editevent/${id}`);
    };

    const handleDeleteEvent = async (id, title) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/events/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.message ||
                    "Deletion request rejected by database."
                );
            }

            setEventsList((previousEvents) =>
                previousEvents.filter((event) => {
                    const eventId =
                        event.event_id ||
                        event.id ||
                        event._id;

                    return Number(eventId) !== Number(id);
                })
            );

            await fetchSummaryData();

            alert(data.message || "Event deleted successfully!");
        } catch (error) {
            console.error("Delete event error:", error);
            alert(error.message);
        }
    };

    const handleUpdateStatus = async (applicationId, newStatus) => {
        if (!applicationId) {
            alert("Application ID is missing.");
            return;
        }

        try {
            setUpdatingApplicationId(applicationId);

            const response = await fetch(
                `http://localhost:5000/api/admin/applications/${applicationId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.message ||
                    "Failed to update application status."
                );
            }

            setApplicationsData((previousApplications) =>
                previousApplications.map((application) => {
                    const currentId =
                        application.application_id || application.id;

                    if (Number(currentId) === Number(applicationId)) {
                        return {
                            ...application,
                            status: data.application?.status || newStatus
                        };
                    }

                    return application;
                })
            );

            await Promise.all([
                fetchApplications(),
                fetchEvents(),
                fetchSummaryData()
            ]);

            alert(data.message || "Application status updated successfully.");
        } catch (error) {
            console.error("Update application status error:", error);
            alert(error.message);
        } finally {
            setUpdatingApplicationId(null);
        }
    };

    return (
        <div className="admin-page-canvas">
            <AdminNavbar />

            <div className="admin-hero-banner">
                <div className="admin-hero-container">
                    <h1 className="admin-hero-title">
                        Admin Dashboard
                    </h1>

                    <p className="admin-hero-subtitle">
                        Manage your events and applications
                    </p>
                </div>
            </div>

            <div className="admin-sheet-wrapper">
                <div className="admin-sheet-card">
                    {error && (
                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "14px 16px",
                                backgroundColor: "#fee2e2",
                                color: "#991b1b",
                                borderRadius: "8px"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div className="admin-tabs-row">
                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "overview"
                                ? "active"
                                : ""
                                }`}
                            onClick={() => setActiveTab("overview")}
                        >
                            Overview
                        </button>

                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "events"
                                ? "active"
                                : ""
                                }`}
                            onClick={() => setActiveTab("events")}
                        >
                            Events
                        </button>

                        <button
                            type="button"
                            className={`admin-tab-btn ${activeTab === "applications"
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                setActiveTab("applications")
                            }
                        >
                            Applications
                        </button>
                    </div>

                    {activeTab === "overview" && (
                        <>
                            <div className="admin-metrics-grid">
                                <div className="analytics-card blue-variant">
                                    <div className="analytics-icon-box blue-icon-bg">
                                        <Calendar
                                            size={22}
                                            color="#0052cc"
                                        />
                                    </div>

                                    <div className="analytics-text-group">
                                        <span className="analytics-label">
                                            Total Events
                                        </span>

                                        <h3 className="analytics-number">
                                            {metrics.totalEvents}
                                        </h3>
                                    </div>
                                </div>

                                <div className="analytics-card orange-variant">
                                    <div className="analytics-icon-box orange-icon-bg">
                                        <FileText
                                            size={22}
                                            color="#e65c00"
                                        />
                                    </div>

                                    <div className="analytics-text-group">
                                        <span className="analytics-label">
                                            Applications
                                        </span>

                                        <h3 className="analytics-number">
                                            {metrics.totalApplications}
                                        </h3>
                                    </div>
                                </div>

                                <div className="analytics-card purple-variant">
                                    <div className="analytics-icon-box purple-icon-bg">
                                        <Users
                                            size={22}
                                            color="#8a2be2"
                                        />
                                    </div>

                                    <div className="analytics-text-group">
                                        <span className="analytics-label">
                                            Active Users
                                        </span>

                                        <h3 className="analytics-number">
                                            {metrics.activeUsers}
                                        </h3>
                                    </div>
                                </div>

                                <div className="analytics-card green-variant">
                                    <div className="analytics-icon-box green-icon-bg">
                                        <TrendingUp
                                            size={22}
                                            color="#00b074"
                                        />
                                    </div>

                                    <div className="analytics-text-group">
                                        <span className="analytics-label">
                                            Upcoming
                                        </span>

                                        <h3 className="analytics-number">
                                            {metrics.upcomingCount}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-activity-section">
                                <h2 className="tab-section-title">
                                    Recent Activity
                                </h2>

                                <div className="activity-stack-list">
                                    {loading ? (
                                        <p
                                            style={{
                                                padding: "20px",
                                                color: "#64748b"
                                            }}
                                        >
                                            Loading recent activity...
                                        </p>
                                    ) : activityLogs.length === 0 ? (
                                        <p
                                            style={{
                                                padding: "20px",
                                                color: "#64748b"
                                            }}
                                        >
                                            No system activity found.
                                        </p>
                                    ) : (
                                        activityLogs.map(
                                            (log, index) => (
                                                <div
                                                    key={
                                                        log.application_id ||
                                                        index
                                                    }
                                                    className="activity-log-strip"
                                                >
                                                    <div className="log-left-details">
                                                        <p className="log-main-announcement">
                                                            <strong>
                                                                {log.applicantName ||
                                                                    "Applicant"}
                                                            </strong>

                                                            {
                                                                " applied for "
                                                            }

                                                            <span className="highlight-text-bold">
                                                                {log.eventTitle ||
                                                                    "Event"}
                                                            </span>
                                                        </p>

                                                        <p className="log-sub-role-label">
                                                            Role:{" "}
                                                            {log.role ||
                                                                "Not specified"}
                                                        </p>
                                                    </div>

                                                    <div className="log-right-timestamp">
                                                        <span>
                                                            {log.status ||
                                                                "Pending"}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "events" && (
                        <div className="subtab-content-container">
                            <div className="subtab-header-row">
                                <h2 className="tab-section-title">
                                    Manage Events
                                </h2>

                                <button
                                    type="button"
                                    className="btn-create-event"
                                    onClick={() =>
                                        navigate(
                                            "/admindashboard/createevent"
                                        )
                                    }
                                >
                                    <Plus size={18} />
                                    Create Event
                                </button>
                            </div>

                            <div className="table-responsive-wrapper">
                                <table className="admin-dashboard-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "35%" }}>
                                                Event
                                            </th>
                                            <th>Date</th>
                                            <th>Category</th>
                                            <th>Applications</th>
                                            <th>Filled</th>
                                            <th
                                                style={{
                                                    textAlign: "right"
                                                }}
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding: "20px"
                                                    }}
                                                >
                                                    Loading events...
                                                </td>
                                            </tr>
                                        ) : eventsList.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding: "20px"
                                                    }}
                                                >
                                                    No events found.
                                                </td>
                                            </tr>
                                        ) : (
                                            eventsList.map((event) => {
                                                const currentId =
                                                    event.event_id ||
                                                    event.id ||
                                                    event._id;

                                                const imageUrl =
                                                    event.image_url ||
                                                    event.imageUrl ||
                                                    event.image ||
                                                    "";

                                                return (
                                                    <tr key={currentId}>
                                                        <td>
                                                            <div className="table-media-cell">
                                                                <div
                                                                    className="table-event-thumb"
                                                                    style={{
                                                                        backgroundImage:
                                                                            imageUrl
                                                                                ? `url(${imageUrl})`
                                                                                : "none",
                                                                        backgroundSize:
                                                                            "cover",
                                                                        backgroundPosition:
                                                                            "center"
                                                                    }}
                                                                />

                                                                <div className="table-cell-meta">
                                                                    <div className="cell-main-title">
                                                                        {event.title}
                                                                    </div>

                                                                    <div className="cell-sub-info">
                                                                        {event.location ||
                                                                            "Remote"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="text-neutral-dark">
                                                            {event.date
                                                                ? new Date(
                                                                    event.date
                                                                ).toLocaleDateString()
                                                                : "TBD"}
                                                        </td>

                                                        <td>
                                                            <span className="badge-pill category-pill">
                                                                {event.category ||
                                                                    "General"}
                                                            </span>
                                                        </td>

                                                        <td className="text-neutral-dark">
                                                            {Number(event.application_count) || 0}
                                                        </td>

                                                        <td className="text-neutral-dark">
                                                            {Number(event.slots_filled) || 0}/
                                                            {Number(event.slots_needed) || 0}
                                                        </td>

                                                        <td>
                                                            <div className="table-actions-group">
                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn view-btn"
                                                                    title="View Details"
                                                                    onClick={() =>
                                                                        handleViewEvent(
                                                                            currentId
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn edit-btn"
                                                                    title="Edit Event"
                                                                    onClick={() =>
                                                                        handleEditEvent(
                                                                            currentId
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn delete-btn"
                                                                    title="Delete Event"
                                                                    onClick={() =>
                                                                        handleDeleteEvent(
                                                                            currentId,
                                                                            event.title
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "applications" && (
                        <div className="subtab-content-container">
                            <div className="subtab-header-row">
                                <h2 className="tab-section-title">
                                    Manage Applications
                                </h2>
                            </div>

                            <div className="table-responsive-wrapper">
                                <table className="admin-dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Event</th>
                                            <th>Role</th>
                                            <th>Applied</th>
                                            <th>Status</th>
                                            <th
                                                style={{
                                                    textAlign: "right"
                                                }}
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicationsLoading ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding: "20px"
                                                    }}
                                                >
                                                    Loading applications...
                                                </td>
                                            </tr>
                                        ) : applicationsData.length ===
                                            0 ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding: "20px"
                                                    }}
                                                >
                                                    No applications found.
                                                </td>
                                            </tr>
                                        ) : (
                                            applicationsData.map(
                                                (application) => {
                                                    const applicationId =
                                                        application.application_id ||
                                                        application.id;

                                                    const status =
                                                        application.status ||
                                                        "Pending";

                                                    return (
                                                        <tr
                                                            key={
                                                                applicationId
                                                            }
                                                        >
                                                            <td>
                                                                <div className="table-media-cell">


                                                                    <div className="table-cell-meta">
                                                                        <div className="cell-main-title">
                                                                            {application.applicantName ||
                                                                                application.applicant ||
                                                                                "Unknown applicant"}
                                                                        </div>

                                                                        <div className="cell-sub-info rating-inline">
                                                                            <Star
                                                                                size={
                                                                                    12
                                                                                }
                                                                                fill="#eab308"
                                                                                color="#eab308"
                                                                            />

                                                                            {application.rating ||
                                                                                "5.0"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="text-neutral-dark">
                                                                {application.eventTitle ||
                                                                    application.event ||
                                                                    "Unknown event"}
                                                            </td>

                                                            <td className="text-neutral-muted">
                                                                {application.role ||
                                                                    application.roleName ||
                                                                    "Not specified"}
                                                            </td>

                                                            <td className="text-neutral-dark">
                                                                {application.applied_at
                                                                    ? new Date(
                                                                        application.applied_at
                                                                    ).toLocaleDateString()
                                                                    : application.appliedDate
                                                                        ? new Date(
                                                                            application.appliedDate
                                                                        ).toLocaleDateString()
                                                                        : ""}
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={`badge-pill status-pill-${status.toLowerCase()}`}
                                                                >
                                                                    {
                                                                        status
                                                                    }
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <div className="table-actions-group">
                                                                    {status ===
                                                                        "Pending" && (
                                                                            <>
                                                                                <button
                                                                                    type="button"
                                                                                    className="action-icon-btn approve-btn"
                                                                                    title="Approve"
                                                                                    onClick={() =>
                                                                                        handleUpdateStatus(
                                                                                            applicationId,
                                                                                            "Accepted"
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Check
                                                                                        size={
                                                                                            16
                                                                                        }
                                                                                    />
                                                                                </button>

                                                                                <button
                                                                                    type="button"
                                                                                    className="action-icon-btn reject-btn"
                                                                                    title="Reject"
                                                                                    onClick={() =>
                                                                                        handleUpdateStatus(
                                                                                            applicationId,
                                                                                            "Declined"
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <X
                                                                                        size={
                                                                                            16
                                                                                        }
                                                                                    />
                                                                                </button>
                                                                            </>
                                                                        )}

                                                                    <button
                                                                        type="button"
                                                                        className="action-icon-btn view-btn"
                                                                        title="View Applicant"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/admin/applicants/${application.applicant_id ||
                                                                                application.applicantId ||
                                                                                applicationId
                                                                                }`
                                                                            )
                                                                        }
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AdminFooter />
        </div>
    );
}

export default AdminDashboard;