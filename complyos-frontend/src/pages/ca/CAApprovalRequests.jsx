import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldAlert, CheckCircle2, XCircle, AlertTriangle, AlertCircle,
    FileText, ArrowLeft, Eye, Clock, User, Building2, CreditCard,
    TrendingUp, Activity, Fingerprint, Database, Zap, ChevronRight,
    BarChart3, Shield, Search, RefreshCw, X
} from "lucide-react";

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const APPROVAL_REQUESTS = [
    {
        id: "REQ-001",
        clientName: "Ramesh Kumar Enterprises",
        clientId: "CL-4821",
        type: "Loan Guarantee Document",
        amount: "₹38,00,000",
        submittedAt: "2025-01-15 09:42",
        urgency: "urgent",
        fraudCase: "IDENTITY_FRAUD",
        isFraud: true,
        avatar: "RK",
        details: {
            pan: "AABPK7890M",
            aadhaar: "XXXX-XXXX-4821",
            gstin: "27AABPK7890M1Z5",
            businessType: "Textile Trading",
            registeredOn: "2025-01-10",
            turnoverDeclared: "₹2,40,00,000/yr",
            bankBalance: "₹18,40,000",
            documents: [
                { name: "Aadhaar Card", status: "uploaded", pages: 1 },
                { name: "PAN Card", status: "uploaded", pages: 1 },
                { name: "GST Certificate", status: "uploaded", pages: 3 },
                { name: "Bank Statement (6 mo)", status: "uploaded", pages: 24 },
                { name: "Loan Guarantee Form", status: "uploaded", pages: 18 },
            ],
            reviewSeconds: 94,
            deviceFingerprint: "FP-7X92-MATCH",
            livenessPassed: false,
            panDuplicateFound: true,
            priorAccounts: ["R. Kumar — CL-3301", "Ramesh K. — CL-3456"],
            gstApiMatch: false,
            bankStatementSource: "user_upload",
            roundTripTransactions: 4,
            monthsActive: 0,
            applicationCount30Days: 5,
        }
    },
    {
        id: "REQ-002",
        clientName: "Priya Innovations Pvt Ltd",
        clientId: "CL-5502",
        type: "GST Return Approval",
        amount: "—",
        submittedAt: "2025-01-15 10:15",
        urgency: "standard",
        fraudCase: "DOCUMENT_FORGERY",
        isFraud: true,
        avatar: "PI",
        details: {
            pan: "AALPP2341K",
            aadhaar: "XXXX-XXXX-5502",
            gstin: "29AALPP2341K1ZR",
            businessType: "IT Services",
            registeredOn: "2024-06-01",
            turnoverDeclared: "₹95,00,000/yr",
            bankBalance: "₹6,20,000",
            documents: [
                { name: "GST Return Q3", status: "uploaded", pages: 6 },
                { name: "Udyam Certificate", status: "uploaded", pages: 2 },
                { name: "Bank Statement", status: "uploaded", pages: 12 },
                { name: "ITR Acknowledgement", status: "uploaded", pages: 4 },
            ],
            reviewSeconds: 310,
            deviceFingerprint: "FP-2M44-CLEAN",
            livenessPassed: true,
            panDuplicateFound: false,
            priorAccounts: [],
            gstApiMatch: false,
            bankStatementSource: "user_upload",
            documentHashTampered: true,
            similarityScore: 94,
            udyamApiMatch: false,
            monthsActive: 7,
            applicationCount30Days: 1,
        }
    },
    {
        id: "REQ-003",
        clientName: "Mehta & Sons Traders",
        clientId: "CL-6103",
        type: "Loan Referral Application",
        amount: "₹55,00,000",
        submittedAt: "2025-01-15 11:03",
        urgency: "high",
        fraudCase: "LOAN_CREDIT_FRAUD",
        isFraud: true,
        avatar: "MS",
        details: {
            pan: "ACQPM5612L",
            aadhaar: "XXXX-XXXX-6103",
            gstin: "07ACQPM5612L1ZK",
            businessType: "General Trading",
            registeredOn: "2024-12-01",
            turnoverDeclared: "₹4,80,00,000/yr",
            bankBalance: "₹42,00,000",
            documents: [
                { name: "Balance Sheet", status: "uploaded", pages: 8 },
                { name: "P&L Statement", status: "uploaded", pages: 5 },
                { name: "Bank Statement", status: "uploaded", pages: 36 },
                { name: "GST Returns (12 mo)", status: "uploaded", pages: 48 },
                { name: "Loan Application Form", status: "uploaded", pages: 12 },
            ],
            reviewSeconds: 820,
            deviceFingerprint: "FP-9KR3-CLEAN",
            livenessPassed: true,
            panDuplicateFound: false,
            priorAccounts: [],
            gstApiMatch: true,
            bankStatementSource: "account_aggregator",
            roundTripTransactions: 6,
            shellBusinessIndicators: true,
            gstFilingsInCalendar: 0,
            monthsActive: 1.5,
            applicationCount30Days: 4,
            partnerBanksApplied: ["HDFC Bank", "SBI", "Axis Bank", "ICICI Bank"],
        }
    },
    {
        id: "REQ-004",
        clientName: "Sunita Agro Foods Ltd",
        clientId: "CL-2234",
        type: "Scheme Application Review",
        amount: "₹12,00,000",
        submittedAt: "2025-01-15 12:30",
        urgency: "standard",
        fraudCase: null,
        isFraud: false,
        avatar: "SA",
        details: {
            pan: "BNJPS4421R",
            aadhaar: "XXXX-XXXX-2234",
            gstin: "24BNJPS4421R1ZA",
            businessType: "Food Processing",
            registeredOn: "2021-03-15",
            turnoverDeclared: "₹1,20,00,000/yr",
            bankBalance: "₹9,80,000",
            documents: [
                { name: "Udyam Certificate", status: "verified", pages: 2 },
                { name: "GST Returns (6 mo)", status: "verified", pages: 24 },
                { name: "Bank Statement", status: "verified", pages: 18 },
                { name: "Scheme Application", status: "uploaded", pages: 7 },
            ],
            reviewSeconds: 640,
            deviceFingerprint: "FP-3QL8-CLEAN",
            livenessPassed: true,
            panDuplicateFound: false,
            priorAccounts: [],
            gstApiMatch: true,
            bankStatementSource: "account_aggregator",
            roundTripTransactions: 0,
            shellBusinessIndicators: false,
            gstFilingsInCalendar: 12,
            monthsActive: 46,
            applicationCount30Days: 1,
        }
    },
    {
        id: "REQ-005",
        clientName: "Kumar Textiles",
        clientId: "CL-1102",
        type: "Document Signing — Export NOC",
        amount: "—",
        submittedAt: "2025-01-15 13:45",
        urgency: "low",
        fraudCase: null,
        isFraud: false,
        avatar: "KT",
        details: {
            pan: "AAAPK1234C",
            aadhaar: "XXXX-XXXX-1102",
            gstin: "29AAAPK1234C1Z9",
            businessType: "Textile Export",
            registeredOn: "2018-07-22",
            turnoverDeclared: "₹3,60,00,000/yr",
            bankBalance: "₹31,50,000",
            documents: [
                { name: "Export NOC Form", status: "uploaded", pages: 3 },
                { name: "Previous NOC (reference)", status: "verified", pages: 3 },
                { name: "RCMC Certificate", status: "verified", pages: 1 },
            ],
            reviewSeconds: 480,
            deviceFingerprint: "FP-1AA2-CLEAN",
            livenessPassed: true,
            panDuplicateFound: false,
            priorAccounts: [],
            gstApiMatch: true,
            bankStatementSource: "account_aggregator",
            roundTripTransactions: 0,
            shellBusinessIndicators: false,
            gstFilingsInCalendar: 24,
            monthsActive: 78,
            applicationCount30Days: 1,
        }
    },
    {
        id: "REQ-006",
        clientName: "Raj Foods Pvt Ltd",
        clientId: "CL-3390",
        type: "Bank Statement Verification",
        amount: "₹22,00,000",
        submittedAt: "2025-01-15 14:20",
        urgency: "medium",
        fraudCase: "DOCUMENT_FORGERY",
        isFraud: true,
        avatar: "RF",
        details: {
            pan: "BFGPR8812Q",
            aadhaar: "XXXX-XXXX-3390",
            gstin: "27BFGPR8812Q1ZD",
            businessType: "Food Distribution",
            registeredOn: "2023-09-10",
            turnoverDeclared: "₹88,00,000/yr",
            bankBalance: "₹19,40,000",
            documents: [
                { name: "Bank Statement Jan", status: "uploaded", pages: 12 },
                { name: "Bank Statement Feb", status: "uploaded", pages: 12 },
                { name: "GST Certificate", status: "uploaded", pages: 2 },
                { name: "Loan Form", status: "uploaded", pages: 9 },
            ],
            reviewSeconds: 520,
            deviceFingerprint: "FP-5QW7-CLEAN",
            livenessPassed: true,
            panDuplicateFound: false,
            priorAccounts: [],
            gstApiMatch: true,
            bankStatementSource: "user_upload",
            documentHashTampered: false,
            similarityScore: 97,
            monthsActive: 16,
            applicationCount30Days: 2,
        }
    }
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const urgencyConfig = {
    urgent: { color: "text-red-500", bg: "bg-red-50 border-red-200", dot: "bg-red-500", label: "URGENT" },
    high: { color: "text-orange-500", bg: "bg-orange-50 border-orange-200", dot: "bg-orange-500", label: "HIGH" },
    medium: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-400", label: "MEDIUM" },
    standard: { color: "text-blue-500", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-400", label: "STANDARD" },
    low: { color: "text-green-600", bg: "bg-green-50 border-green-200", dot: "bg-green-500", label: "LOW" },
};

const fraudLabels = {
    IDENTITY_FRAUD: { label: "Identity Fraud", color: "text-red-700", bg: "bg-red-100" },
    DOCUMENT_FORGERY: { label: "Document Forgery", color: "text-orange-700", bg: "bg-orange-100" },
    LOAN_CREDIT_FRAUD: { label: "Loan & Credit Fraud", color: "text-purple-700", bg: "bg-purple-100" },
};

function MetricBar({ label, value, max, danger }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-36 flex-shrink-0">{label}</span>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className={`h-full rounded-full ${danger ? (pct > 60 ? "bg-red-500" : pct > 30 ? "bg-amber-400" : "bg-green-500") : "bg-emerald-500"}`}
                />
            </div>
            <span className="text-xs font-bold text-slate-700 w-10 text-right">{value}</span>
        </div>
    );
}

function CheckRow({ label, pass, detail }) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${pass ? "bg-emerald-100" : "bg-red-100"}`}>
                {pass ? <CheckCircle2 size={11} className="text-emerald-600" /> : <XCircle size={11} className="text-red-600" />}
            </div>
            <div>
                <p className={`text-sm font-semibold ${pass ? "text-slate-700" : "text-red-700"}`}>{label}</p>
                {detail && <p className="text-xs text-slate-400 mt-0.5">{detail}</p>}
            </div>
        </div>
    );
}

// ── VERIFICATION PAGE ─────────────────────────────────────────────────────────
function VerificationPage({ request, onBack }) {
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);
    const d = request.details;

    const SCAN_STEPS = [
        "Querying UIDAI database for Aadhaar status…",
        "Running PAN deduplication hash check…",
        "Fetching GST portal data via official API…",
        "Comparing document hashes for tamper detection…",
        "Scanning device fingerprint registry…",
        "Running behavioural pattern analysis…",
        "Checking Account Aggregator bank data…",
        "Computing financial consistency score…",
        "Finalising fraud risk verdict…",
    ];

    useEffect(() => {
        let s = 0;
        const iv = setInterval(() => {
            s++;
            setStep(s);
            if (s >= SCAN_STEPS.length) {
                clearInterval(iv);
                setTimeout(() => setLoading(false), 400);
            }
        }, 420);
        return () => clearInterval(iv);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                            <ShieldAlert size={18} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold">SCOUT Verification Engine</p>
                            <p className="text-slate-500 text-xs">ComplianceOS Fraud Detection</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-5">Live Scan — {request.clientName}</p>
                        <div className="flex flex-col gap-3">
                            {SCAN_STEPS.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`flex items-center gap-3 text-sm ${i < step ? "text-emerald-400" : i === step ? "text-white" : "text-slate-600"}`}
                                >
                                    {i < step && <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />}
                                    {i === step && (
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                                            <RefreshCw size={13} className="text-amber-400 flex-shrink-0" />
                                        </motion.div>
                                    )}
                                    {i > step && <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />}
                                    <span className={i === step ? "font-semibold" : ""}>{s}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        {Array.from({ length: SCAN_STEPS.length }).map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? "bg-emerald-500" : i === step ? "bg-amber-400" : "bg-slate-800"}`} />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    // Build verification checks
    const checks = buildChecks(request);
    const riskScore = computeRiskScore(request);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-slate-50"
        >
            {/* Header */}
            <div className={`${request.isFraud ? "bg-red-700" : "bg-emerald-700"} px-6 py-5`}>
                <div className="max-w-5xl mx-auto">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition">
                        <ArrowLeft size={15} /> Back to requests
                    </button>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                    <ShieldAlert size={17} className="text-white" />
                                </div>
                                <span className="text-white/70 text-sm font-medium">SCOUT Verification Report</span>
                            </div>
                            <h1 className="text-2xl font-black text-white">{request.clientName}</h1>
                            <p className="text-white/60 text-sm mt-0.5">{request.type} · {request.id}</p>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm ${request.isFraud ? "bg-red-900/60 text-red-200 border border-red-600/50" : "bg-emerald-900/60 text-emerald-200 border border-emerald-600/50"}`}>
                                {request.isFraud ? <><XCircle size={14} /> FRAUD DETECTED</> : <><CheckCircle2 size={14} /> CLEAR — APPROVE</>}
                            </div>
                            <p className="text-white/50 text-xs mt-2">Risk Score: {riskScore}/100</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Risk Gauge */}
                <div className="lg:col-span-1 flex flex-col gap-5">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Fraud Risk Score</p>
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${request.isFraud ? "border-red-500 bg-red-50" : "border-emerald-500 bg-emerald-50"}`}>
                                <div className="text-center">
                                    <p className={`text-2xl font-black ${request.isFraud ? "text-red-600" : "text-emerald-600"}`}>{riskScore}</p>
                                    <p className="text-xs text-slate-400">/100</p>
                                </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${request.isFraud ? (riskScore > 70 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700") : "bg-emerald-100 text-emerald-700"}`}>
                                {riskScore > 70 ? "HIGH RISK" : riskScore > 40 ? "MEDIUM RISK" : "LOW RISK"}
                            </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-2.5">
                            <MetricBar label="Identity Integrity" value={checks.identityScore} max={100} danger />
                            <MetricBar label="Document Integrity" value={checks.docScore} max={100} danger />
                            <MetricBar label="Financial Consistency" value={checks.financialScore} max={100} danger />
                            <MetricBar label="Behavioural Pattern" value={checks.behaviourScore} max={100} danger />
                        </div>
                    </div>

                    {/* Fraud type badge */}
                    {request.isFraud && request.fraudCase && (
                        <div className="bg-red-900 rounded-2xl p-4 border border-red-800">
                            <p className="text-[10px] font-bold text-red-400 tracking-widest uppercase mb-2">Detected Fraud Type</p>
                            <p className="text-white font-black text-base">{fraudLabels[request.fraudCase].label}</p>
                            <p className="text-red-300 text-xs mt-1.5">{getFraudDescription(request.fraudCase)}</p>
                        </div>
                    )}

                    {!request.isFraud && (
                        <div className="bg-emerald-900 rounded-2xl p-4 border border-emerald-800">
                            <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mb-2">Verification Status</p>
                            <p className="text-white font-black text-base">All Checks Passed</p>
                            <p className="text-emerald-300 text-xs mt-1.5">No fraud indicators found. Document is authentic and consistent across all verification layers.</p>
                        </div>
                    )}
                </div>

                {/* Main analysis */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Verification checks */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">System Verification Checks</p>
                        <div className="flex flex-col">
                            {checks.items.map((c, i) => <CheckRow key={i} label={c.label} pass={c.pass} detail={c.detail} />)}
                        </div>
                    </div>

                    {/* Fraud signals or clean signals */}
                    {request.isFraud ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5">
                            <p className="text-[10px] font-bold text-red-500 tracking-widest uppercase mb-4">Fraud Signals Detected</p>
                            <div className="flex flex-col gap-2.5">
                                {getFraudSignals(request).map((s, i) => (
                                    <div key={i} className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                                        <AlertTriangle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-red-700 text-xs leading-relaxed">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5">
                            <p className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase mb-4">Clean Signals — Why This Is Safe</p>
                            <div className="flex flex-col gap-2.5">
                                {getCleanSignals(request).map((s, i) => (
                                    <div key={i} className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                                        <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-emerald-700 text-xs leading-relaxed">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Document review time analysis */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Review Time Analysis</p>
                        <ReviewTimeChart request={request} />
                    </div>

                    {/* Submitted documents */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Submitted Documents</p>
                        <div className="flex flex-col gap-2">
                            {d.documents.map((doc, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-2.5">
                                        <FileText size={13} className="text-slate-400" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">{doc.name}</p>
                                            <p className="text-xs text-slate-400">{doc.pages} page{doc.pages > 1 ? "s" : ""}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${doc.status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                        {doc.status === "verified" ? "✓ VERIFIED" : "UPLOADED"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform action */}
                    <div className={`rounded-2xl p-5 ${request.isFraud ? "bg-red-700 border border-red-600" : "bg-emerald-700 border border-emerald-600"}`}>
                        <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${request.isFraud ? "text-red-300" : "text-emerald-300"}`}>
                            {request.isFraud ? "⛔ Platform Action — BLOCKING" : "✅ Platform Recommendation"}
                        </p>
                        <p className="text-white font-bold text-sm leading-relaxed">{getPlatformAction(request)}</p>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}

// ── REVIEW TIME CHART ─────────────────────────────────────────────────────────
function ReviewTimeChart({ request }) {
    const d = request.details;
    const safeMin = getSafeMinimum(request.type);
    const actual = d.reviewSeconds;
    const maxBar = Math.max(safeMin * 1.5, actual * 1.2);
    const safeWidth = (safeMin / maxBar) * 100;
    const actualWidth = (actual / maxBar) * 100;
    const isUnder = actual < safeMin;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Actual review time</span>
                        <span className={`font-bold ${isUnder ? "text-red-600" : "text-emerald-600"}`}>{formatSeconds(actual)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${actualWidth}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isUnder ? "bg-red-500" : "bg-emerald-500"}`}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Safe minimum required</span>
                        <span className="font-bold text-slate-600">{formatSeconds(safeMin)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${safeWidth}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className="h-full rounded-full bg-slate-400"
                        />
                    </div>
                </div>
            </div>
            <div className={`rounded-xl px-3 py-2.5 text-xs font-medium ${isUnder ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                {isUnder
                    ? `⚠️ Review was ${formatSeconds(safeMin - actual)} below safe minimum. Rubber-stamp risk flagged.`
                    : `✓ Review time meets minimum threshold by ${formatSeconds(actual - safeMin)}.`}
            </div>
        </div>
    );
}

// ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────
function getSafeMinimum(type) {
    if (type.toLowerCase().includes("loan")) return 600;
    if (type.toLowerCase().includes("bank")) return 480;
    if (type.toLowerCase().includes("scheme")) return 360;
    if (type.toLowerCase().includes("gst")) return 300;
    return 240;
}

function formatSeconds(s) {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function getFraudDescription(type) {
    return {
        IDENTITY_FRAUD: "Multiple accounts detected with same PAN. Liveness check failed. Device fingerprint matched to existing profiles.",
        DOCUMENT_FORGERY: "Document hash mismatch detected post-upload. Visual similarity engine found 94%+ match with previously flagged templates.",
        LOAN_CREDIT_FRAUD: "Shell business indicators present. Round-trip transactions detected. Multi-bank simultaneous applications in 30-day window.",
    }[type] || "";
}

function computeRiskScore(req) {
    if (!req.isFraud) return Math.floor(Math.random() * 15) + 5;
    const base = { IDENTITY_FRAUD: 92, DOCUMENT_FORGERY: 78, LOAN_CREDIT_FRAUD: 85 };
    return base[req.fraudCase] || 70;
}

function buildChecks(req) {
    const d = req.details;
    const items = [];

    items.push({ label: "Aadhaar Liveness Check (UIDAI)", pass: d.livenessPassed ?? true, detail: d.livenessPassed ? "Live selfie matched Aadhaar photo successfully" : "Liveness check failed — face mismatch or no response" });
    items.push({ label: "PAN Deduplication Hash", pass: !d.panDuplicateFound, detail: d.panDuplicateFound ? `Duplicate found: ${d.priorAccounts?.join(", ")}` : "PAN hash is unique — no duplicate accounts" });
    items.push({ label: "GST Portal API Verification", pass: d.gstApiMatch ?? true, detail: d.gstApiMatch ? "Certificate fetched directly from GST portal — authentic" : "Uploaded certificate does not match GST portal data" });
    items.push({ label: "Document Hash Integrity", pass: !(d.documentHashTampered || d.similarityScore > 90), detail: d.documentHashTampered ? "Hash mismatch — document modified after upload" : d.similarityScore > 90 ? `Similarity engine flagged ${d.similarityScore}% match with known template` : "All document hashes verified — no tampering" });
    items.push({ label: "Bank Statement Source", pass: d.bankStatementSource === "account_aggregator", detail: d.bankStatementSource === "account_aggregator" ? "Data sourced directly from Account Aggregator — tamper-proof" : "User-uploaded statement — not directly verified from bank" });
    items.push({ label: "Device Fingerprint Registry", pass: !d.deviceFingerprint?.includes("MATCH"), detail: d.deviceFingerprint?.includes("MATCH") ? "Device fingerprint matched to existing suspended profile" : "Device fingerprint is unique — no collision" });
    if (d.roundTripTransactions !== undefined) items.push({ label: "Round-Trip Transaction Scan", pass: d.roundTripTransactions === 0, detail: d.roundTripTransactions > 0 ? `${d.roundTripTransactions} round-trip cycles detected in 90-day window` : "No round-trip transaction patterns found" });
    if (d.applicationCount30Days !== undefined) items.push({ label: "Multi-Bank Application Check", pass: d.applicationCount30Days <= 2, detail: d.applicationCount30Days > 2 ? `Applied to ${d.applicationCount30Days} partner banks in 30 days` : "Application frequency within normal range" });
    if (d.gstFilingsInCalendar !== undefined) items.push({ label: "Business Activity (Shell Check)", pass: d.gstFilingsInCalendar > 0, detail: d.gstFilingsInCalendar > 0 ? `${d.gstFilingsInCalendar} GST filings found — active business` : "Zero compliance activity — possible shell business" });

    const passCount = items.filter(i => i.pass).length;
    const total = items.length;

    return {
        items,
        identityScore: (!d.panDuplicateFound && (d.livenessPassed ?? true) && !d.deviceFingerprint?.includes("MATCH")) ? (req.isFraud ? 15 : 92) : 15,
        docScore: (d.gstApiMatch && !(d.documentHashTampered) && !(d.similarityScore > 90)) ? (req.isFraud ? 20 : 88) : 20,
        financialScore: (d.bankStatementSource === "account_aggregator" && d.roundTripTransactions === 0) ? (req.isFraud ? 18 : 91) : 18,
        behaviourScore: ((d.applicationCount30Days ?? 0) <= 2 && (d.gstFilingsInCalendar ?? 1) > 0) ? (req.isFraud ? 12 : 95) : 12,
    };
}

function getFraudSignals(req) {
    const d = req.details;
    const signals = [];
    if (d.panDuplicateFound) signals.push(`PAN ${d.pan} is linked to ${d.priorAccounts?.length} other accounts: ${d.priorAccounts?.join(" and ")}. Same PAN hash detected across multiple registrations.`);
    if (!d.livenessPassed) signals.push("Liveness check failed at onboarding. The selfie submitted does not match the Aadhaar photograph. Possible identity theft or deceased person document.");
    if (d.documentHashTampered) signals.push("Cryptographic hash of uploaded document does not match the original. Document was modified after initial receipt by the system.");
    if (d.similarityScore > 90) signals.push(`Visual similarity engine scored ${d.similarityScore}% match against a previously flagged document template. Pattern consistent with 'same template, different numbers' fraud.`);
    if (d.bankStatementSource === "user_upload") signals.push("Bank statement was user-uploaded, not sourced from Account Aggregator. Figures cannot be verified against bank's own systems.");
    if (d.roundTripTransactions > 0) signals.push(`${d.roundTripTransactions} round-trip transaction cycles detected in 90 days. Money leaves and returns from same accounts in short windows — artificial revenue inflation pattern.`);
    if (d.applicationCount30Days > 2) signals.push(`Loan applications submitted to ${d.partnerBanksApplied?.length ?? d.applicationCount30Days} partner banks within 30 days (${d.partnerBanksApplied?.join(", ")}). Simultaneous multi-application fraud pattern.`);
    if (d.gstFilingsInCalendar === 0) signals.push("Zero GST filings, no CA interactions, no scheme activity beyond initial registration. Business exists only on paper — shell business indicators confirmed.");
    if (d.deviceFingerprint?.includes("MATCH")) signals.push("Device fingerprint collides with a previously suspended account. Same device is being used to create multiple identities.");
    return signals;
}

function getCleanSignals(req) {
    const d = req.details;
    return [
        `PAN (${d.pan}) is unique across the platform — no duplicate accounts or hash collisions found in the deduplication engine.`,
        "Liveness check passed successfully at onboarding. Selfie matched Aadhaar photograph with high confidence.",
        d.gstApiMatch ? "GST certificate was fetched directly from the GST portal API — user had no opportunity to modify it." : "GST data is consistent.",
        d.bankStatementSource === "account_aggregator" ? "Bank statement sourced directly from India's Account Aggregator framework — data is bank-certified and tamper-proof." : "Bank data is consistent.",
        `Business has been active for ${d.monthsActive} months with ${d.gstFilingsInCalendar ?? "regular"} compliance filings — not a shell business.`,
        "Device fingerprint is unique — no collision with existing or suspended accounts.",
        d.applicationCount30Days <= 2 ? `Only ${d.applicationCount30Days} loan application(s) in the last 30 days — within legitimate business norms.` : "Application history is normal.",
        "Financial data is consistent with declared business sector and turnover range.",
    ];
}

function getPlatformAction(req) {
    if (!req.isFraud) return "All verification layers passed. Document is authentic. CA may proceed with approval. This approval will be timestamped and hash-locked in the Compliance Vault.";
    const actions = {
        IDENTITY_FRAUD: "Registration BLOCKED. Duplicate PAN accounts suspended pending manual review. UIDAI notified. Partner banks alerted to identity compromise. CA must not approve any documents from this profile until identity is resolved by compliance officer.",
        DOCUMENT_FORGERY: "Document VOIDED. CA approval will not be processed. Document hash mismatch logged and escalated. Client notified that re-submission requires government API verification. CA is protected from liability.",
        LOAN_CREDIT_FRAUD: "Loan referral BLOCKED. All pending partner bank applications paused. Shell business flag raised. Compliance officer assigned for manual investigation. Post-disbursement monitoring activated if any prior loans exist.",
    };
    return actions[req.fraudCase] || "Request blocked pending manual review.";
}

// ── REQUEST CARD ──────────────────────────────────────────────────────────────
function RequestCard({ request, onClick }) {
    const urg = urgencyConfig[request.urgency] || urgencyConfig.standard;
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -1 }}
            onClick={onClick}
            className="bg-white border border-slate-100 rounded-2xl p-4 cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all group"
        >
            <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black ${request.isFraud ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {request.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-bold text-slate-900 text-sm truncate">{request.clientName}</p>
                            <p className="text-slate-400 text-xs">{request.type}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {request.isFraud && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                                    <AlertTriangle size={9} /> FRAUD
                                </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urg.bg} ${urg.color}`}>
                                {urg.label}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-3">
                            {request.amount !== "—" && (
                                <span className="text-xs font-semibold text-slate-600">{request.amount}</span>
                            )}
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={10} /> {request.submittedAt}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-700 transition flex items-center gap-1">
                            <Eye size={11} /> View <ChevronRight size={11} />
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ── DETAIL PAGE ───────────────────────────────────────────────────────────────
function DetailPage({ request, onBack, onVerify }) {
    const d = request.details;
    const urg = urgencyConfig[request.urgency] || urgencyConfig.standard;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-screen bg-slate-50"
        >
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm transition">
                            <ArrowLeft size={15} /> Back
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <span className="text-slate-400 text-sm">{request.id}</span>
                    </div>
                    <button
                        onClick={onVerify}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition"
                    >
                        <ShieldAlert size={13} /> Verify Document
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Left col */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mb-3 ${request.isFraud ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {request.avatar}
                        </div>
                        <h2 className="font-black text-slate-900 text-lg">{request.clientName}</h2>
                        <p className="text-slate-400 text-xs mt-0.5">{d.businessType}</p>
                        <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${urg.bg} ${urg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`} />
                            {urg.label}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Identity</p>
                        {[["PAN", d.pan], ["Aadhaar", d.aadhaar], ["GSTIN", d.gstin], ["Client ID", request.clientId]].map(([k, v]) => (
                            <div key={k} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                                <span className="text-xs text-slate-400">{k}</span>
                                <span className="text-xs font-semibold text-slate-700 font-mono">{v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Financials</p>
                        {[["Declared Turnover", d.turnoverDeclared], ["Bank Balance", d.bankBalance], ["Amount Requested", request.amount], ["Registered Since", d.registeredOn]].map(([k, v]) => (
                            <div key={k} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                                <span className="text-xs text-slate-400">{k}</span>
                                <span className="text-xs font-semibold text-slate-700">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right col */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Request Type</p>
                        <h3 className="text-lg font-black text-slate-900">{request.type}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">Submitted: {request.submittedAt}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Documents Submitted</p>
                        <div className="flex flex-col gap-2">
                            {d.documents.map((doc, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-2.5">
                                        <FileText size={13} className="text-slate-400" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">{doc.name}</p>
                                            <p className="text-xs text-slate-400">{doc.pages} page{doc.pages > 1 ? "s" : ""}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${doc.status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                                        {doc.status === "verified" ? "✓ API VERIFIED" : "UPLOADED"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Quick Stats</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                ["Account Age", `${d.monthsActive} months`, d.monthsActive < 3],
                                ["Apps (30 days)", d.applicationCount30Days?.toString() ?? "1", (d.applicationCount30Days ?? 1) > 2],
                                ["Compliance Filings", d.gstFilingsInCalendar?.toString() ?? "—", d.gstFilingsInCalendar === 0],
                                ["Bank Source", d.bankStatementSource === "account_aggregator" ? "Aggregator ✓" : "User Upload ⚠", d.bankStatementSource !== "account_aggregator"],
                            ].map(([label, value, warn]) => (
                                <div key={label} className={`rounded-xl p-3.5 border ${warn ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                                    <p className={`text-base font-black ${warn ? "text-red-700" : "text-slate-800"}`}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={onVerify}
                        className="w-full bg-slate-900 hover:bg-slate-700 text-white rounded-2xl py-4 flex items-center justify-center gap-2.5 font-bold transition group"
                    >
                        <ShieldAlert size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
                        Run SCOUT Verification
                        <ChevronRight size={15} className="text-slate-400" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ── MAIN LIST VIEW ────────────────────────────────────────────────────────────
function ListView({ onSelect }) {
    const fraudCount = APPROVAL_REQUESTS.filter(r => r.isFraud).length;
    const clearCount = APPROVAL_REQUESTS.filter(r => !r.isFraud).length;
    const urgentCount = APPROVAL_REQUESTS.filter(r => r.urgency === "urgent" || r.urgency === "high").length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 px-6 py-5">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                            <ShieldAlert size={15} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">ComplianceOS CA Portal</p>
                            <p className="text-slate-500 text-xs">Pending Approval Requests</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            ["Total Requests", APPROVAL_REQUESTS.length, "text-white", "bg-slate-800"],
                            ["Fraud Flagged", fraudCount, "text-red-400", "bg-red-900/40 border border-red-800/50"],
                            ["Clear", clearCount, "text-emerald-400", "bg-emerald-900/40 border border-emerald-800/50"],
                        ].map(([label, val, color, bg]) => (
                            <div key={label} className={`rounded-xl p-3 ${bg}`}>
                                <p className={`text-xl font-black ${color}`}>{val}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="max-w-2xl mx-auto px-6 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">All Requests</p>
                    <p className="text-xs text-slate-400">{urgentCount} urgent</p>
                </div>
                {APPROVAL_REQUESTS.map((req, i) => (
                    <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                        <RequestCard request={req} onClick={() => onSelect(req)} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────────
export default function CAApprovalRequests() {
    const [view, setView] = useState("list"); // list | detail | verify
    const [selected, setSelected] = useState(null);

    function selectRequest(req) {
        setSelected(req);
        setView("detail");
    }

    function goVerify() {
        setView("verify");
    }

    function goBack() {
        if (view === "verify") setView("detail");
        else { setView("list"); setSelected(null); }
    }

    return (
        <AnimatePresence mode="wait">
            {view === "list" && (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ListView onSelect={selectRequest} />
                </motion.div>
            )}
            {view === "detail" && selected && (
                <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DetailPage request={selected} onBack={goBack} onVerify={goVerify} />
                </motion.div>
            )}
            {view === "verify" && selected && (
                <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <VerificationPage request={selected} onBack={goBack} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}