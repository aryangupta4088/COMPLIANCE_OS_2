import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  CalendarDays,
  Folder,
  Landmark,
  Wand2,
  Users,
  PiggyBank,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { path: "/notices",      label: "Marketplace",   icon: Store },
  { path: "/calendar",     label: "Calendar",      icon: CalendarDays },
  { path: "/documents",    label: "Document Vault", icon: Folder },
  { path: "/schemes",      label: "Schemes",       icon: Landmark },
  { path: "/registration", label: "Registration",  icon: Wand2 },
  { path: "/ca-connect",   label: "CA Connect",    icon: Users },
  { path: "/loans",        label: "Loans",         icon: PiggyBank },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-cs-100 flex flex-col px-4 py-6 flex-shrink-0">
      {/* Brand */}
      <div className="mb-8 px-2">
        <h2 className="font-bold text-cs-900 text-base tracking-tight">Compliance Pro</h2>
        <p className="text-cs-400 text-xs tracking-widest font-semibold mt-0.5">MSME EDITION</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-cs-600 text-sm font-semibold transition-colors hover:text-cs-900 hover:bg-cs-50"
            >
              {active && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 bg-cs-50 border-r-2 border-cs-900 rounded-lg"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon size={18} className={`z-10 ${active ? "text-cs-900" : "text-cs-500"}`} />
              <span className={`z-10 ${active ? "text-cs-900" : ""}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-cs-100 pt-4 flex flex-col gap-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-cs-900 text-cs-50 rounded-lg py-2.5 text-sm font-bold tracking-wide"
        >
          Audit Ready
        </motion.button>

        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-cs-500 text-sm hover:bg-cs-50 hover:text-cs-900 transition-colors"
        >
          <HelpCircle size={16} />
          <span>Help Center</span>
        </NavLink>

        <button
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-cs-500 text-sm hover:bg-cs-50 hover:text-cs-900 transition-colors text-left"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
