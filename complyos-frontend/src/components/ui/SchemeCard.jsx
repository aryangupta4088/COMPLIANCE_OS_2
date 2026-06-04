import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Star } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function SchemeCard({ scheme, onApply, applied }) {
  const score = scheme.eligibility_match_score || 0;
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(21,27,30,0.10)" }}
      className="bg-white border border-cs-100 rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-cs-900 text-base">{scheme.scheme_name}</h3>
          <p className="text-cs-500 text-xs mt-0.5">{scheme.ministry}</p>
        </div>
        <div className="flex items-center gap-1 bg-cs-50 border border-cs-100 px-2.5 py-1 rounded-full">
          <Star size={11} className="text-amber-500 fill-amber-500" />
          <span className="text-cs-700 text-xs font-bold">{score}% match</span>
        </div>
      </div>

      <p className="text-cs-600 text-sm">{scheme.why_eligible}</p>

      {scheme.max_benefit && (
        <div className="bg-cs-50 rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-cs-500 text-xs">Max Benefit</span>
          <span className="text-cs-900 font-bold text-sm">{scheme.max_benefit}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-auto">
        {scheme.is_women_specific && (
          <StatusBadge status="enrolled" label="Women's Scheme" />
        )}
        <StatusBadge status={scheme.scheme_type || "grant"} label={scheme.scheme_type} />
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onApply?.(scheme.scheme_name)}
        disabled={applied}
        className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
          applied
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-cs-800 text-cs-50 hover:bg-cs-700"
        }`}
      >
        {applied ? <><CheckCircle size={16} /> Applied</> : <><ExternalLink size={16} /> Apply Now</>}
      </motion.button>
    </motion.div>
  );
}
