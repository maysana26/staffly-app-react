import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Auth.css"

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {

        e.preventDefault();
        if (!email || !password) {
            alert("Please fill all the fields!");
            return;
        }

        if (email.toLocaleLowerCase().includes("admin")) {
            alert("Logged in successfully as admin.");
            navigate("/admindashboard");
        }
        else {
            alert("Logged in successfully.");
            navigate("/home");
        }
        setEmail("");
        setPassword("");


    }


    return (

        <>   <Navbar />
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
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" /> Remember me
                            </label>
                            <button type="button" className="forgot-link">Forgot password?</button>
                        </div>

                        <button type="submit" className="login-button">
                            Log In <ArrowRight size={20} />
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

            <Footer />
        </>
    );

}
export default Login;