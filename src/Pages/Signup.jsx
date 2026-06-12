import React, { useState } from "react";
import { Mail, Lock, User, Building, ArrowRight, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Auth.css";

function Signup() {

    const [accountType, setAccountType] = useState("staff");
    const navigate = useNavigate();

    const [formInfo, setFormInfo] = useState({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // this is for the re-rending  of the ui input field, as if the user types in the field, the ui changes based on the typing
    const handleChange = (e) => {
        setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
    };

    // this is for handling the submit and sending ther data to somewhere else or to a database or server
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formInfo.fullName || !formInfo.email || !formInfo.password) {
            alert("Please fill in all the fields!");
        }

        if (accountType == "company" && !formInfo.companyName) {
            alert("Please specify your company name!");
        }
        if (formInfo.password !== formInfo.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        //here , a logic of saving input and data, saving it into a database should happen
        alert(`Account creating successully as a ${accountType}! Redirecting you to Login.`);
        navigate("/login");
    };
    return (
        <>
            <Navbar />
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

                        {/* Account Type Selection */}
                        <div className="input-section">
                            <label>Account Type</label>
                            <div className="role-selection-grid">
                                <div
                                    className={`role-card ${accountType === "staff" ? "active" : ""}`}
                                    onClick={() => setAccountType("staff")}
                                >
                                    <User size={24} className="role-icon" />
                                    <div className="role-info">
                                        <strong>Event Staff</strong>
                                        <p>Looking for event opportunities</p>
                                    </div>
                                </div>

                                <div
                                    className={`role-card ${accountType === "company" ? "active" : ""}`}
                                    onClick={() => setAccountType("company")}
                                >
                                    <Building size={24} className="role-icon" />
                                    <div className="role-info">
                                        <strong>Company</strong>
                                        <p>Posting event opportunities</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-section">
                                <label>{accountType === "staff" ? "Full Name" : "Contact Name"}</label>
                                <div className="input-field">
                                    <User className="field-icon" size={20} />
                                    <input name="fullName" type="text" placeholder="John Doe" value={formInfo.fullName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="input-section">
                                <label>Email Address</label>
                                <div className="input-field">
                                    <Mail className="field-icon" size={20} />
                                    <input name="email" type="email" placeholder="email@example.com" onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Conditional Company Field */}
                        {accountType === "company" && (
                            <div className="input-section fade-in">
                                <label>Company Name</label>
                                <div className="input-field">
                                    <Building className="field-icon" size={20} />
                                    <input name="companyName" type="text" placeholder="Your Company Inc." value={formInform.companyName} onChange={handleChange} required={accountType === "company"} />
                                </div>
                            </div>
                        )}

                        <div className="input-row">
                            <div className="input-section">
                                <label>Password</label>
                                <div className="input-field">
                                    <Lock className="field-icon" size={20} />
                                    <input name="password" type="password" placeholder="••••••••" value={formInfo.password} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="input-section">
                                <label>Confirm Password</label>
                                <div className="input-field">
                                    <Lock className="field-icon" size={20} />
                                    <input name="confirmPassword" type="password" placeholder="••••••••" value={formInfo.confirmPassword} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <p className="agreement-text">
                            I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span>
                        </p>

                        <button type="submit" className="login-button">
                            Create Account <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="footer-link">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>


            </div>
            <Footer />


        </>
    );

};
export default Signup;
