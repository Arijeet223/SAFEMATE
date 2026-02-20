import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BigButton from '../components/BigButton';

export default function LandingPage() {
    const navigate = useNavigate();
    const [locationStatus, setLocationStatus] = useState("Checking Location...");
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationStatus("Location Secured");
                    // Save to local storage so other pages can access it
                    localStorage.setItem('safemate_user_loc', JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }));
                },
                (error) => {
                    setLocationStatus("Location Disabled (Using Default)");
                    // Default to central India
                    localStorage.setItem('safemate_user_loc', JSON.stringify({ lat: 20.5937, lng: 78.9629 }));
                }
            );
        } else {
            setLocationStatus("Location Not Supported");
        }
    }, []);

    return (
        <div style={{ padding: "30px 20px 70px", maxWidth: 600, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <div style={{ textAlign: "center", marginBottom: 50 }}>
                <div style={{ width: 80, height: 80, margin: "0 auto", borderRadius: 25, background: "linear-gradient(135deg,#4361ee,#7209b7,#f72585)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, boxShadow: "0 0 40px rgba(67,97,238,0.5)", marginBottom: 20 }}>🛡️</div>
                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Safemate <span style={{ background: "linear-gradient(90deg,#4cc9f0,#f72585)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span></h1>
                <p style={{ color: "#94a3b8", fontSize: 16 }}>India's Disaster Management System</p>

                <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: 30, fontSize: 12, color: coords ? "#06d6a0" : "#fb8500" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: coords ? "#06d6a0" : "#fb8500", boxShadow: `0 0 10px ${coords ? "#06d6a0" : "#fb8500"}` }}></div>
                    {locationStatus}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <BigButton
                    icon="👤"
                    title="I am a CITIZEN"
                    subtitle="Need help, information, or to report an SOS"
                    gradient="linear-gradient(135deg,rgba(0,180,216,0.1),rgba(3,4,94,0.05))"
                    borderColor="rgba(0,180,216,0.4)"
                    titleColor="#00b4d8"
                    onClick={() => navigate('/citizen')}
                />

                <BigButton
                    icon="🏛️"
                    title="I am an AUTHORITY"
                    subtitle="Access NDRF / SDRF Live Operations Map"
                    gradient="linear-gradient(135deg,rgba(114,9,183,0.15),rgba(67,97,238,0.05))"
                    borderColor="rgba(114,9,183,0.4)"
                    titleColor="#c77dff"
                    onClick={() => navigate('/authority')}
                />
            </div>

        </div>
    );
}
