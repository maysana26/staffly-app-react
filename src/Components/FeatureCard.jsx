import React from "react";
import "./FeatureCard.css";

function FeatureCard({ icon: IconInstance, title, description, iconBg }) {
    return (
        <div className="feature-card">
            {/* Structural Custom Colored Container */}
            <div
                className="feature-icon-wrapper"
                style={{ backgroundColor: iconBg }}
            >
                {/* Dynamically renders the parsed component icon with standard configuration */}
                {IconInstance && <IconInstance size={24} color="#ffffff" />}
            </div>

            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default FeatureCard;