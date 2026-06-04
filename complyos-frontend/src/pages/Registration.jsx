import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, CircleDot, FileText, Sparkles, RefreshCw,
  ExternalLink, Phone, MessageCircle, ChevronDown, ChevronUp,
  Clock, AlertCircle, CheckCircle2, X, PlayCircle, Loader2,
  ListChecks, ArrowRight, BookOpen, Youtube,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Footer } from "../components/layout/Footer";
import ProgressBar from "../components/ui/ProgressBar";
import { groqChat } from "../services/groqService";
import { getProfile } from "../utils/profileStore";

// ─── Real government portals ──────────────────────────────────────────────
const PORTAL_LINKS = {
  "GST Registration": "https://www.gst.gov.in/",
  "GSTR-3B": "https://www.gst.gov.in/",
  "GSTR-1": "https://www.gst.gov.in/",
  "Udyam Registration": "https://udyamregistration.gov.in/",
  "Udyog Aadhaar": "https://udyamregistration.gov.in/",
  "MSME / Udyog Aadhaar": "https://udyamregistration.gov.in/",
  "Shop & Establishment Act": "https://shramsuvidha.gov.in/",
  "Shops & Establishment": "https://shramsuvidha.gov.in/",
  "PAN Registration": "https://www.incometax.gov.in/iec/foportal/",
  "Income Tax": "https://www.incometax.gov.in/iec/foportal/",
  "Professional Tax": "https://www.mahagst.gov.in/",
  "PF / EPF Registration": "https://unifiedportal-emp.epfindia.gov.in/epfo/",
  "ESI Registration": "https://www.esic.in/",
  "FSSAI License": "https://foscos.fssai.gov.in/",
  "Trade License": "https://edistrict.gov.in/",
  "Import Export Code": "https://www.dgft.gov.in/",
  "DPIIT Startup Recognition": "https://www.startupindia.gov.in/",
  "MSME Sampark": "https://msmesampark.in/",
  "ZED Certification": "https://zed.msme.gov.in/",
  "TAN Registration": "https://www.incometax.gov.in/iec/foportal/",
  "Labour Contract": "https://shramsuvidha.gov.in/",
  "Factory License": "https://dipp.gov.in/",
  "Environmental NOC": "https://parivesh.nic.in/",
  "Drug License": "https://cdsco.gov.in/",
  "APEDA Registration": "https://www.apeda.gov.in/",
  "Startup India": "https://www.startupindia.gov.in/",
  "Digital Signature Certificate": "https://www.mca.gov.in/",
  "Company Registration": "https://www.mca.gov.in/",
  "LLP Registration": "https://www.mca.gov.in/",
};

// ─── YouTube video IDs for common registrations ───────────────────────────
const YOUTUBE_VIDEOS = {
  "GST Registration": { id: "J2XJFcmjc8s", title: "GST Registration Step by Step" },
  "GSTR-3B": { id: "1YVlQ-_FNrM", title: "How to File GSTR-3B" },
  "GSTR-1": { id: "8dzpEHFbR6s", title: "How to File GSTR-1" },
  "Udyam Registration": { id: "Ow8Z9X2oFaA", title: "Udyam Registration Process" },
  "PF / EPF Registration": { id: "yFJ3BQw6A9A", title: "EPF Registration for Employers" },
  "ESI Registration": { id: "CtbX8KFVZBU", title: "ESI Registration Complete Guide" },
  "FSSAI License": { id: "QX5y5Y5z5Yw", title: "FSSAI License Application" },
  "Import Export Code": { id: "Kl5eV5kZ5Zs", title: "IEC Registration Process" },
  "DPIIT Startup Recognition": { id: "5mJ2VGXg5Yc", title: "DPIIT Startup India Recognition" },
  "Shop & Establishment Act": { id: "9kM3VNXp5Ya", title: "Shop & Establishment Registration" },
  "PAN Registration": { id: "7kM3PNXp5Ya", title: "PAN Card for Business" },
  "TAN Registration": { id: "3kM3TNXp5Ya", title: "TAN Registration Guide" },
  "Professional Tax": { id: "1kM3PFXp5Ya", title: "Professional Tax Registration" },
  "Trade License": { id: "6kM3TLXp5Ya", title: "Trade License Application" },
};

function getPortalUrl(name, portalHint) {
  if (PORTAL_LINKS[name]) return PORTAL_LINKS[name];
  const key = Object.keys(PORTAL_LINKS).find(
    (k) =>
      name.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(name.toLowerCase())
  );
  if (key) return PORTAL_LINKS[key];
  if (portalHint?.toLowerCase().includes("gst")) return "https://www.gst.gov.in/";
  if (portalHint?.toLowerCase().includes("udyam")) return "https://udyamregistration.gov.in/";
  if (portalHint?.toLowerCase().includes("income tax")) return "https://www.incometax.gov.in/iec/foportal/";
  if (portalHint?.toLowerCase().includes("epfo") || portalHint?.toLowerCase().includes("pf")) return "https://unifiedportal-emp.epfindia.gov.in/epfo/";
  if (portalHint?.toLowerCase().includes("esic") || portalHint?.toLowerCase().includes("esi")) return "https://www.esic.in/";
  if (portalHint?.toLowerCase().includes("startup")) return "https://www.startupindia.gov.in/";
  return "https://services.india.gov.in/";
}

function getYoutubeVideo(name) {
  const exact = YOUTUBE_VIDEOS[name];
  if (exact) return exact;
  const key = Object.keys(YOUTUBE_VIDEOS).find(
    (k) =>
      name.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(name.toLowerCase())
  );
  return key ? YOUTUBE_VIDEOS[key] : null;
}

// ─── Cross-reference profile registrations to set status ─────────────────
function resolveStatus(regName, profileRegistrations = [], groqStatus) {
  const regs = profileRegistrations.map((r) => r.toLowerCase());
  const name = regName.toLowerCase();
  const isComplete = regs.some(
    (r) =>
      name.includes(r) || r.includes(name) ||
      (name.includes("gst") && r.includes("gst")) ||
      (name.includes("udyam") && (r.includes("udyam") || r.includes("msme"))) ||
      (name.includes("pan") && r.includes("pan")) ||
      (name.includes("epf") && r.includes("pf")) ||
      (name.includes("esi") && r.includes("esi")) ||
      (name.includes("shop") && r.includes("shop")) ||
      (name.includes("fssai") && r.includes("fssai")) ||
      (name.includes("iec") && (r.includes("iec") || r.includes("import"))) ||
      (name.includes("dpiit") && r.includes("dpiit"))
  );
  if (isComplete) return "Complete";
  return groqStatus || "Not Started";
}

// ─── AI system prompt for checklist ──────────────────────────────────────
const REG_SYSTEM = `You are a compliance expert for Indian MSMEs.
Given a business profile, return ONLY a JSON array of 7-12 applicable registrations/compliances.
Each item must be highly personalized to the business sector, state, turnover, employee count, and type.
Each item:
{
  "name": "<full official name>",
  "portal": "<official portal name e.g. GST Portal, Udyam Portal, EPFO Portal>",
  "portalUrl": "<actual URL of the official portal>",
  "status": "Complete" | "Pending" | "Not Started",
  "priority": "High" | "Medium" | "Low",
  "description": "<one sentence: what this registration does for THIS specific business>",
  "deadline": "<deadline if applicable, else null>",
  "estimatedTime": "<e.g. 2-3 working days, 7-10 working days>",
  "fees": "<government fee if applicable, else Free>"
}
Status rules: mark "Complete" only if clearly in profile registrations. "Pending" if started. "Not Started" otherwise.
Return ONLY the raw JSON array. No markdown, no backticks, no extra text.`;

// ─── AI system prompt for step-by-step guidance ───────────────────────────
const STEPS_SYSTEM = `You are a compliance expert for Indian MSMEs. 
Given a registration name and business profile, return ONLY a JSON object with step-by-step guidance.
{
  "steps": [
    {
      "stepNumber": 1,
      "title": "<short action title>",
      "description": "<detailed instruction specific to this business>",
      "documents": ["<document 1>", "<document 2>"],
      "tip": "<insider tip or common mistake to avoid>"
    }
  ],
  "totalTime": "<total estimated time>",
  "totalFees": "<total government fees>",
  "helpline": "<official helpline number if available>",
  "importantNotes": ["<note 1>", "<note 2>"]
}
Make steps very specific, actionable, and personalized to the business profile provided.
Return ONLY the raw JSON object. No markdown, no backticks.`;

// ─── Status config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Complete: {
    icon: BadgeCheck,
    color: "text-cs-700",
    bg: "bg-cs-50",
    border: "border-l-cs-500",
    badge: "bg-cs-100 text-cs-800",
    glow: "shadow-cs-100",
  },
  Pending: {
    icon: CircleDot,
    color: "text-cs-500",
    bg: "bg-cs-50",
    border: "border-l-cs-400",
    badge: "bg-cs-100 text-cs-700",
    glow: "shadow-cs-100",
  },
  "Not Started": {
    icon: FileText,
    color: "text-slate-400",
    bg: "bg-slate-50",
    border: "border-l-slate-300",
    badge: "bg-slate-100 text-slate-600",
    glow: "shadow-slate-100",
  },
};

const PRIORITY_CONFIG = {
  High: "bg-cs-50 text-cs-700 border border-cs-200",
  Medium: "bg-cs-50 text-cs-600 border border-cs-200",
  Low: "bg-slate-50 text-slate-500 border border-slate-200",
};

// ─── Step Guide Component ─────────────────────────────────────────────────
function StepGuide({ reg, profile }) {
  const [steps, setSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const video = getYoutubeVideo(reg.name);

  async function loadSteps() {
    setLoading(true);
    setError(null);
    try {
      const prompt = `Registration: "${reg.name}"
Business Profile: ${JSON.stringify({
        businessName: profile.businessName,
        sector: profile.sector || profile.industry,
        state: profile.state,
        turnover: profile.turnover || profile.annualTurnover,
        employees: profile.employees || profile.employeeCount,
        businessType: profile.businessType || profile.entityType,
        registrations: profile.registrations || [],
      })}
Generate specific step-by-step guidance for this exact business to complete "${reg.name}".`;

      const reply = await groqChat(
        [{ role: "user", content: prompt }],
        STEPS_SYSTEM,
        { maxTokens: 1200, temperature: 0.2 }
      );
      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setSteps(parsed);
    } catch (e) {
      setError("Could not load steps. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSteps();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Loader2 size={24} className="animate-spin text-cs-500" />
        <p className="text-sm text-slate-500">Generating personalised guidance…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-cs-400 text-sm mb-3">{error}</p>
        <button
          onClick={loadSteps}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-2 font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!steps) return null;

  return (
    <div className="space-y-5">
      {/* Meta info bar */}
      <div className="flex flex-wrap gap-3">
        {steps.totalTime && (
          <div className="flex items-center gap-1.5 bg-cs-50 border border-cs-100 rounded-full px-3 py-1.5">
            <Clock size={12} className="text-cs-500" />
            <span className="text-xs font-semibold text-cs-700">{steps.totalTime}</span>
          </div>
        )}
        {steps.totalFees && (
          <div className="flex items-center gap-1.5 bg-cs-50 border border-cs-100 rounded-full px-3 py-1.5">
            <BadgeCheck size={12} className="text-cs-500" />
            <span className="text-xs font-semibold text-cs-700">Fees: {steps.totalFees}</span>
          </div>
        )}
        {steps.helpline && (
          <div className="flex items-center gap-1.5 bg-cs-50 border border-cs-100 rounded-full px-3 py-1.5">
            <Phone size={12} className="text-cs-500" />
            <span className="text-xs font-semibold text-cs-700">Helpline: {steps.helpline}</span>
          </div>
        )}
      </div>

      {/* YouTube video */}
      {video && (
        <div className="rounded-xl overflow-hidden border border-slate-200">
          {showVideo ? (
            <iframe
              width="100%"
              height="220"
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            />
          ) : (
            <button
              onClick={() => setShowVideo(true)}
              className="w-full flex items-center gap-4 bg-gradient-to-r from-cs-50 to-cs-100 hover:from-red-100 hover:to-orange-100 transition-colors px-5 py-4 text-left"
            >
              <div className="w-10 h-10 bg-cs-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Youtube size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-cs-700 uppercase tracking-wide mb-0.5">Video Guide</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{video.title}</p>
              </div>
              <PlayCircle size={20} className="text-cs-400 flex-shrink-0" />
            </button>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {steps.steps?.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-4"
          >
            {/* Step number */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-cs-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {step.stepNumber || i + 1}
              </div>
              {i < (steps.steps.length - 1) && (
                <div className="w-px flex-1 bg-cs-100 mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm mb-1">{step.title}</p>
              <p className="text-slate-600 text-xs leading-relaxed mb-2">{step.description}</p>

              {/* Documents needed */}
              {step.documents?.length > 0 && (
                <div className="bg-cs-50 border border-cs-100 rounded-lg px-3 py-2 mb-2">
                  <p className="text-[10px] font-bold text-cs-600 uppercase tracking-wide mb-1.5">
                    Documents Needed
                  </p>
                  <ul className="space-y-0.5">
                    {step.documents.map((doc, di) => (
                      <li key={di} className="flex items-start gap-1.5">
                        <ArrowRight size={10} className="text-cs-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-cs-700">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tip */}
              {step.tip && (
                <div className="bg-cs-50 border border-cs-100 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-bold text-cs-600 uppercase tracking-wide mb-0.5">
                    💡 Pro Tip
                  </p>
                  <p className="text-xs text-cs-700">{step.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Important notes */}
      {steps.importantNotes?.length > 0 && (
        <div className="bg-cs-50 border border-cs-100 rounded-xl p-4">
          <p className="text-xs font-bold text-cs-700 uppercase tracking-wide mb-2">
            ⚠️ Important Notes
          </p>
          <ul className="space-y-1.5">
            {steps.importantNotes.map((note, ni) => (
              <li key={ni} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cs-400 mt-1.5 flex-shrink-0" />
                <span className="text-xs text-cs-700">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={getPortalUrl(reg.name, reg.portal)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-cs-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-cs-700 transition-colors shadow-lg shadow-cs-200"
        >
          {reg.status === "Complete" ? "Visit Portal" : reg.status === "Pending" ? "Continue on Portal" : "Start Registration"}
          <ExternalLink size={11} />
        </a>
        {reg.status !== "Complete" && (
          <a
            href={`https://wa.me/919810123456?text=Hi%2C%20I%20need%20help%20with%20${encodeURIComponent(reg.name)}%20for%20my%20MSME.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-cs-200 text-cs-700 bg-cs-50 rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-cs-100 transition-colors"
          >
            <MessageCircle size={11} /> Ask CA on WhatsApp
          </a>
        )}
        <button
          onClick={loadSteps}
          className="flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
          title="Regenerate steps"
        >
          <RefreshCw size={11} />
        </button>
      </div>
    </div>
  );
}

// ─── Single Registration Row ──────────────────────────────────────────────
function RegRow({ reg, idx, profile }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[reg.status] || STATUS_CONFIG["Not Started"];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.055, duration: 0.28 }}
      className={`bg-white border border-slate-100 border-l-4 ${cfg.border} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left"
      >
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={17} className={cfg.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-800 text-sm">{reg.name}</p>
            {reg.priority && (
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${PRIORITY_CONFIG[reg.priority] || PRIORITY_CONFIG.Low}`}>
                {reg.priority}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-slate-400 text-xs">{reg.portal}</p>
            {reg.estimatedTime && (
              <span className="text-slate-300 text-xs">·</span>
            )}
            {reg.estimatedTime && (
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <Clock size={9} /> {reg.estimatedTime}
              </p>
            )}
          </div>
          {reg.deadline && (
            <p className="text-cs-500 text-xs mt-0.5 flex items-center gap-1">
              <Clock size={9} /> Due: {reg.deadline}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
            {reg.status}
          </span>
          <div className={`text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
            <ChevronDown size={15} />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/60">
              {reg.description && (
                <p className="text-slate-600 text-sm mb-5 leading-relaxed border-l-2 border-cs-200 pl-3">
                  {reg.description}
                </p>
              )}
              <div className="flex items-center gap-2 mb-4">
                <ListChecks size={14} className="text-cs-600" />
                <p className="text-xs font-extrabold text-cs-700 uppercase tracking-widest">
                  AI Step-by-Step Guide
                </p>
                <div className="flex items-center gap-1 bg-cs-100 rounded-full px-2 py-0.5">
                  <Sparkles size={9} className="text-cs-500" />
                  <span className="text-[9px] font-bold text-cs-600">Personalised</span>
                </div>
              </div>
              <StepGuide reg={reg} profile={profile} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── CA Help Modal ────────────────────────────────────────────────────────
function CAHelpModal({ reg, onClose }) {
  if (!reg) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base">CA Assistance</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>
        <p className="text-slate-500 text-sm mb-1">Registration needed:</p>
        <p className="font-semibold text-slate-900 text-sm mb-5">{reg.name}</p>
        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/919810123456?text=Hi%20Rajesh%2C%20I%20need%20help%20with%20${encodeURIComponent(reg.name)}%20for%20my%20MSME.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-cs-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-cs-700 transition-colors"
          >
            <MessageCircle size={15} /> WhatsApp Rajesh Kumar, FCA
          </a>
          <a
            href="tel:+919810123456"
            className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-xl py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <Phone size={15} /> Call Now · +91-98101-23456
          </a>
          <a
            href={getPortalUrl(reg.name, reg.portal)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-xl py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <ExternalLink size={15} /> Open Official Portal
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function RegistrationPage() {
  const profile = getProfile();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [caHelpReg, setCaHelpReg] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  async function fetchRegistrations() {
    setLoading(true);
    try {
      const prompt = `Business profile: ${JSON.stringify(profile)}.
Generate a highly personalised compliance registration checklist for this specific business.
Consider: sector="${profile.sector || profile.industry}", state="${profile.state}", turnover="${profile.turnover || profile.annualTurnover}", employees="${profile.employees || profile.employeeCount}", entity type="${profile.businessType || profile.entityType}".
Mark as Complete only registrations present in: ${JSON.stringify(profile.registrations || [])}.
Be very specific — include state-specific registrations, sector-specific licenses, and size-appropriate compliances.`;

      const reply = await groqChat(
        [{ role: "user", content: prompt }],
        REG_SYSTEM,
        { maxTokens: 1200, temperature: 0.2 }
      );
      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const resolved = parsed.map((item) => ({
          ...item,
          status: resolveStatus(item.name, profile.registrations, item.status),
        }));
        setItems(resolved);
        setAiLoaded(true);
      }
    } catch {
      setItems(buildFallback(profile));
    } finally {
      setLoading(false);
    }
  }

  function buildFallback(profile) {
    const regs = profile.registrations || [];
    const has = (r) => regs.some((x) => x.toLowerCase().includes(r));
    return [
      { name: "GST Registration", portal: "GST Portal", portalUrl: "https://www.gst.gov.in/", status: has("gst") ? "Complete" : "Not Started", priority: "High", description: "Mandatory for turnover above ₹40L. Enables ITC claims and govt scheme eligibility.", estimatedTime: "2-3 working days", fees: "Free" },
      { name: "Udyam Registration", portal: "Udyam Portal", portalUrl: "https://udyamregistration.gov.in/", status: has("udyam") ? "Complete" : "Not Started", priority: "High", description: "Official MSME recognition. Required for all central govt subsidies and priority lending.", estimatedTime: "Same day", fees: "Free" },
      { name: "PAN Registration", portal: "Income Tax Portal", portalUrl: "https://www.incometax.gov.in/iec/foportal/", status: "Complete", priority: "High", description: "Mandatory for all businesses. Required for banking, taxation, and govt transactions.", estimatedTime: "7-10 working days", fees: "₹107" },
      { name: "Shop & Establishment Act", portal: "State Labour Dept", portalUrl: "https://shramsuvidha.gov.in/", status: has("shop") ? "Complete" : "Not Started", priority: "Medium", description: "State-level registration required for all commercial establishments within 30 days of opening.", estimatedTime: "3-5 working days", fees: "Varies by state" },
      { name: "PF / EPF Registration", portal: "EPFO Portal", portalUrl: "https://unifiedportal-emp.epfindia.gov.in/epfo/", status: has("pf") ? "Complete" : "Not Started", priority: "Medium", description: "Mandatory if you have 20+ employees. Provides retirement savings for your workforce.", estimatedTime: "5-7 working days", fees: "Free" },
      { name: "ESI Registration", portal: "ESIC Portal", portalUrl: "https://www.esic.in/", status: has("esi") ? "Complete" : "Not Started", priority: "Medium", description: "Mandatory if 10+ employees earn below ₹21,000/month. Covers health insurance.", estimatedTime: "3-5 working days", fees: "Free" },
      { name: "Professional Tax", portal: "State Tax Dept", portalUrl: "https://www.mahagst.gov.in/", status: has("professional") ? "Complete" : "Not Started", priority: "Low", description: "State-level tax on professional income. Varies by state.", estimatedTime: "2-3 working days", fees: "Varies by state" },
      { name: "TAN Registration", portal: "Income Tax Portal", portalUrl: "https://www.incometax.gov.in/iec/foportal/", status: has("tan") ? "Complete" : "Not Started", priority: "Medium", description: "Required if you deduct TDS. Needed before filing TDS returns.", estimatedTime: "7-10 working days", fees: "₹65" },
    ].map((item) => ({ ...item, deadline: null }));
  }

  useEffect(() => {
    if (profile.businessName) {
      fetchRegistrations();
    } else {
      setItems(buildFallback(profile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stats ──────────────────────────────────────────────────────────────
  const completed = items.filter((r) => r.status === "Complete").length;
  const pending = items.filter((r) => r.status === "Pending").length;
  const notStarted = items.filter((r) => r.status === "Not Started").length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;
  const highPriority = items.filter((r) => r.priority === "High" && r.status !== "Complete").length;

  // ── Filter ─────────────────────────────────────────────────────────────
  const FILTERS = ["All", "Complete", "Pending", "Not Started", "High Priority"];
  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return items;
    if (activeFilter === "High Priority") return items.filter((r) => r.priority === "High");
    return items.filter((r) => r.status === activeFilter);
  }, [items, activeFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* CA Help Modal */}
        <AnimatePresence>
          {caHelpReg && <CAHelpModal reg={caHelpReg} onClose={() => setCaHelpReg(null)} />}
        </AnimatePresence>

        {/* ── HEADER ── */}
        <div className="mb-8">
          <p className="text-xs font-extrabold tracking-widest text-slate-400 uppercase mb-2">
            Registration Status
          </p>

          {/* AI personalisation badge */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-cs-50 border border-cs-200 rounded-full px-3 py-1">
              <Sparkles size={11} className="text-cs-600" />
              <span className="text-cs-700 text-xs font-bold">
                {loading
                  ? "Personalising your checklist…"
                  : aiLoaded
                    ? `AI-personalised for ${profile.businessName} · ${profile.state || ""}`
                    : `${items.length} registrations · ${profile.state || "India"}`}
              </span>
            </div>
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="text-slate-400 hover:text-slate-700 disabled:opacity-40 transition-colors"
              title="Refresh checklist"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Compliance Hub
              </h1>
              {profile.businessName && (
                <p className="text-slate-400 text-sm mt-0.5">
                  {profile.businessName}
                  {profile.sector && ` · ${profile.sector}`}
                  {profile.state && ` · ${profile.state}`}
                </p>
              )}
            </div>
            <span className="text-slate-500 text-sm font-bold tabular-nums">
              {completed}/{items.length} complete
            </span>
          </div>
          <ProgressBar value={pct} size="md" animated />
        </div>

        {/* ── STAT PILLS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Complete", value: completed, icon: <CheckCircle2 size={15} className="text-cs-700" />, color: "bg-cs-50 border-cs-100", text: "text-cs-700" },
            { label: "Pending", value: pending, icon: <CircleDot size={15} className="text-cs-500" />, color: "bg-cs-50 border-cs-100", text: "text-cs-700" },
            { label: "Not Started", value: notStarted, icon: <FileText size={15} className="text-slate-500" />, color: "bg-slate-50 border-slate-100", text: "text-slate-600" },
            { label: "High Priority", value: highPriority, icon: <AlertCircle size={15} className="text-cs-500" />, color: "bg-cs-50 border-cs-100", text: "text-cs-700" },
          ].map(({ label, value, icon, color, text }) => (
            <div key={label} className={`border rounded-2xl p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className={`text-xs font-bold ${text}`}>{label}</span>
              </div>
              <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── ALERT for high priority ── */}
        {highPriority > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-cs-50 border border-cs-100 rounded-2xl px-5 py-4 mb-6"
          >
            <AlertCircle size={18} className="text-cs-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-cs-800 font-bold text-sm">
                {highPriority} high-priority registration{highPriority > 1 ? "s" : ""} pending
              </p>
              <p className="text-cs-700 text-xs mt-0.5">
                Non-compliance may result in penalties. Complete these first.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── AI Guide callout ── */}
        <div className="flex items-start gap-3 bg-cs-50 border border-cs-100 rounded-2xl px-5 py-4 mb-7">
          <BookOpen size={16} className="text-cs-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-cs-800 font-bold text-sm">
              Click any registration to get personalised step-by-step guidance
            </p>
            <p className="text-cs-600 text-xs mt-0.5">
              AI-generated steps, documents checklist, video tutorials, and CA support — all tailored to your business.
            </p>
          </div>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${activeFilter === f
                  ? "bg-cs-600 text-white border-cs-600 shadow-lg shadow-cs-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-cs-300 hover:text-cs-600"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── LOADING skeleton ── */}
        {loading && items.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-2 bg-slate-100 rounded w-1/4" />
                  </div>
                  <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST ── */}
        {!loading || items.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredItems.map((reg, i) => (
                <RegRow
                  key={reg.name}
                  reg={reg}
                  idx={i}
                  profile={profile}
                />
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <FileText size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No registrations in this category</p>
              </div>
            )}
          </div>
        ) : null}

        {/* ── Footer summary ── */}
        {!loading && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 border border-slate-100 bg-white rounded-2xl p-6 text-center"
          >
            <p className="text-slate-500 text-sm">
              Need help with multiple registrations?
            </p>
            <p className="text-slate-800 font-bold text-base mt-1 mb-4">
              Get a CA to handle everything in one go
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/919810123456?text=Hi%2C%20I%20need%20help%20with%20my%20MSME%20compliance%20registrations."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-cs-600 text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-cs-700 transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp a CA
              </a>
              <a
                href="tel:+919810123456"
                className="flex items-center gap-2 border border-slate-200 text-slate-700 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                <Phone size={14} /> Call Now
              </a>
            </div>
          </motion.div>
        )}

        <Footer />
      </div>
    </DashboardLayout>
  );
}