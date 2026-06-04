import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge, FileCheck2, Wand2, Users, Bell, X,
  Store, Building2, User, ChevronRight, ArrowLeft,
  Landmark, ShieldCheck, Sparkles,
} from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Common";
import { setToken, setRole, setUserId } from "../utils/helpers";

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const FEATURES = [
  { icon: Gauge, title: "Real-time Monitoring", desc: "Continuous oversight of your entire regulatory landscape — GST, labour, MCA, all in one feed." },
  { icon: FileCheck2, title: "Audit Readiness", desc: "Stay 100% prepared with automated document gathering and a full filing history log." },
  { icon: Wand2, title: "Multi-scheme Support", desc: "GST, MSME, Udyam, labour codes, credit subsidies, and state schemes — all matched to your profile." },
  { icon: Users, title: "Expert Connect", desc: "On-demand CA and compliance experts who see your full profile — no re-explaining needed." },
  { icon: Bell, title: "Automated Alerts", desc: "Smart notifications that surface only what's critical, before it becomes a penalty." },
  { icon: ShieldCheck, title: "Compliance Vault", desc: "Every document, filing, and approval — encrypted, timestamped, and audit-exportable." },
];

const BUSINESS_PRICING = [
  {
    name: "FREE",
    price: "₹0",
    period: "",
    badge: null,
    items: ["ARIA onboarding", "3 scheme recommendations", "Compliance calendar view", "Registration Hub access"],
    cta: "Start Free",
    variant: "outline",
    featured: false,
  },
  {
    name: "GROWTH",
    price: "₹249",
    period: "/month",
    badge: "MOST POPULAR",
    items: [
      "Everything in Free — zero ads",
      "VEDA — unlimited document uploads",
      "SCOUT — full scheme matching + form pre-fill",
      "Deadline alerts via WhatsApp & email",
      "PATHWAY smart scheduling",
      "SENTINEL regulation alerts",
      "1 CA consultation/month included",
      "Compliance Vault — 3 year storage",
      "20% discount for women-led enterprises",
    ],
    cta: "Upgrade Now",
    variant: "primary",
    featured: true,
  },
  {
    name: "PRO",
    price: "₹649",
    period: "/month",
    badge: null,
    items: [
      "Everything in Growth",
      "Multi-business profile management",
      "Priority PATHWAY scheduling",
      "Compliance Vault — 7 year + audit export",
      "Dedicated account manager",
      "API access for accountants",
      "30% discount for women-led enterprises",
    ],
    cta: "Go Pro",
    variant: "outline",
    featured: false,
  },
];

const CA_PRICING = [
  {
    name: "CA LITE",
    price: "₹749",
    period: "/month",
    badge: null,
    items: [
      "Manage up to 10 client profiles",
      "Shared compliance calendar per client",
      "Approve/reject scheme applications",
      "Annotate documents and flag issues",
      "14-day free trial",
    ],
    cta: "Start Free Trial",
    variant: "outline",
    featured: false,
  },
  {
    name: "CA PRO",
    price: "₹1,599",
    period: "/month",
    badge: "MOST POPULAR",
    items: [
      "Unlimited client profiles",
      "Priority consultation scheduling",
      "Full API access for your own tools",
      "Verified CA badge on directory listing",
      "Revenue dashboard — track your earnings",
      "White-label client reports",
    ],
    cta: "Get CA Pro",
    variant: "primary",
    featured: true,
  },
];

/* ─────────────────────────────────────────────
   DEMO LOGIN CONFIGS
───────────────────────────────────────────── */
const DEMO_USERS = {
  msme: { token: "demo-msme-token", role: "msme_owner", userId: "demo-msme", path: "/dashboard" },
  enterprise: { token: "demo-enterprise-token", role: "enterprise", userId: "demo-enterprise", path: "/dashboard" },
  individual: { token: "demo-individual-token", role: "individual", userId: "demo-individual", path: "/dashboard" },
  ca: { token: "demo-ca-token", role: "ca", userId: "demo-ca", path: "/ca-dashboard" },
};

const BUSINESS_TYPES = [
  {
    key: "msme",
    icon: Store,
    label: "MSME Owner",
    sub: "Shopkeeper, manufacturer, or service provider",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "enterprise",
    icon: Building2,
    label: "Enterprise",
    sub: "Multi-entity business or corporate group",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "individual",
    icon: User,
    label: "Individual / Freelancer",
    sub: "Solo professional or gig worker",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

/* ─────────────────────────────────────────────
   LOGIN MODAL
───────────────────────────────────────────── */
function LoginModal({ onClose, initialFlow }) {
  const navigate = useNavigate();
  // flow: "choose" | "ca" | "business_type" | "business_login"
  const [flow, setFlow] = useState(initialFlow || "choose");
  const [bizType, setBizType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function demoLogin(key) {
    const u = DEMO_USERS[key];
    setToken(u.token);
    setRole(u.role);
    setUserId(u.userId);
    onClose();
    navigate(u.path);
  }

  const slide = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.22 } };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,15,25,0.72)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="flex items-center gap-2">
            {flow !== "choose" && (
              <button
                onClick={() => flow === "business_login" ? setFlow("business_type") : setFlow("choose")}
                className="text-cs-400 hover:text-cs-700 mr-1"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <span className="font-bold text-cs-900 text-base">
              {flow === "choose" && "Welcome back"}
              {flow === "ca" && "CA Login"}
              {flow === "business_type" && "I am a…"}
              {flow === "business_login" && BUSINESS_TYPES.find(b => b.key === bizType)?.label}
            </span>
          </div>
          <button onClick={onClose} className="text-cs-400 hover:text-cs-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Choose role */}
            {flow === "choose" && (
              <motion.div key="choose" {...slide} className="flex flex-col gap-3">
                <p className="text-cs-500 text-sm mb-1">Who are you logging in as?</p>
                <button
                  onClick={() => setFlow("business_type")}
                  className="flex items-center justify-between border border-cs-100 rounded-xl px-4 py-3.5 hover:border-cs-400 hover:bg-cs-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cs-100 flex items-center justify-center text-cs-600">
                      <Store size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-cs-900 text-sm">Business Owner</p>
                      <p className="text-cs-400 text-xs">MSME, enterprise, or individual</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-cs-300 group-hover:text-cs-600 transition-colors" />
                </button>

                <button
                  onClick={() => setFlow("ca")}
                  className="flex items-center justify-between border border-cs-100 rounded-xl px-4 py-3.5 hover:border-cs-400 hover:bg-cs-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                      <Landmark size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-cs-900 text-sm">Chartered Accountant</p>
                      <p className="text-cs-400 text-xs">Manage clients and filings</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-cs-300 group-hover:text-cs-600 transition-colors" />
                </button>

                <div className="mt-2 pt-4 border-t border-cs-100 text-center text-xs text-cs-400">
                  New here?{" "}
                  <button
                    className="text-cs-700 font-semibold hover:underline"
                    onClick={() => { onClose(); navigate("/onboarding"); }}
                  >
                    Create an account →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1 — CA Login */}
            {flow === "ca" && (
              <motion.div key="ca" {...slide} className="flex flex-col gap-4">
                <p className="text-cs-500 text-sm">Enter your registered CA credentials.</p>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Email or Phone</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <Button variant="primary" size="md" className="w-full">Log In</Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cs-100" /></div>
                  <div className="relative flex justify-center text-xs text-cs-400 bg-white px-2">or</div>
                </div>
                <button
                  onClick={() => demoLogin("ca")}
                  className="w-full border border-dashed border-cs-300 rounded-lg py-2.5 text-sm font-semibold text-cs-600 hover:bg-cs-50 transition flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> Try CA Demo Account
                </button>
                <p className="text-center text-xs text-cs-400">
                  Not a CA yet?{" "}
                  <button className="text-cs-700 font-semibold hover:underline" onClick={() => { onClose(); navigate("/ca-onboarding"); }}>
                    Register your practice →
                  </button>
                </p>
              </motion.div>
            )}

            {/* STEP 1 — Business type picker */}
            {flow === "business_type" && (
              <motion.div key="btype" {...slide} className="flex flex-col gap-3">
                <p className="text-cs-500 text-sm mb-1">Select the type that fits your business.</p>
                {BUSINESS_TYPES.map((bt) => (
                  <button
                    key={bt.key}
                    onClick={() => { setBizType(bt.key); setFlow("business_login"); }}
                    className="flex items-center justify-between border border-cs-100 rounded-xl px-4 py-3.5 hover:border-cs-400 hover:bg-cs-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bt.bg} ${bt.color}`}>
                        <bt.icon size={18} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-cs-900 text-sm">{bt.label}</p>
                        <p className="text-cs-400 text-xs">{bt.sub}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-cs-300 group-hover:text-cs-600 transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* STEP 2 — Business login form */}
            {flow === "business_login" && bizType && (
              <motion.div key="blogin" {...slide} className="flex flex-col gap-4">
                <p className="text-cs-500 text-sm">
                  Log in to your {BUSINESS_TYPES.find(b => b.key === bizType)?.label} account.
                </p>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Mobile Number or Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <Button variant="primary" size="md" className="w-full">Log In</Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cs-100" /></div>
                  <div className="relative flex justify-center text-xs text-cs-400 bg-white px-2">or skip login</div>
                </div>
                <button
                  onClick={() => demoLogin(bizType)}
                  className="w-full border border-dashed border-cs-300 rounded-lg py-2.5 text-sm font-semibold text-cs-600 hover:bg-cs-50 transition flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  Try {BUSINESS_TYPES.find(b => b.key === bizType)?.label} Demo
                </button>
                <p className="text-center text-xs text-cs-400">
                  No account?{" "}
                  <button
                    className="text-cs-700 font-semibold hover:underline"
                    onClick={() => { onClose(); navigate("/onboarding"); }}
                  >
                    Register with ARIA →
                  </button>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PRICING SECTION
───────────────────────────────────────────── */
function PricingSection({ viewAs, navigate }) {
  const plans = viewAs === "ca" ? CA_PRICING : BUSINESS_PRICING;

  return (
    <section className="py-20 px-6 bg-cs-50">
      <div className="text-center mb-4">
        <p className="text-xs font-bold tracking-widest text-cs-500 uppercase mb-2">Pricing</p>
        <h2 className="text-3xl font-bold text-cs-900 mb-3">Predictable scale.</h2>
        <p className="text-cs-400 text-sm max-w-md mx-auto">
          {viewAs === "ca"
            ? "One flat fee for your practice. No per-client charges."
            : "Start free. Upgrade when you need more power."}
        </p>
      </div>

      {/* Women-led callout for business */}
      {viewAs !== "ca" && (
        <div className="max-w-4xl mx-auto mb-8 bg-pink-50 border border-pink-100 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <span className="text-lg">🌸</span>
          <p className="text-sm text-pink-800">
            <span className="font-semibold">Women-led enterprises</span> get 20% off Growth and 30% off Pro — automatically applied at checkout.
          </p>
        </div>
      )}

      <div className={`max-w-4xl mx-auto grid grid-cols-1 ${plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.18 }}
            className={`bg-white border rounded-2xl p-6 relative flex flex-col ${plan.featured ? "border-cs-800 shadow-lg" : "border-cs-100"
              }`}
          >
            {plan.badge && (
              <span className="absolute top-0 right-0 bg-cs-900 text-cs-50 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                {plan.badge}
              </span>
            )}
            <p className="text-xs font-bold text-cs-500 tracking-widest mb-1">{plan.name}</p>
            <div className="flex items-end gap-1 mb-5">
              <span className="text-4xl font-extrabold text-cs-900 tracking-tight leading-none">{plan.price}</span>
              {plan.period && <span className="text-sm font-normal text-cs-500 pb-1">{plan.period}</span>}
            </div>
            <ul className="text-cs-600 text-sm space-y-2 mb-6 flex-1">
              {plan.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              variant={plan.featured ? "primary" : "outline"}
              size="md"
              className="w-full"
              onClick={() => navigate("/onboarding")}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING COMPONENT
───────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const [viewAs, setViewAs] = useState("business"); // "business" | "ca"
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFlow, setModalFlow] = useState("choose"); // pre-select flow

  // Typewriter effect state
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["compliance roadmap.", "GST filings.", "tax deadlines.", "statutory audits."];

  useEffect(() => {
    const currentWord = words[textIndex];
    let timeoutId;
    
    if (isDeleting) {
      if (charIndex > 0) {
        timeoutId = setTimeout(() => setCharIndex(c => c - 1), 40);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      if (charIndex < currentWord.length) {
        timeoutId = setTimeout(() => setCharIndex(c => c + 1), 80);
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), 2500);
      }
    }
    
    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, textIndex]);

  const currentTypingText = words[textIndex].substring(0, charIndex);

  function openModal(flow = "choose") {
    setModalFlow(flow);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-cs-50">
      {/* ── NAV ── */}
      <nav className="h-14 bg-white border-b border-cs-100 flex items-center justify-between px-8 sticky top-0 z-40">
        <span className="font-extrabold text-cs-900 text-lg tracking-tight">ComplianceOS</span>

        <div className="hidden md:flex items-center gap-8 text-cs-500 text-sm font-medium">
          <a className="hover:text-cs-900 cursor-pointer">Features</a>
          <a className="hover:text-cs-900 cursor-pointer">How it Works</a>
          <a className="hover:text-cs-900 cursor-pointer">Pricing</a>

          {/* Role toggle pill */}
          <div className="flex items-center bg-cs-100 rounded-full p-0.5 text-xs font-bold gap-0">
            <button
              onClick={() => setViewAs("business")}
              className={`px-3 py-1.5 rounded-full transition-all ${viewAs === "business" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"
                }`}
            >
              Business
            </button>
            <button
              onClick={() => setViewAs("ca")}
              className={`px-3 py-1.5 rounded-full transition-all ${viewAs === "ca" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"
                }`}
            >
              I'm a CA
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal(viewAs === "ca" ? "ca" : "choose")}
            className="text-cs-600 text-sm font-semibold hover:text-cs-900 transition-colors"
          >
            Log In
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => viewAs === "ca" ? openModal("ca") : navigate("/onboarding")}
          >
            {viewAs === "ca" ? "CA Sign Up" : "Get Started"}
          </Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-slate-950 text-cs-50 text-center px-6 min-h-[85vh] py-32 md:py-48 flex flex-col justify-center relative overflow-hidden">
        {/* Dark background gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black opacity-80 z-0" />
        
        {/* The SVG Network Background */}
        <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-none" preserveAspectRatio="none">
          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Central AI Chip */}
          <g filter="url(#neon-glow)">
            <rect x="450" y="250" width="100" height="100" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(147, 197, 253, 0.6)" strokeWidth="2" />
            <rect x="470" y="270" width="60" height="60" rx="4" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            <circle cx="500" cy="300" r="15" fill="rgba(255, 255, 255, 0.8)" />
            {/* Chip pins */}
            <path d="M 440 270 H 450 M 440 290 H 450 M 440 310 H 450 M 440 330 H 450" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M 550 270 H 560 M 550 290 H 560 M 550 310 H 560 M 550 330 H 560" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M 470 240 V 250 M 490 240 V 250 M 510 240 V 250 M 530 240 V 250" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M 470 350 V 360 M 490 350 V 360 M 510 350 V 360 M 530 350 V 360" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
          </g>

          {/* Glowing Orthogonal Wires */}
          <motion.path
            d="M -50 150 H 200 V 270 H 440"
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M -50 450 H 300 V 330 H 440"
            fill="none"
            stroke="rgba(147, 197, 253, 0.5)"
            strokeWidth="2.5"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M 560 270 H 700 V 150 H 1050"
            fill="none"
            stroke="rgba(196, 181, 253, 0.4)"
            strokeWidth="1.5"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut", delay: 1, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M 560 330 H 800 V 450 H 1050"
            fill="none"
            stroke="rgba(147, 197, 253, 0.5)"
            strokeWidth="2"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.2, ease: "easeInOut", delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M -50 50 H 400 V 100 H 600 V 50 H 1050"
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 5, ease: "easeInOut", delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M -50 550 H 350 V 500 H 650 V 550 H 1050"
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4.5, ease: "easeInOut", delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* End Dots (Shining nodes) */}
          <motion.path
            d="M -50 220 H 150 V 100 H 250"
            fill="none"
            stroke="rgba(196, 181, 253, 0.5)"
            strokeWidth="2"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M 1050 380 H 900 V 500 H 800"
            fill="none"
            stroke="rgba(147, 197, 253, 0.4)"
            strokeWidth="2"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.8, ease: "easeInOut", delay: 0.9, repeat: Infinity, repeatType: "reverse" }}
          />

          {[
            { cx: 250, cy: 100, delay: 0.4 },
            { cx: 800, cy: 500, delay: 0.9 },
            { cx: 400, cy: 100, delay: 1.5 },
            { cx: 600, cy: 50, delay: 1.5 },
            { cx: 350, cy: 500, delay: 0.2 },
            { cx: 650, cy: 550, delay: 0.2 },
          ].map((node, i) => (
            <motion.circle
              key={`endnode-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="6"
              fill="#ffffff"
              filter="url(#neon-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
              transition={{ duration: 2, delay: node.delay, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}

          {/* Traveling particles along the wires */}
          {[
            { cx: 200, cy: 270, delay: 1 },
            { cx: 300, cy: 330, delay: 2 },
            { cx: 700, cy: 150, delay: 1.2 },
            { cx: 800, cy: 450, delay: 2.2 },
          ].map((dot, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r="3"
              fill="rgba(255, 255, 255, 0.9)"
              filter="url(#neon-glow)"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5] }}
              transition={{ duration: 1.5, delay: dot.delay, repeat: Infinity }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
          <motion.div
            key={viewAs}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {viewAs === "ca" ? (
              <>
                <span className="inline-block bg-violet-900/60 text-violet-200 text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-6 uppercase border border-violet-700">
                  For Chartered Accountants
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mx-auto max-w-4xl mb-6">
                  One dashboard.<br className="hidden md:block" /> Every client sorted.
                </h1>
                <p className="text-cs-300 text-lg max-w-xl mx-auto mb-10">
                  See compliance calendars, approve filings, and catch deadlines across all your clients — without a single spreadsheet.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" size="lg" onClick={() => openModal("ca")}>
                    Start 14-Day Free Trial
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="!border-cs-600 !text-cs-200 hover:!bg-cs-800"
                    onClick={() => { setToken(DEMO_USERS.ca.token); setRole(DEMO_USERS.ca.role); setUserId(DEMO_USERS.ca.userId); navigate("/ca-dashboard"); }}
                  >
                    View CA Demo
                  </Button>
                </div>
              </>
            ) : (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mx-auto max-w-5xl mb-6"
                >
                  Automate your<br className="hidden md:block" /> {currentTypingText}
                  <span className="inline-block w-[4px] h-[1em] bg-cs-50 ml-1 -mb-1 animate-pulse"></span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="text-cs-300 text-lg max-w-xl mx-auto mb-10"
                >
                  One app for GST, Udyam, schemes, loans, and every deadline — built for India's 6 crore small businesses.
                </motion.p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button variant="secondary" size="lg" onClick={() => navigate("/onboarding")}>
                    Get Started Free
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="!border-cs-600 !text-cs-200 hover:!bg-cs-800"
                    onClick={() => openModal("business_type")}
                  >
                    Try a Demo
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </section>

      {/* ── ROLE PICKER (mobile-friendly banner) ── */}
      <section className="bg-white border-b border-cs-100 py-4 px-6 flex items-center justify-center gap-3 md:hidden">
        <span className="text-cs-500 text-sm font-medium">I am a</span>
        <div className="flex items-center bg-cs-100 rounded-full p-0.5 text-xs font-bold">
          <button
            onClick={() => setViewAs("business")}
            className={`px-4 py-1.5 rounded-full transition-all ${viewAs === "business" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"}`}
          >
            Business
          </button>
          <button
            onClick={() => setViewAs("ca")}
            className={`px-4 py-1.5 rounded-full transition-all ${viewAs === "ca" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"}`}
          >
            CA
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-20 px-6 flex justify-center gap-8 md:gap-16 flex-wrap relative z-20 -mt-10">
        {viewAs === "ca"
          ? [["3,000+", "CAs on platform"], ["₹4.2Cr+", "Client penalties avoided"], ["14-day", "Free trial, no card"]].map(([n, l], idx) => (
            <motion.div 
              key={n} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="text-center bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:border-cs-200 transition-all cursor-default w-72 bg-opacity-80 backdrop-blur-md"
            >
              <motion.p 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 + (idx * 0.1) }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cs-900 to-cs-600 mb-2"
              >
                {n}
              </motion.p>
              <p className="text-cs-500 font-medium">{l}</p>
            </motion.div>
          ))
          : [["6.3 Cr", "MSMEs — our target"], ["128+", "Compliances covered"], ["₹43,000", "Avg savings per user/year"]].map(([n, l], idx) => (
            <motion.div 
              key={n} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="text-center bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:border-cs-200 transition-all cursor-default w-72 bg-opacity-80 backdrop-blur-md"
            >
              <motion.p 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 + (idx * 0.1) }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cs-900 to-cs-600 mb-2"
              >
                {n}
              </motion.p>
              <p className="text-cs-500 font-medium">{l}</p>
            </motion.div>
          ))
        }
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 px-6 bg-slate-50 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0 opacity-50"></div>
        <div className="absolute left-0 right-0 top-10 -z-0 m-auto h-[300px] w-[300px] rounded-full bg-cs-400/20 blur-[80px]"></div>

        {/* Badge */}
        <div className="relative z-10 flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cs-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cs-600"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">Core Capabilities</span>
          </motion.div>
        </div>

        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-16 tracking-tight max-w-3xl mx-auto"
        >
          Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cs-600 to-indigo-500">precision.</span>
        </motion.h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left relative z-10">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-cs-300 transition-all cursor-pointer"
            >
              {/* Anime Flash Shiny Effect */}
              <div className="absolute inset-0 -translate-x-[150%] w-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent opacity-90 z-10 pointer-events-none skew-x-[-25deg]" />
              
              {/* Content */}
              <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-cs-500 mb-4 group-hover:bg-cs-900 group-hover:text-white transition-colors duration-300 relative z-20 shadow-sm">
                <f.icon size={20} />
              </div>
              <h3 className="font-bold text-cs-900 text-base mb-2 relative z-20 group-hover:text-cs-700 transition-colors">{f.title}</h3>
              <p className="text-cs-500 text-sm leading-relaxed relative z-20">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 px-6 bg-white text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0 opacity-50"></div>
        <div className="absolute left-0 right-0 top-20 -z-0 m-auto h-[250px] w-[400px] rounded-full bg-cs-400/10 blur-[80px]"></div>

        {/* Badge */}
        <div className="relative z-10 flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cs-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cs-600"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">
              {viewAs === "ca" ? "For CAs" : "Your Journey"}
            </span>
          </motion.div>
        </div>

        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight max-w-3xl mx-auto"
        >
          {viewAs === "ca" ? "How CAs use " : "The "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cs-600 to-indigo-500">
            {viewAs === "ca" ? "ComplianceOS" : "Implementation Path"}
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-cs-500 text-lg mb-24 relative z-10"
        >
          {viewAs === "ca" ? "Three steps to managing all your clients in one place." : "Three steps to operational mastery."}
        </motion.p>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Connecting dotted line for md/lg screens */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[3px] bg-[linear-gradient(to_right,#cbd5e1_50%,transparent_50%)] bg-[size:16px_3px] opacity-70 z-0"></div>
          {/* Connecting dotted line for mobile screens */}
          <div className="md:hidden absolute top-[5%] bottom-[5%] left-[50%] -translate-x-[1.5px] w-[3px] bg-[linear-gradient(to_bottom,#cbd5e1_50%,transparent_50%)] bg-[size:3px_16px] opacity-70 z-0"></div>

          <div className="flex flex-col md:flex-row gap-16 md:gap-4 justify-between relative z-10">
            {(viewAs === "ca"
              ? [["1", "CONNECT", "Add clients or let them invite you — they share their full profile."], ["2", "MONITOR", "One dashboard shows every client's calendar, filings, and risk status."], ["3", "APPROVE", "Review scheme applications, annotate documents, approve filings."],]
              : [["1", "CONNECT", "Link your GST, MSME, and document sources via VEDA."], ["2", "AUTOMATE", "ARIA and SCOUT map your profile to schemes and deadlines."], ["3", "REPORT", "Generate audit-ready reports and file through PATHWAY."],]
            ).map(([num, title, desc], idx) => (
              <motion.div 
                key={num} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="flex-1 flex flex-col items-center group relative"
              >
                {/* Shiny Neon Round Black Number */}
                <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-3xl mb-8 relative shadow-[0_0_15px_rgba(0,0,0,0.8)] border border-slate-700 group-hover:shadow-[0_0_35px_rgba(99,102,241,1)] group-hover:border-indigo-400 group-hover:scale-110 transition-all duration-500 z-10">
                  {/* Outer pulse */}
                  <div className="absolute inset-0 rounded-full border border-indigo-400/50 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {/* Inner shine */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                  
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-md">{num}</span>
                </div>
                
                {/* Step Content */}
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-xl group-hover:border-cs-300 group-hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 w-full max-w-[300px]">
                  <p className="font-extrabold text-slate-900 text-sm tracking-widest mb-3 uppercase group-hover:text-cs-600 transition-colors">{title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARIA ONBOARDING CALLOUT (business only) ── */}
      {viewAs === "business" && (
        <section className="py-16 px-6 bg-gradient-to-r from-cs-900 to-cs-700 text-center">
          <div className="max-w-xl mx-auto">
            <span className="inline-block bg-white/10 text-white text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-5 border border-white/20">
              POWERED BY ARIA AI
            </span>
            <h2 className="text-2xl font-bold text-white mb-3">Registration takes 5 minutes.</h2>
            <p className="text-cs-300 text-sm mb-7">
              ARIA asks you a few simple questions in Hindi or English, builds your business profile, and shows you exactly which compliances and schemes apply — before asking you to do anything.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="secondary" size="md" onClick={() => navigate("/onboarding")}>
                Start ARIA Onboarding →
              </Button>
              <Button
                variant="outline"
                size="md"
                className="!border-white/40 !text-white hover:!bg-white/10"
                onClick={() => openModal("business_type")}
              >
                Demo first
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING ── */}
      <PricingSection viewAs={viewAs} navigate={navigate} />

      {/* ── FINAL CTA ── */}
      <section className="py-16 px-6 bg-cs-900 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          {viewAs === "ca" ? "Ready to streamline your practice?" : "Ready to stop worrying about compliance?"}
        </h2>
        <p className="text-cs-400 text-sm mb-7 max-w-sm mx-auto">
          {viewAs === "ca"
            ? "14 days free. No card required. Manage your first client in minutes."
            : "Start free. No credit card. ARIA sets you up in 5 minutes."}
        </p>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => viewAs === "ca" ? openModal("ca") : navigate("/onboarding")}
        >
          {viewAs === "ca" ? "Start Free CA Trial" : "Get Started Free →"}
        </Button>
      </section>

      <Footer dark />

      {/* ── LOGIN MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <LoginModal
            onClose={() => setModalOpen(false)}
            initialFlow={modalFlow}
          />
        )}
      </AnimatePresence>
    </div>
  );
}