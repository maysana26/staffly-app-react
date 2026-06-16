import React, { useState, useEffect } from "react";
import { ArrowRight, Briefcase, Award, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/ApplicantNavbar";
import FeatureCard from "../components/FeatureCard";
import EventCard from "../components/EventCard";
import Footer from "../Components/ApplicantFooter";
import "./Home.css";

const features = [
    { icon: Search, title: "Browse Events", description: "Discover opportunities at conferences, festivals, corporate events, and more", iconBg: "#ff6b00" },
    { icon: Briefcase, title: "Apply for Roles", description: "Choose positions that match your skills and submit applications instantly", iconBg: "#2563eb" },
    { icon: Award, title: "Build Reputation", description: "Earn ratings and build your profile to unlock better opportunities", iconBg: "#a855f7" }
];

function Home() {
    const navigate = useNavigate();
    const [featuredEvents, setFeaturedEvents] = useState([]);

    // Fetch dynamic event data directly from database to populate high-visibility landing components
    useEffect(() => {
        const fetchFeaturedOpportunities = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/events");
                if (response.ok) {
                    const data = await response.json();
                    setFeaturedEvents(data.slice(0, 3)); // Match the UI display structure seamlessly
                } else {
                    console.error("Error retrieving dashboard featured collections");
                }
            } catch (error) {
                console.error("Database connection failure on landing hook:", error);
            }
        };

        fetchFeaturedOpportunities();
    }, []);

    return (
        <div className="home-container">
            {/* 1. Global Navigation Bar */}
            <Navbar />

            {/* 2. Hero Presentation Layout */}
            <header className="hero-section">
                <h1 className="hero-title">
                    Find Your Next<br />
                    <span className="text-event">Event</span>
                    <span className="text-opportunity">Opportunity</span>
                </h1>
                <p className="hero-subtitle">
                    Connect with top event organizers and build your career in event management. Apply for roles, showcase your experience, and get hired.
                </p>
                <div className="hero-buttons">
                    <button className="btn-primary" onClick={() => navigate("/events")} >Browse Events <ArrowRight size={18} /></button>
                    <button className="btn-secondary" onClick={() => navigate("/signup")} >Create Account</button>
                </div>
            </header>

            {/* 3. Highlight/Feature Grid */}
            <section className="features-container">
                {features.map((item, index) => (
                    <FeatureCard
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        iconBg={item.iconBg}
                    />
                ))}
            </section>

            {/* 4. Filtered Events Display Showcase */}
            <section className="events-section">
                <h2 className="section-title">Featured Events</h2>
                <p className="section-subtitle">Top opportunities available right now</p>

                <div className="events-grid">
                    {featuredEvents.map((event, index) => (
                        <EventCard
                            key={event._id || index}
                            image={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600"}
                            title={event.title}
                            date={event.date}
                            location={event.location}


                        />
                    ))}
                </div>

                <button className="view-all-btn" onClick={() => navigate("/events")} >View All Events →</button>
            </section>
            <Footer />
        </div>
    );
}

export default Home;