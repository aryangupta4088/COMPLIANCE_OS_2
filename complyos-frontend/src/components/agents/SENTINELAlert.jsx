import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, ArrowRight } from "lucide-react";

const DEMO_ALERTS = [
  { id: 1, message: "New GST circular affects textile businesses in UP. Filing deadline moves from 15th this quarter.", urgency: "high" },
  { id: 2, message: "Labour Code 2026 update: State-specific minimum wage revision effective July 1st.", urgency: "medium" },
];

export function SentinelAlert() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [current, setCurrent] = useState(0);

  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`mx-6 mt-6 rounded-2xl border px-5 py-4 flex items-center gap-4 ${
        alerts[current]?.urgency === "high"
          ? "bg-red-50 border-red-200"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <Shield size={18} className={alerts[current]?.urgency === "high" ? "text-red-600" : "text-amber-600"} />
      <p className={`flex-1 text-sm font-semibold ${alerts[current]?.urgency === "high" ? "text-red-800" : "text-amber-800"}`}>
        <span className="font-black">SENTINEL: </span>{alerts[current]?.message}
      </p>
      <button className="flex items-center gap-1 text-xs font-bold text-cs-600 hover:text-cs-900">
        View <ArrowRight size={12} />
      </button>
      <button onClick={() => setAlerts(a => a.filter((_, i) => i !== current))} className="text-cs-400 hover:text-cs-700">
        <X size={16} />
      </button>
    </motion.div>
  );
}
