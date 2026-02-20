export const saveEmergency = (emergencyData) => {
    const active = getEmergencies();
    const newEmergency = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: "Action Required",
        ...emergencyData
    };

    active.push(newEmergency);
    localStorage.setItem('safemate_emergencies', JSON.stringify(active));

    // Dispatch a cross-tab event so the Authority dashboard updates instantly
    window.dispatchEvent(new Event('storage'));
    return newEmergency;
};

export const getEmergencies = () => {
    const data = localStorage.getItem('safemate_emergencies');
    return data ? JSON.parse(data) : [];
};

export const updateEmergencyStatus = (id, newStatus) => {
    const active = getEmergencies();
    const index = active.findIndex(e => e.id === id);
    if (index !== -1) {
        active[index].status = newStatus;
        localStorage.setItem('safemate_emergencies', JSON.stringify(active));
        window.dispatchEvent(new Event('storage'));
    }
};

export const addTestEmergency = () => {
    saveEmergency({
        type: "Trainee Alert",
        peopleCount: "1",
        medicalNeeded: false,
        location: { lat: 26.2006, lng: 92.9376 }, // Assam center
        address: "Guwahati, Assam"
    });
};
