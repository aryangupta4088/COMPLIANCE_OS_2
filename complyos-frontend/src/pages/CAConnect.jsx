import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, ShieldCheck, Star, MessageCircle,
  Search, X, CheckCircle2, ChevronDown, ExternalLink,
  MapPin, Clock, Users, Briefcase, Languages,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Footer } from "../components/layout/Footer";
import { Button, Modal } from "../components/ui/Common";
import { getProfile } from "../utils/profileStore";
import { CA_DIRECTORY, getAssignedCA } from "../utils/caDirectory";

// ─── Specialisation filter options ────────────────────────────────────────
const ALL_SPECS = [
  "GST", "MSME", "Labour Law", "Women Schemes", "Exports",
  "Income Tax", "Audit", "Startup India", "Manufacturing",
];

const STATE_LIST = [
  "All States", "Delhi", "Maharashtra", "Karnataka",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Gujarat",
  "West Bengal", "Rajasthan", "Kerala",
];

// ─── Star Rating component ────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-cs-200"}
        />
      ))}
      <span className="text-cs-600 text-xs font-semibold ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────
function BookingModal({ ca, profile, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [topic, setTopic] = useState(
    profile.businessName
      ? `GST and ${profile.sector || "MSME"} compliance review for ${profile.businessName}`
      : "GST and MSME compliance review"
  );
  const [mode, setMode] = useState("whatsapp");
  const [confirmed, setConfirmed] = useState(false);

  if (!ca) return null;

  function handleConfirm() {
    if (mode === "whatsapp") {
      const msg = `Hi ${ca.name.split(",")[0]}, I'd like to book a consultation on ${date} at ${time}. Topic: ${topic}. Business: ${profile.businessName || "MSME"}, ${profile.state || ""}.`;
      window.open(`https://wa.me/${ca.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      onClose();
      return;
    }
    if (mode === "call") {
      window.location.href = `tel:${ca.phone}`;
      onClose();
      return;
    }
    setConfirmed(true);
    setTimeout(() => { onClose(); }, 2000);
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle2 size={28} className="text-green-600" />
        </motion.div>
        <p className="font-bold text-cs-900 text-lg">Request Sent!</p>
        <p className="text-cs-500 text-sm">
          Consultation request with <span className="font-semibold">{ca.name}</span> sent.
          They'll confirm within 2 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* CA summary */}
      <div className="flex items-center gap-3 mb-5 bg-cs-50 rounded-xl p-3">
        <div className="w-10 h-10 rounded-full bg-cs-800 text-cs-50 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {ca.initials}
        </div>
        <div>
          <p className="font-bold text-cs-900 text-sm">{ca.name}</p>
          <p className="text-cs-500 text-xs">{ca.title} · {ca.location}</p>
        </div>
        <StarRating rating={ca.rating} />
      </div>

      {/* Booking mode */}
      <p className="text-xs font-semibold text-cs-600 tracking-wide mb-2">How to connect</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { key: "whatsapp", label: "WhatsApp", icon: <MessageCircle size={14} />, color: "text-green-600" },
          { key: "call", label: "Call Now", icon: <Phone size={14} />, color: "text-cs-600" },
          { key: "request", label: "Request", icon: <Mail size={14} />, color: "text-cs-600" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex flex-col items-center gap-1.5 border rounded-xl py-3 text-xs font-semibold transition-all ${mode === m.key
                ? "border-cs-900 bg-cs-900 text-white"
                : "border-cs-200 text-cs-600 hover:border-cs-400"
              }`}
          >
            <span className={mode === m.key ? "text-white" : m.color}>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* WhatsApp / Request fields */}
      {(mode === "whatsapp" || mode === "request") && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-cs-600 mb-1">Preferred Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cs-600 mb-1">Preferred Time</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500 bg-white"
              >
                {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="block text-xs font-semibold text-cs-600 mb-1">Topic / Query</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={2}
            className="w-full border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500 resize-none mb-4"
          />
        </>
      )}

      {/* Call mode info */}
      {mode === "call" && (
        <div className="bg-cs-50 rounded-xl p-4 mb-4 text-center">
          <p className="text-cs-500 text-xs mb-1">Direct number</p>
          <p className="text-cs-900 font-bold text-lg">{ca.phone}</p>
          <p className="text-cs-400 text-xs mt-1">Available Mon–Sat · 9 AM – 7 PM</p>
        </div>
      )}

      {/* Fee info */}
      <div className="flex items-center justify-between text-xs text-cs-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
        <span>Consultation fee</span>
        <span className="font-bold text-cs-900">₹{ca.pricePerConsultation?.toLocaleString("en-IN")} / session</span>
      </div>

      <Button variant="primary" size="md" className="w-full" onClick={handleConfirm}>
        {mode === "whatsapp" ? "Open WhatsApp" : mode === "call" ? "Call Now" : "Send Request"}
      </Button>
    </div>
  );
}

// ─── CA Card ─────────────────────────────────────────────────────────────
function CAListCard({ ca, isAssigned, onBook }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-all ${isAssigned ? "border-cs-700 ring-1 ring-cs-700/30" : "border-cs-100"
        }`}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${isAssigned ? "bg-cs-900 text-cs-50" : "bg-cs-200 text-cs-800"
            }`}>
            {ca.initials}
          </div>
          {isAssigned && (
            <span className="absolute -top-2 -left-2 bg-cs-900 text-cs-50 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              YOURS
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <p className="font-bold text-cs-900 text-sm leading-tight">{ca.name}</p>
            {ca.verified && (
              <ShieldCheck size={14} className="text-cs-600 flex-shrink-0 mt-0.5" title="Verified" />
            )}
          </div>
          <p className="text-cs-500 text-xs mt-0.5">{ca.title}</p>
          <StarRating rating={ca.rating} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          [ca.experience, <Clock size={11} />, "Experience"],
          [`${ca.clients}+`, <Users size={11} />, "Clients"],
          [`₹${(ca.pricePerConsultation / 100).toFixed(1)}k`, <Briefcase size={11} />, "Per session"],
        ].map(([val, icon, label]) => (
          <div key={label} className="bg-cs-50 rounded-lg py-2">
            <div className="flex items-center justify-center gap-0.5 text-cs-500 mb-0.5">{icon}</div>
            <p className="text-cs-900 font-bold text-xs">{val}</p>
            <p className="text-cs-400 text-[10px]">{label}</p>
          </div>
        ))}
      </div>

      {/* Location & languages */}
      <div className="flex items-center gap-3 text-xs text-cs-500">
        <span className="flex items-center gap-1"><MapPin size={11} /> {ca.location}</span>
        <span className="flex items-center gap-1"><Languages size={11} /> {ca.languages.slice(0, 2).join(", ")}</span>
      </div>

      {/* Specialities */}
      <div className="flex flex-wrap gap-1">
        {ca.speciality.map((s) => (
          <span key={s} className="bg-cs-100 text-cs-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {s}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p className="text-cs-400 text-xs leading-relaxed">{ca.bio}</p>

      {/* CTA */}
      <div className="flex gap-2 mt-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBook}
          className="flex-1 bg-cs-900 text-cs-50 rounded-lg py-2 text-xs font-semibold hover:bg-cs-700 transition-colors"
        >
          Book Consultation
        </motion.button>
        <a
          href={`https://wa.me/${ca.whatsapp}?text=Hi%20${encodeURIComponent(ca.name.split(",")[0])}%2C%20I%20need%20help%20with%20MSME%20compliance%20for%20my%20business.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 border border-cs-200 text-cs-600 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
        >
          <MessageCircle size={13} />
        </a>
        <a
          href={`tel:${ca.phone}`}
          className="flex items-center justify-center gap-1 border border-cs-200 text-cs-600 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-cs-50 transition-colors"
        >
          <Phone size={13} />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function CAConnectPage() {
  const profile = getProfile();
  const assignedCA = useMemo(() => getAssignedCA(profile), [profile]);

  const [booking, setBooking] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Dynamic filter
  const filteredCAs = useMemo(() => {
    return CA_DIRECTORY.filter((ca) => {
      const matchSearch =
        !search ||
        ca.name.toLowerCase().includes(search.toLowerCase()) ||
        ca.speciality.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
        ca.location.toLowerCase().includes(search.toLowerCase());

      const matchState =
        selectedState === "All States" ||
        ca.state?.toLowerCase().includes(selectedState.toLowerCase());

      const matchSpec =
        selectedSpecs.length === 0 ||
        selectedSpecs.some((sp) => ca.speciality.includes(sp));

      const matchPrice = ca.pricePerConsultation <= maxPrice;

      return matchSearch && matchState && matchSpec && matchPrice;
    });
  }, [search, selectedState, selectedSpecs, maxPrice]);

  function toggleSpec(s) {
    setSelectedSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function resetFilters() {
    setSearch("");
    setSelectedState("All States");
    setSelectedSpecs([]);
    setMaxPrice(10000);
  }

  return (
    <DashboardLayout topbarDark>
      <div className="p-6 max-w-6xl mx-auto">

        {/* ── ASSIGNED CA BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-cs-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8"
        >
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-cs-900 text-cs-50 flex items-center justify-center font-bold text-2xl">
              {assignedCA.initials}
            </div>
            <span className="absolute -top-2 -left-2 bg-cs-800 text-cs-50 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest">
              YOUR CA
            </span>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-cs-900">{assignedCA.name}</h1>
            <p className="text-cs-500 text-sm mt-0.5">
              {assignedCA.title} · {assignedCA.experience} Experience
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <StarRating rating={assignedCA.rating} />
              <span className="text-cs-400 text-xs">{assignedCA.clients}+ clients</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-cs-500 text-xs font-medium">
              <a href={`mailto:${assignedCA.email}`} className="flex items-center gap-1.5 hover:text-cs-800 transition-colors">
                <Mail size={13} /> {assignedCA.email}
              </a>
              <a href={`tel:${assignedCA.phone}`} className="flex items-center gap-1.5 hover:text-cs-800 transition-colors">
                <Phone size={13} /> {assignedCA.phone}
              </a>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-cs-600" /> Verified Practitioner
              </span>
            </div>
            {profile.businessName && (
              <p className="mt-2 text-xs text-cs-400">
                Best match for:{" "}
                <span className="font-semibold text-cs-700">{profile.businessName}</span>
                {profile.sector && ` · ${profile.sector}`}
                {profile.state && ` · ${profile.state}`}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:items-end flex-shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => setBooking(assignedCA)}
            >
              Book Consultation
            </Button>
            <a
              href={`https://wa.me/${assignedCA.whatsapp}?text=Hi%20${encodeURIComponent(assignedCA.name.split(",")[0])}%2C%20I%20need%20MSME%20compliance%20help%20for%20${encodeURIComponent(profile.businessName || "my business")}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-cs-200 text-cs-700 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
            >
              <MessageCircle size={14} className="text-green-500" /> WhatsApp
            </a>
          </div>
        </motion.div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* Filter panel */}
          <div className="bg-white border border-cs-100 rounded-2xl p-6 self-start sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-cs-900 text-lg">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-cs-500 text-xs font-semibold hover:text-cs-700 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, speciality, location…"
                className="w-full border border-cs-200 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-cs-500"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-cs-400 hover:text-cs-700">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* State */}
            <label className="block text-xs font-semibold text-cs-600 tracking-wide mb-1.5">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-cs-700 text-sm mb-5 outline-none focus:border-cs-500 bg-white cursor-pointer"
            >
              {STATE_LIST.map((s) => <option key={s}>{s}</option>)}
            </select>

            {/* Specialisation */}
            <p className="text-xs font-semibold text-cs-600 tracking-wide mb-2">Specialisation</p>
            <div className="flex flex-col gap-2 mb-5">
              {ALL_SPECS.map((spec) => (
                <label key={spec} className="flex items-center gap-2.5 text-sm text-cs-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSpecs.includes(spec)}
                    onChange={() => toggleSpec(spec)}
                    className="accent-cs-800 w-4 h-4"
                  />
                  {spec}
                </label>
              ))}
            </div>

            {/* Price */}
            <p className="text-xs font-semibold text-cs-600 tracking-wide mb-2">Max Fee per Session</p>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cs-800 mb-1"
            />
            <div className="flex justify-between text-xs text-cs-400">
              <span>₹500</span>
              <span className="text-cs-700 font-bold">₹{maxPrice.toLocaleString("en-IN")}</span>
              <span>₹10,000+</span>
            </div>

            <Button variant="primary" size="md" className="w-full mt-6">
              {filteredCAs.length} CA{filteredCAs.length !== 1 ? "s" : ""} found
            </Button>
          </div>

          {/* CA grid */}
          <div>
            {filteredCAs.length === 0 ? (
              <div className="bg-white border border-cs-100 rounded-2xl p-12 text-center">
                <p className="text-cs-400 text-sm">No CAs match your filters.</p>
                <button onClick={resetFilters} className="mt-3 text-cs-600 text-xs font-semibold underline">
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AnimatePresence>
                  {filteredCAs.map((ca) => (
                    <CAListCard
                      key={ca.id}
                      ca={ca}
                      isAssigned={ca.id === assignedCA.id}
                      onBook={() => setBooking(ca)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOOKING MODAL ── */}
      <Modal
        isOpen={!!booking}
        onClose={() => setBooking(null)}
        title="Book Consultation"
      >
        <BookingModal ca={booking} profile={profile} onClose={() => setBooking(null)} />
      </Modal>

      <Footer dark />
    </DashboardLayout>
  );
}