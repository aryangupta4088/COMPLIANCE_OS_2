import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Bell, HelpCircle, Scale } from "lucide-react";
import { ComplianceChatbot } from "./ComplianceChatbot"; // adjust path as needed

export function Topbar({ dark = false }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header
        className={`h-14 flex items-center justify-between px-6 border-b ${dark
            ? "bg-cs-900 border-cs-800 text-cs-50"
            : "bg-white border-cs-100 text-cs-900"
          }`}
      >
        {/* Brand */}
        <NavLink
          to="/dashboard"
          className="font-extrabold text-lg tracking-tight"
        >
          ComplianceOS
        </NavLink>

        {/* Center links */}
        <div
          className={`hidden md:flex items-center gap-6 text-sm font-medium ${dark ? "text-cs-300" : "text-cs-500"
            }`}
        >
          <NavLink to="/notices" className="hover:text-cs-900 transition-colors">
            Marketplace
          </NavLink>
          <NavLink to="/calendar" className="hover:text-cs-900 transition-colors">
            Calendar
          </NavLink>
          <NavLink to="/documents" className="hover:text-cs-900 transition-colors">
            Document Vault
          </NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={`flex items-center gap-2 rounded-full px-4 h-8 text-sm ${dark ? "bg-cs-800 text-cs-300" : "bg-cs-50 text-cs-400"
              }`}
          >
            <Search size={14} />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-32 placeholder:text-cs-400"
            />
          </div>

          <Bell
            size={18}
            className={dark ? "text-cs-300" : "text-cs-500"}
          />
          <HelpCircle
            size={18}
            className={dark ? "text-cs-300" : "text-cs-500"}
          />

          {/* ── CABot trigger button ── */}
          <button
            onClick={() => setChatOpen((v) => !v)}
            title="Ask CABot"
            className={`relative flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-semibold transition-all ${chatOpen
                ? "bg-cs-900 text-amber-400 shadow-md"
                : dark
                  ? "bg-cs-800 text-amber-400 hover:bg-cs-700"
                  : "bg-cs-900 text-amber-400 hover:bg-cs-700 shadow-sm"
              }`}
          >
            <Scale size={13} />
            <span className="hidden sm:inline">Ask CA</span>
            {/* Pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-cs-200 flex items-center justify-center text-xs font-bold text-cs-800">
            JD
          </div>
        </div>
      </header>

      {/* Chatbot panel — rendered outside header so it overlays full page */}
      <ComplianceChatbot open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}