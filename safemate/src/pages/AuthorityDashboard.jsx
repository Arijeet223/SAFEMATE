import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_REPORTS = [
    { id: "SOS-8472", type: "Water Rising Rapidly", people: "5+", medical: true, time: "2 mins ago", loc: "Assam, Brahmaputra Plain", status: "PENDING", color: "#ff4d6d" },
    { id: "SOS-8471", type: "Trapped in Building", people: "2-4", medical: false, time: "14 mins ago", loc: "Kerala, Ernakulam", status: "DISPATCHED", color: "#ff9f1c" },
    { id: "SOS-8470", type: "Medical Emergency", people: "1", medical: true, time: "22 mins ago", loc: "Bihar, Kosi Banks", status: "RESOLVED", color: "#06d6a0" },
];

export default function AuthorityDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("incoming");

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
                    ← To User
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 30 }}>
                {[
                    { label: "Active SOS", val: "142", c: "#ff4d6d" },
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
                    Incoming SOS
                    {activeTab === "incoming" && <div style={{ position: "absolute", bottom: -12, left: 0, right: 0, height: 2, background: "#4cc9f0" }} />}
                </button>
                <button onClick={() => setActiveTab("map")} style={{ background: "none", border: "none", color: activeTab === "map" ? "#f0f4ff" : "#64748b", fontSize: 16, fontWeight: 700, cursor: "pointer", position: "relative", marginLeft: 20 }}>
                    Live Map
                    {activeTab === "map" && <div style={{ position: "absolute", bottom: -12, left: 0, right: 0, height: 2, background: "#4cc9f0" }} />}
                </button>
            </div>

            {activeTab === "incoming" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {MOCK_REPORTS.map((rep, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${rep.color}30`, borderRadius: 16, padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: rep.color, boxShadow: `0 0 10px ${rep.color}` }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <div style={{ fontWeight: 800, fontSize: 15, color: "#f0f4ff" }}>{rep.type}</div>
                                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>{rep.time}</div>
                                </div>
                                <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", gap: 10 }}>
                                    <span>📍 {rep.loc}</span> • <span>👥 {rep.people}</span> {rep.medical && <span style={{ color: "#ff4d6d" }}>• 🏥 Medical Needed</span>}
                                </div>
                            </div>
                            <button style={{ padding: "8px 16px", borderRadius: 8, background: `${rep.color}15`, border: `1px solid ${rep.color}50`, color: rep.color, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                                {rep.status}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "map" && (
                <div style={{ height: 400, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🗺️</div>
                    <div style={{ color: "#94a3b8" }}>Live GIS Map Integration Here</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 5 }}>(Google Maps / Mapbox API)</div>
                </div>
            )}
        </div>
    );
}
