"use client";

import PatientCard from "@/components/dashboard/doctor/PatientCard";
import SmartPrescription from "@/components/dashboard/doctor/SmartPrescription";
import ClinicalTranscription from "@/components/dashboard/doctor/ClinicalTranscription";
import PatientList from "@/components/dashboard/doctor/PatientList";
import ScheduleCalendar from "@/components/dashboard/doctor/ScheduleCalendar";
import ReportsList from "@/components/dashboard/doctor/ReportsList";
import ProfileEdit from "@/components/dashboard/ProfileEdit";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, User } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  },
} as const;

export default function DoctorDashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [activePatient, setActivePatient] = useState<any>(null);
  const [sessionId, setSessionId] = useState("");

  const startSession = async (apt: any) => {
    // Support both the old mock Patient shape and the new Appointment shape from Firestore
    const patientName = apt.patientName ?? apt.name;
    const patientId   = apt.patientId   ?? apt.id;
    const patientAge  = apt.patientAge  ?? apt.age  ?? null;
    const patientGender = apt.patientGender ?? apt.gender ?? null;
    const condition   = apt.condition   ?? "";

    const sId = `session-${patientId}-${Date.now()}`;
    setSessionId(sId);
    setActivePatient({ ...apt, name: patientName, id: patientId });

    await setDoc(doc(db, "sessions", sId), {
        patientId,
        patientName,
        patientAge,
        patientGender,
        condition,
        appointmentId: apt.id ?? null,
        status: "active",
        startTime: new Date().toISOString(),
    });

    // Mark appointment as "in-session" so it won't appear as pending again
    if (apt.id && apt.doctorId) {
        await updateDoc(doc(db, "appointments", apt.id), { status: "completed" });
    }

    setCurrentView("active-session");
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
      case "patients":
        return (
          <motion.div 
            key="patients-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <PatientList onStartSession={startSession} />
          </motion.div>
        );
      case "appointments":
        return (
          <motion.div 
            key="calendar-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ScheduleCalendar />
          </motion.div>
        );
      case "reports":
        return (
          <motion.div 
            key="reports-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ReportsList />
          </motion.div>
        );
      case "profile":
        return (
          <motion.div
            key="profile-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <ProfileEdit />
          </motion.div>
        );
      case "active-session":
        return (
          <motion.div
            key="active-session-view"
            className="flex-1 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-2">
                    <button 
                        onClick={() => setCurrentView("dashboard")}
                        className="text-[10px] font-black text-deep-teal-600 uppercase tracking-widest hover:underline"
                    >
                        &larr; Back to Dashboard
                    </button>
                </div>
                <PatientCard sessionId={sessionId} />
              </motion.div>
              <div className="relative">
                <SmartPrescription sessionId={sessionId} />
              </div>
            </div>
            <motion.div variants={itemVariants} className="lg:col-span-8 h-full min-h-0 relative">
              <ClinicalTranscription sessionId={sessionId} />
            </motion.div>
          </motion.div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="shrink-0 flex items-center justify-between px-2 pt-2 mb-4">
        <div className="flex items-baseline gap-2">
          <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tighter">
            {currentView === "active-session" ? "Active Consultation" : "Doctor Panel"}
          </h1>
          <p className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest">Medical Scribe Module</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ash-grey-500" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="bg-ash-grey-900 border border-ash-grey-800 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 w-48 transition-all"
            />
          </div>
          <button className="relative p-2 text-ash-grey-600 hover:text-deep-teal-500 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-ash-grey-900"></span>
          </button>
          <button
            onClick={() => setCurrentView("profile")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-teal-500/10 text-deep-teal-600 border border-deep-teal-500/20 cursor-pointer hover:bg-deep-teal-500/20 transition-all"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 relative">
        <div className="h-full">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 shrink-0 flex items-center justify-between text-[11px] font-semibold text-dark-slate-grey-800 tracking-wide uppercase px-2"
        >
          <span>&copy; 2026 MedFlow AI. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Contact</a>
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Security</a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

