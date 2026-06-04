import React from "react";
import { motion } from "framer-motion";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { getInitials } from "../../utils/helpers";
import useNotificationStore from "../../store/notificationStore";

export default function Topbar({ onMenuClick }) {
  const unreadCount = useNotificationStore(s => s.unreadCount);
  
  return (
    <header className="h-16 bg-white border-b border-cs-100 flex items-center gap-4 px-6 flex-shrink-0">
      <button onClick={onMenuClick} className="lg:hidden text-cs-600 hover:text-cs-900">
        <Menu size={22} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-cs-50 border border-cs-100 rounded-xl px-4 py-2">
        <Search size={16} className="text-cs-400" />
        <input placeholder="Search deadlines, schemes..." className="bg-transparent text-sm outline-none text-cs-900 placeholder:text-cs-400 flex-1" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <motion.button whileTap={{ scale: 0.95 }} className="relative w-9 h-9 bg-cs-50 border border-cs-100 rounded-xl flex items-center justify-center text-cs-600 hover:text-cs-900">
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </motion.button>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-cs-700 rounded-full flex items-center justify-center text-cs-50 text-xs font-bold">
            {getInitials("My Business")}
          </div>
          <ChevronDown size={14} className="text-cs-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}