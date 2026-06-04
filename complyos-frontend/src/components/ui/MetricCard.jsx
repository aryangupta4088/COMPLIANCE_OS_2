import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const cardVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function MetricCard({ title, value, subtitle, icon, trend, trendValue }) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(21,27,30,0.10)" }}
      className="bg-white border border-cs-100 rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-cs-500 text-xs font-semibold uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 bg-cs-50 rounded-xl flex items-center justify-center text-cs-600">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-cs-900 text-3xl font-extrabold">{value}</span>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold mb-1 ${trend === "up" ? "text-green-600" : "text-red-500"}`}>
            {trend === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-cs-400 text-xs font-medium">{subtitle}</p>}
    </motion.div>
  );
}
