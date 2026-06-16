import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all the fields!");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/applicant/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid credentials!");
            }

            // Guard rails to guarantee token data exists cleanly
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                throw new Error("Token payload missing from server login response data.");
            }

            alert(`Logged in successfully as ${data.user.role}!`);

            // Dynamic dashboard routing based on DB user role
            if (data.user.role === "admin") {
                navigate("/admindashboard");
            } else {
                navigate("/home");
            }

            setEmail("");
            setPassword("");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="logo-container">
                <Calendar color="white" size={28} strokeWidth={2.5} />
            </div>

            <div className="text-center">
                <h1 className="welcome-title">Welcome Back!</h1>
                <p className="subtitle">Log in to access your account</p>
            </div>

            <div className="auth-card">
                <form onSubmit={handleSubmit}>
                    <div className="input-section">
                        <label>Email Address</label>
                        <div className="input-field">
                            <Mail className="field-icon" size={20} />
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="input-section">
                        <label>Password</label>
                        <div className="input-field">
                            <Lock className="field-icon" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" /> Remember me
                        </label>
                        <button type="button" className="forgot-link">Forgot password?</button>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Verifying..." : "Log In"} <ArrowRight size={20} />
                    </button>
                </form>

                <p className="footer-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>

            <p className="legal-text">
                By logging in, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
            </p>
        </div>
    );
}

export default Login;