import React from "react";
import { motion } from "framer-motion";
import { Landmark, Store, Rocket, PlayCircle } from "lucide-react";
import { Button } from "./Common";

const typeIcons = {
  msme:     Store,
  startup:  Rocket,
  women:    Landmark,
  default:  Landmark,
};

/**
 * @param {{ schemeName: string, maxAmount: string, eligibilityScore: number, interestRate?: string, schemeType?: string, applicationPortal?: string, onExpressInterest?: Function }} props
 */
export default function LoanCard({
  schemeName,
  maxAmount,
  eligibilityScore = 0,
  interestRate,
  schemeType = "default",
  applicationPortal,
  onExpressInterest,
}) {
  const Icon = typeIcons[schemeType] ?? typeIcons.default;

  const scoreBadge =
    eligibilityScore >= 80
      ? { text: "HIGH ELIGIBILITY",   classes: "bg-cs-500 text-cs-50" }
      : eligibilityScore >= 50
      ? { text: "MEDIUM ELIGIBILITY", classes: "bg-cs-400 text-cs-50" }
      : { text: "LOW ELIGIBILITY",    classes: "bg-cs-300 text-cs-800" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-cs-100 rounded-2xl p-5 flex flex-col gap-3 relative"
    >
      {/* Eligibility score badge */}
      <span
        className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full tracking-wide ${scoreBadge.classes}`}
      >
        {scoreBadge.text}
      </span>

      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-cs-100 flex items-center justify-center text-cs-600">
        <Icon size={18} />
      </div>

      {/* Name */}
      <h3 className="font-bold text-cs-900 text-base leading-snug pr-28">
        {schemeName}
      </h3>

      {/* Amount */}
      <p className="text-cs-800 font-bold text-2xl tracking-tight">
        {maxAmount}
      </p>

      {/* Interest rate */}
      {interestRate && (
        <p className="text-cs-600 text-xs">{interestRate}</p>
      )}

      {/* Watch explainer link */}
      <button className="flex items-center gap-1.5 text-cs-500 text-xs font-medium hover:text-cs-700 transition-colors w-fit">
        <PlayCircle size={14} />
        Watch Explainer
      </button>

      {/* CTA */}
      <Button
        variant="primary"
        size="md"
        onClick={onExpressInterest}
        className="w-full mt-1"
      >
        Express Interest
      </Button>
    </motion.div>
  );
}
