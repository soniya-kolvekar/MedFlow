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

export default function Sidebar() {
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
        <Link
          href="/dashboard/doctor"
          className="flex items-center gap-3 px-4 py-3 bg-deep-teal-500 text-white rounded-2xl font-medium shadow-md shadow-deep-teal-500/20 transition-all"
        >
          <Home className="w-5 h-5 text-ash-grey-800" />
          Dashboard
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all group"
        >
          <Users className="w-5 h-5 group-hover:text-ash-grey-500 transition-colors" />
          Patients
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all group"
        >
          <Calendar className="w-5 h-5 group-hover:text-ash-grey-500 transition-colors" />
          Appointments
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all group"
        >
          <FileText className="w-5 h-5 group-hover:text-ash-grey-500 transition-colors" />
          Records
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all group"
        >
          <BarChart2 className="w-5 h-5 group-hover:text-ash-grey-500 transition-colors" />
          Analytics
        </Link>
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          Support
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all text-sm">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
