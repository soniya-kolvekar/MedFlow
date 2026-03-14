import React from 'react';
import { Video, Activity, LayoutGrid, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  {
    title: "Consult Doctor",
    subtitle: "AI-Augmented Virtual Visit",
    icon: Video,
    color: "bg-deep-teal-500",
    textColor: "text-white",
    description: "Connect with specialized doctors and get AI insights."
  },
  {
    title: "Health Checkups",
    subtitle: "Scheduled Screenings",
    icon: Activity,
    color: "bg-white",
    textColor: "text-dark-slate-grey-500",
    description: "Monitor your vitals and upcoming screenings."
  },
  {
    title: "Speciality Services",
    subtitle: "Expert Consultations",
    icon: LayoutGrid,
    color: "bg-white",
    textColor: "text-dark-slate-grey-500",
    description: "Access tailored care for complex conditions."
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`group p-8 rounded-[32px] border border-ash-grey-700/50 shadow-xl shadow-charcoal-blue-500/5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl ${action.color} ${action.textColor}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${action.color === 'bg-white' ? 'bg-ash-grey-900 text-deep-teal-500' : 'bg-white/20 text-white'}`}>
              <action.icon className="h-7 w-7" />
            </div>
            <ArrowRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${action.color === 'bg-white' ? 'text-ash-grey-500' : 'text-white/50'}`} />
          </div>
          
          <h3 className="text-xl font-black tracking-tight mb-2">{action.title}</h3>
          <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${action.color === 'bg-white' ? 'text-deep-teal-600' : 'text-white/70'}`}>
            {action.subtitle}
          </p>
          <p className={`text-sm font-medium leading-relaxed ${action.color === 'bg-white' ? 'text-charcoal-blue-600' : 'text-white/80'}`}>
            {action.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
