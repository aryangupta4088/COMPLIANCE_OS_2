import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import {
  FileText, Users, Landmark, PiggyBank, Folder,
  Sparkles, Bell, ChevronDown, RefreshCw, Phone, MessageCircle, X,
  CheckCircle2, AlertCircle, TrendingUp, TrendingDown,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { SentinelAlert } from "../components/agents/SENTINELAlert";
import MetricCard from "../components/ui/MetricCard";
import ProgressBar from "../components/ui/ProgressBar";
import { groqChat } from "../services/groqService";
import { getProfile } from "../utils/profileStore";

// ─── Hardcoded CA Directory ────────────────────────────────────────────────
const CA_DIRECTORY = [
  {
    id: 1,
    initials: "RK",
    name: "Rajesh Kumar, FCA",
    title: "GST & MSME Specialist",
    location: "Delhi NCR",
    phone: "+91-98101-23456",
    whatsapp: "919810123456",
    speciality: ["GST", "MSME", "Startup"],
    languages: ["Hindi", "English"],
  },
  {
    id: 2,
    initials: "PM",
    name: "Priya Mehta, ACA",
    title: "Women Entrepreneur Advisor",
    location: "Mumbai",
    phone: "+91-98201-78901",
    whatsapp: "919820178901",
    speciality: ["Women Schemes", "Labour", "Exports"],
    languages: ["Hindi", "Marathi", "English"],
  },
  {
    id: 3,
    initials: "SJ",
    name: "Suresh Joshi, FCA",
    title: "Compliance & Tax Expert",
    location: "Bangalore",
    phone: "+91-97300-45678",
    whatsapp: "919730045678",
    speciality: ["Income Tax", "Audit", "Compliance"],
    languages: ["Kannada", "English"],
  },
  {
    id: 4,
    initials: "AN",
    name: "Anjali Nair, ACA",
    title: "Manufacturing & Export CA",
    location: "Chennai",
    phone: "+91-94400-34567",
    whatsapp: "919440034567",
    speciality: ["Manufacturing", "Export", "GST"],
    languages: ["Tamil", "Malayalam", "English"],
  },
];

// ─── Build dynamic metrics from profile ──────────────────────────────────
function buildMetrics(profile, aiData) {
  const regs = profile.registrations || [];
  const hasGST = regs.includes("GST") || !!profile.gstin;
  const hasUdyam = regs.includes("Udyam");

  const complianceScore = aiData?.complianceScore
    || Math.min(95, 40 + regs.length * 8 + (hasGST ? 10 : 0) + (hasUdyam ? 8 : 0));

  const schemesCount = aiData?.matchedSchemes
    || (profile.isWomen ? 34 : 22) + (hasUdyam ? 5 : 0);

  const pendingActions = aiData?.pendingActions
    || Math.max(1, 6 - regs.length);

  return [
    {
      label: "Registrations",
      value: `${regs.length}/8`,
      badge: regs.length < 3 ? "Action needed" : regs.length >= 6 ? "Excellent" : "On track",
      danger: regs.length < 3,
      icon: <FileText size={18} />,
    },
    {
      label: "Compliance Score",
      value: `${complianceScore}%`,
      badge: complianceScore >= 75 ? `+${complianceScore - 62}% vs avg` : "Needs attention",
      danger: complianceScore < 65,
      icon: <CheckCircle2 size={18} />,
    },
    {
      label: "Schemes Available",
      value: `${schemesCount}`,
      badge: "Match your profile",
      danger: false,
      icon: <Landmark size={18} />,
    },
    {
      label: "Pending Actions",
      value: `${pendingActions}`,
      badge: pendingActions <= 2 ? "Looking good" : "Due this week",
      danger: pendingActions > 2,
      icon: <AlertCircle size={18} />,
    },
  ];
}

// ─── Build savings tracker from profile ──────────────────────────────────
function buildSavings(profile) {
  const regs = profile.registrations || [];
  return [
    {
      label: "MSME Subsidies",
      val: regs.includes("Udyam") ? 78 : regs.length > 2 ? 45 : 22,
    },
    {
      label: "Tax Credits",
      val: profile.gstin || regs.includes("GST") ? 60 : 25,
    },
    {
      label: "Export Incentives",
      val: profile.sector?.toLowerCase().includes("manufactur") ? 82
        : profile.sector?.toLowerCase().includes("export") ? 75 : 30,
    },
    {
      label: "Women Grants",
      val: profile.isWomen ? 90 : 8,
    },
  ];
}

// ─── Build notice board from profile ─────────────────────────────────────
function buildNotices(profile, aiData) {
  const base = [];
  const regs = profile.registrations || [];

  if (!regs.includes("GST") && !profile.gstin) {
    base.push({ title: "GST Registration Missing", desc: "Required for turnover above ₹40L", tag: "URGENT" });
  } else {
    base.push({ title: "GSTR-3B Filing", desc: "Due before 20th of this month", tag: "DUE SOON" });
  }

  if (!regs.includes("Udyam")) {
    base.push({ title: "Udyam Registration Pending", desc: "Unlock MSME benefits & schemes", tag: "ACTION" });
  } else {
    base.push({ title: "Udyam Certificate Active", desc: "Valid — review benefits annually", tag: "ACTIVE" });
  }

  if (aiData?.notices?.length > 0) {
    base.push({ title: aiData.notices[0].title, desc: aiData.notices[0].desc, tag: "AI TIP" });
  } else {
    base.push({
      title: `${profile.state || "State"} Policy Update`,
      desc: "New labour scheme — review by EOM",
      tag: "NEW",
    });
  }

  return base.slice(0, 3);
}

// ─── Build chart data from profile ───────────────────────────────────────
function buildChartData(profile) {
  const regs = profile.registrations || [];
  const base = regs.length * 8 + (profile.gstin ? 10 : 0);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((m, i) => ({
    month: m,
    value: Math.min(98, Math.max(30, base + i * 4 + Math.floor(Math.random() * 6))),
  }));
}

// ─── CA Modal ─────────────────────────────────────────────────────────────
function CAModal({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-cs-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="font-bold text-cs-900 text-xl">CA Consultation</h2>
              <p className="text-cs-500 text-xs mt-0.5">Connect directly with verified Chartered Accountants</p>
            </div>
            <button onClick={onClose} className="text-cs-400 hover:text-cs-700 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CA_DIRECTORY.map((ca) => (
              <div
                key={ca.id}
                className="border border-cs-100 rounded-2xl p-5 hover:border-cs-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-cs-200 flex items-center justify-center font-bold text-cs-800 text-base flex-shrink-0">
                    {ca.initials}
                  </div>
                  <div>
                    <p className="font-bold text-cs-900 text-sm leading-tight">{ca.name}</p>
                    <p className="text-cs-500 text-xs mt-0.5">{ca.title}</p>
                    <p className="text-cs-400 text-xs">📍 {ca.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {ca.speciality.map((s) => (
                    <span key={s} className="bg-cs-100 text-cs-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-cs-400 text-xs mb-3">🗣 {ca.languages.join(", ")}</p>

                <div className="flex gap-2">
                  <a
                    href={`tel:${ca.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-cs-900 text-cs-50 rounded-lg py-2 text-xs font-semibold hover:bg-cs-700 transition-colors"
                  >
                    <Phone size={13} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${ca.whatsapp}?text=Hi%20${encodeURIComponent(ca.name.split(",")[0])}%2C%20I%20need%20compliance%20consultation%20for%20my%20MSME.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white rounded-lg py-2 text-xs font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
const container = { animate: { transition: { staggerChildren: 0.07 } } };

export default function Dashboard() {
  const profile = getProfile();
  const [aiInsight, setAiInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [showCAModal, setShowCAModal] = useState(false);
  const [chartData, setChartData] = useState(buildChartData(profile));

  const metrics = buildMetrics(profile, aiData);
  const savings = buildSavings(profile);
  const notices = buildNotices(profile, aiData);

  // ── Fetch ARIA insight + structured dashboard data ──
  async function fetchInsight() {
    if (!profile.businessName) return;
    setInsightLoading(true);
    try {
      const prompt = `Business profile: ${JSON.stringify(profile)}.

Return a JSON object with:
{
  "insight": "<one actionable compliance tip, max 40 words, starts with action verb, specific to sector/state>",
  "complianceScore": <number 40-95 based on registrations and profile completeness>,
  "matchedSchemes": <number of relevant government schemes for this profile>,
  "pendingActions": <number of urgent compliance actions needed>,
  "notices": [{"title":"...", "desc":"..."}],
  "chartTrend": <"up"|"down"|"stable">
}
Return ONLY valid JSON. No markdown, no backticks.`;

      const reply = await groqChat(
        [{ role: "user", content: prompt }],
        `You are ARIA, a compliance assistant for Indian MSMEs. Analyse the business profile and return structured JSON data. Base complianceScore on: each registration adds 6-8 points, GST adds 10, Udyam adds 8, complete profile adds 5. Be realistic and specific to their sector (${profile.sector}) and state (${profile.state}).`,
        { maxTokens: 300, temperature: 0.4 }
      );

      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiData(parsed);
      setAiInsight(parsed.insight || "");
    } catch {
      // fallback: generate insight-only
      try {
        const reply2 = await groqChat(
          [{ role: "user", content: `Business: ${JSON.stringify(profile)}. Write one compliance insight for this Indian MSME, max 40 words, action verb first, specific to ${profile.sector} in ${profile.state}.` }],
          "You are ARIA, a compliance assistant for Indian MSMEs.",
          { maxTokens: 80, temperature: 0.7 }
        );
        setAiInsight(reply2.trim());
      } catch {
        setAiInsight(
          profile.gstin
            ? `File your GSTR-3B before the 20th to avoid ₹50/day penalties. Your ${profile.sector || "business"} in ${profile.state || "your state"} may also qualify for input tax credit on capital goods.`
            : `Register for GST immediately — mandatory above ₹40L turnover in ${profile.state || "your state"}. This unlocks ITC and government scheme eligibility for your ${profile.sector || "business"}.`
        );
      }
    } finally {
      setInsightLoading(false);
    }
  }

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = profile.businessName?.split(" ")[0] || "there";

  return (
    <DashboardLayout>
      <SentinelAlert />

      {showCAModal && <CAModal onClose={() => setShowCAModal(false)} />}

      <div className="p-6 md:p-8">

        {/* ── WELCOME BANNER ── */}
        {profile.businessName && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-br from-cs-900 to-cs-700 rounded-3xl px-6 py-5 flex items-start justify-between gap-4 shadow-xl shadow-cs-900/10 hover:shadow-2xl hover:shadow-cs-900/20 transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden border border-cs-800 cursor-default"
          >
            {/* Ambient shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            <div>
              <p className="text-cs-300 text-xs font-bold tracking-widest uppercase mb-1">
                Welcome back
              </p>
              <h1 className="text-white font-bold text-xl leading-tight">
                {profile.businessName}
                {profile.isWomen && (
                  <span className="ml-2 text-xs font-semibold bg-pink-500/30 text-pink-200 border border-pink-400/30 px-2 py-0.5 rounded-full align-middle">
                    🌸 Women Entrepreneur
                  </span>
                )}
              </h1>
              <p className="text-cs-400 text-xs mt-1">
                {profile.sector && `${profile.sector} · `}{profile.state}
                {profile.turnover && ` · Turnover: ${profile.turnover}`}
              </p>
            </div>
            <div className="flex-shrink-0 bg-white/10 rounded-xl px-4 py-2 text-center hidden sm:block">
              <p className="text-white font-bold text-lg leading-none">
                {profile.registrations?.length || 0}
              </p>
              <p className="text-cs-300 text-xs mt-0.5">Registrations</p>
            </div>
          </motion.div>
        )}

        {/* ── ARIA INSIGHT CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-amber-50/80 backdrop-blur-md border border-amber-200 rounded-3xl px-5 py-4 flex items-start gap-3 hover:shadow-lg hover:shadow-amber-100/50 hover:border-amber-300 transition-all duration-500 hover:-translate-y-1 group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
            <Sparkles size={15} />
          </div>
          <div className="flex-1">
            <p className="text-amber-800 text-xs font-bold tracking-widest uppercase mb-1">
              ARIA Insight · {profile.sector || "MSME"} · {profile.state || "India"}
            </p>
            {insightLoading ? (
              <div className="flex gap-1.5 items-center mt-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-amber-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                  />
                ))}
                <span className="text-amber-600 text-xs ml-1">Analysing your profile…</span>
              </div>
            ) : (
              <p className="text-amber-900 text-sm leading-relaxed">{aiInsight}</p>
            )}
          </div>
          <button
            onClick={fetchInsight}
            disabled={insightLoading}
            className="text-amber-600 hover:text-amber-800 disabled:opacity-40 mt-0.5"
            title="Refresh insight"
          >
            <RefreshCw size={14} className={insightLoading ? "animate-spin" : ""} />
          </button>
        </motion.div>

        {/* ── METRIC CARDS ── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={container}
          initial="initial"
          animate="animate"
        >
          {metrics.map((m) => (
            <MetricCard
              key={m.label}
              title={m.label}
              value={insightLoading && !aiData ? "—" : m.value}
              subtitle={m.badge}
              icon={m.icon}
              trend={m.danger ? "down" : "up"}
              trendValue={m.badge}
            />
          ))}
        </motion.div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-5">

          {/* Compliance Chart */}
          <div className="bg-white/80 backdrop-blur-md border border-cs-100 rounded-3xl p-6 min-h-[360px] hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] hover:border-cs-300 transition-all duration-500 hover:-translate-y-2 group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-cs-900 text-lg">Compliance Overview</h2>
              <div className="flex items-center gap-1.5 border border-cs-200 rounded-lg px-3 py-1.5 text-sm text-cs-600">
                {aiData?.chartTrend === "up" ? (
                  <TrendingUp size={13} className="text-green-500" />
                ) : aiData?.chartTrend === "down" ? (
                  <TrendingDown size={13} className="text-red-400" />
                ) : null}
                Last 6 Months
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#89a0a9", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(107,136,148,0.08)" }}
                  formatter={(v) => [`${v}%`, "Compliance"]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6b8894" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tools */}
          <div className="bg-white/80 backdrop-blur-md border border-cs-100 rounded-3xl p-6 hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] hover:border-cs-300 transition-all duration-500 hover:-translate-y-2 group">
            <h2 className="font-bold text-cs-900 text-lg mb-5">Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                [FileText, "GST", "/registration"],
                [Users, "Labour", "/registration"],
                [Landmark, "Schemes", "/schemes"],
                [PiggyBank, "Loans", "/loans"],
                [Folder, "Docs", "/documents"],
                [Users, "CA", null], // opens modal
                [Sparkles, "Register", "/registration"],
                [Bell, "Alerts", "/notices"],
              ].map(([Icon, label, href]) =>
                href ? (
                  <NavLink key={label} to={href}>
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-full bg-cs-100 flex items-center justify-center text-cs-600">
                        <Icon size={18} />
                      </div>
                      <span className="text-cs-600 text-xs font-semibold">{label}</span>
                    </motion.div>
                  </NavLink>
                ) : (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.06 }}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => setShowCAModal(true)}
                  >
                    <div className="w-11 h-11 rounded-full bg-cs-100 flex items-center justify-center text-cs-600">
                      <Icon size={18} />
                    </div>
                    <span className="text-cs-600 text-xs font-semibold">{label}</span>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* Savings Tracker — dynamic */}
          <div className="bg-white border border-cs-100 rounded-2xl p-6">
            <h2 className="font-bold text-cs-900 text-lg mb-5">Savings Tracker</h2>
            <div className="flex flex-col gap-4">
              {savings.map(({ label, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cs-600 font-medium">{label}</span>
                    <span className="text-cs-700 font-bold">{val}%</span>
                  </div>
                  <ProgressBar value={val} size="sm" />
                </div>
              ))}
            </div>
            <p className="text-cs-400 text-xs mt-4 leading-relaxed">
              Based on your registrations & sector profile.{" "}
              <NavLink to="/schemes" className="text-cs-600 font-semibold underline">
                Unlock more →
              </NavLink>
            </p>
          </div>

          {/* Notice Board — dynamic */}
          <div className="bg-white border border-cs-100 rounded-2xl p-6">
            <h2 className="font-bold text-cs-900 text-lg mb-4">Notice Board</h2>
            {notices.map(({ title, desc, tag }) => (
              <div
                key={title}
                className="border-l-4 border-cs-500 pl-4 py-3 border-b border-b-cs-100 last:border-b-0 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-cs-900 text-sm">{title}</p>
                  <p className="text-cs-400 text-xs">{desc}</p>
                </div>
                <span className="bg-cs-100 text-cs-600 text-xs font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0">
                  {tag}
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming Events — static structure, dynamic copy */}
          <div className="bg-white border border-cs-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-cs-900 text-lg">Upcoming Events</h2>
              <NavLink to="/calendar" className="text-cs-500 text-xs font-semibold hover:text-cs-700">
                View Calendar
              </NavLink>
            </div>
            {[
              ["20th", "GSTR-3B Filing Deadline", "GST Portal"],
              ["25th", `${profile.sector || "MSME"} Compliance Review`, "Self-assigned"],
              ["EOM", "Document Finalization", profile.state || "Your State"],
            ].map(([time, title, place]) => (
              <div key={title} className="grid grid-cols-[60px_1fr] gap-3 mb-3 last:mb-0">
                <span className="text-cs-500 text-xs font-bold pt-0.5">{time}</span>
                <div className="bg-cs-50 border-l-2 border-cs-900 rounded-lg px-3 py-2">
                  <p className="font-semibold text-cs-900 text-xs">{title}</p>
                  <p className="text-cs-400 text-xs">{place}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CA Mini Card — opens modal */}
          <div className="bg-white/80 backdrop-blur-md border border-cs-100 rounded-3xl p-6 text-center flex flex-col items-center gap-3 hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] hover:border-cs-300 transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-14 h-14 rounded-full bg-cs-200 flex items-center justify-center font-bold text-cs-800 text-xl">
              RK
            </div>
            <div>
              <p className="font-bold text-cs-900">Rajesh Kumar, FCA</p>
              <p className="text-cs-500 text-xs">GST & MSME Specialist · Delhi NCR</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCAModal(true)}
              className="w-full bg-cs-800 text-cs-50 rounded-lg py-2 text-sm font-semibold hover:bg-cs-700 transition-colors"
            >
              Book Consultation
            </motion.button>
            <a
              href="https://wa.me/919810123456?text=Hi%20Rajesh%2C%20I%20need%20MSME%20compliance%20help."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-cs-200 text-cs-700 rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-cs-50 transition-colors"
            >
              <MessageCircle size={14} className="text-green-500" /> WhatsApp
            </a>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}