import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    Calendar,
    MapPin,
    Users,
    Edit3,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./ExploreEvents.css";
import ApplicantNavbar from "../Components/ApplicantNavbar";
import ApplicantFooter from "../Components/ApplicantFooter";
import AdminNavbar from "../Components/AdminNavbar";
import AdminFooter from "../Components/AdminFooter";

function ExploreEvents() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [selectedDateFilter, setSelectedDateFilter] = useState("All");
    const [selectedAvailability, setSelectedAvailability] =
        useState("All");
    const [sortOption, setSortOption] = useState("date-asc");

    const [isFilterDropdownOpen, setIsFilterDropdownOpen] =
        useState(false);

    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("applicant");

    useEffect(() => {
        const currentUserString = localStorage.getItem("user");

        if (currentUserString) {
            try {
                const currentUser = JSON.parse(currentUserString);

                setUserRole(
                    String(
                        currentUser.role || "applicant"
                    ).toLowerCase()
                );
            } catch (error) {
                console.error(
                    "Failed to read current user:",
                    error
                );

                setUserRole("applicant");
            }
        }

        try {
            const storedPending = JSON.parse(
                localStorage.getItem("pendingEvents") || "[]"
            );

            setPendingEvents(
                Array.isArray(storedPending)
                    ? storedPending
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to read pending events:",
                error
            );

            setPendingEvents([]);
        }
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/applicant/explore-events"
                );

                const data = await response
                    .json()
                    .catch(() => []);

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        `Failed to load events. Status: ${response.status}`
                    );
                }

                setEvents(
                    Array.isArray(data) ? data : []
                );
            } catch (error) {
                console.error(
                    "Failed to load events:",
                    error
                );

                setError(error.message);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const categories = useMemo(() => {
        const values = events.map(
            (event) => event.category || "General"
        );

        return ["All", ...new Set(values)];
    }, [events]);

    const locations = useMemo(() => {
        const values = events
            .map((event) => event.location)
            .filter(Boolean);

        return ["All", ...new Set(values)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        const normalizedSearch = searchQuery
            .trim()
            .toLowerCase();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = events.filter((event) => {
            const title = String(
                event.title || ""
            ).toLowerCase();

            const location = String(
                event.location || ""
            ).toLowerCase();

            const description = String(
                event.description || ""
            ).toLowerCase();

            const category = String(
                event.category || "General"
            ).toLowerCase();

            const matchesSearch =
                normalizedSearch === "" ||
                title.includes(normalizedSearch) ||
                location.includes(normalizedSearch) ||
                description.includes(normalizedSearch) ||
                category.includes(normalizedSearch);

            const matchesCategory =
                selectedCategory === "All" ||
                (event.category || "General") ===
                selectedCategory;

            const matchesLocation =
                selectedLocation === "All" ||
                event.location === selectedLocation;

            let eventDate = null;

            if (event.date) {
                eventDate = new Date(event.date);

                if (!Number.isNaN(eventDate.getTime())) {
                    eventDate.setHours(0, 0, 0, 0);
                } else {
                    eventDate = null;
                }
            }

            let matchesDate = true;

            if (selectedDateFilter === "Upcoming") {
                matchesDate =
                    eventDate !== null &&
                    eventDate >= today;
            }

            if (selectedDateFilter === "Today") {
                matchesDate =
                    eventDate !== null &&
                    eventDate.getTime() ===
                    today.getTime();
            }

            if (selectedDateFilter === "This Week") {
                const endOfWeek = new Date(today);
                endOfWeek.setDate(
                    today.getDate() + 7
                );

                matchesDate =
                    eventDate !== null &&
                    eventDate >= today &&
                    eventDate <= endOfWeek;
            }

            if (selectedDateFilter === "This Month") {
                matchesDate =
                    eventDate !== null &&
                    eventDate.getMonth() ===
                    today.getMonth() &&
                    eventDate.getFullYear() ===
                    today.getFullYear();
            }

            const filledSlots =
                Number(event.slots_filled) || 0;

            const neededSlots =
                Number(event.slots_needed) || 0;

            const availableSlots =
                neededSlots - filledSlots;

            let matchesAvailability = true;

            if (
                selectedAvailability === "Available"
            ) {
                matchesAvailability =
                    availableSlots > 0;
            }

            if (selectedAvailability === "Full") {
                matchesAvailability =
                    neededSlots > 0 &&
                    availableSlots <= 0;
            }

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesDate &&
                matchesAvailability
            );
        });

        return [...filtered].sort(
            (firstEvent, secondEvent) => {
                const firstDate = new Date(
                    firstEvent.date || 0
                );

                const secondDate = new Date(
                    secondEvent.date || 0
                );

                if (sortOption === "date-asc") {
                    return firstDate - secondDate;
                }

                if (sortOption === "date-desc") {
                    return secondDate - firstDate;
                }

                if (
                    sortOption ===
                    "availability-desc"
                ) {
                    const firstAvailable =
                        (Number(
                            firstEvent.slots_needed
                        ) || 0) -
                        (Number(
                            firstEvent.slots_filled
                        ) || 0);

                    const secondAvailable =
                        (Number(
                            secondEvent.slots_needed
                        ) || 0) -
                        (Number(
                            secondEvent.slots_filled
                        ) || 0);

                    return (
                        secondAvailable -
                        firstAvailable
                    );
                }

                if (
                    sortOption ===
                    "title-asc"
                ) {
                    return String(
                        firstEvent.title || ""
                    ).localeCompare(
                        String(
                            secondEvent.title || ""
                        )
                    );
                }

                return 0;
            }
        );
    }, [
        events,
        searchQuery,
        selectedCategory,
        selectedLocation,
        selectedDateFilter,
        selectedAvailability,
        sortOption
    ]);

    const handleNavigateRegister = (event) => {
        const eventId =
            event.event_id ??
            event.id ??
            event._id;

        if (!eventId) {
            alert(
                "Event ID is missing. Registration cannot continue."
            );
            return;
        }

        navigate(`/register-event/${eventId}`, {
            state: {
                roleId: event.role_id,
                eventTitle: event.title
            }
        });
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSelectedLocation("All");
        setSelectedDateFilter("All");
        setSelectedAvailability("All");
        setSortOption("date-asc");
        setIsFilterDropdownOpen(false);
    };

    const hasActiveFilters =
        searchQuery.trim() !== "" ||
        selectedCategory !== "All" ||
        selectedLocation !== "All" ||
        selectedDateFilter !== "All" ||
        selectedAvailability !== "All" ||
        sortOption !== "date-asc";

    return (
        <div className="explore-container">
            {userRole === "admin" ? (
                <AdminNavbar />
            ) : (
                <ApplicantNavbar />
            )}

            <header className="explore-hero">
                <div className="explore-hero-content">
                    <h1>Explore Events</h1>

                    <p>
                        Find the perfect event opportunity
                        for your skills
                    </p>

                    <div className="search-filter-area">
                        <div className="search-bar-wrapper">
                            <div className="search-input-box">
                                <Search
                                    className="icon-search"
                                    size={18}
                                />

                                <input
                                    type="text"
                                    placeholder="Search by event, location, category..."
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(
                                            event.target.value
                                        )
                                    }
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="clear-search-btn"
                                        onClick={() =>
                                            setSearchQuery("")
                                        }
                                        title="Clear search"
                                        aria-label="Clear search"
                                    >
                                        <X size={17} />
                                    </button>
                                )}
                            </div>

                            <div className="filter-wrapper">
                                <button
                                    type="button"
                                    className={`filter-button ${hasActiveFilters
                                        ? "active-filter"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setIsFilterDropdownOpen(
                                            (
                                                previousValue
                                            ) =>
                                                !previousValue
                                        )
                                    }
                                >
                                    <SlidersHorizontal
                                        size={16}
                                    />

                                    Filters
                                </button>

                                {isFilterDropdownOpen && (
                                    <div className="filter-dropdown advanced-filter-dropdown">
                                        <div className="filter-dropdown-header">
                                            <span>
                                                Filter Events
                                            </span>

                                            <button
                                                type="button"
                                                className="clear-filter-btn"
                                                onClick={
                                                    clearAllFilters
                                                }
                                            >
                                                Reset
                                            </button>
                                        </div>

                                        <div className="filter-group">
                                            <label htmlFor="category-filter">
                                                Category
                                            </label>

                                            <select
                                                id="category-filter"
                                                value={
                                                    selectedCategory
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSelectedCategory(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >
                                                {categories.map(
                                                    (
                                                        category
                                                    ) => (
                                                        <option
                                                            key={
                                                                category
                                                            }
                                                            value={
                                                                category
                                                            }
                                                        >
                                                            {
                                                                category
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label htmlFor="location-filter">
                                                Location
                                            </label>

                                            <select
                                                id="location-filter"
                                                value={
                                                    selectedLocation
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSelectedLocation(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >
                                                {locations.map(
                                                    (
                                                        location
                                                    ) => (
                                                        <option
                                                            key={
                                                                location
                                                            }
                                                            value={
                                                                location
                                                            }
                                                        >
                                                            {
                                                                location
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label htmlFor="date-filter">
                                                Date
                                            </label>

                                            <select
                                                id="date-filter"
                                                value={
                                                    selectedDateFilter
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSelectedDateFilter(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >
                                                <option value="All">
                                                    All Dates
                                                </option>

                                                <option value="Upcoming">
                                                    Upcoming
                                                </option>

                                                <option value="Today">
                                                    Today
                                                </option>

                                                <option value="This Week">
                                                    This Week
                                                </option>

                                                <option value="This Month">
                                                    This Month
                                                </option>
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label htmlFor="availability-filter">
                                                Availability
                                            </label>

                                            <select
                                                id="availability-filter"
                                                value={
                                                    selectedAvailability
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSelectedAvailability(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >
                                                <option value="All">
                                                    All Events
                                                </option>

                                                <option value="Available">
                                                    Available
                                                    Slots
                                                </option>

                                                <option value="Full">
                                                    Full Events
                                                </option>
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label htmlFor="sort-filter">
                                                Sort By
                                            </label>

                                            <select
                                                id="sort-filter"
                                                value={
                                                    sortOption
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSortOption(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >
                                                <option value="date-asc">
                                                    Earliest
                                                    Date
                                                </option>

                                                <option value="date-desc">
                                                    Latest Date
                                                </option>

                                                <option value="availability-desc">
                                                    Most
                                                    Available
                                                    Slots
                                                </option>

                                                <option value="title-asc">
                                                    Event Name
                                                    A-Z
                                                </option>
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            className="apply-filter-btn"
                                            onClick={() =>
                                                setIsFilterDropdownOpen(
                                                    false
                                                )
                                            }
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="active-filters-row">
                                <span>
                                    Showing{" "}
                                    {
                                        filteredEvents.length
                                    }{" "}
                                    of {events.length} events
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        clearAllFilters
                                    }
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="explore-main-content">
                {error && (
                    <div className="explore-error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="explore-loading-message">
                        Loading events...
                    </div>
                ) : (
                    <div className="explore-cards-grid">
                        {filteredEvents.length === 0 ? (
                            <div className="no-events-found">
                                <Search size={40} />

                                <h3>No events found</h3>

                                <p>
                                    Try changing your
                                    search or filter
                                    options.
                                </p>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={
                                            clearAllFilters
                                        }
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredEvents.map(
                                (event, index) => {
                                    const eventId =
                                        event.event_id ??
                                        event.id ??
                                        event._id;

                                    const roleId =
                                        event.role_id ??
                                        eventId;

                                    const isPending =
                                        pendingEvents.includes(
                                            event.role_id
                                        ) ||
                                        pendingEvents.includes(
                                            eventId
                                        );

                                    const imageUrl =
                                        event.image_url ||
                                        event.imageUrl ||
                                        event.image ||
                                        "";

                                    const filledSlots =
                                        Number(
                                            event.slots_filled
                                        ) || 0;

                                    const neededSlots =
                                        Number(
                                            event.slots_needed
                                        ) || 0;

                                    return (
                                        <div
                                            key={
                                                roleId ||
                                                eventId ||
                                                index
                                            }
                                            className="wide-event-card"
                                        >
                                            <div className="wide-card-image-box">
                                                {imageUrl ? (
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        className="wide-event-img"
                                                        alt={
                                                            event.title ||
                                                            "Event"
                                                        }
                                                    />
                                                ) : (
                                                    <div className="event-image-placeholder">
                                                        <Calendar
                                                            size={
                                                                34
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="wide-card-details">
                                                <div className="wide-card-header-row">
                                                    <h2 className="wide-event-title">
                                                        {event.title ||
                                                            "Untitled Event"}
                                                    </h2>

                                                    {userRole ===
                                                        "admin" ? (
                                                        <button
                                                            type="button"
                                                            className="card-action-edit-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admindashboard/editevent/${eventId}`
                                                                )
                                                            }
                                                        >
                                                            <Edit3
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                            Edit
                                                            Info
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className={`card-action-btn applicant-register-mode-btn ${isPending
                                                                ? "status-pending"
                                                                : ""
                                                                }`}
                                                            onClick={() =>
                                                                handleNavigateRegister(
                                                                    event
                                                                )
                                                            }
                                                            disabled={
                                                                isPending
                                                            }
                                                        >
                                                            {isPending
                                                                ? "Pending"
                                                                : "Register Now"}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="wide-meta-row">
                                                    <div className="meta-item">
                                                        <Calendar
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {event.date
                                                            ? new Date(
                                                                event.date
                                                            ).toLocaleDateString()
                                                            : "Date not set"}
                                                    </div>

                                                    <div className="meta-item">
                                                        <MapPin
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {event.location ||
                                                            "Location not set"}
                                                    </div>

                                                    <div className="meta-item">
                                                        <Users
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {
                                                            filledSlots
                                                        }
                                                        /
                                                        {
                                                            neededSlots
                                                        }
                                                    </div>
                                                </div>

                                                <p className="wide-event-description">
                                                    {event.description ||
                                                        "No description available."}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                )}
            </main>

            {userRole === "admin" ? (
                <AdminFooter />
            ) : (
                <ApplicantFooter />
            )}
        </div>
    );
}

export default ExploreEvents;