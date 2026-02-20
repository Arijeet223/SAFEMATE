import React from 'react';

export default function BigButton({
    onClick,
    icon,
    title,
    subtitle,
    subtext,
    gradient = "linear-gradient(135deg,rgba(190,18,60,0.14),rgba(255,77,109,0.07))",
    borderColor = "rgba(255,77,109,0.38)",
    iconSize = 60,
    titleColor = "#ff4d6d",
    shadowColor = "rgba(255,77,109,0.12)",
    pulseAnimation = false
}) {
    return (
        <div
            onClick={onClick}
            style={{
                background: gradient,
                border: `2px solid ${borderColor}`,
                borderRadius: 24,
                padding: 34,
                marginBottom: 24,
                textAlign: "center",
                cursor: "pointer",
                boxShadow: `0 0 80px ${shadowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                transition: "all 0.2s",
                animation: pulseAnimation ? "sosRing 2.2s ease-out infinite" : "none"
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
            <div style={{ fontSize: iconSize, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: titleColor, marginBottom: 8, textShadow: `0 0 40px ${titleColor}99` }}>
                {title}
            </div>
            {subtitle && (
                <div style={{ fontSize: 14, color: "#475569", marginBottom: 22 }}>
                    {subtitle}
                </div>
            )}
            {subtext && (
                <div style={{ fontSize: 13, color: "#334155", marginTop: 10 }}>
                    {subtext}
                </div>
            )}
        </div>
    );
}
