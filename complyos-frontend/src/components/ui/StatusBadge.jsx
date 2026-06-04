import React from "react";
import {
  CheckCircle2,
  Clock,
  X,
  Star,
  Sparkles,
} from "lucide-react";

const statusMap = {
  completed:  { label: "Completed",  icon: CheckCircle2, classes: "bg-cs-100 text-cs-700" },
  verified:   { label: "Verified",   icon: CheckCircle2, classes: "bg-cs-100 text-cs-700" },
  enrolled:   { label: "Enrolled",   icon: CheckCircle2, classes: "bg-cs-100 text-cs-700" },
  pending:    { label: "Pending",    icon: Clock,        classes: "bg-cs-200 text-cs-700 animate-pulse" },
  processing: { label: "Processing", icon: Clock,        classes: "bg-cs-200 text-cs-700 animate-pulse" },
  overdue:    { label: "Overdue",    icon: X,            classes: "bg-cs-900 text-cs-50" },
  rejected:   { label: "Rejected",   icon: X,            classes: "bg-cs-900 text-cs-50" },
  eligible:   { label: "Eligible",   icon: Star,         classes: "bg-cs-200 text-cs-800" },
  active:     { label: "Active",     icon: Star,         classes: "bg-cs-200 text-cs-800" },
  new:        { label: "New",        icon: Sparkles,     classes: "bg-cs-800 text-cs-50" },
  complete:   { label: "Complete",   icon: CheckCircle2, classes: "bg-cs-100 text-cs-700" },
  "not started": { label: "Not Started", icon: X, classes: "bg-cs-100 text-cs-500" },
};

const sizeMap = {
  sm: { badge: "px-2 py-0.5 text-xs", icon: 11 },
  md: { badge: "px-3 py-1 text-sm",   icon: 14 },
};

/**
 * @param {{ status: string, size?: 'sm'|'md' }} props
 */
export default function StatusBadge({ status = "pending", size = "sm" }) {
  const key = status.toLowerCase();
  const cfg = statusMap[key] ?? statusMap.pending;
  const Icon = cfg.icon;
  const sz = sizeMap[size] ?? sizeMap.sm;

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full tracking-wide ${sz.badge} ${cfg.classes}`}
    >
      <Icon size={sz.icon} />
      {cfg.label}
    </span>
  );
}
