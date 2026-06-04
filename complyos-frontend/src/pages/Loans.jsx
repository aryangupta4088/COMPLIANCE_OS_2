import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, Sparkles, RefreshCw, ExternalLink,
  X, CheckCircle2, AlertCircle, TrendingUp, MessageCircle,
  Phone, Building2, ChevronDown, ChevronUp, Info,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Footer } from "../components/layout/Footer";
import ProgressBar from "../components/ui/ProgressBar";
import { Button } from "../components/ui/Common";
import { groqChat } from "../services/groqService";
import { getProfile } from "../utils/profileStore";

// ─── Real loan schemes with official portal links ─────────────────────────
const REAL_LOAN_SCHEMES = [
  {
    id: "mudra_shishu",
    title: "MUDRA Loan – Shishu",
    amount: "Up to ₹50,000",
    rate: "8.5% – 12% p.a.",
    type: "Central",
    tag: "Micro",
    portal_url: "https://www.mudra.org.in/",
    portal_name: "MUDRA Portal",
    collateral: "None",
    tenure: "Up to 5 years",
    description: "For micro-enterprises at earliest stage. No collateral, minimal paperwork.",
    eligibility_tags: ["all", "micro", "startup"],
    ministry: "Ministry of Finance",
  },
  {
    id: "mudra_kishore",
    title: "MUDRA Loan – Kishore",
    amount: "₹50,000 – ₹5 Lakh",
    rate: "9% – 12% p.a.",
    type: "Central",
    tag: "Small",
    portal_url: "https://www.mudra.org.in/",
    portal_name: "MUDRA Portal",
    collateral: "None",
    tenure: "Up to 5 years",
    description: "For growing enterprises needing working capital or equipment finance.",
    eligibility_tags: ["all", "micro", "small"],
    ministry: "Ministry of Finance",
  },
  {
    id: "mudra_tarun",
    title: "MUDRA Loan – Tarun",
    amount: "₹5 Lakh – ₹10 Lakh",
    rate: "10% – 13% p.a.",
    type: "Central",
    tag: "Medium",
    portal_url: "https://www.mudra.org.in/",
    portal_name: "MUDRA Portal",
    collateral: "None",
    tenure: "Up to 7 years",
    description: "For established small businesses expanding operations or infrastructure.",
    eligibility_tags: ["all", "small", "medium"],
    ministry: "Ministry of Finance",
  },
  {
    id: "cgtmse",
    title: "CGTMSE – Collateral Free Loan",
    amount: "Up to ₹2 Crore",
    rate: "8% – 14% p.a.",
    type: "Central",
    tag: "MSME",
    portal_url: "https://www.cgtmse.in/",
    portal_name: "CGTMSE Portal",
    collateral: "None (Govt guarantee)",
    tenure: "Up to 10 years",
    description: "Credit guarantee scheme allowing MSMEs to get loans without collateral via partner banks.",
    eligibility_tags: ["all", "msme", "udyam"],
    ministry: "SIDBI & Ministry of MSME",
  },
  {
    id: "standup_india",
    title: "Stand-Up India",
    amount: "₹10 Lakh – ₹1 Crore",
    rate: "Base Rate + 3%",
    type: "Central",
    tag: "Women / SC/ST",
    portal_url: "https://www.standupmitra.in/",
    portal_name: "Stand-Up Mitra Portal",
    collateral: "Primary security only",
    tenure: "Up to 7 years",
    description: "Greenfield enterprise loans for women and SC/ST entrepreneurs setting up new businesses.",
    eligibility_tags: ["women", "sc_st", "greenfield"],
    ministry: "Ministry of Finance / SIDBI",
  },
  {
    id: "mahila_udyam_nidhi",
    title: "Mahila Udyam Nidhi",
    amount: "Up to ₹10 Lakh",
    rate: "9% – 11% p.a.",
    type: "Central",
    tag: "Women",
    portal_url: "https://www.sidbi.in/en/products-and-services/mahila-udyam-nidhi",
    portal_name: "SIDBI Portal",
    collateral: "None",
    tenure: "Up to 10 years",
    description: "Soft loans from SIDBI exclusively for women-owned small enterprises at concessional rates.",
    eligibility_tags: ["women"],
    ministry: "SIDBI",
  },
  {
    id: "pmegp",
    title: "PMEGP – Entrepreneurship Loan",
    amount: "Up to ₹25 Lakh (Mfg) / ₹10 Lakh (Service)",
    rate: "11% – 12% p.a.",
    type: "Central",
    tag: "Subsidy",
    portal_url: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    portal_name: "KVIC / PMEGP Portal",
    collateral: "None (for loans up to ₹5L)",
    tenure: "3 – 7 years",
    description: "Government subsidy of 15–35% on project cost for new enterprises in manufacturing and services.",
    eligibility_tags: ["all", "manufacturing", "service", "new_enterprise"],
    ministry: "Ministry of MSME / KVIC",
  },
  {
    id: "sidbi_direct",
    title: "SIDBI Direct Lending",
    amount: "₹10 Lakh – ₹25 Crore",
    rate: "8% – 13% p.a.",
    type: "Central",
    tag: "MSME Growth",
    portal_url: "https://www.sidbi.in/",
    portal_name: "SIDBI Portal",
    collateral: "Varies",
    tenure: "Up to 10 years",
    description: "Direct term loans and working capital from SIDBI for registered MSMEs with growth potential.",
    eligibility_tags: ["msme", "udyam", "medium", "large"],
    ministry: "SIDBI",
  },
  {
    id: "emergency_credit",
    title: "ECLGS – Emergency Credit Line",
    amount: "Up to 20% of outstanding credit",
    rate: "9.25% (max) p.a.",
    type: "Central",
    tag: "Working Capital",
    portal_url: "https://www.ncgtc.in/en/products/eclgs",
    portal_name: "NCGTC Portal",
    collateral: "None",
    tenure: "Up to 5 years",
    description: "100% govt-guaranteed additional working capital for existing borrowers affected by economic stress.",
    eligibility_tags: ["all", "msme", "existing_borrower"],
    ministry: "Ministry of Finance",
  },
  {
    id: "msme_loan_59min",
    title: "59-Minute MSME Loan",
    amount: "₹1 Lakh – ₹5 Crore",
    rate: "8.5% – 11% p.a.",
    type: "Central",
    tag: "Fast Approval",
    portal_url: "https://www.psbloansin59minutes.com/",
    portal_name: "PSB Loans in 59 Min",
    collateral: "Varies by amount",
    tenure: "Up to 15 years",
    description: "In-principle approval within 59 minutes for GST-registered MSMEs through PSB network.",
    eligibility_tags: ["gst", "msme", "all"],
    ministry: "Ministry of Finance",
  },
  {
    id: "pm_svanidhi",
    title: "PM SVANidhi – Micro Loan",
    amount: "₹10,000 – ₹50,000",
    rate: "7% p.a.",
    type: "Central",
    tag: "Micro / Street",
    portal_url: "https://pmsvanidhi.mohua.gov.in/",
    portal_name: "PM SVANidhi Portal",
    collateral: "None",
    tenure: "1 year (renewable)",
    description: "Working capital loans for street vendors and micro-enterprise owners at very low interest.",
    eligibility_tags: ["micro", "street_vendor", "urban"],
    ministry: "Ministry of Housing & Urban Affairs",
  },
  {
    id: "clcss",
    title: "CLCS-TUS – Technology Upgrade Loan",
    amount: "Up to ₹1 Crore",
    rate: "15% capital subsidy + market rate",
    type: "Central",
    tag: "Technology",
    portal_url: "https://msme.gov.in/schemes/credit-linked-capital-subsidy-and-technology-upgradation-scheme",
    portal_name: "MSME Portal",
    collateral: "Machinery as security",
    tenure: "Up to 7 years",
    description: "15% capital subsidy on new plant and machinery for technology upgradation in small enterprises.",
    eligibility_tags: ["manufacturing", "technology", "msme"],
    ministry: "Ministry of MSME",
  },
];

// ─── Real banks with official URLs ───────────────────────────────────────
const REAL_BANKS = [
  {
    name: "State Bank of India",
    short: "SBI",
    account: "SBI SME Smart Account",
    benefit: "Lowest interest MSME loans, largest PSB network, Mudra partner",
    loan_url: "https://sbi.co.in/web/business/sme",
    account_url: "https://sbi.co.in/web/business/sme/sme-smart",
    color: "from-blue-900 to-blue-800",
    rate: "8.5% p.a. onwards",
    max: "₹25 Crore",
  },
  {
    name: "Bank of Baroda",
    short: "BOB",
    account: "BOB Baroda MSME Loan",
    benefit: "Digital MSME loans, fast in-principle approval, CGTMSE partner",
    loan_url: "https://www.bankofbaroda.in/business-banking/sme",
    account_url: "https://www.bankofbaroda.in/business-banking",
    color: "from-orange-900 to-orange-800",
    rate: "9% p.a. onwards",
    max: "₹10 Crore",
  },
  {
    name: "HDFC Bank",
    short: "HDFC",
    account: "HDFC Business Growth Account",
    benefit: "Fastest approval, SmartHub Vyapar, collateral-free up to ₹40L",
    loan_url: "https://www.hdfcbank.com/sme",
    account_url: "https://www.hdfcbank.com/sme/business-banking",
    color: "from-red-900 to-red-800",
    rate: "10% p.a. onwards",
    max: "₹40 Lakh (collateral-free)",
  },
  {
    name: "ICICI Bank",
    short: "ICICI",
    account: "ICICI iMobile Business",
    benefit: "Instant digital loans, GST-linked credit, Mudra & CGTMSE partner",
    loan_url: "https://www.icicibank.com/business-banking/sme",
    account_url: "https://www.icicibank.com/business-banking",
    color: "from-orange-800 to-amber-800",
    rate: "9.5% p.a. onwards",
    max: "₹2 Crore",
  },
  {
    name: "Punjab National Bank",
    short: "PNB",
    account: "PNB MSME Udyog Current Account",
    benefit: "Priority sector MSME lending, Stand-Up India partner, rural reach",
    loan_url: "https://www.pnbindia.in/msme-loans.html",
    account_url: "https://www.pnbindia.in/current-accounts.html",
    color: "from-indigo-900 to-indigo-800",
    rate: "8.75% p.a. onwards",
    max: "₹5 Crore",
  },
  {
    name: "Canara Bank",
    short: "CAN",
    account: "Canara MSME Plus",
    benefit: "Women entrepreneur preference, PMEGP disbursement bank, KVIC partner",
    loan_url: "https://canarabank.com/User_page.aspx?menulevel=1&menuid=1&CatID=2",
    account_url: "https://canarabank.com/",
    color: "from-yellow-900 to-yellow-800",
    rate: "8.9% p.a. onwards",
    max: "₹10 Crore",
  },
];

// ─── Compute eligibility score dynamically from profile ──────────────────
function computeEligibilityScore(profile) {
  let score = 40;
  const regs = profile.registrations || [];
  if (regs.includes("GST") || profile.gstin) score += 15;
  if (regs.includes("Udyam")) score += 12;
  if (regs.includes("PAN")) score += 8;
  if (regs.length >= 3) score += 5;
  if (profile.turnover === "1Cr-10Cr") score += 8;
  if (profile.turnover === "40L-1Cr") score += 5;
  if (profile.turnover === "above10Cr") score += 10;
  if (profile.businessName) score += 3;
  if (profile.state) score += 2;
  return Math.min(score, 98);
}

function scoreLabel(score) {
  if (score >= 85) return { label: "Excellent", color: "text-green-600" };
  if (score >= 70) return { label: "Good", color: "text-amber-600" };
  if (score >= 55) return { label: "Fair", color: "text-orange-500" };
  return { label: "Needs Improvement", color: "text-red-500" };
}

// ─── Match loan schemes to profile ───────────────────────────────────────
function matchSchemes(profile, aiScores) {
  const regs = (profile.registrations || []).map((r) => r.toLowerCase());
  const isWomen = profile.isWomen;
  const hasGST = regs.includes("gst") || !!profile.gstin;
  const hasUdyam = regs.includes("udyam");
  const sector = (profile.sector || "").toLowerCase();
  const turnover = profile.turnover || "";

  return REAL_LOAN_SCHEMES.map((loan) => {
    const tags = loan.eligibility_tags;
    let score = 50;

    if (tags.includes("all")) score += 10;
    if (isWomen && tags.includes("women")) score += 25;
    if (hasGST && tags.includes("gst")) score += 15;
    if (hasUdyam && tags.includes("udyam")) score += 15;
    if (hasUdyam && tags.includes("msme")) score += 12;
    if (sector.includes("manufactur") && tags.includes("manufacturing")) score += 15;
    if (["1Cr-10Cr", "above10Cr"].includes(turnover) && tags.includes("medium")) score += 10;
    if (["below40L", "40L-1Cr"].includes(turnover) && tags.includes("micro")) score += 10;
    if (!isWomen && tags.length === 1 && tags[0] === "women") score -= 30;
    if (tags.includes("greenfield") && !tags.includes("all")) score -= 10;

    // Merge AI score if available
    const aiScore = aiScores?.[loan.id];
    const finalScore = aiScore != null ? Math.round((score + aiScore) / 2) : Math.min(score, 97);

    return { ...loan, match_score: finalScore };
  })
    .filter((l) => l.match_score >= 35)
    .sort((a, b) => b.match_score - a.match_score);
}

// ─── AI system prompt for loan matching ──────────────────────────────────
const LOAN_SYSTEM = `You are a financial advisor for Indian MSMEs. Given a business profile, return ONLY a JSON object mapping loan scheme IDs to eligibility scores (0-97).
Scheme IDs: mudra_shishu, mudra_kishore, mudra_tarun, cgtmse, standup_india, mahila_udyam_nidhi, pmegp, sidbi_direct, emergency_credit, msme_loan_59min, pm_svanidhi, clcss.
Rules: women-specific schemes get 90+ only for isWomen=true, else 20. GST-registered gets msme_loan_59min boost. Udyam gets cgtmse/sidbi boost. Manufacturing gets clcss boost.
Return ONLY valid JSON like: {"mudra_shishu": 85, "cgtmse": 72, ...}. No markdown.`;

// ─── Loan detail modal ─────────────────────────────────────────────────────
function LoanDetailModal({ loan, profile, onClose }) {
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const reply = await groqChat(
          [{ role: "user", content: `Explain how to apply for "${loan.title}" for: ${JSON.stringify({ sector: profile.sector, state: profile.state, turnover: profile.turnover, registrations: profile.registrations, isWomen: profile.isWomen })}. Give: 1) Eligibility check (2 lines), 2) Step-by-step application (3 steps), 3) One pro tip. Max 90 words.` }],
          "You are a financial advisor for Indian MSMEs. Be specific, practical, and mention the official portal.",
          { maxTokens: 200, temperature: 0.3 }
        );
        setAiTip(reply.trim());
      } catch {
        setAiTip(`Visit ${loan.portal_name} to start your application. Ensure you have your Udyam certificate, GST returns, bank statements for last 6 months, and business PAN ready.`);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [loan, profile]);

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
        <div className="bg-cs-50 border-b border-cs-100 px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold bg-cs-200 text-cs-700 px-2 py-0.5 rounded-full">{loan.tag}</span>
            <p className="font-bold text-cs-900 text-base mt-1">{loan.title}</p>
            <p className="text-cs-400 text-xs">{loan.ministry}</p>
          </div>
          <button onClick={onClose} className="text-cs-400 hover:text-cs-700"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Key details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Max Amount", loan.amount],
              ["Interest Rate", loan.rate],
              ["Collateral", loan.collateral],
              ["Tenure", loan.tenure],
            ].map(([label, val]) => (
              <div key={label} className="bg-cs-50 rounded-xl px-3 py-2">
                <p className="text-cs-400 text-[10px] font-bold uppercase tracking-wide">{label}</p>
                <p className="text-cs-900 font-bold text-xs mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          <p className="text-cs-600 text-sm leading-relaxed">{loan.description}</p>

          {/* Match score */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cs-500 font-medium">Your eligibility</span>
                <span className="text-cs-700 font-bold">{loan.match_score}%</span>
              </div>
              <div className="h-2 bg-cs-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${loan.match_score}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-cs-700 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* AI tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-amber-600" />
              <p className="text-amber-800 text-xs font-bold uppercase tracking-widest">ARIA Guide</p>
            </div>
            {loading ? (
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400"
                    animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }} />
                ))}
              </div>
            ) : (
              <p className="text-amber-900 text-sm leading-relaxed whitespace-pre-line">{aiTip}</p>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <a
              href={loan.portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-cs-900 text-cs-50 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-cs-700 transition-colors"
            >
              Apply on {loan.portal_name} <ExternalLink size={14} />
            </a>
            <a
              href={`https://wa.me/919810123456?text=Hi%20Rajesh%2C%20I%20want%20to%20apply%20for%20${encodeURIComponent(loan.title)}%20for%20my%20business.%20Can%20you%20help?`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-green-200 bg-green-50 text-green-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-green-100 transition-colors"
            >
              <MessageCircle size={14} /> Get CA Help on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Loan card ────────────────────────────────────────────────────────────
function LoanCard({ loan, onLearnMore }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-cs-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-cs-300 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold bg-cs-100 text-cs-600 px-2 py-0.5 rounded-full">{loan.tag}</span>
          <p className="font-bold text-cs-900 text-sm mt-1.5 leading-tight">{loan.title}</p>
          <p className="text-cs-400 text-xs mt-0.5">{loan.ministry}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] text-cs-400">Match</p>
          <p className="font-bold text-cs-900 text-lg leading-none">{loan.match_score}%</p>
        </div>
      </div>

      {/* Match bar */}
      <div className="h-1.5 bg-cs-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${loan.match_score}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${loan.match_score >= 80 ? "bg-green-500" : loan.match_score >= 60 ? "bg-amber-400" : "bg-cs-500"}`}
        />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-cs-50 rounded-lg px-2.5 py-2">
          <p className="text-cs-400 text-[10px] font-bold uppercase">Amount</p>
          <p className="text-cs-900 font-bold text-xs mt-0.5 leading-snug">{loan.amount}</p>
        </div>
        <div className="bg-cs-50 rounded-lg px-2.5 py-2">
          <p className="text-cs-400 text-[10px] font-bold uppercase">Rate</p>
          <p className="text-cs-900 font-bold text-xs mt-0.5 leading-snug">{loan.rate}</p>
        </div>
        <div className="bg-cs-50 rounded-lg px-2.5 py-2">
          <p className="text-cs-400 text-[10px] font-bold uppercase">Collateral</p>
          <p className="text-cs-900 font-bold text-xs mt-0.5">{loan.collateral}</p>
        </div>
        <div className="bg-cs-50 rounded-lg px-2.5 py-2">
          <p className="text-cs-400 text-[10px] font-bold uppercase">Tenure</p>
          <p className="text-cs-900 font-bold text-xs mt-0.5">{loan.tenure}</p>
        </div>
      </div>

      <p className="text-cs-500 text-xs leading-relaxed">{loan.description}</p>

      {/* CTAs */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onLearnMore(loan)}
          className="flex-1 border border-cs-200 text-cs-700 rounded-lg py-2 text-xs font-semibold hover:bg-cs-50 transition-colors flex items-center justify-center gap-1"
        >
          <Sparkles size={11} /> ARIA Guide
        </button>
        <a
          href={loan.portal_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-cs-900 text-cs-50 rounded-lg py-2 text-xs font-semibold hover:bg-cs-700 transition-colors flex items-center justify-center gap-1"
        >
          Apply <ExternalLink size={11} />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Filter panel ─────────────────────────────────────────────────────────
const LOAN_TYPES = ["All", "Micro", "Small", "MSME", "Women", "Subsidy", "Technology", "Working Capital", "Fast Approval"];
const AMOUNT_RANGES = ["Any", "Under ₹1 Lakh", "₹1L – ₹10L", "₹10L – ₹1Cr", "Above ₹1 Crore"];
const SORT_OPTIONS = ["Best Match", "Lowest Rate", "Highest Amount"];

// ─── Main Page ────────────────────────────────────────────────────────────
export default function LoansPage() {
  const profile = getProfile();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [amountFilter, setAmountFilter] = useState("Any");
  const [sortBy, setSortBy] = useState("Best Match");
  const [collateralFree, setCollateralFree] = useState(false);

  const eligibilityScore = useMemo(() => computeEligibilityScore(profile), [profile]);
  const { label: scoreLabel_, color: scoreColor } = scoreLabel(eligibilityScore);

  async function fetchAIScores() {
    setLoading(true);
    try {
      const reply = await groqChat(
        [{ role: "user", content: `Business profile: ${JSON.stringify(profile)}. Score each loan scheme's eligibility for this business.` }],
        LOAN_SYSTEM,
        { maxTokens: 300, temperature: 0.2 }
      );
      const clean = reply.replace(/```json|```/g, "").trim();
      const aiScores = JSON.parse(clean);
      setSchemes(matchSchemes(profile, aiScores));
      setAiLoaded(true);
    } catch {
      setSchemes(matchSchemes(profile, null));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAIScores(); }, []); // eslint-disable-line

  // ── Apply filters + sort ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...schemes];

    if (typeFilter !== "All") {
      list = list.filter((l) => l.tag.toLowerCase().includes(typeFilter.toLowerCase()) || l.eligibility_tags.includes(typeFilter.toLowerCase()));
    }
    if (collateralFree) {
      list = list.filter((l) => l.collateral === "None" || l.collateral.toLowerCase().includes("none"));
    }
    if (amountFilter !== "Any") {
      list = list.filter((l) => {
        const text = l.amount.toLowerCase();
        if (amountFilter === "Under ₹1 Lakh") return text.includes("50,000") || text.includes("10,000") || (text.includes("lakh") && text.includes("0 –"));
        if (amountFilter === "₹1L – ₹10L") return text.includes("10 lakh") || text.includes("5 lakh") || text.includes("lakh – ₹5") || text.includes("lakh – ₹10");
        if (amountFilter === "₹10L – ₹1Cr") return text.includes("1 crore") || text.includes("25 lakh") || text.includes("crore") && text.includes("–");
        if (amountFilter === "Above ₹1 Crore") return text.includes("crore") && (text.includes("2") || text.includes("5") || text.includes("25"));
        return true;
      });
    }
    if (sortBy === "Best Match") list.sort((a, b) => b.match_score - a.match_score);
    else if (sortBy === "Lowest Rate") {
      list.sort((a, b) => {
        const ra = parseFloat(a.rate) || 99;
        const rb = parseFloat(b.rate) || 99;
        return ra - rb;
      });
    }
    return list;
  }, [schemes, typeFilter, amountFilter, sortBy, collateralFree]);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Loan detail modal */}
        <AnimatePresence>
          {selectedLoan && (
            <LoanDetailModal loan={selectedLoan} profile={profile} onClose={() => setSelectedLoan(null)} />
          )}
        </AnimatePresence>

        {/* ── CREDIT HEALTH CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-cs-100 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-cs-500 uppercase mb-1">
                Loan Eligibility Score
              </p>
              <div className="flex items-end gap-3">
                <h1 className="text-4xl font-bold text-cs-900 leading-none">{eligibilityScore}%</h1>
                <span className={`text-sm font-bold mb-0.5 ${scoreColor}`}>
                  ↗ {scoreLabel_}
                </span>
              </div>
              {profile.businessName && (
                <p className="text-cs-400 text-xs mt-1">
                  {profile.businessName} · {profile.sector || "MSME"} · {profile.state || "India"}
                </p>
              )}
            </div>

            {/* Score breakdown */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "GST", done: (profile.registrations || []).includes("GST") || !!profile.gstin, pts: "+15" },
                { label: "Udyam", done: (profile.registrations || []).includes("Udyam"), pts: "+12" },
                { label: "PAN", done: (profile.registrations || []).includes("PAN"), pts: "+8" },
                { label: "Turnover", done: !!profile.turnover && profile.turnover !== "below40L", pts: "+8" },
              ].map(({ label, done, pts }) => (
                <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${done ? "bg-green-50 border-green-200 text-green-700" : "bg-cs-50 border-cs-200 text-cs-400"}`}>
                  {done ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                  {label} <span className="opacity-60">{pts}</span>
                </div>
              ))}
            </div>
          </div>

          <ProgressBar value={eligibilityScore} size="md" animated />
          <div className="flex justify-between mt-2 text-xs text-cs-400">
            <span>Min threshold: 40%</span>
            <span>
              {eligibilityScore < 75 && (
                <span className="text-amber-600 font-semibold">
                  Add Udyam registration to boost by +12%
                </span>
              )}
            </span>
            <span>Max: 98%</span>
          </div>
        </motion.div>

        {/* ── HEADER + FILTERS ── */}
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-cs-900">Recommended Loan Schemes</h2>
            <p className="text-cs-400 text-xs mt-0.5">
              {aiLoaded
                ? `${filtered.length} schemes matched to your profile`
                : `${filtered.length} schemes available`}
              {loading && <span className="ml-2 text-amber-500">· Personalising…</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAIScores}
              disabled={loading}
              className="text-cs-500 hover:text-cs-800 disabled:opacity-40 transition-colors"
              title="Refresh AI matching"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={`flex items-center gap-2 text-xs font-bold tracking-widest px-3 py-2 rounded-lg border transition-colors ${showFilters ? "bg-cs-900 text-cs-50 border-cs-900" : "border-cs-200 text-cs-500 hover:text-cs-700"}`}
            >
              <SlidersHorizontal size={13} /> FILTERS {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border border-cs-100 rounded-2xl p-5 mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-6">
                {/* Type */}
                <div>
                  <p className="text-xs font-bold text-cs-500 uppercase tracking-wide mb-2">Loan Type</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LOAN_TYPES.map((t) => (
                      <button key={t} onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${typeFilter === t ? "bg-cs-900 text-cs-50" : "bg-cs-100 text-cs-600 hover:bg-cs-200"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs font-bold text-cs-500 uppercase tracking-wide mb-2">Loan Amount</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AMOUNT_RANGES.map((a) => (
                      <button key={a} onClick={() => setAmountFilter(a)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${amountFilter === a ? "bg-cs-900 text-cs-50" : "bg-cs-100 text-cs-600 hover:bg-cs-200"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-xs font-bold text-cs-500 uppercase tracking-wide mb-2">Sort By</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SORT_OPTIONS.map((s) => (
                      <button key={s} onClick={() => setSortBy(s)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${sortBy === s ? "bg-cs-900 text-cs-50" : "bg-cs-100 text-cs-600 hover:bg-cs-200"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2 self-end">
                  <button
                    onClick={() => setCollateralFree((p) => !p)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${collateralFree ? "bg-cs-900" : "bg-cs-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${collateralFree ? "left-5" : "left-0.5"}`} />
                  </button>
                  <span className="text-xs font-semibold text-cs-600">Collateral-free only</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOAN GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-cs-100 rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-cs-100 rounded mb-2 w-16" />
                <div className="h-4 bg-cs-100 rounded mb-3 w-3/4" />
                <div className="h-2 bg-cs-100 rounded-full mb-4" />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[...Array(4)].map((_, j) => <div key={j} className="h-10 bg-cs-100 rounded-lg" />)}
                </div>
                <div className="h-8 bg-cs-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-cs-400 mb-14">
            <Info size={32} className="mx-auto mb-3 text-cs-300" />
            <p className="font-semibold text-cs-700">No schemes match your current filters.</p>
            <button onClick={() => { setTypeFilter("All"); setAmountFilter("Any"); setCollateralFree(false); }} className="mt-2 text-cs-600 text-xs underline">Reset filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            <AnimatePresence>
              {filtered.map((loan) => (
                <LoanCard key={loan.id} loan={loan} onLearnMore={setSelectedLoan} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── BANKS SECTION ── */}
        <div className="bg-cs-900 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-cs-50 mb-1">Best Banks for Your Business</h2>
          <p className="text-cs-400 text-sm mb-8">
            Partner banks for MSME loans, CGTMSE, and MUDRA disbursement
            {profile.state && ` · ${profile.state}`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REAL_BANKS.map((bank) => (
              <motion.div
                key={bank.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cs-800 border border-cs-700 rounded-2xl p-5 flex flex-col gap-4 hover:border-cs-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-cs-50 text-base">{bank.name}</h3>
                    <p className="text-cs-400 text-xs mt-0.5">{bank.rate}</p>
                  </div>
                  <span className="bg-cs-700 text-cs-200 text-xs font-bold px-2 py-1 rounded-lg">{bank.short}</span>
                </div>

                <div>
                  <p className="text-cs-500 text-[10px] font-bold tracking-widest uppercase mb-1">Recommended Account</p>
                  <p className="text-cs-200 font-semibold text-sm">{bank.account}</p>
                </div>

                <div>
                  <p className="text-cs-500 text-[10px] font-bold tracking-widest uppercase mb-1">Primary Benefit</p>
                  <p className="text-cs-300 text-sm leading-snug">{bank.benefit}</p>
                </div>

                <div>
                  <p className="text-cs-500 text-[10px] font-bold tracking-widest uppercase mb-1">Max Loan</p>
                  <p className="text-cs-200 font-bold text-sm">{bank.max}</p>
                </div>

                <div className="flex gap-2 mt-auto">
                  <a
                    href={bank.loan_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-cs-50 rounded-lg py-2 text-xs font-semibold hover:bg-white/20 transition-colors"
                  >
                    Apply Loan <ExternalLink size={11} />
                  </a>
                  <a
                    href={bank.account_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 border border-cs-600 text-cs-200 rounded-lg py-2 text-xs font-semibold hover:bg-cs-700 transition-colors"
                  >
                    Open Account
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </DashboardLayout>
  );
}