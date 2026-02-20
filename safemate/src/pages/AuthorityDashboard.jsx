import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { getEmergencies } from '../data/emergencyStore';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '20px'
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629 // Center of India
};

export default function AuthorityDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("incoming");
    const [emergencies, setEmergencies] = useState([]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCMK2OL0jkWWOVXo5As1MGsrZle8kuqMng"
    });

    useEffect(() => {
        const loadData = () => {
            setEmergencies(getEmergencies().reverse()); // Show newest first
        };
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const activeSOSCount = emergencies.filter(e => e.status !== "Resolved").length;

    return (
        <div style={{ padding: "30px 20px 70px", maxWidth: 960, margin: "0 auto", position: "relative" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 30 }}>
                <div style={{ position: "relative" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 15, background: "linear-gradient(135deg,#1e293b,#0f172a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "2px solid #4cc9f0" }}>🏛️</div>
                </div>
                <div>
                    <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        Safemate <span style={{ color: "#4cc9f0" }}>Command</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.15em", marginTop: 3 }}>AUTHORITY INTERFACE</div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    style={{ marginLeft: "auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", color: "#e2e8f0", fontSize: 12, cursor: "pointer" }}
                >
                    ← Switch Role
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 30 }}>
                {[
                    { label: "Active SOS", val: activeSOSCount.toString(), c: "#ff4d6d" },
                    { label: "Teams Deployed", val: "38", c: "#ff9f1c" },
                    { label: "People Rescued", val: "8,405", c: "#06d6a0" }
                ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: 20, borderRadius: 16 }}>
                        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 5 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: s.c }}>{s.val}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }}>
                <button onClick={() => setActiveTab("incoming")} style={{ background: "none", border: "none", color: activeTab === "incoming" ? "#f0f4ff" : "#64748b", fontSize: 16, fontWeight: 700, cursor: "pointer", position: "relative" }}>
                    Live Feed
                    {activeTab === "incoming" && <div style={{ position: "absolute", bottom: -12, left: 0, right: 0, height: 2, background: "#4cc9f0" }} />}
                </button>
                <button onClick={() => setActiveTab("map")} style={{ background: "none", border: "none", color: activeTab === "map" ? "#f0f4ff" : "#64748b", fontSize: 16, fontWeight: 700, cursor: "pointer", position: "relative", marginLeft: 20 }}>
                    Live Map
                    {activeTab === "map" && <div style={{ position: "absolute", bottom: -12, left: 0, right: 0, height: 2, background: "#4cc9f0" }} />}
                </button>
            </div>

            {activeTab === "incoming" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {emergencies.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                            No active SOS reports right now.
                        </div>
                    ) : emergencies.map((rep, i) => (
                        <div key={rep.id} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid #ff4d6d30`, borderRadius: 16, padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4d6d", boxShadow: `0 0 10px #ff4d6d` }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <div style={{ fontWeight: 800, fontSize: 15, color: "#f0f4ff" }}>{rep.type}</div>
                                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>
                                        {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    <span>📍 {rep.address || `${rep.location?.lat.toFixed(4)}, ${rep.location?.lng.toFixed(4)}`}</span> • <span>👥 {rep.peopleCount}</span> {rep.medicalNeeded && <span style={{ color: "#ff4d6d" }}>• 🏥 Medical Needed</span>}
                                </div>
                            </div>
                            <button style={{ padding: "8px 16px", borderRadius: 8, background: `#ff4d6d15`, border: `1px solid #ff4d6d50`, color: "#ff4d6d", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                                {rep.status.toUpperCase()}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "map" && (
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={emergencies.length > 0 ? emergencies[0].location : defaultCenter}
                            zoom={emergencies.length > 0 ? 12 : 5}
                            options={{
                                styles: [
                                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
                                ],
                                disableDefaultUI: true,
                                zoomControl: true
                            }}
                        >
                            {emergencies.map((rep) => (
                                <Marker
                                    key={rep.id}
                                    position={rep.location}
                                    title={rep.type}
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                    }}
                                />
                            ))}
                        </GoogleMap>
                    ) : (
                        <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                            Loading Map...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
