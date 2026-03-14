import React from 'react';
import { Calendar, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecordsOverview() {
  const records = [
    {
      title: "My Records",
      count: "12 new lab results",
      icon: FileText,
      buttonText: "Access Vault",
      bg: "bg-ash-grey-900/40",
      accent: "text-deep-teal-600"
    },
    {
      title: "Appointments",
      count: "Next visit in 3 days",
      icon: Calendar,
      buttonText: "View Schedule",
      bg: "bg-green-100/30",
      accent: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {records.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`relative group p-8 rounded-[32px] border border-ash-grey-700/50 shadow-sm transition-all hover:shadow-xl hover:shadow-charcoal-blue-500/5 ${item.bg}`}
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-dark-slate-grey-500 shadow-sm group-hover:scale-110 transition-transform">
              <item.icon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-dark-slate-grey-500 tracking-tight">{item.title}</h3>
              <p className={`text-[10px] font-black uppercase tracking-widest ${item.accent}`}>{item.count}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button className="px-6 py-2.5 bg-dark-slate-grey-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-charcoal-blue-600 transition-all active:scale-95 shadow-lg shadow-dark-slate-grey-500/10">
              {item.buttonText}
            </button>
            <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
               <ShieldCheck className="h-3.5 w-3.5 text-deep-teal-600" />
               <span className="text-[9px] font-black uppercase tracking-widest text-charcoal-blue-700">Encrypted</span>
            </div>
          </div>

          {/* Decorative element like in mockup */}
          <div className="absolute top-4 right-4 h-24 w-24 bg-ash-grey-700/10 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-700" />
        </motion.div>
      ))}
    </div>
  );
}
