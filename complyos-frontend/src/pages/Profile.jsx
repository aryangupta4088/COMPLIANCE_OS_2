import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/Common";
import { getProfile, setProfile } from "../utils/profileStore";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const SECTORS = [
  "Textiles", "Food & Beverages", "IT / Software", "Retail", "Manufacturing",
  "Agriculture", "Construction", "Healthcare", "Education", "Other",
];

const TURNOVER_OPTIONS = [
  { label: "Below ₹40 Lakh", value: "below40L" },
  { label: "₹40L – ₹1 Crore", value: "40L-1Cr" },
  { label: "₹1 Cr – ₹10 Crore", value: "1Cr-10Cr" },
  { label: "Above ₹10 Crore", value: "above10Cr" },
];

const ALL_REGS = ["GST", "Udyam", "PAN", "ShopLicense", "FSSAI", "ImportExport", "Trademark", "ESIC", "EPF"];

export default function ProfilePage() {
  const [profile, setLocalProfile] = useState(getProfile());
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setLocalProfile((prev) => ({ ...prev, [field]: value }));
  }

  function toggleReg(reg) {
    const regs = profile.registrations || [];
    const updated = regs.includes(reg) ? regs.filter((r) => r !== reg) : [...regs, reg];
    update("registrations", updated);
  }

  function save() {
    setProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const initials = profile.businessName
    ? profile.businessName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "??";

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="fixed top-20 right-6 z-50 bg-cs-900 text-cs-50 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg"
            >
              Profile saved successfully ✓
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* ── SIDEBAR ── */}
          <aside className="bg-white border border-cs-100 rounded-2xl p-6 self-start">
            <div className="w-20 h-20 rounded-full bg-cs-800 text-cs-50 flex items-center justify-center font-bold text-2xl mb-4">
              {initials}
            </div>
            <h2 className="font-bold text-cs-900 text-lg">{profile.businessName || "Your Business"}</h2>
            <p className="text-cs-500 text-sm">{profile.sector || "Business"}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-cs-100 text-cs-700 text-xs font-semibold px-3 py-1 rounded-full">
                {profile.tier || "Starter"} Tier
              </span>
              {profile.isWomen && (
                <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                  🌸 Women Entrepreneur
                </span>
              )}
            </div>

            <hr className="border-cs-100 my-4" />

            <div className="flex flex-col gap-3 text-sm">
              {[
                ["GSTIN", profile.gstin || "—"],
                ["Udyam", profile.udyam || "—"],
                ["State", profile.state || "—"],
                ["Turnover", profile.turnover || "—"],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-cs-400 text-xs">{label}</p>
                  <p className="font-semibold text-cs-900 break-all">{val}</p>
                </div>
              ))}
            </div>

            <hr className="border-cs-100 my-4" />
            <p className="text-cs-500 text-xs font-bold tracking-widest uppercase mb-2">Registrations</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.registrations || []).map((r) => (
                <span key={r} className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {r}
                </span>
              ))}
              {(profile.registrations || []).length === 0 && (
                <span className="text-cs-400 text-xs">None added yet</span>
              )}
            </div>
          </aside>

          {/* ── FORM ── */}
          <div className="flex flex-col gap-5">
            {/* Business Settings */}
            <div className="bg-white border border-cs-100 rounded-2xl p-6">
              <h2 className="font-bold text-cs-900 text-lg mb-5">Business Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-cs-600">Business Name</span>
                  <input
                    value={profile.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500 transition-colors"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-cs-600">Business Type</span>
                  <select
                    value={profile.businessType}
                    onChange={(e) => update("businessType", e.target.value)}
                    className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500 bg-white"
                  >
                    <option value="">Select…</option>
                    {["shop", "factory", "food", "service", "other"].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-cs-600">Sector</span>
                  <select
                    value={profile.sector}
                    onChange={(e) => update("sector", e.target.value)}
                    className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500 bg-white"
                  >
                    <option value="">Select…</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-cs-600">State</span>
                  <select
                    value={profile.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500 bg-white"
                  >
                    <option value="">Select…</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-cs-600">District</span>
                  <input
                    value={profile.district}
                    onChange={(e) => update("district", e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-cs-600">Annual Turnover</span>
                  <select
                    value={profile.turnover}
                    onChange={(e) => update("turnover", e.target.value)}
                    className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500 bg-white"
                  >
                    <option value="">Select…</option>
                    {TURNOVER_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Women toggle */}
              <label className="flex items-center gap-3 mt-5 cursor-pointer select-none">
                <div
                  onClick={() => update("isWomen", !profile.isWomen)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${profile.isWomen ? "bg-pink-500" : "bg-cs-200"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${profile.isWomen ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm font-semibold text-cs-700">
                  Women-led enterprise {profile.isWomen && <span className="text-pink-600">🌸 (20% discount active)</span>}
                </span>
              </label>
            </div>

            {/* Compliance Identifiers */}
            <div className="bg-white border border-cs-100 rounded-2xl p-6">
              <h2 className="font-bold text-cs-900 text-lg mb-5">Compliance Identifiers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["GSTIN", "gstin", "27ABCDE1234F1Z5"],
                  ["PAN", "pan", "ABCDE1234F"],
                  ["Udyam Number", "udyam", "UDYAM-MH-12-0000001"],
                ].map(([label, field, placeholder]) => (
                  <label key={field} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-cs-600">{label}</span>
                    <input
                      value={profile[field] || ""}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={placeholder}
                      className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Registrations checklist */}
            <div className="bg-white border border-cs-100 rounded-2xl p-6">
              <h2 className="font-bold text-cs-900 text-lg mb-2">Existing Registrations</h2>
              <p className="text-cs-400 text-xs mb-4">Check all that apply — this personalizes your scheme and compliance recommendations.</p>
              <div className="flex flex-wrap gap-2">
                {ALL_REGS.map((reg) => {
                  const active = (profile.registrations || []).includes(reg);
                  return (
                    <button
                      key={reg}
                      onClick={() => toggleReg(reg)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${active
                          ? "bg-cs-900 text-white border-cs-900"
                          : "bg-white text-cs-600 border-cs-200 hover:border-cs-400"
                        }`}
                    >
                      {active ? "✓ " : ""}{reg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Billing */}
            <div className="bg-white border border-cs-100 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-cs-900 text-lg">Billing</h2>
                <p className="text-cs-500 text-sm">Current tier: {profile.tier || "Starter"}</p>
              </div>
              <Button variant="primary" size="md" type="button">Upgrade to Growth</Button>
            </div>

            <Button variant="primary" size="lg" onClick={save} className="self-start">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}