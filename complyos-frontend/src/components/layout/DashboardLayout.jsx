import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardLayout({ children, topbarDark = false }) {
  return (
    <div className="flex min-h-screen bg-cs-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar dark={topbarDark} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
