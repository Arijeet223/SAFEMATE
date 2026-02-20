import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportSection() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ type: '', people: '1', injured: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = (type) => {
        setFormData({ ...formData, type });
        setStep(2);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call to authorities
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3);
        }, 2000);
    };

    return (
        <div style={{ padding: "30px 20px 70px", maxWidth: 600, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
                <button onClick={() => navigate('/')} style={{ background: "transparent", border: "none", color: "#a5b4fc", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>←</span> Back
                </button>
                <div style={{ margin: "0 auto", fontWeight: 800, fontSize: 18, color: "#ff4d6d", letterSpacing: "2px" }}>SOS REPORT</div>
                <div style={{ width: 60 }}></div>
            </div>

            {step === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, textAlign: "center" }}>What is your emergency?</h2>
                    <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: 40 }}>Tap the option that best describes your situation</p>

                    <div style={{ display: "grid", gap: 16 }}>
                        {[
                            { id: 'water_rising', icon: "🌊", label: "Water Rising Rapidly", alert: "High Priority" },
                            { id: 'trapped', icon: "🏠", label: "Trapped in Building", alert: "" },
                            { id: 'medical', icon: "🏥", label: "Medical Emergency", alert: "Need Ambulance" },
                            { id: 'power', icon: "⚡", label: "Live Wire Hazard", alert: "Stay Back" }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => handleNext(opt.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 20, padding: "20px",
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 20, cursor: "pointer", transition: "all 0.2s"
                                }}
                            >
                                <div style={{ fontSize: 32, flexShrink: 0 }}>{opt.icon}</div>
                                <div style={{ flex: 1, textAlign: "left" }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff" }}>{opt.label}</div>
                                    {opt.alert && <div style={{ fontSize: 12, color: "#ff4d6d", marginTop: 4, fontWeight: 600 }}>{opt.alert}</div>}
                                </div>
                                <div style={{ fontSize: 24, color: "#475569" }}>→</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 30 }}>Final Details</h2>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", marginBottom: 10, color: "#94a3b8", fontWeight: 600 }}>People Stranded</label>
                        <div style={{ display: "flex", gap: 10 }}>
                            {['1', '2-4', '5+'].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setFormData({ ...formData, people: num })}
                                    style={{
                                        flex: 1, padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                                        background: formData.people === num ? "rgba(67,97,238,0.2)" : "rgba(255,255,255,0.05)",
                                        border: `2px solid ${formData.people === num ? "#4361ee" : "transparent"}`,
                                        color: formData.people === num ? "#a5b4fc" : "#94a3b8",
                                        cursor: "pointer"
                                    }}
                                >{num}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: 40, padding: "20px", background: "rgba(255,77,109,0.1)", borderRadius: 16, border: "1px solid rgba(255,77,109,0.3)" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 15, cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={formData.injured}
                                onChange={e => setFormData({ ...formData, injured: e.target.checked })}
                                style={{ width: 24, height: 24, accentColor: "#ff4d6d" }}
                            />
                            <div>
                                <div style={{ fontWeight: 700, color: "#ff4d6d", fontSize: 16 }}>Requires Medical Attention</div>
                                <div style={{ fontSize: 12, color: "#ffccd5" }}>Check if someone is severely injured</div>
                            </div>
                        </label>
                    </div>

                    <div style={{ marginTop: "auto", padding: "20px", background: "rgba(0,0,0,0.5)", borderRadius: 20, textAlign: "center", marginBottom: 20 }}>
                        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 10 }}>📍 Your GPS Location will be attached automatically</div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{
                                width: "100%", padding: "20px", borderRadius: 16, fontSize: 18, fontWeight: 900,
                                background: "linear-gradient(135deg,#be123c,#ff4d6d)", border: "none", color: "white",
                                cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1,
                                boxShadow: "0 10px 30px rgba(255,77,109,0.4)"
                            }}
                        >
                            {isSubmitting ? "TRANSMITTING SOS..." : "SEND SOS NOW"}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(6,214,160,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, marginBottom: 20, border: "2px solid #06d6a0", boxShadow: "0 0 40px rgba(6,214,160,0.3)" }}>✓</div>
                    <h2 style={{ fontSize: 28, fontWeight: 900, color: "#06d6a0", marginBottom: 10 }}>SOS RECEIVED</h2>
                    <p style={{ color: "#e2e8f0", fontSize: 16, marginBottom: 30, lineHeight: 1.6 }}>Authorities have your location. <br />NDRF teams are tracking your request.</p>

                    <div style={{ background: "rgba(255,255,255,0.05)", padding: 20, borderRadius: 16, width: "100%", marginBottom: 40 }}>
                        <div style={{ fontWeight: 700, color: "#ff9f1c", marginBottom: 10 }}>⚠️ IMMEDIATE INSTRUCTIONS:</div>
                        <ul style={{ textAlign: "left", color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
                            <li>Move to the highest floor immediately</li>
                            <li>Stay away from electrical appliances</li>
                            <li>Preserve phone battery</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        style={{ padding: "16px 30px", borderRadius: 12, background: "transparent", border: "2px solid #4361ee", color: "#a5b4fc", fontWeight: 700, cursor: "pointer", width: "100%" }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
