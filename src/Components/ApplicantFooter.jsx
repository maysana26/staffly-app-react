import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css"; // Reuses shared CSS structural layout classes

function ApplicantFooter() {
    const navigate = useNavigate();

    return (
        <footer className="global-cta-section">
            <div className="footer-content-wrap">
                <h2 className="global-cta-title">Ready to Start Your Journey?</h2>
                <p className="global-cta-subtitle">
                    Join hundreds of event professionals building their careers on Staffly!
                </p>
                <button
                    className="global-btn-cta"
                    type="button"
                    onClick={() => navigate("/signup")}
                >
                    Get Started Today
                </button>
            </div>

            {/* Bottom metadata sub-footer section */}
            <div className="footer-bottom-meta">
                <div className="footer-meta-left">
                    © 2026 Staffly. Created by Maysana Abukhait. All Rights Reserved.
                </div>
                <div className="footer-meta-right">
                    Contact us: support@staffly.com | +962 796 082 327
                </div>
            </div>
        </footer>
    );
}

export default ApplicantFooter;