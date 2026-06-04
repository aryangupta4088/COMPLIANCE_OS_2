import React from "react";
import { motion } from "framer-motion";
import { motion as m } from "framer-motion";
import { AlertTriangle, Clock, Info, Shield } from "lucide-react";
import { Button } from "./Common";

const urgencyConfig = {
  high:   { border: "border-l-cs-900", icon: AlertTriangle, iconBg: "bg-cs-900/10", iconColor: "text-cs-900" },
  medium: { border: "border-l-cs-700", icon: Clock,          iconBg: "bg-cs-200",    iconColor: "text-cs-700" },
  low:    { border: "border-l-cs-500", icon: Info,           iconBg: "bg-cs-100",    iconColor: "text-cs-500" },
  info:   { border: "border-l-cs-400", icon: Shield,         iconBg: "bg-cs-100",    iconColor: "text-cs-400" },
};

/**
 * @param {{ title: string, description?: string, urgency: 'high'|'medium'|'low'|'info', source?: string, timestamp?: string, actionLabel?: string, onAction?: Function, isSentinel?: boolean }} props
 */
export default function NoticeRow({
  title,
  description,
  urgency = "info",
  source,
  timestamp,
  actionLabel,
  onAction,
  isSentinel = false,
}) {
  const cfg = urgencyConfig[urgency] ?? urgencyConfig.info;
  const Icon = cfg.icon;

  const urgencyLabels = {
    high:   { text: "URGENT",     bg: "bg-cs-900 text-cs-50" },
    medium: { text: "7 DAYS",     bg: "bg-cs-200 text-cs-700" },
    low:    { text: "NEW SCHEME", bg: "bg-cs-100 text-cs-600" },
    info:   { text: "INFO",       bg: "bg-cs-100 text-cs-500" },
  };

  const labelCfg = urgencyLabels[urgency] ?? urgencyLabels.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border border-cs-100 border-l-4 ${cfg.border} rounded-xl px-5 py-4 flex items-center gap-4`}
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-full ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={16} className={cfg.iconColor} />
      </div>

      {/* Label + title */}
      <div className="flex items-center gap-2 min-w-[120px]">
        {isSentinel ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest bg-cs-800 text-cs-50">
            SENTINEL
          </span>
        ) : (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest ${labelCfg.bg}`}
          >
            {labelCfg.text}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-cs-900 text-sm leading-snug">{title}</p>
        {description && (
          <p className="text-cs-400 text-xs mt-0.5 truncate">{description}</p>
        )}
        {timestamp && (
          <p className="text-cs-400 text-xs mt-0.5">{timestamp}</p>
        )}
      </div>

      {/* Action */}
      {actionLabel && (
        <Button
          variant={urgency === "high" ? "primary" : "outline"}
          size="sm"
          onClick={onAction}
          className="flex-shrink-0"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
