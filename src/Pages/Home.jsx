import React from "react";
import { ArrowRight, Briefcase, Award, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import EventCard from "../components/EventCard";
import Footer from "../Components/Footer";
import "./Home.css";



const features = [
    { icon: Search, title: "Browse Events", description: "Discover opportunities at conferences, festivals, corporate events, and more", iconBg: "#ff6b00" },
    { icon: Briefcase, title: "Apply for Roles", description: "Choose positions that match your skills and submit applications instantly", iconBg: "#2563eb" },
    { icon: Award, title: "Build Reputation", description: "Earn ratings and build your profile to unlock better opportunities", iconBg: "#a855f7" }
];

const events = [
    { image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600", title: "Tech Innovation Summit 2026", date: "2026-05-15", location: "Convention Center, Downtown", roles: 4, category: "Technology" },
    { image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600", title: "Summer Music Festival", date: "2026-06-20", location: "Riverside Park", roles: 3, category: "Music" },
    { image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600", title: "Corporate Gala Dinner", date: "2026-05-01", location: "Grand Hotel Ballroom", roles: 2, category: "Corporate" }
];


function Home() {
    const navigate = useNavigate();

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
                    {events.map((event, index) => (
                        <EventCard
                            key={index}
                            image={event.image}
                            title={event.title}
                            date={event.date}
                            location={event.location}
                            roles={event.roles}
                            category={event.category}
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