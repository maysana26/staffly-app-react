import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";
import "./Navbar.css";

function ApplicantNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="global-navbar">
            <div className="navbar-container">
                {/* Left Brand Area */}
                <div className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <div className="logo-icon-bg">
                        <Calendar color="white" size={20} strokeWidth={2.5} />
                    </div>
                    <span className="navbar-brand-name">Staffly</span>
                </div>

                {/* Center Navigation Links */}
                <div className="navbar-links">
                    <button
                        className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
                        onClick={() => navigate("/home")}
                    >
                        Home
                    </button>
                    <button
                        className={`nav-link ${location.pathname === "/events" ? "active" : ""}`}
                        onClick={() => navigate("/events")}
                    >
                        Events
                    </button>
                    <button
                        className={`nav-link ${location.pathname === "/myevents" ? "active" : ""}`}
                        onClick={() => navigate("/myevents")}
                    >
                        My Events
                    </button>
                    <button
                        className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>
                </div>

                {/* Right Side Authentication Section Box */}
                <div className="navbar-auth-buttons">
                    <button className="btn-nav-login" onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button className="btn-nav-signup" onClick={() => navigate("/signup")}>
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
}

export default ApplicantNavbar;