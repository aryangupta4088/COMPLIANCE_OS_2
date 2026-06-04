import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const ICONS = {
  high: <AlertTriangle size={14} className="text-red-500" />,
  medium: <Info size={14} className="text-amber-500" />,
  low: <CheckCircle size={14} className="text-green-500" />,
};

export default function NoticeRow({ notice, onRead }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => onRead?.(notice.id)}
      className={`flex items-start gap-4 px-5 py-4 rounded-xl cursor-pointer transition-colors ${
        notice.is_read ? "bg-transparent" : "bg-cs-50"
      }`}
    >
      <div className="mt-0.5">{ICONS[notice.urgency] || ICONS.low}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${notice.is_read ? "text-cs-600" : "text-cs-900"}`}>{notice.title}</p>
        <p className="text-cs-400 text-xs mt-0.5 truncate">{notice.message}</p>
      </div>
      <div className="text-cs-400 text-xs flex-shrink-0">{formatDate(notice.created_at)}</div>
    </motion.div>
  );
}
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
