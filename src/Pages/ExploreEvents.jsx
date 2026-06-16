import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Calendar, MapPin, Users, CheckCircle, Edit3 } from "lucide-react";
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
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("applicant");

    useEffect(() => {
        const currentUserStr = localStorage.getItem("user");
        if (currentUserStr) {
            try {
                const currentUser = JSON.parse(currentUserStr);
                setUserRole(currentUser.role || "applicant");
            } catch (e) {
                setUserRole("applicant");
            }
        }

        const storedPending = JSON.parse(localStorage.getItem("pendingEvents") || "[]");
        setPendingEvents(storedPending);
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/applicant/explore-events");
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const categories = ["All", ...new Set(events.map(e => e.category || "General"))];

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || (event.category || "General") === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleNavigateRegister = (event) => {
        const eventId = event.event_id ?? event.id ?? event._id;

        if (!eventId) {
            alert("Event ID missing - cannot proceed");
            return;
        }

        navigate(`/register-event/${eventId}`, {
            state: {
                roleId: event.role_id,
                eventTitle: event.title
            }
        });
    };

    return (
        <div className="explore-container">
            {userRole === "admin" ? <AdminNavbar /> : <ApplicantNavbar />}

            <header className="explore-hero">
                <div className="explore-hero-content">
                    <h1>Explore Events</h1>
                    <p>Find the perfect event opportunity for your skills</p>

                    <div className="search-bar-wrapper">
                        <div className="search-input-box">
                            <Search className="icon-search" size={18} />
                            <input
                                placeholder="Search by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            className="filter-button"
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </div>
            </header>

            <main className="explore-main-content">
                <div className="explore-cards-grid">

                    {filteredEvents.map((event) => {
                        const eventId = event.event_id || event.id || event._id;
                        const isPending = pendingEvents.includes(event.role_id);

                        return (
                            <div key={event.role_id} className="wide-event-card">

                                <div className="wide-card-image-box">
                                    <img src={event.image} className="wide-event-img" />
                                </div>

                                <div className="wide-card-details">

                                    <div className="wide-card-header-row">
                                        <h2 className="wide-event-title">{event.title}</h2>

                                        {userRole === "admin" ? (
                                            <button
                                                className="card-action-edit-btn"
                                                onClick={() =>
                                                    navigate(`/admindashboard/editevent/${eventId}`)
                                                }
                                            >
                                                <Edit3 size={14} />
                                                Edit Info
                                            </button>
                                        ) : (
                                            <button
                                                className={`card-action-btn applicant-register-mode-btn ${isPending ? "status-pending" : ""
                                                    }`}
                                                onClick={() => handleNavigateRegister(event)}
                                                disabled={isPending}
                                            >
                                                {isPending ? "Pending" : "Register Now"}
                                            </button>
                                        )}
                                    </div>

                                    <div className="wide-meta-row">
                                        <div className="meta-item">
                                            <Calendar size={14} />
                                            {event.date}
                                        </div>
                                        <div className="meta-item">
                                            <MapPin size={14} />
                                            {event.location}
                                        </div>
                                        <div className="meta-item">
                                            <Users size={14} />
                                            {event.slots_filled}/{event.slots_needed}
                                        </div>
                                    </div>

                                    <p className="wide-event-description">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {userRole === "admin" ? <AdminFooter /> : <ApplicantFooter />}
        </div>
    );
}

export default ExploreEvents;