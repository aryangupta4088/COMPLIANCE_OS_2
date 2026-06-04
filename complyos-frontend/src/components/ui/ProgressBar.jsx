import React from "react";
import { motion } from "framer-motion";

const trackHeights = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

/**
 * @param {{ value: number, label?: string, sublabel?: string, showPercentage?: boolean, size?: 'sm'|'md'|'lg', animated?: boolean }} props
 */
export default function ProgressBar({
  value = 0,
  label,
  sublabel,
  showPercentage = false,
  size = "md",
  animated = true,
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Label row */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-cs-600 text-xs font-medium">{label}</span>
          )}
          {sublabel && (
            <span className="text-cs-400 text-xs">{sublabel}</span>
          )}
          {showPercentage && (
            <span className="text-cs-700 text-xs font-semibold">
              {clamped}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className={`w-full bg-cs-100 rounded-full overflow-hidden ${trackHeights[size] ?? trackHeights.md}`}
      >
        <motion.div
          className="h-full bg-cs-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={animated ? { duration: 0.8, ease: "easeOut" } : { duration: 0 }}
        />
      </div>
    </div>
  );
}
