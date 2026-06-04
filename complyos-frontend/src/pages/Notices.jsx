import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Sparkles, ExternalLink, X, AlertTriangle,
  Clock, Info, CheckCircle2, ChevronRight, MessageCircle,
  Phone, Star, Shield, Briefcase, Search,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Footer } from "../components/layout/Footer";
import { groqChat } from "../services/groqService";
import { getProfile } from "../utils/profileStore";

// ─── Urgency config ───────────────────────────────────────────────────────
const URGENCY_CONFIG = {
  urgent: { label: "URGENT", color: "border-l-red-500", badge: "bg-red-100 text-red-700", icon: <AlertTriangle size={14} className="text-red-500" />, dot: "bg-red-500" },
  medium: { label: "DEADLINE", color: "border-l-amber-400", badge: "bg-amber-100 text-amber-700", icon: <Clock size={14} className="text-amber-500" />, dot: "bg-amber-400" },
  scheme: { label: "SCHEME", color: "border-l-violet-400", badge: "bg-violet-100 text-violet-700", icon: <Sparkles size={14} className="text-violet-500" />, dot: "bg-violet-400" },
  regulatory: { label: "REGULATORY", color: "border-l-blue-400", badge: "bg-blue-100 text-blue-700", icon: <Info size={14} className="text-blue-500" />, dot: "bg-blue-400" },
};

// ─── Govt portal map for notices ─────────────────────────────────────────
const NOTICE_PORTALS = {
  gst: { label: "GST Portal", url: "https://www.gst.gov.in/" },
  udyam: { label: "Udyam Portal", url: "https://udyamregistration.gov.in/" },
  income_tax: { label: "Income Tax Portal", url: "https://www.incometax.gov.in/iec/foportal/" },
  epfo: { label: "EPFO Portal", url: "https://unifiedportal-emp.epfindia.gov.in/epfo/" },
  msme: { label: "MSME Portal", url: "https://msme.gov.in/" },
  startup: { label: "Startup India", url: "https://www.startupindia.gov.in/" },
  schemes: { label: "MSME Schemes", url: "https://msme.gov.in/schemes" },
  zed: { label: "ZED Portal", url: "https://zed.msme.gov.in/" },
  mudra: { label: "MUDRA", url: "https://www.mudra.org.in/" },
  labour: { label: "Shram Suvidha", url: "https://shramsuvidha.gov.in/" },
};

function inferPortal(title = "", action = "") {
  const t = (title + " " + action).toLowerCase();
  if (t.includes("gst") || t.includes("gstr")) return NOTICE_PORTALS.gst;
  if (t.includes("udyam") || t.includes("msme regist")) return NOTICE_PORTALS.udyam;
  if (t.includes("income tax") || t.includes("itr") || t.includes("tds") || t.includes("tan")) return NOTICE_PORTALS.income_tax;
  if (t.includes("pf") || t.includes("epfo") || t.includes("provident")) return NOTICE_PORTALS.epfo;
  if (t.includes("scheme") || t.includes("subsid") || t.includes("grant")) return NOTICE_PORTALS.schemes;
  if (t.includes("startup") || t.includes("dpiit")) return NOTICE_PORTALS.startup;
  if (t.includes("zed") || t.includes("quality")) return NOTICE_PORTALS.zed;
  if (t.includes("mudra") || t.includes("loan")) return NOTICE_PORTALS.mudra;
  if (t.includes("labour") || t.includes("shop") || t.includes("establishment")) return NOTICE_PORTALS.labour;
  if (t.includes("msme")) return NOTICE_PORTALS.msme;
  return null;
}

// ─── Expert directory ─────────────────────────────────────────────────────
const EXPERTS = [
  { id: 1, initials: "RK", name: "Rajesh Kumar", role: "CA & GST Expert", tags: ["GST", "MSME", "Udyam"], rating: 4.9, projects: 340, price: "₹1,500/session", whatsapp: "919810123456", phone: "+91-98101-23456", category: "CA & ACCOUNTANT", verified: true },
  { id: 2, initials: "PM", name: "Priya Mehta", role: "CA & Women Schemes", tags: ["Women Schemes", "CGTMSE", "Labour"], rating: 4.8, projects: 215, price: "₹1,200/session", whatsapp: "919820178901", phone: "+91-98201-78901", category: "CA & ACCOUNTANT", verified: true },
  { id: 3, initials: "SJ", name: "Suresh Joshi", role: "Legal Advisor", tags: ["Labour Law", "Contracts", "IP"], rating: 4.7, projects: 180, price: "₹2,000/session", whatsapp: "919730045678", phone: "+91-97300-45678", category: "LEGAL ADVISOR", verified: true },
  { id: 4, initials: "AN", name: "Anjali Nair", role: "GST Expert", tags: ["GST Filing", "ITC", "Export"], rating: 4.8, projects: 290, price: "₹1,400/session", whatsapp: "919440034567", phone: "+91-94400-34567", category: "GST EXPERT", verified: true },
  { id: 5, initials: "VG", name: "Vikram Gupta", role: "Startup & DPIIT", tags: ["Startup India", "Angel Tax", "DPIIT"], rating: 4.6, projects: 178, price: "₹1,800/session", whatsapp: "919300012345", phone: "+91-93000-12345", category: "CA & ACCOUNTANT", verified: true },
  { id: 6, initials: "KP", name: "Kavitha P.", role: "Labour Law Specialist", tags: ["PF/ESI", "Payroll", "Shops Act"], rating: 4.7, projects: 160, price: "₹1,000/session", whatsapp: "919900067890", phone: "+91-99000-67890", category: "LEGAL ADVISOR", verified: true },
  { id: 7, initials: "AR", name: "Arjun Rao", role: "Web Developer", tags: ["E-commerce", "GST Plugin", "Portal"], rating: 4.5, projects: 95, price: "₹5,000/project", whatsapp: "919800011122", phone: "+91-98000-11122", category: "WEB DEVELOPER", verified: true },
  { id: 8, initials: "NS", name: "Nisha Shah", role: "Designer", tags: ["Branding", "Packaging", "UI/UX"], rating: 4.6, projects: 130, price: "₹3,000/project", whatsapp: "919900022233", phone: "+91-99000-22233", category: "DESIGNER", verified: true },
];

const EXPERT_PILLS = ["ALL", "CA & ACCOUNTANT", "GST EXPERT", "LEGAL ADVISOR", "WEB DEVELOPER", "DESIGNER"];

// ─── AI detail modal for a notice ────────────────────────────────────────
function NoticeDetailModal({ notice, profile, onClose }) {
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(true);
  const portal = inferPortal(notice.title, notice.action);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const reply = await groqChat(
          [{ role: "user", content: `Explain this compliance notice for an Indian MSME in simple terms: "${notice.title}". Context: ${notice.message}. Business: ${profile.sector || "MSME"} in ${profile.state || "India"}. Give: 1) What this means for them, 2) Exact steps to take, 3) Consequence of missing it. Max 100 words total, use numbered steps.` }],
          "You are ARIA, a compliance expert for Indian MSMEs. Give clear, actionable, specific advice in plain English. No jargon.",
          { maxTokens: 200, temperature: 0.3 }
        );
        setDetail(reply.trim());
      } catch {
        setDetail(`This notice relates to ${notice.title}. ${notice.message} Please visit the official portal to take action or consult a CA for guidance.`);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [notice, profile]);

  const cfg = URGENCY_CONFIG[notice.urgency] || URGENCY_CONFIG.regulatory;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`border-l-4 ${cfg.color} px-5 py-4 bg-cs-50 flex items-start justify-between gap-3`}>
          <div className="flex items-start gap-3">
            {cfg.icon}
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
              <p className="font-bold text-cs-900 text-sm mt-1 leading-snug">{notice.title}</p>
              <p className="text-cs-500 text-xs mt-0.5">{notice.source}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cs-400 hover:text-cs-700 flex-shrink-0 mt-0.5"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Original message */}
          <p className="text-cs-600 text-sm leading-relaxed">{notice.message}</p>

          {/* AI explanation */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-amber-600" />
              <p className="text-amber-800 text-xs font-bold tracking-widest uppercase">ARIA Explains</p>
            </div>
            {loading ? (
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400"
                    animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }} />
                ))}
                <span className="text-amber-600 text-xs ml-1">Analysing for your business…</span>
              </div>
            ) : (
              <p className="text-amber-900 text-sm leading-relaxed whitespace-pre-line">{detail}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {portal && (
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-cs-900 text-cs-50 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-cs-700 transition-colors"
              >
                <span>Take Action on {portal.label}</span>
                <ExternalLink size={14} />
              </a>
            )}
            <a
              href={`https://wa.me/919810123456?text=Hi%20Rajesh%2C%20I%20need%20help%20with%20this%20notice:%20${encodeURIComponent(notice.title)}%20for%20my%20business%20in%20${encodeURIComponent(profile.state || "India")}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-green-200 bg-green-50 text-green-700 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-green-100 transition-colors"
            >
              <MessageCircle size={14} /> Ask CA on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Notice row ───────────────────────────────────────────────────────────
function NoticeRow({ notice, onClick }) {
  const cfg = URGENCY_CONFIG[notice.urgency] || URGENCY_CONFIG.regulatory;
  const portal = inferPortal(notice.title, notice.action);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-cs-100 border-l-4 ${cfg.color} rounded-xl px-5 py-4`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge} mr-2`}>
                {cfg.label}
              </span>
              {notice.source === "SENTINEL" && (
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </div>
          </div>
          <p className="font-semibold text-cs-900 text-sm mt-1.5 leading-snug">{notice.title}</p>
          <p className="text-cs-500 text-xs mt-1 leading-relaxed">{notice.message}</p>

          {/* Action row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => onClick(notice)}
              className="flex items-center gap-1.5 text-cs-700 bg-cs-50 border border-cs-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-cs-100 transition-colors"
            >
              <Sparkles size={11} /> ARIA Explains
            </button>
            {portal && (
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-cs-600 border border-cs-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-cs-50 transition-colors"
              >
                {notice.action || "Visit Portal"} <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Expert card ──────────────────────────────────────────────────────────
function ExpertCard({ expert }) {
  const [booked, setBooked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-cs-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-all"
    >
      {/* Top */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-cs-200 flex items-center justify-center font-bold text-cs-800 text-base flex-shrink-0">
          {expert.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-cs-900 text-sm leading-tight">{expert.name}</p>
            {expert.verified && <Shield size={12} className="text-cs-600" />}
          </div>
          <p className="text-cs-500 text-xs">{expert.role}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={10} className={s <= Math.round(expert.rating) ? "fill-amber-400 text-amber-400" : "text-cs-200"} />
            ))}
            <span className="text-cs-500 text-xs ml-0.5">{expert.rating}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {expert.tags.map((t) => (
          <span key={t} className="bg-cs-100 text-cs-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-cs-500">
        <span className="flex items-center gap-1"><Briefcase size={11} /> {expert.projects}+ projects</span>
        <span className="font-bold text-cs-900">{expert.price}</span>
      </div>

      {/* CTAs */}
      {booked ? (
        <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl py-2.5">
          <CheckCircle2 size={14} className="text-green-600" />
          <span className="text-green-700 text-xs font-bold">Request Sent!</span>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setBooked(true)}
            className="flex-1 bg-cs-900 text-cs-50 rounded-lg py-2 text-xs font-semibold hover:bg-cs-700 transition-colors"
          >
            Book Consultation
          </button>
          <a
            href={`https://wa.me/${expert.whatsapp}?text=Hi%20${encodeURIComponent(expert.name.split(" ")[0])}%2C%20I%20need%20help%20with%20${encodeURIComponent(expert.tags[0])}%20for%20my%20MSME.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center border border-cs-200 text-cs-600 rounded-lg px-2.5 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
          >
            <MessageCircle size={13} />
          </a>
          <a
            href={`tel:${expert.phone}`}
            className="flex items-center justify-center border border-cs-200 text-cs-600 rounded-lg px-2.5 hover:bg-cs-50 transition-colors"
          >
            <Phone size={13} />
          </a>
        </div>
      )}
    </motion.div>
  );
}

// ─── Groq system prompt for notices ──────────────────────────────────────
const NOTICE_SYSTEM = `You are SENTINEL, a compliance alert AI for Indian MSMEs.
Given a business profile, return ONLY a valid JSON array of 6 highly relevant compliance notices.
Each notice: { "id": "n1", "title": "...", "message": "...", "urgency": "urgent"|"medium"|"scheme"|"regulatory", "source": "SENTINEL", "action": "..." }
Make them specific to the business state, sector, registrations, and current compliance calendar.
urgent = overdue/immediate action. medium = upcoming deadline. scheme = opportunity/benefit. regulatory = new rule/update.
Return ONLY the raw JSON array. No markdown, no backticks.`;

const FALLBACK_NOTICES = (profile) => [
  { id: "f1", title: "GSTR-3B Filing Due", message: `File your GSTR-3B return before the 20th to avoid ₹50/day penalty. Applicable for ${profile.businessName || "your business"}.`, urgency: "urgent", source: "GST Portal", action: "File on GST Portal" },
  { id: "f2", title: "Udyam Registration Pending", message: "Register on udyamregistration.gov.in to unlock MSME subsidies, priority lending, and government scheme eligibility.", urgency: "medium", source: "MSME Portal", action: "Register Now" },
  { id: "f3", title: "PM MUDRA Loan — Apply Now", message: "Collateral-free loans up to ₹10 Lakh for MSMEs under Pradhan Mantri MUDRA Yojana. Low interest, fast approval.", urgency: "scheme", source: "MUDRA Portal", action: "Check Eligibility" },
  { id: "f4", title: "New GST Circular on ITC", message: "CBIC issued new guidelines on Input Tax Credit eligibility for businesses with mixed supply. Review your ITC claims.", urgency: "regulatory", source: "CBIC", action: "Read Circular" },
  { id: "f5", title: "ESI Registration Threshold", message: "If you have 10+ employees earning below ₹21,000/month, ESI registration is mandatory or attracts penalties.", urgency: "medium", source: "ESIC Portal", action: "Register on ESIC" },
  { id: "f6", title: "ZED Certification — ₹5L Subsidy", message: `MSMEs in ${profile.sector || "manufacturing"} can claim up to ₹5 Lakh reimbursement under Zero Defect Zero Effect certification.`, urgency: "scheme", source: "MSME Portal", action: "Apply for ZED" },
];

// ─── Main Page ────────────────────────────────────────────────────────────
const NOTICE_TABS = ["All", "Urgent", "Deadlines", "Schemes", "Regulatory"];

export default function NoticesPage() {
  const profile = getProfile();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [activePill, setActivePill] = useState("ALL");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [expertSearch, setExpertSearch] = useState("");

  async function fetchNotices() {
    if (!profile.businessName) {
      setNotices(FALLBACK_NOTICES(profile));
      return;
    }
    setLoading(true);
    try {
      const reply = await groqChat(
        [{ role: "user", content: `Business profile: ${JSON.stringify(profile)}. Generate 6 urgent compliance alerts personalised for this business.` }],
        NOTICE_SYSTEM,
        { maxTokens: 900, temperature: 0.4 }
      );
      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setNotices(parsed);
        setAiLoaded(true);
      }
    } catch {
      setNotices(FALLBACK_NOTICES(profile));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNotices(); }, []); // eslint-disable-line

  // Filter notices by tab
  const filteredNotices = useMemo(() => {
    if (activeTab === "All") return notices;
    if (activeTab === "Urgent") return notices.filter((n) => n.urgency === "urgent");
    if (activeTab === "Deadlines") return notices.filter((n) => n.urgency === "medium");
    if (activeTab === "Schemes") return notices.filter((n) => n.urgency === "scheme");
    if (activeTab === "Regulatory") return notices.filter((n) => n.urgency === "regulatory");
    return notices;
  }, [notices, activeTab]);

  // Filter experts
  const filteredExperts = useMemo(() => {
    return EXPERTS.filter((e) => {
      const matchPill = activePill === "ALL" || e.category === activePill;
      const matchSearch = !expertSearch || e.name.toLowerCase().includes(expertSearch.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(expertSearch.toLowerCase())) ||
        e.role.toLowerCase().includes(expertSearch.toLowerCase());
      return matchPill && matchSearch;
    });
  }, [activePill, expertSearch]);

  const urgentCount = notices.filter((n) => n.urgency === "urgent").length;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">

        {/* Notice detail modal */}
        <AnimatePresence>
          {selectedNotice && (
            <NoticeDetailModal
              notice={selectedNotice}
              profile={profile}
              onClose={() => setSelectedNotice(null)}
            />
          )}
        </AnimatePresence>

        {/* ── HEADING ── */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-cs-900 tracking-tight">Notices & Alerts</h1>
            <p className="text-cs-400 text-sm mt-1">
              {aiLoaded
                ? `${notices.length} alerts personalised for ${profile.businessName} · ${profile.state}`
                : "Stay updated on deadlines and regulations"}
              {urgentCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {urgentCount} urgent
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotices}
              disabled={loading}
              className="flex items-center gap-1.5 text-cs-500 hover:text-cs-800 disabled:opacity-40 text-xs font-semibold transition-colors"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              {aiLoaded ? "Refresh" : "Load AI Alerts"}
            </button>

            {/* Tab filter */}
            <div className="flex items-center bg-cs-800 rounded-full p-0.5 gap-0.5">
              {NOTICE_TABS.map((tab) => (
                <motion.button
                  key={tab}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === tab ? "bg-cs-50 text-cs-900" : "text-cs-300 hover:text-cs-50"
                    }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* AI badge */}
        {aiLoaded && (
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-full px-3 py-1">
              <Sparkles size={11} className="text-violet-600" />
              <span className="text-violet-700 text-xs font-bold">
                SENTINEL AI · Alerts generated for {profile.sector || "your sector"} in {profile.state || "India"}
              </span>
            </div>
          </div>
        )}

        {/* ── NOTICE LIST ── */}
        {loading ? (
          <div className="flex flex-col gap-3 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-cs-100 rounded-xl px-5 py-4 animate-pulse">
                <div className="h-3 bg-cs-100 rounded mb-2 w-24" />
                <div className="h-4 bg-cs-100 rounded mb-2 w-1/2" />
                <div className="h-3 bg-cs-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-12 text-cs-400 mb-12">
            <CheckCircle2 size={32} className="mx-auto mb-3 text-green-400" />
            <p className="font-semibold text-cs-700">No {activeTab.toLowerCase()} notices right now!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-14">
            <AnimatePresence>
              {filteredNotices.map((notice, idx) => (
                <motion.div key={notice.id || idx} transition={{ delay: idx * 0.04 }}>
                  <NoticeRow notice={notice} onClick={setSelectedNotice} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-4 mb-10">
          <span className="flex-1 h-px bg-cs-100" />
          <p className="text-cs-400 text-xs font-bold tracking-widest">NEED PROFESSIONAL HELP?</p>
          <span className="flex-1 h-px bg-cs-100" />
        </div>

        {/* ── EXPERT MARKETPLACE ── */}
        <div>
          <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-cs-900 tracking-tight">Connect with Experts</h2>
              <p className="text-cs-400 text-sm mt-1">Verified professionals for your business needs</p>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-400" />
              <input
                value={expertSearch}
                onChange={(e) => setExpertSearch(e.target.value)}
                placeholder="Search by skill or name…"
                className="border border-cs-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-cs-500 w-44"
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-6 mt-4">
            {EXPERT_PILLS.map((pill) => (
              <motion.button
                key={pill}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActivePill(pill)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-colors ${activePill === pill
                    ? "bg-cs-900 text-cs-50 border-cs-900"
                    : "bg-white text-cs-600 border-cs-200 hover:border-cs-400"
                  }`}
              >
                {pill}
              </motion.button>
            ))}
            <span className="ml-auto text-cs-400 text-xs self-center">
              {filteredExperts.length} expert{filteredExperts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredExperts.length === 0 ? (
            <div className="text-center py-10 text-cs-400">
              <p className="text-sm">No experts match your search.</p>
              <button onClick={() => { setActivePill("ALL"); setExpertSearch(""); }} className="mt-2 text-xs text-cs-600 underline">Reset</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {filteredExperts.map((expert) => (
                  <ExpertCard key={expert.id} expert={expert} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Footer dark />
    </DashboardLayout>
  );
}