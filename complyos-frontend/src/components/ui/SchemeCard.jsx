import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Landmark,
  Leaf,
  GraduationCap,
  Factory,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Button, Badge } from "./Common";

const typeIcons = {
  grant:   Shield,
  loan:    Landmark,
  subsidy: Leaf,
  edu:     GraduationCap,
  factory: Factory,
};

const statusConfig = {
  eligible: { label: "Eligible",  color: "bg-cs-100 text-cs-700" },
  applied:  { label: "Applied",   color: "bg-cs-200 text-cs-800" },
  enrolled: { label: "Enrolled",  color: "bg-cs-800 text-cs-50"  },
};

/**
 * @param {{ schemeName: string, ministry?: string, schemeType?: string, maxBenefit: string, matchScore: number, whyEligible?: string, requiredDocuments?: string[], applicationPortal?: string, isWomenSpecific?: boolean, status?: 'eligible'|'applied'|'enrolled', onApply?: Function }} props
 */
export default function SchemeCard({
  schemeName,
  ministry,
  schemeType = "grant",
  maxBenefit,
  matchScore,
  whyEligible,
  requiredDocuments = [],
  applicationPortal,
  isWomenSpecific = false,
  status = "eligible",
  onApply,
}) {
  const Icon = typeIcons[schemeType] ?? Shield;
  const st = statusConfig[status] ?? statusConfig.eligible;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-cs-100 rounded-2xl p-5 flex flex-col gap-3 relative"
    >
      {/* Match score badge */}
      <span className="absolute top-4 right-4 bg-cs-800 text-cs-50 text-xs font-bold px-2.5 py-1 rounded-full tracking-wide">
        {matchScore}% match
      </span>

      {/* Icon + women badge */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-cs-100 flex items-center justify-center text-cs-600 flex-shrink-0">
          <Icon size={18} />
        </div>
        {isWomenSpecific && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cs-300 text-cs-800">
            Women Scheme
          </span>
        )}
      </div>

      {/* Name + ministry */}
      <div>
        <h3 className="font-bold text-cs-900 text-base leading-snug pr-16">
          {schemeName}
        </h3>
        {ministry && (
          <p className="text-cs-500 text-xs mt-0.5">{ministry}</p>
        )}
      </div>

      {/* Why eligible */}
      {whyEligible && (
        <p className="text-cs-600 text-xs italic leading-snug line-clamp-2">
          {whyEligible}
        </p>
      )}

      {/* Max benefit */}
      <p className="text-cs-800 font-bold text-xl tracking-tight">
        {maxBenefit}
      </p>

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-cs-100">
        <button className="flex items-center gap-1.5 text-cs-500 text-xs font-medium hover:text-cs-700 transition-colors">
          <PlayCircle size={14} />
          Watch explainer
        </button>

        {status === "enrolled" ? (
          <span className="flex items-center gap-1 text-cs-600 text-xs font-semibold">
            <CheckCircle2 size={14} className="text-cs-500" />
            Enrolled
          </span>
        ) : (
          <Button variant="primary" size="sm" onClick={onApply}>
            Apply Now
          </Button>
        )}
      </div>
    </motion.div>
  );
}
