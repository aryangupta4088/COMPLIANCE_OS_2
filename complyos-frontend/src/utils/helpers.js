/* utils/helpers.js
   Single source of truth for auth state in localStorage.
   These are imported by Landing.jsx, App.jsx, and any component
   that needs to check or set the current user.
*/

const TOKEN_KEY = "cos_token";
const ROLE_KEY = "cos_role";
const USERID_KEY = "cos_user_id";

export const setToken = (v) => localStorage.setItem(TOKEN_KEY, v);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const setRole = (v) => localStorage.setItem(ROLE_KEY, v);
export const getRole = () => localStorage.getItem(ROLE_KEY);

export const setUserId = (v) => localStorage.setItem(USERID_KEY, v);
export const getUserId = () => localStorage.getItem(USERID_KEY);

/** Wipe everything — call on logout */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERID_KEY);
}

/** True if a valid token exists */
export const isAuthenticated = () => Boolean(getToken());

/**
 * Role helpers — use these for conditional rendering.
 * e.g.  isCA() → show CA pricing
 *       isMSME() → show Udyam-specific features
 */
export const isCA = () => getRole() === "ca";
export const isMSME = () => getRole() === "msme_owner";
export const isEnterprise = () => getRole() === "enterprise";
export const isIndividual = () => getRole() === "individual";
export const isBusiness = () => ["msme_owner", "enterprise", "individual"].includes(getRole());

// Formatting
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const getUrgencyColor = (urgency) => ({
  high: "text-red-600 bg-red-50 border-red-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  low: "text-green-600 bg-green-50 border-green-200",
}[urgency] || "text-cs-600 bg-cs-100 border-cs-200");

export const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);