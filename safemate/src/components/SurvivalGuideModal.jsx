import React, { useState } from "react";
import { SURVIVAL_STEPS } from "../data/constants";

export default function SurvivalGuideModal({ onClose }) {
    const [activeGuide, setActiveGuide] = useState("Before Flood");

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#05071a", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Header */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(5,7,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
                <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#a5b4fc", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>←</span> Back
                </button>
                <div style={{ fontWeight: 800, fontSize: 16 }}>Survival Guide</div>
                <div style={{ width: 60 }}></div>
            </div>

            <div style={{ padding: "30px 20px" }}>
                <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: "#4361ee", marginBottom: 10, letterSpacing: "0.12em" }}>// NDMA-BACKED PROTOCOL</div>
                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.03em" }}>
                    Flood Survival{" "}
                    <span style={{ background: "linear-gradient(90deg,#4cc9f0,#7209b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Playbook</span>
                </h1>
                <p style={{ color: "#475569", fontSize: 14, marginBottom: 26 }}>Step-by-step safety instructions for India's flood emergencies</p>

                <div style={{ display: "flex", gap: 10, marginBottom: 26, flexWrap: "wrap" }}>
                    {[
                        { key: "Before Flood", icon: "⚡", active: "#4cc9f0", bg: "rgba(76,201,240,0.1)", border: "rgba(76,201,240,0.3)" },
                        { key: "During Flood", icon: "🌊", active: "#ff4d6d", bg: "rgba(255,77,109,0.1)", border: "rgba(255,77,109,0.3)" },
                        { key: "After Flood", icon: "🏥", active: "#06d6a0", bg: "rgba(6,214,160,0.1)", border: "rgba(6,214,160,0.3)" },
                    ].map(g => (
                        <button key={g.key} className="guide-tab-btn" onClick={() => setActiveGuide(g.key)} style={{
                            flex: "1 1 auto",
                            border: `1px solid ${activeGuide === g.key ? g.border : "rgba(255,255,255,0.06)"}`,
                            background: activeGuide === g.key ? g.bg : "transparent",
                            color: activeGuide === g.key ? g.active : "#475569",
                            boxShadow: activeGuide === g.key ? `0 0 25px ${g.active}18` : "none",
                            padding: "16px 20px",
                            fontSize: "15px"
                        }}>
                            {g.icon} {g.key}
                        </button>
                    ))}
                </div>

                <div>
                    {SURVIVAL_STEPS[activeGuide].map((step, i) => (
                        <div key={`${activeGuide}-${i}`} className="step-card" style={{ animationDelay: `${i * 0.07}s`, padding: "20px" }}>
                            <div style={{
                                width: 50, height: 50, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                                background: activeGuide === "During Flood" ? "rgba(255,77,109,0.12)" : activeGuide === "After Flood" ? "rgba(6,214,160,0.1)" : "rgba(76,201,240,0.1)",
                                border: `1px solid ${activeGuide === "During Flood" ? "rgba(255,77,109,0.2)" : activeGuide === "After Flood" ? "rgba(6,214,160,0.18)" : "rgba(76,201,240,0.18)"}`,
                            }}>{step.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: "#1e3a8a", marginBottom: 5 }}>STEP {i + 1}</div>
                                <div style={{ fontSize: 16, color: "#cbd5e1", lineHeight: 1.68 }}>{step.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {activeGuide === "After Flood" && (
                    <div style={{ marginTop: 20, background: "linear-gradient(135deg,rgba(6,214,160,0.07),rgba(6,214,160,0.02))", border: "1px solid rgba(6,214,160,0.2)", borderRadius: 20, padding: 24 }}>
                        <h3 style={{ color: "#06d6a0", fontSize: 16, fontWeight: 800, marginBottom: 16 }}>⚕️ Post-Flood Disease Watch — India</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 10 }}>
                            {[
                                { name: "Leptospirosis", risk: "HIGH", sign: "Fever + jaundice after wading in floodwater", color: "#ff4d6d" },
                                { name: "Cholera", risk: "HIGH", sign: "Severe diarrhea + dehydration, spreads fast", color: "#ff4d6d" },
                                { name: "Typhoid", risk: "HIGH", sign: "Sustained fever + stomach pain + weakness", color: "#ff9f1c" },
                                { name: "Malaria", risk: "MEDIUM", sign: "Cyclical fever + chills — mosquito-borne", color: "#f7d716" },
                                { name: "Dengue", risk: "MEDIUM", sign: "High fever + severe joint pain + rash", color: "#f7d716" },
                                { name: "Skin Infections", risk: "MEDIUM", sign: "Rashes, boils from contaminated water contact", color: "#c77dff" },
                            ].map((d, i) => (
                                <div key={i} style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${d.color}18`, borderRadius: 13, padding: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                                        <span style={{ fontWeight: 700, fontSize: 13 }}>{d.name}</span>
                                        <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 10, background: `${d.color}18`, color: d.color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{d.risk}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.55 }}>{d.sign}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
