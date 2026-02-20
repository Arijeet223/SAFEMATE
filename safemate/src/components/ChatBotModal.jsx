import React, { useState, useRef, useEffect } from "react";
import { SYSTEM_PROMPT, QUICK_PROMPTS } from "../data/constants";

function BotAvatar({ pulse, size = 38 }) {
    return (
        <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
                width: size, height: size, borderRadius: "50%",
                background: "linear-gradient(135deg, #4361ee, #7209b7, #f72585)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: size * 0.45,
                boxShadow: pulse
                    ? "0 0 0 0 rgba(67,97,238,0.7)"
                    : "0 0 15px rgba(67,97,238,0.3)",
                animation: pulse ? "avatarPulseRing 1.2s ease-out infinite" : "avatarIdleGlow 3s ease-in-out infinite",
                transition: "all 0.3s",
            }}>🛡️</div>
            <div style={{
                position: "absolute", bottom: 1, right: 1,
                width: 11, height: 11, borderRadius: "50%",
                background: "#06d6a0",
                border: "2px solid #05071a",
                animation: "statusPing 2s ease-in-out infinite",
            }} />
        </div>
    );
}

function TypingBubble() {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "14px 20px",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px 18px 18px 4px",
            width: "fit-content",
        }}>
            <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 9, height: 9, borderRadius: "50%",
                        background: "linear-gradient(135deg, #4cc9f0, #c77dff)",
                        animation: `typingBounce 1.4s ease-in-out ${i * 0.22}s infinite`,
                        boxShadow: "0 0 8px rgba(76,201,240,0.5)",
                    }} />
                ))}
            </div>
            <span style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", letterSpacing: "0.01em" }}>Safemate is thinking…</span>
        </div>
    );
}

export default function ChatBotModal({ onClose, onSOS }) {
    const [messages, setMessages] = useState([{
        role: "assistant",
        content: "Namaste! 🙏 I'm Safemate AI — India's intelligent flood disaster companion.\n\nI can help you with:\n• Real-time flood survival guidance\n• State-specific flood information\n• Emergency contacts & NDRF coordination\n\nAre you currently in a flood emergency, or do you want to prepare in advance?",
    }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

    const sendMessage = async (overrideText) => {
        const text = (overrideText || input).trim();
        if (!text || loading) return;
        setInput("");
        const newMessages = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setLoading(true);

        // NOTE: This area is reserved for the future chatbot API integration you mentioned
        // "leave the place for api for chatbot that one only thing i will tell you later"
        try {
            // Mock API call simulation
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I've received your message. Please integrate the real API endpoint here later."
            }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection issue. In a real emergency — CALL 112 immediately! I'll reconnect shortly. Stay safe!" }]);
        }
        setLoading(false);
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#05071a", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(5,7,26,0.9)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#a5b4fc", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>←</span> Back
                </button>
                <div style={{ fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
                    Safemate AI
                    <span style={{ fontSize: 10, background: "rgba(6,214,160,0.15)", border: "1px solid rgba(6,214,160,0.3)", color: "#06d6a0", padding: "3px 8px", borderRadius: 12 }}>● ONLINE</span>
                </div>
                <div style={{ width: 60 }}></div> {/* Spacer */}
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "20px", height: "100%", overflow: "hidden" }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18, paddingRight: 4, paddingBottom: 20 }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-end", animation: msg.role === "user" ? "slideFromRight 0.3s ease" : "slideFromLeft 0.35s ease" }}>
                            {msg.role === "assistant" && <BotAvatar pulse={false} size={36} />}
                            {msg.role === "user" && <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1e40af,#4361ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👤</div>}
                            <div style={{
                                maxWidth: "85%", padding: "15px 20px",
                                borderRadius: msg.role === "user" ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                                fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap",
                                ...(msg.role === "user" ? {
                                    background: "linear-gradient(135deg,#1d4ed8,#4361ee,#6d28d9)", color: "#fff",
                                } : {
                                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0",
                                }),
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                            <BotAvatar pulse={true} size={36} />
                            <TypingBubble />
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Quick prompt chips */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 0 10px", scrollbarWidth: "none" }}>
                    {QUICK_PROMPTS.map((q, i) => (
                        <button key={i} className="quick-chip" onClick={() => sendMessage(q.text)}>{q.label}</button>
                    ))}
                </div>

                {/* Input row */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", paddingBottom: "20px" }}>
                    <button className="sos-main mobile-hide" onClick={onSOS} style={{ width: 52, height: 52, fontSize: 9, borderRadius: "50%" }}>
                        <span style={{ fontSize: 13 }}>🚨</span><span>SOS</span>
                    </button>
                    <div style={{ flex: 1 }}>
                        <textarea
                            className="chat-input"
                            placeholder="Ask about flood survival, routes, or NDRF..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            rows={2}
                        />
                    </div>
                    <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                        {loading ? "···" : "Send ↑"}
                    </button>
                </div>
            </div>
        </div>
    );
}
