import React, { useState } from 'react';

function FeedbackModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-4 text-center">
            {/* Trigger Button styled cleanly with Bootstrap */}
            <button className="btn btn-outline-secondary fw-semibold px-4 py-2" onClick={() => setIsOpen(true)}>
                ⭐ Leave Application Feedback
            </button>

            {/* Conditional Bootstrap Modal Overlay with absolute priority stack */}
            {isOpen && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 10000, /* Forces modal backdrop over the footer wrapper layer */
                        overflowX: "hidden",
                        overflowY: "auto"
                    }}
                >
                    {/* Modal wrapper structure enforcing stacking context */}
                    <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 10001, position: "relative" }}>
                        <div className="modal-content p-2" style={{ borderRadius: '14px', textAlign: 'left', border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold text-dark">Rate Your Experience</h5>
                                <button type="button" className="btn-close" onClick={() => setIsOpen(false)} style={{ boxShadow: 'none' }}></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted small">How easy was it to manage your event profile today?</p>
                                <div className="mb-3">
                                    <select className="form-select" style={{ boxShadow: 'none' }}>
                                        <option>Excellent (5 Stars)</option>
                                        <option>Good (4 Stars)</option>
                                        <option>Average (3 Stars)</option>
                                        <option>Poor (2 Stars)</option>
                                    </select>
                                </div>
                                <textarea className="form-control" rows="3" placeholder="Tell us more about your experience..." style={{ boxShadow: 'none' }}></textarea>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-light fw-medium" onClick={() => setIsOpen(false)}>Close</button>
                                <button type="button" className="btn text-white fw-bold" style={{ backgroundColor: '#ff6b00' }} onClick={() => setIsOpen(false)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FeedbackModal;