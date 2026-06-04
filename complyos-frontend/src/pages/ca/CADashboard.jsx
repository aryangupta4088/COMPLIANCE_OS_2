import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Common";
import MetricCard from "../../components/ui/MetricCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { deadlines, documents as mockDocuments } from "../../utils/constants";
import { setToken, setRole, setUserId } from "../../utils/helpers";
import {
  FileText, Landmark, Users,
  ShieldAlert, LogOut, Menu, X,
} from "lucide-react";

const CLIENTS = [
  { name: "Kumar Textiles", urgency: "high" },
  { name: "Raj Foods", urgency: "medium" },
  { name: "Mehta Traders", urgency: "low" },
];

const urgencyDot = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-green-500" };

export default function CADashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(CLIENTS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function handleLogout() {
    setToken("");
    setRole("");
    setUserId("");
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-cs-50">

      {/* ── Dark sidebar ────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 208 : 0 }}
        transition={{ duration: 0.2 }}
        className="bg-cs-900 text-cs-50 flex flex-col overflow-hidden flex-shrink-0"
      >
        <div className="flex flex-col px-5 py-7 h-full">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-bold text-base tracking-tight whitespace-nowrap">ComplianceOS CA</h1>
            <button onClick={() => setSidebarOpen(false)} className="text-cs-500 hover:text-white ml-2">
              <X size={15} />
            </button>
          </div>
          <p className="text-cs-500 text-xs mb-8">Client Control Room</p>

          {/* Client list */}
          <p className="text-[10px] font-bold text-cs-600 tracking-widest uppercase mb-3">Clients</p>
          <div className="flex flex-col gap-1.5 flex-1">
            {CLIENTS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelected(c)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${selected.name === c.name ? "bg-cs-800" : "hover:bg-cs-800/50 text-cs-400"
                  }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${urgencyDot[c.urgency]}`} />
                {c.name}
              </button>
            ))}
          </div>

          {/* Fraud Shield */}
          <div className="mt-6 mb-4">
            <p className="text-[10px] font-bold text-cs-600 tracking-widest uppercase mb-2">Protection</p>
            <button
              onClick={() => navigate("/ca/fraud-shield")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors border border-red-900/40 hover:border-red-700/60"
            >
              <ShieldAlert size={15} className="flex-shrink-0" />
              <span className="whitespace-nowrap">Fraud Shield</span>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-cs-500 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </motion.aside>

      {/* ── Main workspace ──────────────────────────────────────────── */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-cs-500 hover:text-cs-900 transition">
                <Menu size={20} />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-cs-900 tracking-tight">{selected.name}</h1>
              <p className="text-cs-400 text-sm mt-0.5">Compliance workspace and approvals</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/ca/fraud-shield")}
              className="hidden md:flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-lg transition"
            >
              <ShieldAlert size={13} /> Fraud Shield
            </button>
            <Button variant="primary" size="md">Generate Report</Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {[
            ["OPEN DEADLINES", "04", FileText],
            ["DOCS PENDING", "09", FileText],
            ["SCHEMES", "06", Landmark],
            ["RISK SCORE", "LOW", Users],
          ].map(([title, value, Icon]) => (
            <MetricCard key={title} title={title} value={value} icon={<Icon size={16} />} />
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div className="bg-white border border-cs-100 rounded-2xl p-5">
            <h2 className="font-bold text-cs-900 text-base mb-4">Compliance Calendar</h2>
            {deadlines.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center justify-between py-3 border-b border-cs-100 last:border-0">
                <div>
                  <p className="font-semibold text-cs-900 text-sm">{d.title}</p>
                  <p className="text-cs-400 text-xs">{d.deadline_date}</p>
                </div>
                <StatusBadge status={d.urgency === "high" ? "overdue" : "pending"} size="sm" />
              </div>
            ))}
          </div>

          <div className="bg-white border border-cs-100 rounded-2xl p-5">
            <h2 className="font-bold text-cs-900 text-base mb-4">Document List</h2>
            {mockDocuments.slice(0, 4).map((doc) => (
              <div key={doc.name} className="flex items-center justify-between py-3 border-b border-cs-100 last:border-0">
                <div>
                  <p className="font-semibold text-cs-900 text-sm truncate max-w-[180px]">{doc.name}</p>
                  <StatusBadge status={doc.status?.toLowerCase()} size="sm" />
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">Approve</Button>
                  <Button variant="outline" size="sm">Flag</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval queue */}
        <div className="bg-white border border-cs-100 rounded-2xl p-5 mb-5">
          <h2 className="font-bold text-cs-900 text-base mb-4">Pending Approvals Queue</h2>
          {["Scheme application review", "GST filing approval", "Loan documentation review"].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-cs-100 last:border-0">
              <p className="font-semibold text-cs-900 text-sm">{item}</p>
              <Button variant="primary" size="sm" onClick={() => navigate("/ca/approval-requests")}>Review</Button>
            </div>
          ))}
        </div>

        {/* Fraud Shield prompt card */}
        <div
          onClick={() => navigate("/ca/fraud-shield")}
          className="bg-cs-900 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-cs-800 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={18} className="text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">SCOUT Fraud Shield active</p>
            <p className="text-cs-500 text-xs mt-0.5">
              Screen new bookings, catch rubber-stamp approvals, and block CA workflow exploitation before it happens.
            </p>
          </div>
          <span className="text-cs-500 text-xs font-bold group-hover:text-cs-300 transition">Open →</span>
        </div>
      </main>
    </div>
  );
}