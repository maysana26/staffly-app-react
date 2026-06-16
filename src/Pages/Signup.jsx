import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ApplicantNavbar from "../Components/ApplicantNavbar";
import ApplicantFooter from "../Components/ApplicantFooter";
import "./Auth.css";

function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formInfo, setFormInfo] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formInfo.fullName || !formInfo.email || !formInfo.password) {
            alert("Please fill in all the fields!");
            return;
        }

        if (formInfo.password !== formInfo.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/applicant/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formInfo.fullName,
                    email: formInfo.email,
                    password: formInfo.password,
                    role: "applicant"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            alert("Account created successfully! Redirecting you to Login.");
            navigate("/login");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ApplicantNavbar />
            <div className="auth-page-wrapper">
                <div className="logo-container">
                    <Calendar color="white" size={28} strokeWidth={2.5} />
                </div>

                <div className="text-center">
                    <h1 className="welcome-title">Create Account</h1>
                    <p className="subtitle">Join Staffly and start your journey</p>
                </div>

                <div className="auth-card signup-card">
                    <form onSubmit={handleSubmit}>
                        <div className="input-row">
                            <div className="input-section">
                                <label>Full Name</label>
                                <div className="input-field">
                                    <User className="field-icon" size={20} />
                                    <input name="fullName" type="text" placeholder="John Doe" value={formInfo.fullName} onChange={handleChange} required disabled={loading} />
                                </div>
                            </div>

                            <div className="input-section">
                                <label>Email Address</label>
                                <div className="input-field">
                                    <Mail className="field-icon" size={20} />
                                    <input name="email" type="email" placeholder="email@example.com" value={formInfo.email} onChange={handleChange} required disabled={loading} />
                                </div>
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-section">
                                <label>Password</label>
                                <div className="input-field">
                                    <Lock className="field-icon" size={20} />
                                    <input name="password" type="password" placeholder="••••••••" value={formInfo.password} onChange={handleChange} required disabled={loading} />
                                </div>
                            </div>

                            <div className="input-section">
                                <label>Confirm Password</label>
                                <div className="input-field">
                                    <Lock className="field-icon" size={20} />
                                    <input name="confirmPassword" type="password" placeholder="••••••••" value={formInfo.confirmPassword} onChange={handleChange} required disabled={loading} />
                                </div>
                            </div>
                        </div>

                        <p className="agreement-text">
                            I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span>
                        </p>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="footer-link">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
            <ApplicantFooter />
        </>
    );
}

export default Signup;