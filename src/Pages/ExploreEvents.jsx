import React, { useState } from "react";
import { Search, SlidersHorizontal, Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import "./ExploreEvents.css";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const INITIAL_EVENTS = [
    {
        id: 1,
        title: "Tech Innovation Summit 2026",
        category: "Technology",
        badgeClass: "cat-tech",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60",
        date: "2026-05-15 • 09:00 AM - 06:00 PM",
        location: "Convention Center, Downtown",
        filledStatus: "6/14 positions filled",
        description: "Join us for the biggest tech conference of the year featuring global keynotes, workshops, and innovative networking spaces.",
        roles: ["Event Coordinator (1 needed)", "Registration Desk Staff (2 needed)", "AV Technician (3 needed)"],
        hasMoreRoles: true
    },
    {
        id: 2,
        title: "Summer Music Festival",
        category: "Music",
        badgeClass: "cat-music",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60",
        date: "2026-06-20 • 02:00 PM - 11:00 PM",
        location: "Riverside Park",
        filledStatus: "21/31 positions filled",
        description: "An outdoor music festival featuring local and international artists across multi-stage independent production sets.",
        roles: ["Stage Manager (1 needed)", "Security Personnel (5 needed)", "Cleaning Crew (4 needed)"],
        hasMoreRoles: false
    },
    {
        id: 3,
        title: "Corporate Gala Dinner",
        category: "Corporate",
        badgeClass: "cat-corporate",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=60",
        date: "2026-05-01 • 07:00 PM - 11:00 PM",
        location: "Grand Hotel Ballroom",
        filledStatus: "12/19 positions filled",
        description: "An elegant evening celebrating our company's 25th anniversary with dinner service, live string quartets, and charity auctions.",
        roles: ["Wait Staff (4 needed)", "Valet Parking (3 needed)"],
        hasMoreRoles: false
    },
    {
        id: 4,
        title: "Startup Pitch Night",
        category: "Business",
        badgeClass: "cat-business",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=60",
        date: "2026-04-25 • 06:00 PM - 09:00 PM",
        location: "Innovation Hub",
        filledStatus: "3/6 positions filled",
        description: "Watch aspiring entrepreneurs pitch their ideas to investors in this high-energy workspace environment.",
        roles: ["Technical Support (1 needed)", "Registration Staff (1 needed)", "Photography (1 needed)"],
        hasMoreRoles: false
    },
    {
        id: 5,
        title: "Charity Marathon",
        category: "Sports",
        badgeClass: "cat-sports",
        image: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop&q=60",
        date: "2026-07-10 • 06:00 AM - 02:00 PM",
        location: "City Center Route",
        filledStatus: "29/39 positions filled",
        description: "Annual charity run supporting local schools with 5K, 10K, and comprehensive hydration management centers across track markers.",
        roles: ["Water Station Volunteer (5 needed)", "Route Marshal (3 needed)", "Registration Desk (2 needed)"],
        hasMoreRoles: false
    },
    {
        id: 6,
        title: "Art Gallery Opening",
        category: "Arts",
        badgeClass: "cat-arts",
        image: "https://images.unsplash.com/photo-1531058020387-3be344559be6?w=600&auto=format&fit=crop&q=60",
        date: "2026-05-08 • 05:00 PM - 09:00 PM",
        location: "Modern Art Museum",
        filledStatus: "5/9 positions filled",
        description: "Exclusive opening night for our contemporary art exhibition presenting featured international sculptors and digital displays.",
        roles: ["Gallery Guide (2 needed)", "Reception Staff (2 needed)"],
        hasMoreRoles: false
    }
];

const CATEGORIES = ["All", ...new Set(INITIAL_EVENTS.map(event => event.category))];

function ExploreEvents() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    // State to track registered event IDs dynamically
    const [registeredEvents, setRegisteredEvents] = useState([]);

    const handleRegister = (eventId, eventTitle) => {
        if (registeredEvents.includes(eventId)) return;
        setRegisteredEvents([...registeredEvents, eventId]);
        alert(`Successfully applied for role openings at: ${eventTitle}!`);
    };

    const filteredEvents = INITIAL_EVENTS.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            event.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="explore-container">
            <Navbar />

            <header className="explore-hero">
                <div className="explore-hero-content">
                    <h1>Explore Events</h1>
                    <p>Find the perfect event opportunity for your skills</p>

                    <div className="search-bar-wrapper" style={{ position: "relative" }}>
                        <div className="search-input-box">
                            <Search className="icon-search" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            className={`filter-button ${selectedCategory !== "All" ? "active-filter" : ""}`}
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        >
                            <SlidersHorizontal size={16} />
                            <span>Filters {selectedCategory !== "All" ? `(${selectedCategory})` : ""}</span>
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="filter-dropdown-menu">
                                <p className="dropdown-section-title">Filter by Category</p>
                                <div className="category-options-list">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            className={`category-option-btn ${selectedCategory === category ? "selected" : ""}`}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsFilterDropdownOpen(false);
                                            }}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="explore-main-content">
                <div className="results-counter">
                    Found {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
                    {selectedCategory !== "All" && ` in "${selectedCategory}"`}
                </div>

                <div className="explore-cards-grid">
                    {filteredEvents.length === 0 ? (
                        <div className="no-results-fallback" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
                            <h3>No events found match your selection.</h3>
                            <p>Try clearing your filters or changing your text search query.</p>
                            <button
                                className="clear-filters-link"
                                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                                style={{ marginTop: "12px", background: "none", border: "none", color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
                            >
                                Reset Filters & Search
                            </button>
                        </div>
                    ) : (
                        filteredEvents.map((event) => {
                            const isRegistered = registeredEvents.includes(event.id);
                            return (
                                <div key={event.id} className="wide-event-card">
                                    <div className="wide-card-image-box">
                                        <img src={event.image} alt={event.title} className="wide-event-img" />
                                        <span className={`wide-card-badge ${event.badgeClass}`}>
                                            {event.category}
                                        </span>
                                    </div>

                                    <div className="wide-card-details">
                                        <div className="wide-card-header-row">
                                            <h2 className="wide-event-title">{event.title}</h2>

                                            {/* Action Applied/Register Button added matching the mockup schema */}
                                            <button
                                                type="button"
                                                className={`card-action-register-btn ${isRegistered ? "registered-applied" : ""}`}
                                                onClick={() => handleRegister(event.id, event.title)}
                                                disabled={isRegistered}
                                            >
                                                {isRegistered ? (
                                                    <>
                                                        <CheckCircle size={14} /> Applied
                                                    </>
                                                ) : (
                                                    "Register Now"
                                                )}
                                            </button>
                                        </div>

                                        <div className="wide-meta-row">
                                            <div className="meta-item">
                                                <Calendar size={14} className="meta-icon-cal" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="meta-item">
                                                <MapPin size={14} className="meta-icon-pin" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="meta-item">
                                                <Users size={14} className="meta-icon-users" />
                                                <span>{event.filledStatus}</span>
                                            </div>
                                        </div>

                                        <p className="wide-event-description">{event.description}</p>

                                        <div className="wide-roles-pills-box">
                                            {event.roles.map((role, idx) => (
                                                <span key={idx} className="role-pill-tag">
                                                    {role}
                                                </span>
                                            ))}
                                            {event.hasMoreRoles && (
                                                <span className="role-pill-tag tag-more">+1 more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default ExploreEvents;