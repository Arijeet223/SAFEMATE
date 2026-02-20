import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BigButton from '../components/BigButton';
import ChatBotModal from '../components/ChatBotModal';
import SurvivalGuideModal from '../components/SurvivalGuideModal';

export default function UserDashboard() {
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div style={{ padding: "30px 20px 70px", maxWidth: 600, margin: "0 auto", position: "relative" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 40 }}>
                <div style={{ position: "relative" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 15, background: "linear-gradient(135deg,#4361ee,#7209b7,#f72585)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 0 30px rgba(67,97,238,0.45)" }}>🛡️</div>
                </div>
                <div>
                    <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        Safemate <span style={{ background: "linear-gradient(90deg,#4cc9f0,#7209b7,#f72585,#4cc9f0)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmerGrad 4s linear infinite" }}>AI</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.15em", marginTop: 3 }}>USER INTERFACE</div>
                </div>
                <button
                    onClick={() => navigate('/authority')}
                    style={{ marginLeft: "auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", color: "#e2e8f0", fontSize: 12, cursor: "pointer" }}
                >
                    To Authority →
                </button>
            </div>

            <div style={{ marginBottom: 30 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Stay Safe. <br />Help is nearby.</h1>
                <p style={{ color: "#94a3b8", fontSize: 15 }}>India's Disaster Management Companion</p>
            </div>

            {/* BIG PRIMARY BUTTONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                <div style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>
                    {/* BIG SOS CIRCLE (No animation, solid red, very visible) */}
                    <div
                        onClick={() => navigate('/report')}
                        style={{
                            width: "180px",
                            height: "180px",
                            borderRadius: "50%",
                            background: "#ff0033",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                            boxShadow: "0 10px 40px rgba(255, 0, 51, 0.6)",
                            transition: "transform 0.2s"
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
                        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <div style={{ fontSize: "50px", marginBottom: "5px" }}>🚨</div>
                        <div style={{ fontSize: "36px", fontWeight: 900, color: "white", letterSpacing: "2px", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>SOS</div>
                    </div>

                    {/* CHATBOT BUTTON (Smaller, to the right) */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div
                            onClick={() => setShowChat(true)}
                            style={{
                                flex: 1,
                                background: "linear-gradient(135deg,rgba(67,97,238,0.15),rgba(114,9,183,0.1))",
                                border: "2px solid rgba(67,97,238,0.4)",
                                borderRadius: 24,
                                padding: "20px",
                                textAlign: "center",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                transition: "all 0.2s"
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
                            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <div style={{ fontSize: 40, marginBottom: 8 }}>🤖</div>
                            <div style={{ fontSize: 18, fontWeight: 900, color: "#a5b4fc", textShadow: "0 0 20px rgba(165,180,252,0.5)" }}>
                                AI
                            </div>
                            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                                ASSISTANT
                            </div>
                        </div>
                    </div>
                </div>

                {/* SURVIVAL GUIDE BUTTON */}
                <BigButton
                    icon="📋"
                    title="SURVIVAL GUIDE"
                    subtitle="Pre-flood, live flood & post-flood protocols"
                    gradient="linear-gradient(135deg,rgba(6,214,160,0.1),rgba(6,214,160,0.02))"
                    borderColor="rgba(6,214,160,0.3)"
                    titleColor="#06d6a0"
                    shadowColor="rgba(6,214,160,0.1)"
                    onClick={() => setShowGuide(true)}
                />

            </div>

            {/* Quick Emergency Numbers Bar */}
            <div style={{ marginTop: 30, background: "rgba(255,255,255,0.03)", borderRadius: 20, padding: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: "#64748b", marginBottom: 15 }}>DIRECT DIAL</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#ff4d6d", fontFamily: "'JetBrains Mono',monospace" }}>112</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>National</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#4cc9f0", fontFamily: "'JetBrains Mono',monospace" }}>1078</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>NDMA</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#06d6a0", fontFamily: "'JetBrains Mono',monospace" }}>108</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>Ambulance</div>
                    </div>
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
