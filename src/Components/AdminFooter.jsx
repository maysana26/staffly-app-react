import React from "react";
import "./Footer.css"; // Reuses shared global-cta footer structures

function AdminFooter() {
    return (
        <footer className="global-cta-section">
            <div className="footer-content-wrap">
                <h2 className="global-cta-title">Check New Applications?</h2>
                <p className="global-cta-subtitle">View users building their careers on Staffly!</p>
                <button className="global-btn-cta" type="button">
                    Let's Check
                </button>
            </div>

            {/* Bottom metadata sub-footer section */}
            <div className="footer-bottom-meta">
                <div className="footer-meta-left">
                    © 2026 Staffly. Created by Maysana Abukhait. All Rights Reserved.
                </div>
                <div className="footer-meta-right">
                    Contact us: admin-support@staffly.com | +962 796 082 327
                </div>
            </div>
        </footer>
    );
}

export default AdminFooter;