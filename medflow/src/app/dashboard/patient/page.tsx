"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import PatientAppointments from "@/components/dashboard/patient/PatientAppointments";
import ProfileEdit from "@/components/dashboard/ProfileEdit";
import {
  LayoutDashboard, Calendar, FileText, ShieldPlus, LogOut,
  User, Bell, Home, HelpCircle, UserCircle
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "My Appointments", icon: Calendar },
  { id: "records", label: "My Records", icon: FileText },
  { id: "profile", label: "My Profile", icon: UserCircle },
];

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState("appointments");

  const userName = user?.email ? user.email.split("@")[0] : "Patient";

  const renderContent = () => {
    switch (currentView) {
      case "appointments":
        return (
          <motion.div
            key="appointments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PatientAppointments />
          </motion.div>
        );
      case "profile":
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProfileEdit />
          </motion.div>
        );
      case "records":
        return (
          <motion.div
            key="records"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-ash-grey-800 text-center"
          >
            <FileText className="w-14 h-14 text-ash-grey-700 mb-4" />
            <h3 className="text-lg font-black text-dark-slate-grey-500">Medical Records</h3>
            <p className="text-sm text-ash-grey-600 mt-1">Your past consultation reports will appear here.</p>
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Upcoming Appointments", value: "View →", action: () => setCurrentView("appointments"), color: "bg-deep-teal-500" },
                { label: "Medical Records", value: "View →", action: () => setCurrentView("records"), color: "bg-charcoal-blue-500" },
                { label: "Profile Settings", value: "Edit →", action: () => setCurrentView("profile"), color: "bg-dark-slate-grey-500" },
              ].map((card) => (
                <button
                  key={card.label}
                  onClick={card.action}
                  className={`${card.color} text-white p-6 rounded-3xl text-left shadow-lg hover:opacity-90 transition-opacity active:scale-98`}
                >
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-2">{card.label}</p>
                  <p className="text-2xl font-black">{card.value}</p>
                </button>
              ))}
            </div>
            <PatientAppointments />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-ash-grey-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-slate-grey-500 text-white min-h-screen flex flex-col m-4 rounded-3xl overflow-hidden shadow-xl shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-deep-teal-500">
            <ShieldPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-tight">MedFlow AI</h2>
            <p className="text-[10px] text-dark-slate-grey-800 uppercase tracking-widest font-semibold">Patient Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all group ${
                  isActive
                    ? "bg-deep-teal-500 text-white shadow-md"
                    : "text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all text-sm">
            <HelpCircle className="w-4 h-4" /> Support
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-red-400 hover:bg-red-50 rounded-2xl font-medium transition-all text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen pt-4 pr-6 pb-6 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-2xl px-6 py-4 border border-ash-grey-800 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-dark-slate-grey-500">
              Welcome back, <span className="capitalize text-deep-teal-600">{userName}</span>
            </h1>
            <p className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest">Patient Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-ash-grey-600 hover:text-deep-teal-500 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-teal-500/10 text-deep-teal-600 border border-deep-teal-500/20 cursor-pointer hover:bg-deep-teal-500/20 transition-all"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
