import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/**
 * @param {{ title: string, value: string|number, subtitle?: string, icon: React.ReactNode, trend?: 'up'|'down'|'neutral', trendValue?: string }} props
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend = "neutral",
  trendValue,
}) {
  const trendConfig = {
    up:      { icon: TrendingUp,   color: "text-cs-500", bg: "bg-cs-100" },
    down:    { icon: TrendingDown, color: "text-cs-700", bg: "bg-cs-200" },
    neutral: { icon: Minus,        color: "text-cs-400", bg: "bg-cs-100" },
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-white/80 backdrop-blur-md border border-cs-100 rounded-3xl p-6 flex flex-col gap-3 group relative overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:border-cs-300 hover:-translate-y-2 cursor-default"
    >
      {/* Anime shiny hover sweep */}
      <div className="absolute inset-0 -translate-x-[150%] w-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent opacity-80 z-0 pointer-events-none skew-x-[-25deg]" />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <div className="w-11 h-11 rounded-2xl bg-white border border-cs-100 flex items-center justify-center text-cs-600 group-hover:bg-cs-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110">
          {icon}
        </div>

        {trendValue && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wide uppercase px-2 py-1 rounded-full border border-transparent group-hover:border-cs-200 transition-colors duration-300 shadow-sm ${trendConfig[trend].bg} ${trendConfig[trend].color}`}
          >
            <TrendIcon size={12} />
            {trendValue}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="relative z-10 mt-1">
        <p className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-slate-900 group-hover:to-cs-600 transition-all duration-300">
          {value}
        </p>
        <p className="text-cs-600 text-sm font-bold mt-2">{title}</p>
        {subtitle && (
          <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
