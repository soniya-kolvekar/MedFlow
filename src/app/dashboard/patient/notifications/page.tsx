"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Pill, 
  AlertTriangle,
  MoreVertical,
  Trash2,
  Check
} from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Appointment Confirmed', message: 'Your consultation with Dr. Sharma has been confirmed for June 10, 10:30 AM.', type: 'success', time: '2 hours ago', read: false },
    { id: 2, title: 'Lab Report Uploaded', message: 'Your Full Blood Count report from Central Lab is now available in My Records.', type: 'info', time: '5 hours ago', read: false },
    { id: 3, title: 'Prescription Processed', message: 'Dr. Mehta has sent your prescription for Lisinopril to City Central Pharmacy.', type: 'med', time: 'Yesterday', read: true },
    { id: 4, title: 'Medicine Ready', message: 'Your medicines are ready for pickup at your selected pharmacy.', type: 'med', time: 'Yesterday', read: true },
    { id: 5, title: 'Insurance Update', message: 'Your recent claim for the cardiac screening has been approved.', type: 'success', time: '2 days ago', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
             <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-2">Notifications</h1>
             <p className="text-charcoal-blue-500 font-medium">Stay updated with your appointment status and medical reports.</p>
          </div>
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-ash-grey-700 text-xs font-bold text-charcoal-blue-600 hover:bg-ash-grey-900 transition-all"
          >
             <Check className="h-4 w-4" />
             Mark all as read
          </button>
       </div>

       <div className="space-y-4">
          <AnimatePresence initial={false}>
             {notifications.map((n) => (
                <motion.div
                   key={n.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className={`relative group rounded-[24px] p-6 border transition-all ${n.read ? 'bg-ash-grey-900/50 border-ash-grey-700' : 'bg-white border-deep-teal-500 shadow-md ring-1 ring-deep-teal-500/10'}`}
                >
                   <div className="flex gap-6">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' : n.type === 'med' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                         {n.type === 'success' && <CheckCircle2 className="h-7 w-7" />}
                         {n.type === 'med' && <Pill className="h-7 w-7" />}
                         {n.type === 'info' && <FileText className="h-7 w-7" />}
                      </div>
                      
                      <div className="flex-1 pr-10">
                         <div className="flex items-center gap-3 mb-1">
                            <h3 className={`font-bold ${n.read ? 'text-charcoal-blue-600' : 'text-dark-slate-grey-500 text-lg'}`}>{n.title}</h3>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-deep-teal-500" />}
                         </div>
                         <p className={`text-sm leading-relaxed ${n.read ? 'text-charcoal-blue-400 font-medium' : 'text-charcoal-blue-600 font-bold'}`}>
                            {n.message}
                         </p>
                         <div className="mt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">
                            <span className="flex items-center gap-1.5">
                               <Clock className="h-3 w-3" />
                               {n.time}
                            </span>
                            <span>•</span>
                            <button className="hover:text-deep-teal-500 transition-colors">View Details</button>
                         </div>
                      </div>

                      <button 
                        onClick={() => deleteNotification(n.id)}
                        className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-xl bg-ash-grey-900 text-charcoal-blue-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                         <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </motion.div>
             ))}
          </AnimatePresence>
          
          {notifications.length === 0 && (
            <div className="text-center py-20 bg-ash-grey-900 rounded-[40px] border border-dashed border-ash-grey-700">
               <Bell className="h-10 w-10 text-ash-grey-700 mx-auto mb-4" />
               <p className="text-charcoal-blue-400 font-bold uppercase tracking-widest text-xs">All caught up!</p>
            </div>
          )}
       </div>
    </div>
  );
}
