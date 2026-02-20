export const SYSTEM_PROMPT = `You are "Safemate AI," India's official intelligent disaster companion for flood emergencies. You are calm, reassuring, and speak in a warm, human way — never robotic.

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

export const FLOOD_STATS = [
    { label: "Annual Deaths", value: "1,600+", icon: "💀", color: "#ff4d6d", glow: "#ff4d6d" },
    { label: "People Displaced", value: "7M+", icon: "🏠", color: "#ff9f1c", glow: "#ff9f1c" },
    { label: "States Affected", value: "28/36", icon: "🗺️", color: "#f7d716", glow: "#f7d716" },
    { label: "Annual Loss (₹Cr)", value: "75,000+", icon: "💸", color: "#c77dff", glow: "#c77dff" },
];

export const FLOOD_ZONES = [
    { state: "Assam", risk: "EXTREME", rivers: "Brahmaputra, Barak", color: "#ff4d6d", season: "Jun–Sep" },
    { state: "Bihar", risk: "EXTREME", rivers: "Kosi, Gandak, Ganga", color: "#ff4d6d", season: "Jul–Sep" },
    { state: "Uttar Pradesh", risk: "HIGH", rivers: "Ganga, Yamuna, Ghaghra", color: "#ff9f1c", season: "Jul–Aug" },
    { state: "West Bengal", risk: "HIGH", rivers: "Ganga, Damodar", color: "#ff9f1c", season: "Jun–Sep" },
    { state: "Kerala", risk: "HIGH", rivers: "Periyar, Pamba", color: "#ff9f1c", season: "Jun–Aug" },
    { state: "Odisha", risk: "HIGH", rivers: "Mahanadi, Brahmani", color: "#ff9f1c", season: "Jul–Oct" },
    { state: "Maharashtra", risk: "MEDIUM", rivers: "Godavari, Krishna", color: "#f7d716", season: "Jul–Sep" },
    { state: "Uttarakhand", risk: "HIGH", rivers: "Alaknanda, Mandakini", color: "#ff9f1c", season: "Jun–Sep" },
];

export const SURVIVAL_STEPS = {
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

export const EMERGENCY_CONTACTS = [
    { name: "National Emergency", number: "112", icon: "🚨", color: "#ff4d6d" },
    { name: "NDMA Helpline", number: "1078", icon: "🏛️", color: "#4cc9f0" },
    { name: "State Disaster", number: "1070", icon: "🌊", color: "#4895ef" },
    { name: "Police", number: "100", icon: "👮", color: "#c77dff" },
    { name: "Ambulance", number: "108", icon: "🏥", color: "#06d6a0" },
    { name: "Fire Brigade", number: "101", icon: "🔥", color: "#ff9f1c" },
];

export const QUICK_PROMPTS = [
    { label: "🆘 I'm stuck in floodwater!", text: "I'm stuck in floodwater right now, what do I do?" },
    { label: "🗺️ Assam flood zones?", text: "Tell me about flood zones in Assam and what areas are most dangerous" },
    { label: "🎒 72-hour kit guide", text: "How do I make a proper 72-hour emergency flood kit for my family?" },
    { label: "🦠 Post-flood diseases", text: "What diseases should I watch out for after a flood in India?" },
    { label: "🚁 Contact NDRF", text: "How do I contact NDRF for flood rescue and what information do they need?" },
    { label: "🌧️ Kerala flood tips", text: "What are specific safety tips for Kerala flood situations?" },
];
