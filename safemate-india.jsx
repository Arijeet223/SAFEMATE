import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are "Safemate AI," India's official intelligent disaster companion for flood emergencies. You are calm, reassuring, and speak in a warm, human way — never robotic.

You have deep knowledge about:
- India-specific flood disasters (Kerala 2018, Assam annual floods, Mumbai floods, Bihar floods, Odisha cyclones, Uttarakhand flash floods)
- NDMA (National Disaster Management Authority) guidelines
- State-level disaster response systems (SDRF, NDRF)
- Indian emergency numbers: 112 (National Emergency), 1078 (NDMA Helpline), 1070 (State Disaster Helpline)
- Flood survival techniques specific to Indian geography (river plains, coastal areas, Himalayan foothills, urban flooding)
- First Aid basics, Evacuation routes logic
- Post-flood disease prevention (leptospirosis, cholera, typhoid common in India after floods)

Your personality:
- Always reassure first, then instruct
- Use simple Hindi/English mix when appropriate (like "Ghabraiye mat" = Don't panic)
- Give numbered step-by-step instructions
- Always mention calling 112 in emergencies
- Reference specific Indian states when asked about regional floods
- Mention NDRF (National Disaster Response Force) deployment when relevant
- Warn about post-flood diseases common in India

Response format:
1. Acknowledge the situation warmly
2. Give clear, numbered steps  
3. Mention Indian emergency resources
4. End with reassurance

Keep responses concise but complete. You are saving lives.`;

const FLOOD_STATS = [
  { label: "Annual Deaths", value: "1,600+", icon: "💀", color: "#ff4d6d", glow: "#ff4d6d" },
  { label: "People Displaced", value: "7M+", icon: "🏠", color: "#ff9f1c", glow: "#ff9f1c" },
  { label: "States Affected", value: "28/36", icon: "🗺️", color: "#f7d716", glow: "#f7d716" },
  { label: "Annual Loss (₹Cr)", value: "75,000+", icon: "💸", color: "#c77dff", glow: "#c77dff" },
];

const FLOOD_ZONES = [
  { state: "Assam", risk: "EXTREME", rivers: "Brahmaputra, Barak", color: "#ff4d6d", season: "Jun–Sep" },
  { state: "Bihar", risk: "EXTREME", rivers: "Kosi, Gandak, Ganga", color: "#ff4d6d", season: "Jul–Sep" },
  { state: "Uttar Pradesh", risk: "HIGH", rivers: "Ganga, Yamuna, Ghaghra", color: "#ff9f1c", season: "Jul–Aug" },
  { state: "West Bengal", risk: "HIGH", rivers: "Ganga, Damodar", color: "#ff9f1c", season: "Jun–Sep" },
  { state: "Kerala", risk: "HIGH", rivers: "Periyar, Pamba", color: "#ff9f1c", season: "Jun–Aug" },
  { state: "Odisha", risk: "HIGH", rivers: "Mahanadi, Brahmani", color: "#ff9f1c", season: "Jul–Oct" },
  { state: "Maharashtra", risk: "MEDIUM", rivers: "Godavari, Krishna", color: "#f7d716", season: "Jul–Sep" },
  { state: "Uttarakhand", risk: "HIGH", rivers: "Alaknanda, Mandakini", color: "#ff9f1c", season: "Jun–Sep" },
];

const SURVIVAL_STEPS = {
  "Before Flood": [
    { text: "Store 72-hour emergency kit: food, water (5L/person/day), medicines, torch, phone charger", icon: "🎒" },
    { text: "Save NDMA helpline 1078 and State Disaster helpline 1070 in your phone right now", icon: "📞" },
    { text: "Identify your nearest relief camp — check local panchayat or municipality office", icon: "🏕️" },
    { text: "Move valuables and documents to upper floors in sealed waterproof bags", icon: "📦" },
    { text: "Keep car fuel full and park on high ground away from river banks", icon: "🚗" },
    { text: "Disconnect all electrical appliances and switch off the main circuit breaker", icon: "⚡" },
  ],
  "During Flood": [
    { text: "Call 112 immediately if water is rising rapidly around you", icon: "🚨" },
    { text: "Move to the highest floor — NEVER go to basement or ground floor", icon: "🏠" },
    { text: "Do NOT walk through moving floodwater — just 15cm can knock you down", icon: "🌊" },
    { text: "Avoid touching electrical switches or wires in any wet area", icon: "⚡" },
    { text: "Signal rescue teams from upper windows using bright cloth or torch", icon: "🔦" },
    { text: "Do NOT attempt to cross flooded roads, bridges, or underpasses", icon: "🚫" },
    { text: "Stay tuned to All India Radio / Doordarshan for official shelter alerts", icon: "📻" },
  ],
  "After Flood": [
    { text: "Do NOT return home until local authorities officially declare it safe", icon: "🏛️" },
    { text: "Boil ALL water for 20 minutes minimum — cholera and typhoid risk is VERY HIGH", icon: "💧" },
    { text: "Wear rubber boots and gloves — leptospirosis spreads through floodwater contact", icon: "🥾" },
    { text: "Document ALL property damage with photos for NDMA relief compensation claims", icon: "📸" },
    { text: "Contact local NDRF team for structural safety inspection before re-entry", icon: "🔍" },
    { text: "Watch for fever, diarrhea, or skin rashes — visit nearest PHC within 48 hours", icon: "🏥" },
  ],
};

const EMERGENCY_CONTACTS = [
  { name: "National Emergency", number: "112", icon: "🚨", color: "#ff4d6d" },
  { name: "NDMA Helpline", number: "1078", icon: "🏛️", color: "#4cc9f0" },
  { name: "State Disaster", number: "1070", icon: "🌊", color: "#4895ef" },
  { name: "Police", number: "100", icon: "👮", color: "#c77dff" },
  { name: "Ambulance", number: "108", icon: "🏥", color: "#06d6a0" },
  { name: "Fire Brigade", number: "101", icon: "🔥", color: "#ff9f1c" },
];

const QUICK_PROMPTS = [
  { label: "🆘 I'm stuck in floodwater!", text: "I'm stuck in floodwater right now, what do I do?" },
  { label: "🗺️ Assam flood zones?", text: "Tell me about flood zones in Assam and what areas are most dangerous" },
  { label: "🎒 72-hour kit guide", text: "How do I make a proper 72-hour emergency flood kit for my family?" },
  { label: "🦠 Post-flood diseases", text: "What diseases should I watch out for after a flood in India?" },
  { label: "🚁 Contact NDRF", text: "How do I contact NDRF for flood rescue and what information do they need?" },
  { label: "🌧️ Kerala flood tips", text: "What are specific safety tips for Kerala flood situations?" },
];

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

export default function SafemateAI() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Namaste! 🙏 I'm Safemate AI — India's intelligent flood disaster companion.\n\nI can help you with:\n• Real-time flood survival guidance\n• State-specific flood information (Assam, Kerala, Bihar & more)\n• Step-by-step NDMA-backed safety instructions\n• Emergency contacts & NDRF coordination\n\nAre you currently in a flood emergency, or do you want to prepare in advance?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeGuide, setActiveGuide] = useState("Before Flood");
  const [showSosFlash, setShowSosFlash] = useState(false);
  const [riskLevel, setRiskLevel] = useState("SCANNING");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { setTimeout(() => setRiskLevel("MODERATE"), 1800); }, []);

  const sendMessage = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm here to help. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection issue. In a real emergency — CALL 112 immediately! I'll reconnect shortly. Stay safe!" }]);
    }
    setLoading(false);
  };

  const handleSOS = () => {
    setShowSosFlash(true);
    setTimeout(() => setShowSosFlash(false), 3000);
    const sosMsg = {
      role: "assistant",
      content: "🚨 SOS ACTIVATED — Ghabraiye mat (Don't panic)!\n\n📞 CALL RIGHT NOW:\n1. 112 — National Emergency (any network, zero balance works)\n2. 1078 — NDMA 24x7 Helpline\n3. 1070 — State Disaster Response Force\n\n🏠 Immediate Steps:\n1. Move to highest floor immediately\n2. Signal from window — bright cloth, torch, or mirror flash\n3. Stay away from all electrical points\n4. Do NOT step into floodwater\n5. Share your Google Maps live location with family\n\nNDRF teams are trained for exactly this. Help IS on the way. You are not alone. 💪",
    };
    setMessages(prev => [...prev, sosMsg]);
    setActiveTab("chat");
  };

  const riskColors = { EXTREME: "#ff4d6d", HIGH: "#ff9f1c", MODERATE: "#f7d716", LOW: "#06d6a0", SCANNING: "#4cc9f0" };
  const riskColor = riskColors[riskLevel] || "#4cc9f0";

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: "#05071a", minHeight: "100vh", color: "#f0f4ff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1e3a8a;border-radius:4px;}

        @keyframes typingBounce{0%,60%,100%{transform:translateY(0) scale(1);}30%{transform:translateY(-9px) scale(1.1);}}
        @keyframes avatarPulseRing{0%{box-shadow:0 0 0 0 rgba(67,97,238,0.8),0 0 20px rgba(67,97,238,0.4);}70%{box-shadow:0 0 0 14px rgba(67,97,238,0),0 0 30px rgba(67,97,238,0.2);}100%{box-shadow:0 0 0 0 rgba(67,97,238,0),0 0 20px rgba(67,97,238,0.4);}}
        @keyframes avatarIdleGlow{0%,100%{box-shadow:0 0 15px rgba(67,97,238,0.3);}50%{box-shadow:0 0 25px rgba(67,97,238,0.5),0 0 50px rgba(114,9,183,0.2);}}
        @keyframes statusPing{0%,100%{box-shadow:0 0 0 0 rgba(6,214,160,0.7);}70%{box-shadow:0 0 0 6px rgba(6,214,160,0);}}
        @keyframes floatIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideFromLeft{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
        @keyframes slideFromRight{from{opacity:0;transform:translateX(16px);}to{opacity:1;transform:translateX(0);}}
        @keyframes sosOverlay{0%,100%{opacity:0;}15%,85%{opacity:1;}50%{opacity:0.6;}}
        @keyframes sosRing{0%{transform:scale(1);opacity:1;}100%{transform:scale(2.6);opacity:0;}}
        @keyframes shimmerGrad{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}
        @keyframes riskPulse{0%,100%{transform:scale(1);opacity:0.9;}50%{transform:scale(3);opacity:0;}}
        @keyframes waveBar{0%,100%{transform:scaleY(0.4);}50%{transform:scaleY(1);}}
        @keyframes rain{0%{transform:translateY(-80px);opacity:0;}8%{opacity:0.7;}90%{opacity:0.25;}100%{transform:translateY(102vh);opacity:0;}}
        @keyframes ambientFloat{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-30px) scale(1.05);}}
        @keyframes borderGlow{0%,100%{border-color:rgba(67,97,238,0.3);}50%{border-color:rgba(67,97,238,0.7);}}

        .tab-pill{background:transparent;border:1px solid transparent;border-radius:30px;padding:9px 18px;font-family:inherit;font-size:13px;font-weight:600;color:#4a5568;cursor:pointer;transition:all 0.25s ease;display:flex;align-items:center;gap:7px;white-space:nowrap;}
        .tab-pill:hover{color:#94a3b8;background:rgba(255,255,255,0.04);}
        .tab-pill.active{background:linear-gradient(135deg,rgba(67,97,238,0.2),rgba(114,9,183,0.15));border-color:rgba(67,97,238,0.4);color:#a5b4fc;box-shadow:0 0 25px rgba(67,97,238,0.15);}

        .stat-card{border-radius:22px;padding:24px;border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(10px);animation:floatIn 0.5s ease both;cursor:default;transition:transform 0.25s,box-shadow 0.25s;position:relative;overflow:hidden;}
        .stat-card:hover{transform:translateY(-5px) scale(1.01);box-shadow:0 20px 60px rgba(0,0,0,0.3);}
        .stat-card::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 60%);pointer-events:none;}

        .zone-row{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.055);border-radius:16px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;transition:all 0.25s;animation:floatIn 0.4s ease both;}
        .zone-row:hover{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);transform:translateX(5px);}

        .step-card{display:flex;gap:14px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.055);border-radius:14px;margin-bottom:10px;transition:all 0.25s;animation:floatIn 0.4s ease both;}
        .step-card:hover{background:rgba(255,255,255,0.055);border-color:rgba(67,97,238,0.25);transform:translateX(3px);}

        .contact-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:22px 14px;text-align:center;cursor:pointer;transition:all 0.25s;animation:floatIn 0.4s ease both;}
        .contact-card:hover{transform:translateY(-5px) scale(1.03);}

        .quick-chip{background:rgba(67,97,238,0.1);border:1px solid rgba(67,97,238,0.22);border-radius:25px;padding:9px 16px;font-family:inherit;font-size:12.5px;font-weight:600;color:#93a8f7;cursor:pointer;white-space:nowrap;transition:all 0.2s;display:inline-flex;align-items:center;gap:4px;}
        .quick-chip:hover{background:rgba(67,97,238,0.22);border-color:rgba(67,97,238,0.5);color:#c7d2fe;transform:translateY(-2px);box-shadow:0 6px 25px rgba(67,97,238,0.2);}

        .sos-main{position:relative;background:linear-gradient(135deg,#be123c,#ff4d6d,#ff6b35);border:none;border-radius:50%;color:white;font-weight:900;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-family:'JetBrains Mono',monospace;flex-shrink:0;transition:transform 0.15s;box-shadow:0 0 30px rgba(255,77,109,0.5),0 0 60px rgba(255,77,109,0.2);}
        .sos-main::before,.sos-main::after{content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid rgba(255,77,109,0.5);animation:sosRing 2.2s ease-out infinite;}
        .sos-main::after{animation-delay:1.1s;}
        .sos-main:active{transform:scale(0.92);}

        .send-btn{background:linear-gradient(135deg,#4361ee,#7209b7);border:none;border-radius:14px;padding:13px 24px;color:white;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 25px rgba(67,97,238,0.35);white-space:nowrap;}
        .send-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 35px rgba(67,97,238,0.5);}
        .send-btn:disabled{opacity:0.35;cursor:not-allowed;transform:none;}

        .chat-input{background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);border-radius:14px;padding:13px 16px;color:#f0f4ff;font-family:inherit;font-size:14px;width:100%;outline:none;resize:none;transition:border-color 0.2s,box-shadow 0.2s;line-height:1.55;}
        .chat-input:focus{border-color:rgba(67,97,238,0.55);box-shadow:0 0 0 4px rgba(67,97,238,0.08);}
        .chat-input::placeholder{color:#334155;}

        .risk-badge{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.06em;font-family:'JetBrains Mono',monospace;}
        .wave-bar{width:3px;border-radius:3px;background:#06d6a0;transform-origin:bottom;animation:waveBar 0.9s ease-in-out infinite;}
        .guide-tab-btn{padding:10px 22px;border-radius:25px;font-family:inherit;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;letter-spacing:0.01em;}
      `}</style>

      {/* SOS flash */}
      {showSosFlash && (
        <div style={{ position:"fixed",inset:0,zIndex:9999,pointerEvents:"none", background:"rgba(255,77,109,0.12)", animation:"sosOverlay 3s ease", backdropFilter:"blur(2px)" }} />
      )}

      {/* Rain drops */}
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} style={{
          position:"fixed", top:0, left:`${(i * 3.7) % 100}%`,
          width:"1.5px",
          height:`${45 + (i * 7) % 80}px`,
          background:`linear-gradient(to bottom, transparent, rgba(76,201,240,${0.08 + (i * 0.007) % 0.2}))`,
          animation:`rain ${0.7 + (i * 0.07) % 1.4}s linear ${(i * 0.17) % 4}s infinite`,
          pointerEvents:"none", zIndex:0,
        }} />
      ))}

      {/* Ambient glows */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-250,right:-200,width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(67,97,238,0.07) 0%,transparent 70%)",animation:"ambientFloat 12s ease-in-out infinite" }} />
        <div style={{ position:"absolute",bottom:-300,left:-250,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(247,215,22,0.04) 0%,transparent 70%)",animation:"ambientFloat 15s ease-in-out 3s infinite" }} />
        <div style={{ position:"absolute",top:"35%",left:"20%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(114,9,183,0.05) 0%,transparent 70%)",animation:"ambientFloat 10s ease-in-out 6s infinite" }} />
      </div>

      {/* ===== HEADER ===== */}
      <div style={{ position:"sticky",top:0,zIndex:100,borderBottom:"1px solid rgba(255,255,255,0.05)",backdropFilter:"blur(24px)",background:"rgba(5,7,26,0.88)" }}>
        <div style={{ maxWidth:960,margin:"0 auto",padding:"0 20px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:70 }}>

            {/* Logo */}
            <div style={{ display:"flex",alignItems:"center",gap:13 }}>
              <div style={{ position:"relative" }}>
                <div style={{ width:46,height:46,borderRadius:15,background:"linear-gradient(135deg,#4361ee,#7209b7,#f72585)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 0 30px rgba(67,97,238,0.45),0 0 60px rgba(114,9,183,0.2)" }}>🛡️</div>
                <div style={{ position:"absolute",inset:-3,borderRadius:18,border:"1.5px solid rgba(67,97,238,0.35)",animation:"avatarIdleGlow 3s ease-in-out infinite",pointerEvents:"none" }} />
              </div>
              <div>
                <div style={{ fontWeight:900,fontSize:22,letterSpacing:"-0.04em",lineHeight:1 }}>
                  Safemate{" "}
                  <span style={{ background:"linear-gradient(90deg,#4cc9f0,#7209b7,#f72585,#4cc9f0)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmerGrad 4s linear infinite" }}>AI</span>
                </div>
                <div style={{ fontSize:10,color:"#334155",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.15em",marginTop:3 }}>INDIA DISASTER MANAGEMENT</div>
              </div>
            </div>

            {/* Right controls */}
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              {/* Live wave */}
              <div style={{ display:"flex",alignItems:"center",gap:8,background:"rgba(6,214,160,0.08)",border:"1px solid rgba(6,214,160,0.2)",borderRadius:25,padding:"7px 14px" }}>
                <div style={{ display:"flex",gap:3,alignItems:"flex-end",height:20 }}>
                  {[0.3,0.6,1,0.7,0.4].map((h,i)=>(
                    <div key={i} className="wave-bar" style={{ height:`${h*18}px`,animationDelay:`${i*0.12}s` }} />
                  ))}
                </div>
                <span style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#06d6a0",fontWeight:700 }}>LIVE</span>
              </div>

              {/* Risk indicator */}
              <div style={{ display:"flex",alignItems:"center",gap:7,background:`${riskColor}0d`,border:`1px solid ${riskColor}35`,borderRadius:25,padding:"7px 14px" }}>
                <div style={{ position:"relative",width:10,height:10 }}>
                  <div style={{ width:10,height:10,borderRadius:"50%",background:riskColor }} />
                  <div style={{ position:"absolute",inset:0,borderRadius:"50%",background:riskColor,animation:"riskPulse 1.8s ease-out infinite" }} />
                </div>
                <span style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:riskColor,fontWeight:700 }}>{riskLevel}</span>
              </div>

              {/* SOS */}
              <button className="sos-main" onClick={handleSOS} style={{ width:64,height:64,fontSize:10,letterSpacing:"0.08em" }}>
                <span style={{ fontSize:16 }}>🚨</span>
                <span>SOS</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display:"flex",gap:4,paddingBottom:10,overflowX:"auto" }}>
            {[
              { id:"dashboard",icon:"📊",label:"Dashboard" },
              { id:"chat",icon:"🤖",label:"AI Assistant" },
              { id:"guide",icon:"📋",label:"Survival Guide" },
              { id:"zones",icon:"🗺️",label:"Flood Zones" },
              { id:"emergency",icon:"🚨",label:"Emergency" },
            ].map(tab=>(
              <button key={tab.id} className={`tab-pill ${activeTab===tab.id?"active":""}`} onClick={()=>setActiveTab(tab.id)}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location strip */}
      <div style={{ background:"rgba(255,255,255,0.015)",borderBottom:"1px solid rgba(255,255,255,0.035)",padding:"6px 20px" }}>
        <div style={{ maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:14 }}>📍</span>
          <span style={{ fontSize:12,color:"#334155",fontFamily:"'JetBrains Mono',monospace" }}>India · Monsoon Season Active · NDMA Alerts Enabled</span>
          <span style={{ marginLeft:"auto",fontSize:11,color:"#1e293b",fontFamily:"'JetBrains Mono',monospace" }}>v3.0 · MONSOON 2024</span>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth:960,margin:"0 auto",padding:"30px 20px 70px",position:"relative",zIndex:1 }}>

        {/* ====== DASHBOARD ====== */}
        {activeTab==="dashboard" && (
          <div>
            <div style={{ marginBottom:34 }}>
              <div style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#4361ee",marginBottom:10,letterSpacing:"0.12em" }}>// INDIA FLOOD INTELLIGENCE CENTER</div>
              <h1 style={{ fontSize:38,fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.1,marginBottom:12 }}>
                Real-Time Disaster<br/>
                <span style={{ background:"linear-gradient(90deg,#4cc9f0 0%,#7209b7 50%,#f72585 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Intelligence for India</span>
              </h1>
              <p style={{ color:"#475569",fontSize:15,lineHeight:1.75,maxWidth:580 }}>
                Powered by NDMA guidelines and live AI assistance — protecting lives across India's 34 million flood-prone hectares every monsoon season.
              </p>
            </div>

            {/* Stat cards */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:16,marginBottom:32 }}>
              {FLOOD_STATS.map((stat,i)=>(
                <div key={i} className="stat-card" style={{ background:`linear-gradient(135deg,${stat.glow}14,${stat.glow}06,rgba(5,7,26,0.8))`,animationDelay:`${i*0.1}s` }}>
                  <div style={{ fontSize:30,marginBottom:14 }}>{stat.icon}</div>
                  <div style={{ fontSize:34,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:stat.color,letterSpacing:"-0.03em",textShadow:`0 0 40px ${stat.color}50` }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize:13,color:"#475569",marginTop:6,fontWeight:500 }}>{stat.label}</div>
                  <div style={{ marginTop:16,height:3,borderRadius:3,background:"rgba(255,255,255,0.04)" }}>
                    <div style={{ height:"100%",width:"75%",background:`linear-gradient(90deg,${stat.color},${stat.color}70)`,borderRadius:3,boxShadow:`0 0 12px ${stat.color}50` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Two-col info */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
              {[
                { title:"🌊 Why Floods Hit India Hard", color:"#4cc9f0", bg:"rgba(67,97,238,0.08)", border:"rgba(67,97,238,0.18)", points:["80% of India's rain falls in just 4 monsoon months","34 million hectares are chronically flood-prone","River bank encroachment reduces natural buffers","Rapid urbanization creates non-absorbent concrete cities"] },
                { title:"👥 Most Vulnerable Communities", color:"#ff9f1c", bg:"rgba(255,77,109,0.07)", border:"rgba(255,77,109,0.18)", points:["Rural farmers in Assam, Bihar, and UP flood plains","Urban slum dwellers in Mumbai, Kolkata, Chennai","Tribal communities in Odisha and Jharkhand","Himalayan foothill residents facing flash floods"] },
              ].map((sec,i)=>(
                <div key={i} style={{ background:sec.bg,border:`1px solid ${sec.border}`,borderRadius:20,padding:24 }}>
                  <h2 style={{ fontSize:15,fontWeight:800,marginBottom:16,color:sec.color }}>{sec.title}</h2>
                  {sec.points.map((pt,j)=>(
                    <div key={j} style={{ display:"flex",gap:10,marginBottom:10,fontSize:13,color:"#64748b",lineHeight:1.65 }}>
                      <span style={{ color:sec.color,flexShrink:0 }}>◆</span>{pt}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.055)",borderRadius:20,padding:24,marginBottom:24 }}>
              <h2 style={{ fontSize:16,fontWeight:800,marginBottom:20 }}>📅 India's Worst Flood Events</h2>
              {[
                { year:"2023",event:"Himachal Pradesh Flash Floods",deaths:"400+",affected:"2.5L+",color:"#ff4d6d" },
                { year:"2022",event:"Assam Floods — Brahmaputra overflow",deaths:"190+",affected:"55L+",color:"#ff9f1c" },
                { year:"2021",event:"Kerala + Maharashtra Dual Floods",deaths:"280+",affected:"15L+",color:"#f7d716" },
                { year:"2020",event:"Bihar + Assam Crisis — double blow",deaths:"350+",affected:"1Cr+",color:"#ff4d6d" },
                { year:"2018",event:"Kerala Mega Floods — 100-year event",deaths:"483",affected:"54L+",color:"#c77dff" },
              ].map((ev,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:ev.color,boxShadow:`0 0 10px ${ev.color}`,flexShrink:0 }} />
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#334155",width:36,flexShrink:0 }}>{ev.year}</div>
                  <div style={{ flex:1,fontSize:13,color:"#e2e8f0",fontWeight:500 }}>{ev.event}</div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ fontSize:13,color:"#ff4d6d",fontFamily:"'JetBrains Mono',monospace",fontWeight:700 }}>💀 {ev.deaths}</div>
                    <div style={{ fontSize:11,color:"#334155" }}>Affected: {ev.affected}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
              <button onClick={()=>setActiveTab("chat")} style={{ background:"linear-gradient(135deg,#4361ee,#7209b7)",border:"none",borderRadius:14,padding:"15px 30px",color:"white",fontFamily:"inherit",fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 6px 30px rgba(67,97,238,0.45)",transition:"all 0.2s",letterSpacing:"0.01em" }}>
                🤖 Talk to Safemate AI
              </button>
              <button onClick={handleSOS} style={{ background:"linear-gradient(135deg,#be123c,#ff4d6d)",border:"none",borderRadius:14,padding:"15px 30px",color:"white",fontFamily:"inherit",fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 6px 30px rgba(255,77,109,0.35)",transition:"all 0.2s" }}>
                🚨 Emergency SOS
              </button>
              <button onClick={()=>setActiveTab("guide")} style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:14,padding:"15px 30px",color:"#94a3b8",fontFamily:"inherit",fontWeight:600,cursor:"pointer",fontSize:15,transition:"all 0.2s" }}>
                📋 Survival Guide
              </button>
            </div>
          </div>
        )}

        {/* ====== CHAT ====== */}
        {activeTab==="chat" && (
          <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 240px)",minHeight:520 }}>

            {/* Chat header — the "alive" bar */}
            <div style={{
              display:"flex",alignItems:"center",gap:14,padding:"14px 20px",marginBottom:16,
              background:"linear-gradient(135deg,rgba(67,97,238,0.12),rgba(114,9,183,0.08),rgba(247,37,133,0.05))",
              border:"1px solid rgba(67,97,238,0.25)",
              borderRadius:20,
              boxShadow:"0 0 40px rgba(67,97,238,0.08)",
            }}>
              <BotAvatar pulse={loading} size={44} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800,fontSize:16,display:"flex",alignItems:"center",gap:10 }}>
                  Safemate AI
                  <span style={{ fontSize:11,background:"rgba(6,214,160,0.15)",border:"1px solid rgba(6,214,160,0.3)",color:"#06d6a0",padding:"3px 10px",borderRadius:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace" }}>
                    ● ONLINE
                  </span>
                  {loading && (
                    <span style={{ fontSize:11,background:"rgba(76,201,240,0.12)",border:"1px solid rgba(76,201,240,0.25)",color:"#4cc9f0",padding:"3px 10px",borderRadius:12,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",animation:"shimmerGrad 1.5s linear infinite" }}>
                      ◌ RESPONDING
                    </span>
                  )}
                </div>
                <div style={{ fontSize:12,color:"#334155",marginTop:3 }}>
                  India's flood disaster AI · NDMA-compliant · Hindi + English · Active 24x7
                </div>
              </div>
              {/* Audio wave — active when loading */}
              <div style={{ display:"flex",gap:3,alignItems:"flex-end",height:24 }}>
                {[0.3,0.55,0.85,1,0.85,0.55,0.3].map((h,i)=>(
                  <div key={i} className="wave-bar" style={{
                    height:`${h*22}px`,
                    animationDelay:`${i*0.1}s`,
                    opacity: loading ? 1 : 0.2,
                    transition:"opacity 0.4s",
                    background: loading ? "#4cc9f0" : "#1e3a8a",
                  }} />
                ))}
              </div>
              <div style={{ textAlign:"right",flexShrink:0,borderLeft:"1px solid rgba(255,255,255,0.05)",paddingLeft:14 }}>
                <div style={{ fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#1e293b",letterSpacing:"0.1em" }}>POWERED BY</div>
                <div style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#4361ee",fontWeight:700 }}>CLAUDE AI</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:18,paddingRight:4,paddingBottom:8 }}>
              {messages.map((msg,i)=>(
                <div key={i}
                  style={{ display:"flex",flexDirection:msg.role==="user"?"row-reverse":"row",gap:10,alignItems:"flex-end",
                    animation: msg.role==="user"?"slideFromRight 0.3s ease":"slideFromLeft 0.35s ease" }}>
                  {msg.role==="assistant" && <BotAvatar pulse={false} size={36} />}
                  {msg.role==="user" && (
                    <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#1e40af,#4361ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,boxShadow:"0 0 15px rgba(67,97,238,0.3)" }}>👤</div>
                  )}
                  <div style={{
                    maxWidth:"78%", padding:"15px 20px",
                    borderRadius: msg.role==="user" ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                    fontSize:14, lineHeight:1.75, whiteSpace:"pre-wrap",
                    ...(msg.role==="user" ? {
                      background:"linear-gradient(135deg,#1d4ed8,#4361ee,#6d28d9)",
                      color:"#fff",
                      boxShadow:"0 6px 30px rgba(67,97,238,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                    } : {
                      background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.08)",
                      color:"#e2e8f0",
                      backdropFilter:"blur(10px)",
                      boxShadow:"0 4px 20px rgba(0,0,0,0.2)",
                    }),
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display:"flex",gap:10,alignItems:"flex-end",animation:"slideFromLeft 0.35s ease" }}>
                  <BotAvatar pulse={true} size={36} />
                  <TypingBubble />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompt chips */}
            <div style={{ display:"flex",gap:8,overflowX:"auto",padding:"12px 0 10px",scrollbarWidth:"none" }}>
              {QUICK_PROMPTS.map((q,i)=>(
                <button key={i} className="quick-chip" onClick={()=>sendMessage(q.text)}>{q.label}</button>
              ))}
            </div>

            {/* Input row */}
            <div style={{ display:"flex",gap:10,alignItems:"flex-end" }}>
              <button className="sos-main" onClick={handleSOS} style={{ width:52,height:52,fontSize:9,letterSpacing:"0.06em",borderRadius:"50%" }}>
                <span style={{ fontSize:13 }}>🚨</span>
                <span>SOS</span>
              </button>
              <div style={{ flex:1 }}>
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  placeholder="Ask about flood survival, evacuation routes, NDRF contact, post-flood diseases, or anything..."
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); } }}
                  rows={2}
                />
              </div>
              <button className="send-btn" onClick={()=>sendMessage()} disabled={loading||!input.trim()}>
                {loading ? "···" : "Send ↑"}
              </button>
            </div>
            <div style={{ fontSize:11,color:"#1e293b",textAlign:"center",marginTop:8,fontFamily:"'JetBrains Mono',monospace" }}>
              Enter to send · Shift+Enter for new line · Real emergency → CALL 112
            </div>
          </div>
        )}

        {/* ====== GUIDE ====== */}
        {activeTab==="guide" && (
          <div>
            <div style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#4361ee",marginBottom:10,letterSpacing:"0.12em" }}>// NDMA-BACKED PROTOCOL</div>
            <h1 style={{ fontSize:32,fontWeight:900,marginBottom:6,letterSpacing:"-0.03em" }}>
              Flood Survival{" "}
              <span style={{ background:"linear-gradient(90deg,#4cc9f0,#7209b7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Playbook</span>
            </h1>
            <p style={{ color:"#475569",fontSize:14,marginBottom:26 }}>Step-by-step safety instructions for India's flood emergencies</p>

            <div style={{ display:"flex",gap:10,marginBottom:26,flexWrap:"wrap" }}>
              {[
                { key:"Before Flood",icon:"⚡",active:"#4cc9f0",bg:"rgba(76,201,240,0.1)",border:"rgba(76,201,240,0.3)" },
                { key:"During Flood",icon:"🌊",active:"#ff4d6d",bg:"rgba(255,77,109,0.1)",border:"rgba(255,77,109,0.3)" },
                { key:"After Flood",icon:"🏥",active:"#06d6a0",bg:"rgba(6,214,160,0.1)",border:"rgba(6,214,160,0.3)" },
              ].map(g=>(
                <button key={g.key} className="guide-tab-btn" onClick={()=>setActiveGuide(g.key)} style={{
                  border:`1px solid ${activeGuide===g.key ? g.border : "rgba(255,255,255,0.06)"}`,
                  background: activeGuide===g.key ? g.bg : "transparent",
                  color: activeGuide===g.key ? g.active : "#475569",
                  boxShadow: activeGuide===g.key ? `0 0 25px ${g.active}18` : "none",
                }}>
                  {g.icon} {g.key}
                </button>
              ))}
            </div>

            <div>
              {SURVIVAL_STEPS[activeGuide].map((step,i)=>(
                <div key={`${activeGuide}-${i}`} className="step-card" style={{ animationDelay:`${i*0.07}s` }}>
                  <div style={{ width:40,height:40,borderRadius:13,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,
                    background: activeGuide==="During Flood" ? "rgba(255,77,109,0.12)" : activeGuide==="After Flood" ? "rgba(6,214,160,0.1)" : "rgba(76,201,240,0.1)",
                    border: `1px solid ${activeGuide==="During Flood" ? "rgba(255,77,109,0.2)" : activeGuide==="After Flood" ? "rgba(6,214,160,0.18)" : "rgba(76,201,240,0.18)"}`,
                  }}>{step.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#1e3a8a",marginBottom:5,letterSpacing:"0.1em" }}>STEP {i+1}</div>
                    <div style={{ fontSize:14,color:"#cbd5e1",lineHeight:1.68 }}>{step.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {activeGuide==="After Flood" && (
              <div style={{ marginTop:20,background:"linear-gradient(135deg,rgba(6,214,160,0.07),rgba(6,214,160,0.02))",border:"1px solid rgba(6,214,160,0.2)",borderRadius:20,padding:24 }}>
                <h3 style={{ color:"#06d6a0",fontSize:16,fontWeight:800,marginBottom:16 }}>⚕️ Post-Flood Disease Watch — India</h3>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:10 }}>
                  {[
                    { name:"Leptospirosis",risk:"HIGH",sign:"Fever + jaundice after wading in floodwater",color:"#ff4d6d" },
                    { name:"Cholera",risk:"HIGH",sign:"Severe diarrhea + dehydration, spreads fast",color:"#ff4d6d" },
                    { name:"Typhoid",risk:"HIGH",sign:"Sustained fever + stomach pain + weakness",color:"#ff9f1c" },
                    { name:"Malaria",risk:"MEDIUM",sign:"Cyclical fever + chills — mosquito-borne",color:"#f7d716" },
                    { name:"Dengue",risk:"MEDIUM",sign:"High fever + severe joint pain + rash",color:"#f7d716" },
                    { name:"Skin Infections",risk:"MEDIUM",sign:"Rashes, boils from contaminated water contact",color:"#c77dff" },
                  ].map((d,i)=>(
                    <div key={i} style={{ background:"rgba(0,0,0,0.35)",border:`1px solid ${d.color}18`,borderRadius:13,padding:14 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7 }}>
                        <span style={{ fontWeight:700,fontSize:13 }}>{d.name}</span>
                        <span style={{ fontSize:10,padding:"3px 9px",borderRadius:10,background:`${d.color}18`,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace" }}>{d.risk}</span>
                      </div>
                      <div style={{ fontSize:12,color:"#475569",lineHeight:1.55 }}>{d.sign}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14,padding:"13px 16px",background:"rgba(0,0,0,0.35)",borderRadius:12,border:"1px solid rgba(6,214,160,0.15)",fontSize:13,color:"#64748b" }}>
                  🏥 Call <strong style={{ color:"#06d6a0" }}>104</strong> (Health Helpline) or visit nearest PHC if you notice any symptoms within 2 weeks of flood exposure.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====== ZONES ====== */}
        {activeTab==="zones" && (
          <div>
            <div style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#ff4d6d",marginBottom:10,letterSpacing:"0.12em" }}>// NDMA RISK ASSESSMENT</div>
            <h1 style={{ fontSize:32,fontWeight:900,marginBottom:6,letterSpacing:"-0.03em" }}>
              India Flood{" "}
              <span style={{ background:"linear-gradient(90deg,#ff4d6d,#ff9f1c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Risk Map</span>
            </h1>
            <p style={{ color:"#475569",fontSize:14,marginBottom:24 }}>State-wise flood vulnerability by river basin, season, and historical frequency</p>

            <div style={{ display:"flex",gap:10,marginBottom:22,flexWrap:"wrap" }}>
              {[{l:"EXTREME",c:"#ff4d6d",d:"Evacuate immediately when warned"},{l:"HIGH",c:"#ff9f1c",d:"Prepare emergency kits now"},{l:"MEDIUM",c:"#f7d716",d:"Monitor weather alerts"}].map(r=>(
                <div key={r.l} style={{ display:"flex",alignItems:"center",gap:8,background:`${r.c}0c`,border:`1px solid ${r.c}2a`,borderRadius:25,padding:"7px 14px" }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:r.c,boxShadow:`0 0 10px ${r.c}` }} />
                  <span style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:r.c,fontWeight:700 }}>{r.l}</span>
                  <span style={{ fontSize:11,color:"#334155" }}>— {r.d}</span>
                </div>
              ))}
            </div>

            {FLOOD_ZONES.map((zone,i)=>(
              <div key={i} className="zone-row" style={{ animationDelay:`${i*0.07}s` }}>
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  <div style={{ width:46,height:46,borderRadius:14,flexShrink:0,background:`${zone.color}12`,border:`1px solid ${zone.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>🌊</div>
                  <div>
                    <div style={{ fontWeight:800,fontSize:16 }}>{zone.state}</div>
                    <div style={{ fontSize:12,color:"#334155",marginTop:2 }}>Rivers: <span style={{ color:"#64748b" }}>{zone.rivers}</span></div>
                  </div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:14,flexShrink:0 }}>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:10,color:"#334155",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.1em" }}>PEAK SEASON</div>
                    <div style={{ fontSize:13,color:"#64748b",fontFamily:"'JetBrains Mono',monospace",fontWeight:600 }}>{zone.season}</div>
                  </div>
                  <span className="risk-badge" style={{ background:`${zone.color}14`,color:zone.color,border:`1px solid ${zone.color}35` }}>{zone.risk}</span>
                </div>
              </div>
            ))}

            <div style={{ marginTop:20,background:"linear-gradient(135deg,rgba(67,97,238,0.08),rgba(114,9,183,0.05))",border:"1px solid rgba(67,97,238,0.18)",borderRadius:20,padding:22 }}>
              <h3 style={{ fontSize:15,fontWeight:800,color:"#a5b4fc",marginBottom:16 }}>📡 India Flood Monitoring Agencies</h3>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10 }}>
                {[
                  { name:"CWC",full:"Central Water Commission",role:"River level & flow monitoring",color:"#4cc9f0" },
                  { name:"IMD",full:"India Meteorological Dept",role:"Weather, cyclone & monsoon alerts",color:"#f7d716" },
                  { name:"NDMA",full:"Natl Disaster Mgmt Authority",role:"Policy, guidelines & coordination",color:"#c77dff" },
                  { name:"NDRF",full:"Natl Disaster Response Force",role:"Ground rescue & relief ops",color:"#06d6a0" },
                ].map((org,i)=>(
                  <div key={i} style={{ background:"rgba(0,0,0,0.4)",borderRadius:14,padding:14,border:`1px solid ${org.color}18` }}>
                    <div style={{ fontWeight:900,color:org.color,fontSize:20,fontFamily:"'JetBrains Mono',monospace",marginBottom:5,textShadow:`0 0 20px ${org.color}40` }}>{org.name}</div>
                    <div style={{ fontSize:12,color:"#64748b",marginBottom:5 }}>{org.full}</div>
                    <div style={{ fontSize:11,color:"#334155" }}>{org.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====== EMERGENCY ====== */}
        {activeTab==="emergency" && (
          <div>
            <div style={{ fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#ff4d6d",marginBottom:10,letterSpacing:"0.12em" }}>// INDIA EMERGENCY NETWORK</div>
            <h1 style={{ fontSize:32,fontWeight:900,marginBottom:6,letterSpacing:"-0.03em" }}>
              Emergency{" "}
              <span style={{ background:"linear-gradient(90deg,#ff4d6d,#ff9f1c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Contacts</span>
            </h1>
            <p style={{ color:"#475569",fontSize:14,marginBottom:24 }}>India's official helplines — always accessible, 24×7</p>

            {/* Big SOS panel */}
            <div onClick={handleSOS} style={{ background:"linear-gradient(135deg,rgba(190,18,60,0.14),rgba(255,77,109,0.07))",border:"2px solid rgba(255,77,109,0.38)",borderRadius:24,padding:34,marginBottom:24,textAlign:"center",cursor:"pointer",boxShadow:"0 0 80px rgba(255,77,109,0.12),inset 0 1px 0 rgba(255,255,255,0.05)",transition:"all 0.2s" }}>
              <div style={{ fontSize:60,marginBottom:12 }}>🚨</div>
              <div style={{ fontSize:26,fontWeight:900,color:"#ff4d6d",marginBottom:8,textShadow:"0 0 40px rgba(255,77,109,0.6)" }}>TRIGGER EMERGENCY SOS</div>
              <div style={{ fontSize:14,color:"#475569",marginBottom:22 }}>Tap to activate distress signal · Notifies all emergency services</div>
              <div style={{ fontSize:48,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:"white",letterSpacing:"0.06em",textShadow:"0 0 50px rgba(255,255,255,0.25)" }}>CALL 112</div>
              <div style={{ fontSize:13,color:"#334155",marginTop:10 }}>National Emergency — Works on any network, any SIM, even zero balance</div>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24 }}>
              {EMERGENCY_CONTACTS.map((c,i)=>(
                <div key={i} className="contact-card" style={{ background:`${c.color}08`,border:`1px solid ${c.color}22`,boxShadow:`0 6px 30px ${c.color}0e`,animationDelay:`${i*0.08}s` }}>
                  <div style={{ fontSize:30,marginBottom:12 }}>{c.icon}</div>
                  <div style={{ fontSize:28,fontWeight:900,color:c.color,fontFamily:"'JetBrains Mono',monospace",textShadow:`0 0 25px ${c.color}50` }}>{c.number}</div>
                  <div style={{ fontSize:12,color:"#475569",marginTop:7,fontWeight:500 }}>{c.name}</div>
                </div>
              ))}
            </div>

            <div style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.055)",borderRadius:20,padding:22,marginBottom:20 }}>
              <h3 style={{ fontSize:16,fontWeight:800,marginBottom:18 }}>🏛️ Disaster-Specific Helplines</h3>
              {[
                { name:"NDMA 24x7 Helpline",num:"1078",desc:"National Disaster Management Authority",color:"#4cc9f0" },
                { name:"State Disaster Helpline",num:"1070",desc:"Connects to your State SDRF team",color:"#4895ef" },
                { name:"Coast Guard Rescue",num:"1554",desc:"Coastal flood & sea rescue operations",color:"#06d6a0" },
                { name:"Health Emergency Line",num:"104",desc:"Medical assistance + post-flood disease help",color:"#c77dff" },
                { name:"Tourist Emergency",num:"1800111363",desc:"For tourists stranded in flood-hit areas",color:"#ff9f1c" },
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <div>
                    <div style={{ fontWeight:700,fontSize:14 }}>{item.name}</div>
                    <div style={{ fontSize:12,color:"#334155",marginTop:2 }}>{item.desc}</div>
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:900,color:item.color,textShadow:`0 0 20px ${item.color}45` }}>{item.num}</div>
                </div>
              ))}
            </div>

            <div style={{ background:"linear-gradient(135deg,rgba(6,214,160,0.07),rgba(6,214,160,0.02))",border:"1px solid rgba(6,214,160,0.2)",borderRadius:20,padding:22 }}>
              <h3 style={{ fontSize:16,fontWeight:800,color:"#06d6a0",marginBottom:14 }}>📱 Emergency SMS Template</h3>
              <div style={{ background:"rgba(0,0,0,0.5)",borderRadius:14,padding:18,border:"1px solid rgba(255,255,255,0.05)",fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#64748b",lineHeight:2 }}>
                🆘 SOS FLOOD EMERGENCY<br/>
                Name: [YOUR FULL NAME]<br/>
                Location: [GPS COORDINATES / ADDRESS]<br/>
                People stranded: [NUMBER]<br/>
                Medical emergency: [YES/NO + DETAILS]<br/>
                Floor: [WHICH FLOOR YOU'RE ON]<br/>
                <span style={{ color:"#06d6a0" }}>→ Send to: 112 · 1078 · All family members</span>
              </div>
              <p style={{ fontSize:13,color:"#334155",marginTop:12 }}>💡 Also share your Google Maps live location link for faster NDRF rescue coordination</p>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)",padding:"14px 20px",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(10px)" }}>
        <div style={{ maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
          <span style={{ fontSize:12,color:"#1e293b" }}>🛡️ Safemate AI · Built for India · NDMA Compliant · Always call 112 in real emergencies</span>
          <span style={{ fontSize:11,color:"#1e293b",fontFamily:"'JetBrains Mono',monospace" }}>v3.0 · MONSOON 2024</span>
        </div>
      </div>
    </div>
  );
}
