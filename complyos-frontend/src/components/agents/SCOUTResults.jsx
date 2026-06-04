import React from "react";
import { motion } from "framer-motion";
import { Loader, SearchX } from "lucide-react";
import SchemeCard from "../ui/SchemeCard";

export function SCOUTResults({ schemes, loading, error, onApply, appliedSchemes = [] }) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader size={28} className="text-cs-500 animate-spin" />
      <p className="text-cs-600 font-semibold text-sm">SCOUT is finding eligible schemes...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-cs-500 text-sm">{error}</div>
  );

  if (schemes.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <SearchX size={32} className="text-cs-300" />
      <p className="text-cs-600 font-semibold">No schemes found yet</p>
      <p className="text-cs-400 text-xs">Complete your business profile so SCOUT can find eligible schemes</p>
    </div>
  );

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
    >
      {schemes.map((scheme, i) => (
        <motion.div
          key={i}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <SchemeCard
            scheme={scheme}
            onApply={onApply}
            applied={appliedSchemes.includes(scheme.scheme_name)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
