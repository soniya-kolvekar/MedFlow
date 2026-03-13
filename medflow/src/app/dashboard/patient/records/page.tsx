"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  FlaskConical, 
  Pill, 
  Activity, 
  Mic, 
  Search, 
  Download, 
  MoreVertical, 
  Filter,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function RecordsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: FileText },
    { name: 'Consultations', icon: FileText },
    { name: 'Lab Reports', icon: FlaskConical },
    { name: 'Prescriptions', icon: Pill },
    { name: 'Diagnostics', icon: Activity },
    { name: 'Audio Logs', icon: Mic },
  ];

  const records = [
    { id: 1, title: 'Cardiology Summary', type: 'Consultations', date: 'June 01, 2026', doctor: 'Dr. Mehta', size: '1.2 MB', color: 'text-blue-600 bg-blue-50' },
    { id: 2, title: 'Full Blood Count', type: 'Lab Reports', date: 'May 28, 2026', doctor: 'Central Lab', size: '2.4 MB', color: 'text-amber-600 bg-amber-50' },
    { id: 3, title: 'Lisinopril Prescription', type: 'Prescriptions', date: 'June 01, 2026', doctor: 'Dr. Mehta', size: '0.8 MB', color: 'text-purple-600 bg-purple-50' },
    { id: 4, title: 'ECG Report', type: 'Diagnostics', date: 'May 15, 2026', doctor: 'Dr. Wilson', size: '4.5 MB', color: 'text-deep-teal-600 bg-deep-teal-50' },
    { id: 5, title: 'Virtual Session Audio', type: 'Audio Logs', date: 'May 10, 2026', doctor: 'Dr. Sarah Jenkins', size: '12.8 MB', color: 'text-red-600 bg-red-50' },
  ];

  const filteredRecords = activeCategory === 'All' 
    ? records 
    : records.filter(r => r.type === activeCategory);

  return (
    <div className="space-y-8 pb-12 font-sans">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
             <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-2">My Health Records</h1>
             <p className="text-charcoal-blue-500 font-medium">Access your global health history, reports, and prescriptions in one place.</p>
          </div>
          
          <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-blue-400 group-focus-within:text-deep-teal-500 transition-colors" />
             <input 
               type="text" 
               placeholder="Search records, doctors..." 
               className="h-14 w-full md:w-80 rounded-2xl border border-ash-grey-700 bg-white pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all shadow-sm"
             />
          </div>
       </div>

       {/* Category Filters */}
       <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
             const Icon = cat.icon;
             return (
                <button
                   key={cat.name}
                   onClick={() => setActiveCategory(cat.name)}
                   className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${activeCategory === cat.name ? 'bg-dark-slate-grey-500 text-white border-dark-slate-grey-500 shadow-xl shadow-dark-slate-grey-500/20' : 'bg-white text-charcoal-blue-500 border-ash-grey-700 hover:border-deep-teal-500 hover:text-deep-teal-600'}`}
                >
                   <Icon className="h-4 w-4" />
                   {cat.name}
                </button>
             );
          })}
       </div>

       {/* Records Table/Grid */}
       <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
             {filteredRecords.map((record, i) => (
                <motion.div
                   key={record.id}
                   layout
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   transition={{ duration: 0.2 }}
                   className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[24px] bg-white p-6 border border-ash-grey-700 shadow-sm transition-all hover:shadow-md"
                >
                   <div className="flex items-center gap-6">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${record.color} shrink-0`}>
                         {record.type === 'Consultations' && <FileText className="h-8 w-8" />}
                         {record.type === 'Lab Reports' && <FlaskConical className="h-8 w-8" />}
                         {record.type === 'Prescriptions' && <Pill className="h-8 w-8" />}
                         {record.type === 'Diagnostics' && <Activity className="h-8 w-8" />}
                         {record.type === 'Audio Logs' && <Mic className="h-8 w-8" />}
                      </div>
                      
                      <div>
                         <h3 className="text-xl font-bold text-dark-slate-grey-500 mb-1">{record.title}</h3>
                         <div className="flex items-center gap-3 text-xs font-bold text-charcoal-blue-400">
                            <span className="uppercase tracking-widest">{record.type}</span>
                            <span>•</span>
                            <span>{record.doctor}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between sm:justify-end gap-10">
                      <div className="text-right hidden sm:block">
                         <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-1">Upload Date</p>
                         <p className="text-sm font-bold text-dark-slate-grey-500">{record.date}</p>
                      </div>
                      <div className="text-right hidden sm:block px-6 border-x border-ash-grey-700">
                         <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-1">File Size</p>
                         <p className="text-sm font-bold text-dark-slate-grey-500">{record.size}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                         <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-ash-grey-900 h-12 px-6 text-xs font-bold text-charcoal-blue-600 border border-ash-grey-700 hover:bg-white hover:text-deep-teal-600 transition-all">
                            <ExternalLink className="h-4 w-4" />
                            View
                         </button>
                         <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-deep-teal-500 h-12 px-6 text-xs font-bold text-white shadow-lg shadow-deep-teal-500/10 hover:bg-deep-teal-600 transition-all">
                            <Download className="h-4 w-4" />
                            Download
                         </button>
                      </div>
                   </div>
                </motion.div>
             ))}
          </AnimatePresence>
       </div>

       {/* Pagination/Load More */}
       <div className="pt-6 text-center">
          <button className="text-xs font-bold text-charcoal-blue-400 hover:text-deep-teal-500 transition-colors uppercase tracking-[0.2em]">
             Load older records
          </button>
       </div>
    </div>
  );
}
