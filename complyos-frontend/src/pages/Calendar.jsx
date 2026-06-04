import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/Common";
import { apiFetch } from "../services/api";
import { getUserId } from "../utils/helpers";
import { deadlines } from "../utils/constants";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAYS = [26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6];
const MUTED = new Set([0, 1, 2, 3, 4, 36, 37, 38, 39, 40, 41]);
const EVENT_DAYS = new Set([4, 7, 10, 14]);

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300 } }
};

export default function CalendarPage() {
  const [deadlineData, setDeadlineData] = useState(deadlines);
  const [selected, setSelected] = useState(10);

  useEffect(() => {
    apiFetch(`/api/compliance/calendar/${getUserId()}`).then(setDeadlineData).catch(() => { });
  }, []);

  const dayEvents = deadlineData.filter((d) =>
    d.deadline_date?.includes(`-${String(selected).padStart(2, "0")}`)
  );

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen relative overflow-hidden">
        {/* Subtle glowing background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cs-300/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cs-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <CalendarIcon size={20} />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Compliance Calendar</h1>
            </div>
            <p className="text-slate-500 text-base font-medium ml-14">Track regulatory deadlines for Q2 2026</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/80 backdrop-blur-md shadow-sm hover:bg-slate-50">Export CSV</Button>
            <Button variant="primary" className="shadow-lg shadow-cs-600/20">Add Event</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 relative z-10">
          
          {/* Main Calendar View */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 relative overflow-hidden"
          >
            {/* Inner top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cs-400 to-transparent opacity-50" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-extrabold text-slate-900 text-3xl">May 2026</h2>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-cs-50 hover:text-cs-600 transition-colors border border-slate-100 shadow-sm">
                  <ChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-cs-50 hover:text-cs-600 transition-colors border border-slate-100 shadow-sm">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {WEEKDAYS.map((d) => (
                <span key={d} className="text-center text-xs font-black text-slate-400 tracking-widest">{d}</span>
              ))}
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-7 gap-y-4 gap-x-2"
            >
              {DAYS.map((day, idx) => {
                const muted = MUTED.has(idx);
                const hasEvent = EVENT_DAYS.has(day) && !muted;
                const isSelected = selected === day && !muted;
                return (
                  <motion.div key={`${day}-${idx}`} variants={itemVariants} className="flex justify-center">
                    <motion.button
                      whileHover={!muted ? { scale: 1.1, y: -2 } : {}}
                      whileTap={!muted ? { scale: 0.95 } : {}}
                      onClick={() => !muted && setSelected(day)}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300
                        ${muted ? "text-slate-300 cursor-not-allowed" : "text-slate-700 bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100"}
                        ${isSelected ? "!bg-gradient-to-br !from-cs-700 !to-cs-900 !text-white shadow-xl shadow-cs-900/30 !border-cs-600 scale-110 z-10" : ""}
                        ${hasEvent && !isSelected ? "ring-2 ring-inset ring-cs-100" : ""}
                      `}
                    >
                      {day}
                      {hasEvent && (
                        <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${isSelected ? "bg-white" : "bg-cs-500"}`} />
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Side Panels */}
          <div className="flex flex-col gap-6">
            
            {/* Daily Tasks Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Clock size={18} className="text-cs-500" /> May {selected}, 2026
                </h2>
                <span className="bg-cs-100 text-cs-700 text-xs font-black tracking-widest px-3 py-1 rounded-full">
                  {dayEvents.length || 3} TASKS
                </span>
              </div>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {(dayEvents.length ? dayEvents : deadlineData.slice(0, 3)).map((ev, i) => (
                    <motion.div 
                      key={ev.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative pl-5 py-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-cs-400 to-cs-600 rounded-full transition-all group-hover:h-full group-hover:top-0 group-hover:bottom-0" />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-cs-700 transition-colors">{ev.title}</p>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{ev.description}</p>
                        </div>
                        <span className="bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md flex-shrink-0 uppercase tracking-wider">{ev.compliance_type}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                ["TOTAL TASKS", "18", "text-slate-900", <CheckCircle2 size={16} className="text-emerald-500"/>], 
                ["CRITICAL", "04", "text-rose-600", <AlertCircle size={16} className="text-rose-500"/>]
              ].map(([label, val, color, icon]) => (
                <div key={label} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <p className="text-[10px] font-black text-slate-400 tracking-widest">{label}</p>
                  </div>
                  <p className={`text-4xl font-extrabold tracking-tight ${color} group-hover:scale-105 origin-left transition-transform`}>{val}</p>
                </div>
              ))}
            </motion.div>

            {/* AI Risk Forecast */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-950 rounded-3xl p-6 text-slate-50 relative overflow-hidden group shadow-2xl"
            >
              {/* Animated background glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cs-600 via-indigo-600 to-purple-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="font-bold text-sm tracking-widest uppercase text-slate-300">AI Risk Forecast</h2>
                </div>
                
                <div className="flex items-end justify-between mb-3">
                  <span className="text-white font-medium text-lg">Late Filing Risk</span>
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">LOW</span>
                </div>
                
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "18%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                  />
                </div>
                
                <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-800 pt-4 mt-2">
                  <span className="text-emerald-400 font-semibold">+12%</span> submission speed increased this quarter due to automated reminders.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
