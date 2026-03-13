import React from "react";
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart2,
  HelpCircle,
  LogOut,
  ShieldPlus,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar({ 
  currentView = "dashboard", 
  onViewChange 
}: { 
  currentView?: string; 
  onViewChange?: (view: string) => void 
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "patients", label: "Patients", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-dark-slate-grey-500 text-white min-h-screen flex flex-col m-4 rounded-3xl overflow-hidden shadow-xl shadow-dark-slate-grey-200/20">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-deep-teal-500">
          <ShieldPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight tracking-tight">
            MedFlow AI
          </h2>
          <p className="text-[10px] text-dark-slate-grey-800 uppercase tracking-widest font-semibold">
            Medical Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange?.(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all group ${
                isActive 
                ? "bg-deep-teal-500 text-white shadow-md shadow-deep-teal-500/20" 
                : "text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-ash-grey-800" : "group-hover:text-ash-grey-500"} transition-colors`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all text-sm">
          <HelpCircle className="w-4 h-4" />
          Support
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all text-sm">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
