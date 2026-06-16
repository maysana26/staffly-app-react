import React from "react";
import "./EventCard.css";

function EventCard({ image, title, date, location, roles, category }) {
    // Generate lower-case CSS utility class names dynamically (e.g., badge-technology)
    const badgeClass = category ? `badge-${category.toLowerCase()}` : "";

    return (
        <div className="event-card">
            {/* Visual Media Wrapper */}
            <div className="event-image-container">
                <img src={image} alt={title} className="event-img" />
                {category && (
                    <span className={`event-badge ${badgeClass}`}>
                        {category}
                    </span>
                )}
            </div>

            {/* Information Space Content Block */}
            <div className="event-details">
                <h3 className="event-title">{title}</h3>
                <p className="event-date-loc">
                    {date} • {location}
                </p>

                {/* Available Positions Indicator */}
                <div className="event-roles">
                    <span className="role-pin">📈</span>
                    <span>{roles} roles available</span>
                </div>
            </div>
        </div>
    );
}

export default EventCard;