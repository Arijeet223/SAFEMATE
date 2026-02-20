import React, { useState, useEffect } from 'react';

export default function NewsWidget({ location }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulated local disaster news feed
    const newsItems = [
        "🔴 ALERT: Heavy rainfall expected in your district next 24hrs.",
        "🌊 NDRF deployed 3 teams to downstream coastal areas.",
        "🏛️ Sub-divisional magistrate declares holiday for schools tomorrow.",
        "⚠️ River water levels have crossed the danger mark at Station 4."
    ];

    const [currentNewsIdx, setCurrentNewsIdx] = useState(0);

    // Auto-scroll news every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentNewsIdx((prev) => (prev + 1) % newsItems.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [newsItems.length]);

    // Fetch real-time weather from Open-Meteo API
    useEffect(() => {
        if (!location) return;

        const fetchWeather = async () => {
            setLoading(true);
            try {
                // Free API, no key required
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current_weather=true&hourly=precipitation_probability`);
                if (!res.ok) throw new Error('Weather fetch failed');

                const data = await res.json();

                // Get precipitation probability for the current hour
                const currentHour = new Date().getHours();
                const rainProb = data.hourly?.precipitation_probability?.[currentHour] || 0;

                setWeather({
                    temp: Math.round(data.current_weather.temperature),
                    wind: Math.round(data.current_weather.windspeed),
                    code: data.current_weather.weathercode,
                    rainProb: rainProb
                });
            } catch (err) {
                console.error("Open-Meteo API Error:", err);
                // Fallback dummy data if offline/failed
                setWeather({ temp: 28, wind: 12, code: 3, rainProb: 40 });
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [location]);

    // WMO Weather code to Emoji mapper
    const getWeatherIcon = (code) => {
        if (code === 0) return "☀️"; // Clear
        if (code === 1 || code === 2 || code === 3) return "⛅"; // Partly cloudy
        if (code >= 51 && code <= 67) return "🌧️"; // Rain
        if (code >= 71 && code <= 77) return "❄️"; // Snow
        if (code >= 80 && code <= 82) return "⛈️"; // Showers
        if (code >= 95) return "🌩️"; // Thunderstorm
        return "🌡️";
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Live Region Updates
            </h2>

            <div style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}>

                {/* Weather Top Section */}
                <div style={{
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.04)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            fontSize: 32,
                            lineHeight: 1,
                            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))"
                        }}>
                            {loading ? "⏳" : getWeatherIcon(weather?.code)}
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", lineHeight: 1 }}>
                                {loading ? "--" : weather?.temp}°C
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, display: "flex", gap: 10 }}>
                                <span>💨 {loading ? "--" : weather?.wind} km/h</span>
                                <span>☔ {loading ? "--" : weather?.rainProb}%</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#e2e8f0",
                            background: weather?.rainProb > 60 ? "rgba(255,77,109,0.2)" : "rgba(76,201,240,0.1)",
                            color: weather?.rainProb > 60 ? "#ff4d6d" : "#4cc9f0",
                            padding: "4px 8px",
                            borderRadius: 8,
                            border: `1px solid ${weather?.rainProb > 60 ? "rgba(255,77,109,0.4)" : "rgba(76,201,240,0.3)"}`
                        }}>
                            {weather?.rainProb > 60 ? "HIGH FLOOD RISK" : "NORMAL CONDITIONS"}
                        </span>
                    </div>
                </div>

                {/* News Ticker Bottom Section */}
                <div style={{
                    padding: "12px 16px",
                    background: "rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                }}>
                    <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#06d6a0",
                        background: "rgba(6,214,160,0.1)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        letterSpacing: "0.05em"
                    }}>
                        LIVE
                    </span>
                    <div style={{
                        flex: 1,
                        overflow: "hidden",
                        position: "relative",
                        height: "18px"
                    }}>
                        {newsItems.map((news, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    fontSize: 12,
                                    color: "#e2e8f0",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    opacity: currentNewsIdx === idx ? 1 : 0,
                                    transform: `translateY(${currentNewsIdx === idx ? 0 : (idx < currentNewsIdx ? -10 : 10)}px)`,
                                    transition: "all 0.5s ease-in-out"
                                }}
                            >
                                {news}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
