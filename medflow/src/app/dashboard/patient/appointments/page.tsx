"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Clock, MapPin, Video, MoreVertical, XCircle, RefreshCw } from 'lucide-react';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const tabs = ['Upcoming', 'Completed', 'Cancelled'];

  const appointments: { [key: string]: any[] } = {
    Upcoming: [
      { id: 1, dr: 'Dr. Mehta', spec: 'Cardiology', date: 'June 10, 2026', time: '10:30 AM', type: 'Physical', status: 'Confirmed', room: 'OPD 3' },
      { id: 2, dr: 'Dr. Sarah Jenkins', spec: 'General Practice', date: 'June 15, 2026', time: '02:00 PM', type: 'Virtual', status: 'Scheduled' },
    ],
    Completed: [
      { id: 3, dr: 'Dr. Michael Chen', spec: 'General Practice', date: 'May 20, 2026', time: '11:00 AM', type: 'Physical', status: 'Completed' },
    ],
    Cancelled: [
      { id: 4, dr: 'Dr. Amit Shah', spec: 'Dermatology', date: 'May 05, 2026', time: '04:00 PM', type: 'Virtual', status: 'Cancelled' },
    ]
  };

  return (
    <div className="space-y-10 pb-12 font-sans">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl">
             <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-2">My Appointments</h1>
             <p className="text-charcoal-blue-500 font-medium">Manage and track your upcoming and past consultations.</p>
          </div>
          <button className="rounded-2xl bg-deep-teal-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-deep-teal-500/20 hover:bg-deep-teal-600 transition-all">
             Book New Appointment
          </button>
       </div>

       {/* Tabs */}
       <div className="flex bg-ash-grey-900 p-1.5 rounded-[20px] w-fit border border-ash-grey-700">
          {tabs.map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-[16px] text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-dark-slate-grey-500 shadow-md border border-ash-grey-700' : 'text-charcoal-blue-400 hover:text-charcoal-blue-600'}`}
             >
                {tab}
             </button>
          ))}
       </div>

       {/* Appointment List */}
       <div className="grid gap-6">
          <AnimatePresence mode="wait">
             <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
             >
                {appointments[activeTab as keyof typeof appointments].length > 0 ? (
                  appointments[activeTab as keyof typeof appointments].map((apt) => (
                    <div key={apt.id} className="group relative overflow-hidden rounded-[32px] bg-white p-6 border border-ash-grey-700 shadow-sm transition-all hover:shadow-md">
                       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                             <div className="h-20 w-20 rounded-3xl bg-ash-grey-900 border border-ash-grey-700 flex items-center justify-center text-charcoal-blue-500 group-hover:bg-deep-teal-500 group-hover:text-white transition-all">
                                <User className="h-10 w-10" />
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-dark-slate-grey-500">{apt.dr}</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-charcoal-blue-400 mb-4">{apt.spec}</p>
                                <div className="flex flex-wrap gap-3">
                                   <div className="flex items-center gap-2 text-xs font-bold text-charcoal-blue-600 bg-ash-grey-900 px-3 py-1.5 rounded-xl border border-ash-grey-700">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {apt.date}
                                   </div>
                                   <div className="flex items-center gap-2 text-xs font-bold text-charcoal-blue-600 bg-ash-grey-900 px-3 py-1.5 rounded-xl border border-ash-grey-700">
                                      <Clock className="h-3.5 w-3.5" />
                                      {apt.time}
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                             <div className="flex items-center gap-8 px-6 border-r border-ash-grey-700 hidden sm:flex">
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-2">Type</p>
                                   <div className={`flex items-center gap-2 text-sm font-bold ${apt.type === 'Virtual' ? 'text-deep-teal-600' : 'text-blue-600'}`}>
                                      {apt.type === 'Virtual' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                                      {apt.type}
                                   </div>
                                </div>
                                {apt.room && (
                                  <div>
                                     <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-2">Location</p>
                                     <p className="text-sm font-bold text-dark-slate-grey-500">{apt.room}</p>
                                  </div>
                                )}
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-2">Status</p>
                                   <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : apt.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                      {apt.status}
                                   </span>
                                </div>
                             </div>

                             {activeTab === 'Upcoming' && (
                               <div className="flex gap-2 w-full sm:w-auto">
                                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-ash-grey-900 px-4 py-3 text-xs font-bold text-charcoal-blue-600 border border-ash-grey-700 hover:bg-white transition-all">
                                     <XCircle className="h-4 w-4" />
                                     Cancel
                                  </button>
                                  <button className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg transition-all ${apt.type === 'Virtual' ? 'bg-deep-teal-500 shadow-deep-teal-500/20 hover:bg-deep-teal-600' : 'bg-charcoal-blue-500 shadow-charcoal-blue-500/20 hover:bg-charcoal-blue-400'}`}>
                                     {apt.type === 'Virtual' ? 'Join Call' : 'Check In'}
                                  </button>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white border border-ash-grey-700 rounded-[40px]">
                     <div className="mx-auto h-16 w-16 bg-ash-grey-900 rounded-3xl flex items-center justify-center text-charcoal-blue-300 mb-6">
                        <Calendar className="h-8 w-8" />
                     </div>
                     <h3 className="text-xl font-bold text-dark-slate-grey-500 mb-2">No {activeTab} Appointments</h3>
                     <p className="text-sm font-medium text-charcoal-blue-400 max-w-xs mx-auto">You don't have any appointments in this category at the moment.</p>
                  </div>
                )}
             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
}
