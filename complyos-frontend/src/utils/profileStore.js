// profileStore.js — single source of truth for business profile
// All pages read/write through these helpers

export const PROFILE_KEY = "cos_business_profile";

export const DEFAULT_PROFILE = {
    businessName: "",
    businessType: "",   // shop | factory | food | service | other
    sector: "",
    state: "",
    district: "",
    turnover: "",
    gstin: "",
    pan: "",
    udyam: "",
    registrations: [],  // ["GST","Udyam","PAN","Shop License"]
    isWomen: false,
    tier: "Starter",
    caName: "",
};

export function getProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
    } catch {
        return { ...DEFAULT_PROFILE };
    }
}

export function setProfile(data) {
    const merged = { ...getProfile(), ...data };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
    return merged;
}

export function clearProfile() {
    localStorage.removeItem(PROFILE_KEY);
}