import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    ShieldAlert, AlertTriangle, CheckCircle2, XCircle,
    AlertCircle, RefreshCw, Brain, Clock, Users,
    ArrowLeft, UserX,
} from "lucide-react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

async function groq(systemPrompt, userContent, maxTokens = 900) {
    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: maxTokens,
            temperature: 0.1,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent },
            ],
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Groq HTTP ${res.status}`);
    }
    const data = await res.json();
    return (data.choices?.[0]?.message?.content || "").replace(/```json|```/g, "").trim();
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function RiskBadge({ level }) {
    const cfg = {
        HIGH: { cls: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
        MEDIUM: { cls: "bg-amber-100 text-amber-700", icon: <AlertCircle size={11} /> },
        LOW: { cls: "bg-green-100 text-green-700", icon: <CheckCircle2 size={11} /> },
    }[level] || { cls: "bg-cs-100 text-cs-600", icon: null };
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
            {cfg.icon} {level} RISK
        </span>
    );
}

function Card({ title, children, className = "" }) {
    return (
        <div className={`bg-white border border-cs-100 rounded-2xl p-5 flex flex-col gap-3 ${className}`}>
            {title && <p className="text-[10px] font-bold text-cs-500 tracking-widest uppercase">{title}</p>}
            {children}
        </div>
    );
}

function Flag({ text }) {
    return (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            <AlertTriangle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-xs leading-relaxed">{text}</p>
        </div>
    );
}

function Good({ text }) {
    return (
        <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-xs leading-relaxed">{text}</p>
        </div>
    );
}

function SafeguardAction({ text, blocking = false }) {
    return (
        <div className={`rounded-2xl p-4 ${blocking ? "bg-red-700" : "bg-cs-900"}`}>
            <p className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 ${blocking ? "text-red-300" : "text-cs-400"}`}>
                {blocking ? "⛔ Platform Action — BLOCKING" : "Platform Safeguard Triggered"}
            </p>
            <p className="text-white text-sm font-semibold leading-relaxed">{text}</p>
        </div>
    );
}

function ScanSteps({ steps, current }) {
    return (
        <div className="flex flex-col gap-2.5">
            {steps.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-2.5 text-xs ${i < current ? "text-green-600 font-medium" :
                        i === current ? "text-cs-900 font-bold" : "text-cs-300"
                        }`}
                >
                    {i < current && <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />}
                    {i === current && (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
                            <RefreshCw size={13} className="text-amber-500 flex-shrink-0" />
                        </motion.div>
                    )}
                    {i > current && <div className="w-3 h-3 rounded-full border border-cs-200 flex-shrink-0" />}
                    {s}
                </motion.div>
            ))}
        </div>
    );
}

function InputField({ label, placeholder, value, onChange }) {
    return (
        <div>
            <label className="text-cs-500 text-xs font-bold block mb-1.5">{label}</label>
            <input
                className="w-full border border-cs-100 rounded-xl px-3 py-2.5 text-sm text-cs-900 font-medium focus:outline-none focus:border-cs-500 focus:ring-1 focus:ring-cs-200 bg-cs-50 transition"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function Select({ label, value, onChange, options }) {
    return (
        <div>
            <label className="text-cs-500 text-xs font-bold block mb-1.5">{label}</label>
            <select
                className="w-full border border-cs-100 rounded-xl px-3 py-2.5 text-sm text-cs-900 font-medium focus:outline-none focus:border-cs-500 bg-cs-50 transition"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

function RunButton({ onClick, loading, label, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-cs-900 text-white rounded-xl py-3 text-sm font-bold hover:bg-cs-700 transition disabled:opacity-40 disabled:cursor-not-allowed w-full"
        >
            <Icon size={15} />
            {loading ? "Analysing…" : label}
        </button>
    );
}

function PresetBar({ presets }) {
    return (
        <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
                <button
                    key={p.label}
                    onClick={p.apply}
                    className={`flex-1 text-xs border rounded-lg py-2 font-semibold transition-colors min-w-[140px] ${p.danger
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                >
                    {p.danger ? "⚠️" : "✓"} {p.label}
                </button>
            ))}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// PANEL 1 — WORKLOAD GUARD
// ══════════════════════════════════════════════════════════════════════════════
function WorkloadGuard() {
    const STEPS = [
        "Pulling CA's active client list…",
        "Counting pending approval queue items…",
        "Checking open compliance deadlines…",
        "Measuring today's session activity…",
        "Profiling incoming booking urgency…",
        "Running AI overload risk model…",
        "Generating booking admission decision…",
    ];

    const OVERLOADED = { activeClients: "17", pendingApprovals: "11", openDeadlines: "8", hoursWorkedToday: "9", bookingType: "urgent", bookingDocCount: "5", bookingLoanAmount: "38,00,000", newClientDays: "3", lastBreakMinutes: "210" };
    const SAFE = { activeClients: "6", pendingApprovals: "2", openDeadlines: "3", hoursWorkedToday: "4", bookingType: "standard", bookingDocCount: "2", bookingLoanAmount: "0", newClientDays: "90", lastBreakMinutes: "45" };

    const [f, setF] = useState({ activeClients: "", pendingApprovals: "", openDeadlines: "", hoursWorkedToday: "", bookingType: "standard", bookingDocCount: "", bookingLoanAmount: "", newClientDays: "", lastBreakMinutes: "" });
    const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
    const [step, setStep] = useState(-1);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function run() {
        if (!f.activeClients || !f.pendingApprovals) { setError("Active clients and pending approvals are required."); return; }
        setError(""); setResult(null); setLoading(true); setStep(0);
        try {
            for (let i = 1; i <= 5; i++) { await delay(400); setStep(i); }
            const raw = await groq(
                "You are SCOUT, a CA protection AI for ComplianceOS. Return ONLY valid JSON. No markdown.",
                `Assess CA overload risk. CA state: ${JSON.stringify(f)}. Safe thresholds: <10 clients, <5 pending, >30min break, <3 docs/session.
Return JSON: {"overload_risk":"HIGH|MEDIUM|LOW","overload_score":0-100,"booking_admission":"BLOCK|FLAG_FOR_REVIEW|ADMIT_WITH_SAFEGUARDS|ADMIT","cognitive_load_note":"...","booking_risk_signals":[],"safeguards_required":[],"recommended_action":"...","minimum_review_time_minutes":0}`
            );
            setStep(6); await delay(300);
            setResult({ ai: JSON.parse(raw) });
        } catch (e) { setError(`Error: ${e.message}`); }
        finally { setLoading(false); setStep(-1); }
    }

    const admissionLabel = result && { BLOCK: "🚫 Booking BLOCKED", FLAG_FOR_REVIEW: "⚠️ Flagged — Senior Review Required", ADMIT_WITH_SAFEGUARDS: "🔒 Admitted — Mandatory Safeguards Active", ADMIT: "✅ Booking Admitted Safely" }[result.ai.booking_admission];
    const admissionBg = result && { BLOCK: "bg-red-50 border-red-200", FLAG_FOR_REVIEW: "bg-amber-50 border-amber-200", ADMIT_WITH_SAFEGUARDS: "bg-blue-50 border-blue-200", ADMIT: "bg-green-50 border-green-200" }[result.ai.booking_admission];

    return (
        <div className="flex flex-col gap-5">
            <Card title="CA Current State + Incoming Booking">
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-800 leading-relaxed">
                    <strong>Scenario:</strong> A fraudster books a "quick consultation" to get high-value loan documents approved by an overloaded CA. Platform intercepts before confirmation.
                </div>
                <PresetBar presets={[
                    { label: "Overloaded CA (fraud target)", danger: true, apply: () => setF(OVERLOADED) },
                    { label: "Safe workload (clear to proceed)", danger: false, apply: () => setF(SAFE) },
                ]} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Active Clients" placeholder="e.g. 17" value={f.activeClients} onChange={set("activeClients")} />
                    <InputField label="Pending Approvals in Queue" placeholder="e.g. 11" value={f.pendingApprovals} onChange={set("pendingApprovals")} />
                    <InputField label="Open Compliance Deadlines" placeholder="e.g. 8" value={f.openDeadlines} onChange={set("openDeadlines")} />
                    <InputField label="Hours Worked Today" placeholder="e.g. 9" value={f.hoursWorkedToday} onChange={set("hoursWorkedToday")} />
                    <InputField label="Minutes Since Last Break" placeholder="e.g. 210" value={f.lastBreakMinutes} onChange={set("lastBreakMinutes")} />
                    <Select label="Incoming Booking Type" value={f.bookingType} onChange={set("bookingType")} options={[
                        { value: "standard", label: "Standard consultation" },
                        { value: "urgent", label: "Urgent / same-day" },
                        { value: "signing", label: "Document signing only" },
                    ]} />
                    <InputField label="Documents to Approve This Session" placeholder="e.g. 5" value={f.bookingDocCount} onChange={set("bookingDocCount")} />
                    <InputField label="Loan Amount in Documents (₹)" placeholder="e.g. 38,00,000" value={f.bookingLoanAmount} onChange={set("bookingLoanAmount")} />
                    <InputField label="Days Since Client Account Created" placeholder="e.g. 3" value={f.newClientDays} onChange={set("newClientDays")} />
                </div>
                {error && <p className="text-red-600 text-xs font-semibold">{error}</p>}
                <RunButton onClick={run} loading={loading} icon={Brain} label="Run Workload Risk Assessment" />
            </Card>

            {loading && step >= 0 && <Card title="Live Analysis Steps"><ScanSteps steps={STEPS} current={step} /></Card>}

            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    <div className={`rounded-2xl border p-5 ${admissionBg}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="font-black text-cs-900 text-base">{admissionLabel}</p>
                            <RiskBadge level={result.ai.overload_risk} />
                        </div>
                        <p className="text-cs-700 text-sm mb-3">{result.ai.cognitive_load_note}</p>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-cs-500 font-medium w-24 flex-shrink-0">Overload score</span>
                            <div className="flex-1 h-2 bg-white/70 rounded-full overflow-hidden border border-cs-100">
                                <motion.div
                                    className={`h-full rounded-full ${result.ai.overload_score >= 70 ? "bg-red-500" : result.ai.overload_score >= 40 ? "bg-amber-400" : "bg-green-500"}`}
                                    initial={{ width: 0 }} animate={{ width: `${result.ai.overload_score}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                                />
                            </div>
                            <span className="text-xs font-black text-cs-900 w-10 text-right">{result.ai.overload_score}/100</span>
                        </div>
                    </div>
                    {result.ai.booking_risk_signals?.length > 0 && <Card title="Booking Risk Signals">{result.ai.booking_risk_signals.map((s, i) => <Flag key={i} text={s} />)}</Card>}
                    {result.ai.safeguards_required?.length > 0 && (
                        <Card title="Mandatory Safeguards Before Any Approval">
                            {result.ai.safeguards_required.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                        <span className="text-[8px] font-black text-blue-600">{i + 1}</span>
                                    </div>
                                    <p className="text-blue-800 text-xs leading-relaxed">{s}</p>
                                </div>
                            ))}
                        </Card>
                    )}
                    <SafeguardAction text={result.ai.recommended_action} blocking={result.ai.booking_admission === "BLOCK"} />
                </motion.div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// PANEL 2 — VELOCITY CHECKER
// ══════════════════════════════════════════════════════════════════════════════
function VelocityChecker() {
    const STEPS = [
        "Retrieving approval timestamp log…",
        "Loading document complexity profile…",
        "Checking CA's historical review baseline…",
        "Calculating velocity deviation score…",
        "Flagging against safe-minimum thresholds…",
        "Running AI rubber-stamp analysis…",
        "Generating approval validity verdict…",
    ];

    const RUBBER_STAMP = { docType: "loan_guarantee", docPages: "18", loanAmount: "36,00,000", reviewSeconds: "94", caHistoricalAvg: "720", pendingAtTime: "12", caInteractedClient: "no", docUploadedBy: "client" };
    const CAREFUL = { docType: "gst_return", docPages: "6", loanAmount: "0", reviewSeconds: "840", caHistoricalAvg: "600", pendingAtTime: "3", caInteractedClient: "yes", docUploadedBy: "ca" };

    const [f, setF] = useState({ docType: "gst_return", docPages: "", loanAmount: "", reviewSeconds: "", caHistoricalAvg: "", pendingAtTime: "", caInteractedClient: "yes", docUploadedBy: "client" });
    const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
    const [step, setStep] = useState(-1);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function run() {
        if (!f.reviewSeconds || !f.docType) { setError("Document type and review time are required."); return; }
        setError(""); setResult(null); setLoading(true); setStep(0);
        try {
            for (let i = 1; i <= 5; i++) { await delay(380); setStep(i); }
            const raw = await groq(
                "You are SCOUT, a CA fraud protection AI. Detect rubber-stamp approvals. Return ONLY valid JSON. No markdown.",
                `Analyse CA approval. Doc: ${JSON.stringify(f)}. Safe minimums: loan_guarantee=600s, bank_statement=480s, scheme_application=360s, gst_return=300s, udyam_cert=120s.
Return JSON: {"verdict":"RUBBER_STAMP|SUSPICIOUSLY_FAST|ACCEPTABLE|THOROUGH","risk_level":"HIGH|MEDIUM|LOW","actual_vs_safe_ratio":0.0,"safe_minimum_seconds":0,"velocity_flags":[],"context_signals":[],"explanation":"...","platform_action":"...","approval_validity":"VOID_PENDING_REVIEW|FLAGGED|VALID"}`
            );
            setStep(6); await delay(300);
            setResult({ ai: JSON.parse(raw) });
        } catch (e) { setError(`Error: ${e.message}`); }
        finally { setLoading(false); setStep(-1); }
    }

    const verdictLabel = result && { RUBBER_STAMP: "🚫 Rubber-stamp Detected — Approval VOIDED", SUSPICIOUSLY_FAST: "⚠️ Suspiciously Fast — Under Review", ACCEPTABLE: "✅ Review Time Acceptable", THOROUGH: "✅ Thorough Review — No Issues" }[result?.ai?.verdict];
    const verdictBg = result && { RUBBER_STAMP: "bg-red-50 border-red-200", SUSPICIOUSLY_FAST: "bg-amber-50 border-amber-200", ACCEPTABLE: "bg-green-50 border-green-200", THOROUGH: "bg-green-50 border-green-200" }[result?.ai?.verdict];
    const safeMin = result?.ai?.safe_minimum_seconds;
    const actualSec = parseInt(f.reviewSeconds) || 0;

    return (
        <div className="flex flex-col gap-5">
            <Card title="Approval Event Details">
                <div className="bg-cs-50 border border-cs-100 rounded-lg px-3 py-2 text-xs text-cs-600 leading-relaxed">
                    <strong>How this works:</strong> SCOUT timestamps every CA approval. If a CA approves a loan guarantee in 94s (safe minimum: 600s), the approval is automatically voided and all parties notified.
                </div>
                <PresetBar presets={[
                    { label: "Rubber-stamp scenario", danger: true, apply: () => setF(RUBBER_STAMP) },
                    { label: "Careful review", danger: false, apply: () => setF(CAREFUL) },
                ]} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select label="Document Type" value={f.docType} onChange={set("docType")} options={[
                        { value: "loan_guarantee", label: "Loan Guarantee / CGTMSE" },
                        { value: "bank_statement", label: "Bank Statement" },
                        { value: "scheme_application", label: "Scheme Application" },
                        { value: "gst_return", label: "GST Return" },
                        { value: "udyam_cert", label: "Udyam Certificate" },
                    ]} />
                    <InputField label="Document Pages" placeholder="e.g. 18" value={f.docPages} onChange={set("docPages")} />
                    <InputField label="Amount at Stake (₹)" placeholder="e.g. 36,00,000" value={f.loanAmount} onChange={set("loanAmount")} />
                    <InputField label="Actual Review Time (seconds)" placeholder="e.g. 94" value={f.reviewSeconds} onChange={set("reviewSeconds")} />
                    <InputField label="CA Historical Avg (sec)" placeholder="e.g. 720" value={f.caHistoricalAvg} onChange={set("caHistoricalAvg")} />
                    <InputField label="CA's Pending Items at Approval" placeholder="e.g. 12" value={f.pendingAtTime} onChange={set("pendingAtTime")} />
                    <Select label="CA Spoke with Client?" value={f.caInteractedClient} onChange={set("caInteractedClient")} options={[
                        { value: "yes", label: "Yes — call or chat logged" },
                        { value: "no", label: "No interaction recorded" },
                    ]} />
                    <Select label="Who Uploaded the Document?" value={f.docUploadedBy} onChange={set("docUploadedBy")} options={[
                        { value: "client", label: "Client uploaded" },
                        { value: "ca", label: "CA uploaded" },
                    ]} />
                </div>
                {error && <p className="text-red-600 text-xs font-semibold">{error}</p>}
                <RunButton onClick={run} loading={loading} icon={Clock} label="Analyse Approval Velocity" />
            </Card>

            {loading && step >= 0 && <Card title="Live Analysis Steps"><ScanSteps steps={STEPS} current={step} /></Card>}

            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    <div className={`rounded-2xl border p-5 ${verdictBg}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="font-black text-cs-900 text-base leading-tight">{verdictLabel}</p>
                            <RiskBadge level={result.ai.risk_level} />
                        </div>
                        <p className="text-cs-700 text-sm mb-4 leading-relaxed">{result.ai.explanation}</p>
                        {safeMin && actualSec && (
                            <div className="bg-white/70 rounded-xl p-3 border border-white/40 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-cs-500 w-28 flex-shrink-0">Actual review</span>
                                    <div className="flex-1 h-2 bg-cs-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${actualSec < safeMin * 0.5 ? "bg-red-500" : actualSec < safeMin ? "bg-amber-400" : "bg-green-500"}`}
                                            initial={{ width: 0 }} animate={{ width: `${Math.min((actualSec / safeMin) * 100, 100)}%` }} transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-cs-900 w-12 text-right">{actualSec}s</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-cs-500 w-28 flex-shrink-0">Safe minimum</span>
                                    <div className="flex-1 h-2 bg-cs-100 rounded-full"><div className="h-full bg-cs-300 rounded-full w-full" /></div>
                                    <span className="text-xs font-black text-cs-900 w-12 text-right">{safeMin}s</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {result.ai.velocity_flags?.length > 0 && <Card title="Velocity Flags">{result.ai.velocity_flags.map((f, i) => <Flag key={i} text={f} />)}</Card>}
                    {result.ai.context_signals?.length > 0 && (
                        <Card title="Context Signals">
                            {result.ai.context_signals.map((s, i) =>
                                s.toLowerCase().includes("no ") || s.toLowerCase().includes("not ") ? <Flag key={i} text={s} /> : <Good key={i} text={s} />
                            )}
                        </Card>
                    )}
                    <SafeguardAction text={result.ai.platform_action} blocking={result.ai.approval_validity === "VOID_PENDING_REVIEW"} />
                </motion.div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// PANEL 3 — BOOKING DETECTOR
// ══════════════════════════════════════════════════════════════════════════════
function BookingDetector() {
    const STEPS = [
        "Pulling client account history…",
        "Checking compliance activity footprint…",
        "Profiling booking urgency pattern…",
        "Scanning document complexity stack…",
        "Cross-checking against known fraud patterns…",
        "Running AI booking risk model…",
        "Generating CA recommendation…",
    ];

    const SUSPICIOUS = { clientAgeDays: "4", priorSessions: "0", complianceActions: "0", urgency: "same_day", docCount: "6", totalLoanValue: "52,00,000", docTypes: "loan_guarantee, bank_statement, NOC, board_resolution", clientMessage: "Need all 6 documents signed urgently today — bank deadline is tomorrow", paymentUpfront: "yes", referralSource: "direct_search" };
    const LEGIT = { clientAgeDays: "120", priorSessions: "4", complianceActions: "18", urgency: "standard", docCount: "2", totalLoanValue: "5,00,000", docTypes: "gst_return, udyam_cert", clientMessage: "Following up on our last session, please review the updated GST filing", paymentUpfront: "no", referralSource: "existing_client_referral" };

    const [f, setF] = useState({ clientAgeDays: "", priorSessions: "", complianceActions: "", urgency: "standard", docCount: "", totalLoanValue: "", docTypes: "", clientMessage: "", paymentUpfront: "no", referralSource: "direct_search" });
    const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
    const [step, setStep] = useState(-1);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function run() {
        if (!f.clientAgeDays || !f.docCount) { setError("Client account age and document count are required."); return; }
        setError(""); setResult(null); setLoading(true); setStep(0);
        try {
            for (let i = 1; i <= 5; i++) { await delay(380); setStep(i); }
            const raw = await groq(
                "You are SCOUT, a CA protection AI. Detect fraudulent bookings designed to exploit busy CAs. Return ONLY valid JSON. No markdown.",
                `Assess booking: ${JSON.stringify(f)}. Known patterns: new account+same-day+high-value=manipulation; zero compliance activity+loan docs=shell business; pressure language=coercion.
Return JSON: {"booking_risk":"HIGH|MEDIUM|LOW","risk_score":0-100,"recommendation":"DECLINE|ESCALATE_TO_SENIOR_CA|ACCEPT_WITH_FRICTION|ACCEPT","fraud_pattern_matches":[],"pressure_signals":[],"trust_signals":[],"mandatory_friction":[],"ca_briefing":"..."}`
            );
            setStep(6); await delay(300);
            setResult({ ai: JSON.parse(raw) });
        } catch (e) { setError(`Error: ${e.message}`); }
        finally { setLoading(false); setStep(-1); }
    }

    const recLabel = result && { DECLINE: "🚫 Booking DECLINED — Fraud Pattern Match", ESCALATE_TO_SENIOR_CA: "⚠️ Escalate to Senior CA — Cannot Proceed as-is", ACCEPT_WITH_FRICTION: "🔒 Accepted — Mandatory Friction Steps Added", ACCEPT: "✅ Booking Accepted — Low Risk" }[result?.ai?.recommendation];
    const recBg = result && { DECLINE: "bg-red-50 border-red-200", ESCALATE_TO_SENIOR_CA: "bg-amber-50 border-amber-200", ACCEPT_WITH_FRICTION: "bg-blue-50 border-blue-200", ACCEPT: "bg-green-50 border-green-200" }[result?.ai?.recommendation];

    return (
        <div className="flex flex-col gap-5">
            <Card title="Incoming Booking Profile">
                <div className="bg-cs-50 border border-cs-100 rounded-lg px-3 py-2 text-xs text-cs-600 leading-relaxed">
                    <strong>How this works:</strong> Before a CA sees a new booking, SCOUT screens it. A new client + same-day urgency + 6 loan documents + pressure language = declined before the CA is even notified.
                </div>
                <PresetBar presets={[
                    { label: "Suspicious booking (fraud pattern)", danger: true, apply: () => setF(SUSPICIOUS) },
                    { label: "Legitimate booking", danger: false, apply: () => setF(LEGIT) },
                ]} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Client Account Age (days)" placeholder="e.g. 4" value={f.clientAgeDays} onChange={set("clientAgeDays")} />
                    <InputField label="Prior CA Sessions on Platform" placeholder="e.g. 0" value={f.priorSessions} onChange={set("priorSessions")} />
                    <InputField label="Total Compliance Actions (filings/uploads)" placeholder="e.g. 0" value={f.complianceActions} onChange={set("complianceActions")} />
                    <Select label="Booking Urgency" value={f.urgency} onChange={set("urgency")} options={[
                        { value: "same_day", label: "Same day — needs sign today" },
                        { value: "urgent_48h", label: "Urgent — 48 hour window" },
                        { value: "standard", label: "Standard — scheduled in advance" },
                        { value: "flexible", label: "Flexible — no deadline" },
                    ]} />
                    <InputField label="Documents to Approve This Session" placeholder="e.g. 6" value={f.docCount} onChange={set("docCount")} />
                    <InputField label="Total Loan/Scheme Value (₹)" placeholder="e.g. 52,00,000" value={f.totalLoanValue} onChange={set("totalLoanValue")} />
                    <Select label="Referral Source" value={f.referralSource} onChange={set("referralSource")} options={[
                        { value: "direct_search", label: "Direct search — no referral" },
                        { value: "existing_client_referral", label: "Referred by existing client" },
                        { value: "ca_invited", label: "CA invited them" },
                        { value: "govt_portal_redirect", label: "Govt portal redirect" },
                    ]} />
                    <Select label="Payment Made Upfront?" value={f.paymentUpfront} onChange={set("paymentUpfront")} options={[
                        { value: "yes", label: "Yes — paid before session" },
                        { value: "no", label: "No — standard booking" },
                    ]} />
                </div>
                <InputField label="Document Types in This Booking" placeholder="e.g. loan_guarantee, bank_statement, board_resolution" value={f.docTypes} onChange={set("docTypes")} />
                <div>
                    <label className="text-cs-500 text-xs font-bold block mb-1.5">Client's Message with Booking</label>
                    <textarea
                        rows={3}
                        className="w-full border border-cs-100 rounded-xl px-3 py-2.5 text-sm text-cs-900 font-medium focus:outline-none focus:border-cs-500 bg-cs-50 resize-none transition"
                        placeholder="Paste the client's booking message here…"
                        value={f.clientMessage}
                        onChange={(e) => setF((p) => ({ ...p, clientMessage: e.target.value }))}
                    />
                </div>
                {error && <p className="text-red-600 text-xs font-semibold">{error}</p>}
                <RunButton onClick={run} loading={loading} icon={UserX} label="Screen This Booking" />
            </Card>

            {loading && step >= 0 && <Card title="Live Screening Steps"><ScanSteps steps={STEPS} current={step} /></Card>}

            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    <div className={`rounded-2xl border p-5 ${recBg}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="font-black text-cs-900 text-base">{recLabel}</p>
                            <RiskBadge level={result.ai.booking_risk} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs text-cs-500 font-medium w-20 flex-shrink-0">Fraud risk</span>
                            <div className="flex-1 h-2 bg-white/70 rounded-full overflow-hidden border border-cs-100">
                                <motion.div
                                    className={`h-full rounded-full ${result.ai.risk_score >= 70 ? "bg-red-500" : result.ai.risk_score >= 40 ? "bg-amber-400" : "bg-green-500"}`}
                                    initial={{ width: 0 }} animate={{ width: `${result.ai.risk_score}%` }} transition={{ duration: 1.1, ease: "easeOut" }}
                                />
                            </div>
                            <span className="text-xs font-black text-cs-900 w-10 text-right">{result.ai.risk_score}/100</span>
                        </div>
                        {result.ai.ca_briefing && (
                            <div className="bg-white/70 rounded-xl p-3 border border-white/40">
                                <p className="text-[10px] font-bold text-cs-500 uppercase tracking-wider mb-1.5">CA Briefing</p>
                                <p className="text-cs-800 text-xs leading-relaxed">{result.ai.ca_briefing}</p>
                            </div>
                        )}
                    </div>
                    {result.ai.fraud_pattern_matches?.length > 0 && <Card title="Fraud Pattern Matches">{result.ai.fraud_pattern_matches.map((p, i) => <Flag key={i} text={p} />)}</Card>}
                    {result.ai.pressure_signals?.length > 0 && <Card title="Pressure / Coercion Language">{result.ai.pressure_signals.map((s, i) => <Flag key={i} text={s} />)}</Card>}
                    {result.ai.trust_signals?.length > 0 && <Card title="Trust Signals">{result.ai.trust_signals.map((s, i) => <Good key={i} text={s} />)}</Card>}
                    {result.ai.mandatory_friction?.length > 0 && (
                        <Card title="Friction Steps Added to This Booking">
                            {result.ai.mandatory_friction.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                        <span className="text-[8px] font-black text-blue-600">{i + 1}</span>
                                    </div>
                                    <p className="text-blue-800 text-xs leading-relaxed">{s}</p>
                                </div>
                            ))}
                        </Card>
                    )}
                    <SafeguardAction
                        text={result.ai.recommendation === "DECLINE"
                            ? "Booking declined automatically. Client notified. CA was not shown client details. Incident logged."
                            : "Booking processed with safeguards. CA briefing delivered. Mandatory friction steps active before document access."}
                        blocking={result.ai.recommendation === "DECLINE"}
                    />
                </motion.div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
    { id: "workload", label: "Workload Guard", icon: Brain, desc: "Overload risk before new bookings" },
    { id: "velocity", label: "Velocity Checker", icon: Clock, desc: "Catches rubber-stamp approvals" },
    { id: "booking", label: "Booking Detector", icon: UserX, desc: "Screens bookings before CA sees them" },
];

export default function CAFraudShield() {
    const navigate = useNavigate();
    const [active, setActive] = useState("workload");

    return (
        <div className="min-h-screen bg-cs-50">
            {/* Topbar */}
            <div className="bg-cs-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
                <button
                    onClick={() => navigate("/ca-dashboard")}
                    className="text-cs-400 hover:text-white transition flex items-center gap-1.5 text-sm font-medium"
                >
                    <ArrowLeft size={15} /> CA Dashboard
                </button>
                <div className="h-4 w-px bg-cs-700" />
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                        <ShieldAlert size={14} className="text-red-400" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold leading-none">SCOUT · CA Fraud Shield</p>
                        <p className="text-cs-500 text-[10px] mt-0.5">Signature fraud prevention layer</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Crisis banner */}
                <div className="bg-cs-900 rounded-2xl p-5 mb-8 border border-cs-800">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-white text-sm mb-1">The Attack Vector</p>
                            <p className="text-cs-400 text-xs leading-relaxed max-w-xl">
                                A fraudster books a "quick consultation" with an overloaded CA — 15+ clients, back-to-back deadlines, 12 items pending.
                                Documents look clean. CA approves in 94 seconds.
                                <span className="text-red-400 font-semibold"> CA loses their license. Platform gets investigated. Fraudster disappears.</span>
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            ["Workload Guard", "Blocks booking before CA is targeted"],
                            ["Velocity Checker", "Voids approvals that are dangerously fast"],
                            ["Booking Detector", "Intercepts fraud patterns pre-session"],
                        ].map(([title, desc]) => (
                            <div key={title} className="bg-cs-800 rounded-xl px-3 py-2.5">
                                <p className="text-white text-xs font-bold mb-0.5">{title}</p>
                                <p className="text-cs-500 text-[10px] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tab selector */}
                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                    {TABS.map((tab, i) => (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`flex-1 flex items-start gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all ${active === tab.id
                                ? "bg-cs-900 border-cs-900 text-white shadow-lg"
                                : "bg-white border-cs-100 text-cs-700 hover:border-cs-300"
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${active === tab.id ? "bg-white/10" : "bg-cs-100"}`}>
                                <tab.icon size={15} className={active === tab.id ? "text-white" : "text-cs-600"} />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[9px] font-bold ${active === tab.id ? "text-cs-500" : "text-cs-400"}`}>0{i + 1}</span>
                                    <p className="font-bold text-sm">{tab.label}</p>
                                </div>
                                <p className={`text-[10px] mt-0.5 ${active === tab.id ? "text-cs-400" : "text-cs-400"}`}>{tab.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Active panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                    >
                        {active === "workload" && <WorkloadGuard />}
                        {active === "velocity" && <VelocityChecker />}
                        {active === "booking" && <BookingDetector />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}