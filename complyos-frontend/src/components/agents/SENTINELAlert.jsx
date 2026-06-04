import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

export function SentinelAlert() {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-cs-900 text-cs-50 rounded-full px-4 py-2 text-sm font-semibold shadow-lg"
    >
      <motion.span
        animate={{ rotate: [0, -14, 12, -8, 8, 0] }}
        transition={{ duration: 0.8, repeat: 1 }}
      >
        <Bell size={15} />
      </motion.span>
      SENTINEL regulatory update detected
    </motion.div>
  );
}
