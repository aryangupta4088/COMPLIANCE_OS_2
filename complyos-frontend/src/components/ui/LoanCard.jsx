import React from "react";
import { motion } from "framer-motion";
import { Building, Percent, Clock } from "lucide-react";

export default function LoanCard({ loan, onInterest }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(21,27,30,0.10)" }}
      className="bg-white border border-cs-100 rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-cs-900">{loan.name}</h3>
          <p className="text-cs-500 text-xs flex items-center gap-1 mt-0.5"><Building size={11} />{loan.bank}</p>
        </div>
        <div className="text-right">
          <p className="text-cs-900 font-extrabold text-lg">{loan.amount}</p>
          <p className="text-cs-500 text-xs">max loan</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-cs-50 rounded-xl p-3 text-center">
          <p className="text-cs-500 text-xs mb-1 flex items-center justify-center gap-1"><Percent size={10} />Interest Rate</p>
          <p className="text-cs-900 font-bold text-sm">{loan.rate}</p>
        </div>
        <div className="bg-cs-50 rounded-xl p-3 text-center">
          <p className="text-cs-500 text-xs mb-1 flex items-center justify-center gap-1"><Clock size={10} />Tenure</p>
          <p className="text-cs-900 font-bold text-sm">{loan.tenure}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onInterest?.(loan)}
        className="w-full bg-cs-800 text-cs-50 py-2.5 rounded-xl text-sm font-bold"
      >
        Express Interest
      </motion.button>
    </motion.div>
  );
}
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
