import React from "react";

const STATUS_STYLES = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  done:      "bg-green-50 text-green-700 border-green-200",
  overdue:   "bg-red-50 text-red-600 border-red-200",
  high:      "bg-red-50 text-red-600 border-red-200",
  medium:    "bg-amber-50 text-amber-700 border-amber-200",
  low:       "bg-green-50 text-green-700 border-green-200",
  applied:   "bg-blue-50 text-blue-700 border-blue-200",
  enrolled:  "bg-green-50 text-green-700 border-green-200",
  eligible:  "bg-cs-100 text-cs-700 border-cs-200",
  free:      "bg-cs-100 text-cs-700 border-cs-200",
  growth:    "bg-amber-50 text-amber-700 border-amber-200",
  pro:       "bg-purple-50 text-purple-700 border-purple-200",
};

export default function StatusBadge({ status, label }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || "bg-cs-100 text-cs-600 border-cs-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${style}`}>
      {label || status}
    </span>
  );
}
