"use client";

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Video, User } from 'lucide-react';
import SarvamTTS from '@/components/dashboard/SarvamTTS';
import ProfileCard from '@/components/dashboard/ProfileCard';
import HealthSnapshot from '@/components/dashboard/HealthSnapshot';

export default function PatientDashboard() {
  const { user } = useAuth();
  
  const userName = user?.email ? user.email.split('@')[0] : 'Patient';

  // Mock data for the profile - in a real app, this would come from Firestore
  const patientData = {
    name: "Rahul Sharma",
    age: 35,
    gender: "Male",
    bloodGroup: "O+",
    allergies: ["Penicillin"],
    conditions: ["Hypertension"]
  };

  return (
    <div className="space-y-8 font-sans pb-12">
       {/* Welcome Banner */}
       <div className="relative overflow-hidden rounded-[32px] bg-charcoal-blue-500 p-10 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="max-w-xl">
                <h1 className="text-4xl font-extrabold tracking-tight mb-3">Welcome back, {userName}</h1>
                <p className="text-charcoal-blue-800 font-medium text-lg opacity-90">
                  Your health portal is up to date. You have a cardiology consultation scheduled for tomorrow.
                </p>
             </div>
             <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 rounded-2xl bg-deep-teal-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-deep-teal-600 shadow-xl shadow-deep-teal-500/20">
                   <Video className="h-4 w-4" />
                   Start Virtual Visit
                </button>
             </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-deep-teal-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
       </div>

       {/* Patient Profile Card */}
       <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark-slate-grey-500 px-2 tracking-tight">Your Health Profile</h2>
          <ProfileCard {...patientData} name={userName === 'Patient' ? patientData.name : userName} />
       </section>

       {/* Health Status Snapshot */}
       <section className="space-y-4">
          <h2 className="text-xl font-bold text-dark-slate-grey-500 px-2 tracking-tight">Health Status Snapshot</h2>
          <HealthSnapshot />
       </section>

       {/* Secondary Content: AI Tools & Records */}
       <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Recent Activity Column */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-dark-slate-grey-500 tracking-tight">Recent Consultations</h2>
                <button className="text-sm font-bold text-deep-teal-500 hover:underline">View All Records</button>
             </div>
             
             <div className="space-y-4">
                {[
                  { dr: 'Dr. Sarah Jenkins', spec: 'Cardiology', date: 'Today, 10:00 AM', status: 'Completed', note: 'Discussed recent ECG results. Recommended adjusting dosage of Lisinopril from 10mg to 20mg.' },
                  { dr: 'Dr. Michael Chen', spec: 'General Practice', date: 'Mar 10, 2026', status: 'Completed', note: 'Standard annual physical. All blood work appears normal. Recommended maintaining current exercise routine.' }
                ].map((visit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-[24px] bg-white p-6 shadow-sm border border-ash-grey-800 transition-all hover:shadow-md"
                  >
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-ash-grey-800 flex items-center justify-center text-charcoal-blue-500 border border-ash-grey-700">
                              <User className="h-6 w-6" />
                           </div>
                           <div>
                              <h3 className="font-bold text-dark-slate-grey-500">{visit.dr}</h3>
                              <p className="text-xs font-bold text-charcoal-blue-600 uppercase tracking-widest">{visit.spec}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-bold text-charcoal-blue-600 bg-ash-grey-800 px-3 py-1.5 rounded-lg border border-ash-grey-700">{visit.date}</span>
                           <span className="text-[10px] uppercase tracking-wider font-bold text-deep-teal-600 bg-deep-teal-500/10 px-3 py-1.5 rounded-lg border border-deep-teal-500/20">{visit.status}</span>
                        </div>
                     </div>
                     <div className="rounded-2xl bg-ash-grey-900 border border-ash-grey-800 p-5">
                        <div className="flex items-center gap-2 mb-3 text-deep-teal-600 font-bold text-[10px] uppercase tracking-widest">
                           <FileText className="h-4 w-4" />
                           Clinical Summary
                        </div>
                        <p className="text-sm font-medium text-charcoal-blue-600 leading-relaxed">
                          {visit.note}
                        </p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* Sarvam AI Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <div className="px-2">
                   <h2 className="text-xl font-bold text-dark-slate-grey-500 tracking-tight">AI Assistant</h2>
                </div>
                <SarvamTTS />
             </div>
          </div>

       </div>
    </div>
  );
}
