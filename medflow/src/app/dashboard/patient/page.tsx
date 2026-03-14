"use client";

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileCard from '@/components/dashboard/ProfileCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecordsOverview from '@/components/dashboard/RecordsOverview';
import ConsultationPanel from '@/components/dashboard/ConsultationPanel';
import { Search, Bell, Settings, User } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  
  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Patient');

  // Mock data for the profile
  const patientData = {
    name: "Sarah Miller",
    age: 32,
    gender: "Female",
    bloodGroup: "O-Positive",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma", "Hypertension"]
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tighter">Patient Overview</h1>
          <p className="text-charcoal-blue-500 font-bold mt-1">Case ID: <span className="text-deep-teal-600">#MED-449102</span> • Last visit: 3 days ago</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-ash-grey-700/50">
          <div className="flex items-center gap-3 px-4 border-r border-ash-grey-800">
            <div className="text-right">
              <p className="text-xs font-black text-dark-slate-grey-500 leading-none">Dr. Elena Vance</p>
              <p className="text-[9px] font-bold text-ash-grey-500 uppercase tracking-widest mt-1">Clinical Director</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-ash-grey-900 border border-ash-grey-800 flex items-center justify-center text-charcoal-blue-400">
              <User className="h-5 w-5" />
            </div>
          </div>
          <div className="flex gap-1 px-2">
             <button className="p-2 text-charcoal-blue-500 hover:text-deep-teal-500 transition-colors"><Settings className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Hero Section: Profile and Top Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-12">
            <ProfileCard {...patientData} />
         </div>
      </div>

      {/* Quick Actions Grid */}
      <QuickActions />

      {/* Records and Appointments */}
      <RecordsOverview />

      {/* AI Consultation Section */}
      <div className="pt-8 border-t border-ash-grey-800">
         <ConsultationPanel />
      </div>
    </div>
  );
}

