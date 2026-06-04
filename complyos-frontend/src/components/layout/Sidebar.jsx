import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CalendarDays, FolderOpen, Landmark,
  MapPin, Users, PiggyBank, Bell, User, LogOut, X, Shield
} from "lucide-react";
import { clearAuth } from "../../utils/helpers";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/documents", icon: FolderOpen, label: "Documents" },
  { to: "/schemes", icon: Landmark, label: "Schemes" },
  { to: "/registration", icon: MapPin, label: "Registration" },
  { to: "/ca-connect", icon: Users, label: "CA Connect" },
  { to: "/loans", icon: PiggyBank, label: "Loans" },
  { to: "/notices", icon: Bell, label: "Notices" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-cs-900 text-cs-50 w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-cs-700">
        <div className="w-8 h-8 bg-cs-500 rounded-lg flex items-center justify-center">
          <Shield size={16} className="text-cs-50" />
        </div>
        <span className="font-extrabold text-lg tracking-tight">ComplianceOS</span>
        <button onClick={onClose} className="ml-auto lg:hidden text-cs-400 hover:text-cs-50">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-cs-600 text-cs-50"
                    : "text-cs-400 hover:text-cs-50 hover:bg-cs-800"
                }`}
              >
                <Icon size={18} />
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-cs-700">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-cs-400 hover:text-red-400 hover:bg-cs-800 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
