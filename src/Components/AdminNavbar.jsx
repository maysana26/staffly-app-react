import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Reuses shared Navbar styling layouts
import { Calendar, LogOut } from "lucide-react";

function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to determine if a route path is currently active
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        // Clear any auth tokens or user state here if needed
        navigate("/login");
    };

    return (
        <nav className="global-navbar">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate("/adminhome")} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon-bg">
                        <Calendar color="white" size={20} strokeWidth={2.5} />
                    </div>
                    <span className="navbar-brand-name">Staffly</span>
                </div>
                <div className="navbar-links">
                    <button
                        className={`nav-link ${isActive("/adminhome") ? "active" : ""}`}
                        onClick={() => navigate("/adminhome")}
                    >
                        Home
                    </button>
                    <button
                        className={`nav-link ${isActive("/admin/events") ? "active" : ""}`}
                        onClick={() => navigate("/admin/events")}
                    >
                        Events
                    </button>
                    <button
                        className={`nav-link ${isActive("/admindashboard") ? "active" : ""}`}
                        onClick={() => navigate("/admindashboard")}
                    >
                        Admin Dashboard
                    </button>

                </div>
                <div className="navbar-auth-buttons">
                    <button className="btn-nav-logout" onClick={handleLogout}>
                        <LogOut size={16} strokeWidth={2.5} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;