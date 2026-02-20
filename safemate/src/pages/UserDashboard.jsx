import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import ChatBotModal from '../components/ChatBotModal';
import SurvivalGuideModal from '../components/SurvivalGuideModal';
import NewsWidget from '../components/NewsWidget';

const mapContainerStyle = {
    width: '100%',
    height: '220px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

export default function UserDashboard() {
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [location, setLocation] = useState(defaultCenter);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCMK2OL0jkWWOVXo5As1MGsrZle8kuqMng"
    });

    useEffect(() => {
        const locString = localStorage.getItem('safemate_user_loc');
        if (locString) {
            try { setLocation(JSON.parse(locString)); } catch (e) { }
        }
    }, []);

    return (
        <div style={{ padding: "20px 20px 140px", maxWidth: 600, margin: "0 auto", position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Header Area */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#4361ee,#7209b7,#f72585)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 0 20px rgba(67,97,238,0.3)" }}>
                        🛡️
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc" }}>
                            Safemate <span style={{ color: "#4cc9f0" }}>AI</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginTop: 2 }}>
                            CITIZEN INTERFACE
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/')}
                    style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px", color: "#cbd5e1", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                    <span style={{ fontSize: 14 }}>🔄</span> Switch
                </div>
            </div>

            {/* Dynamic News & Weather Dashboard */}
            <NewsWidget location={location} />

            {/* Live Location Map Focus */}
            <div style={{ marginBottom: 25 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>📍 Live Location</h2>
                    <span style={{ fontSize: 11, color: "#06d6a0", background: "rgba(6,214,160,0.1)", padding: "2px 8px", borderRadius: 10 }}>GPS Active</span>
                </div>
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={location}
                        zoom={15}
                        options={{
                            styles: [
                                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
                            ],
                            disableDefaultUI: true,
                        }}
                    >
                        <Marker position={location} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
                    </GoogleMap>
                ) : (
                    <div style={{ height: 220, background: "rgba(255,255,255,0.02)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="spinner" style={{ borderTopColor: "#4cc9f0" }}></div>
                    </div>
                )}
            </div>

            {/* Emergency Contacts - Clean Card Style */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "18px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.05em" }}>DIRECT EMERGENCY DIAL</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <a href="tel:112" style={{ width: "30%", textAlign: "center", textDecoration: "none", background: "rgba(255,77,109,0.1)", padding: "12px 0", borderRadius: 10, border: "1px solid rgba(255,77,109,0.2)" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#ff4d6d" }}>112</div>
                        <div style={{ fontSize: 10, color: "#e2e8f0", marginTop: 2 }}>National</div>
                    </a>
                    <a href="tel:1078" style={{ width: "30%", textAlign: "center", textDecoration: "none", background: "rgba(76,201,240,0.1)", padding: "12px 0", borderRadius: 10, border: "1px solid rgba(76,201,240,0.2)" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#4cc9f0" }}>1078</div>
                        <div style={{ fontSize: 10, color: "#e2e8f0", marginTop: 2 }}>NDMA</div>
                    </a>
                    <a href="tel:108" style={{ width: "30%", textAlign: "center", textDecoration: "none", background: "rgba(6,214,160,0.1)", padding: "12px 0", borderRadius: 10, border: "1px solid rgba(6,214,160,0.2)" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#06d6a0" }}>108</div>
                        <div style={{ fontSize: 10, color: "#e2e8f0", marginTop: 2 }}>Medic</div>
                    </a>
                </div>
            </div>

            {/* Bottom App Navigation Bar (Clean & Aligned) */}
            <div className="mobile-modal bottom-nav-bar" style={{
                top: "auto",
                bottom: 0,
                height: "80px",
                background: "rgba(5, 7, 26, 0.98)", // Solid dark background to match app
                borderTop: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                justifyContent: "space-between", // Even spacing horizontally
                alignItems: "center", // Perfect vertical alignment
                padding: "0 25px", // Side padding
                zIndex: 1000,
            }}>

                {/* Survival Guide (Left) */}
                <div onClick={() => setShowGuide(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: "80px" }}>
                    <div style={{ fontSize: 24, marginBottom: 4, opacity: 0.9 }}>📋</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#06d6a0" }}>Guide</div>
                </div>

                {/* Main SOS Button (Center - Popped out) */}
                <div style={{ position: "relative", width: "90px", display: "flex", justifyContent: "center" }}>
                    <div
                        onClick={() => navigate('/report')}
                        style={{
                            position: "absolute",
                            top: "-40px", // Pops entirely out of the bar
                            width: "78px",
                            height: "78px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #ff0a33, #c1001a)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 8px 30px rgba(255, 10, 51, 0.5), inset 0 2px 0 rgba(255,255,255,0.2)",
                            border: "6px solid #05071a" // Global dark background to create a crisp cutout look
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <div style={{ fontSize: 28, lineHeight: 1, marginTop: -2 }}>🚨</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "white", letterSpacing: "1px", marginTop: 2 }}>SOS</div>
                    </div>
                </div>

                {/* AI Chatbot (Right - Extremely visible icon) */}
                <div onClick={() => setShowChat(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: "80px" }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4cc9f0, #4361ee)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        marginBottom: 4,
                        boxShadow: "0 0 10px rgba(76,201,240,0.5)"
                    }}>🤖</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>Chat AI</div>
                </div>

            </div>

            {/* Modals */}
            {showChat && (
                <ChatBotModal
                    onClose={() => setShowChat(false)}
                    onSOS={() => {
                        setShowChat(false);
                        navigate('/report');
                    }}
                />
            )}
            {showGuide && <SurvivalGuideModal onClose={() => setShowGuide(false)} />}
        </div>
    );
}
