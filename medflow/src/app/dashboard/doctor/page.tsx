"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import PatientCard from "@/components/dashboard/doctor/PatientCard";
import SmartPrescription from "@/components/dashboard/doctor/SmartPrescription";
import ClinicalTranscription from "@/components/dashboard/doctor/ClinicalTranscription";
import PatientList from "@/components/dashboard/doctor/PatientList";
import ScheduleCalendar from "@/components/dashboard/doctor/ScheduleCalendar";
import ReportsList from "@/components/dashboard/doctor/ReportsList";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const sidebarVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  },
} as const;

export default function DoctorDashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [activePatient, setActivePatient] = useState<any>(null);
  const [sessionId, setSessionId] = useState("");

  const startSession = async (patient: any) => {
    const sId = `session-${patient.id}-${Date.now()}`;
    setSessionId(sId);
    setActivePatient(patient);
    
    // Initialize session in Firestore with patient details
    await setDoc(doc(db, "sessions", sId), {
        patientId: patient.id,
        patientName: patient.name,
        patientAge: patient.age,
        patientGender: patient.gender,
        allergies: [patient.condition.split(' ')[0]], // Mock allergy from condition
        status: "active",
        startTime: new Date().toISOString()
    });

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
      case "active-session":
        return (
          <motion.div
            key="active-session-view"
            className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column (Patient + Prescription) */}
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
              <motion.div variants={itemVariants} className="flex-1 min-h-0 relative">
                <SmartPrescription sessionId={sessionId} />
              </motion.div>
            </div>

            {/* Right Column (Clinical Transcription Panel) */}
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
    <div className="flex min-h-screen bg-ash-grey-900 font-sans selection:bg-muted-teal-200 selection:text-deep-teal-600 overflow-hidden">
      <motion.div initial="hidden" animate="visible" variants={sidebarVariants} className="shrink-0 flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      </motion.div>
      <main className="flex-1 flex flex-col pt-4 pr-6 pb-6 h-screen">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <TopBar />
        </motion.div>

        <div className="flex-1 min-h-0 mt-2">
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-4 shrink-0 flex items-center justify-between text-[11px] font-semibold text-dark-slate-grey-800 tracking-wide uppercase px-2"
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
