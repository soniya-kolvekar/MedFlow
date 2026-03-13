"use client";

import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity as ActivityIcon, 
  ShieldPlus, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Layers,
  FlaskConical
} from 'lucide-react';

export default function CheckupsPage() {
  const packages = [
    {
      title: "Full Body Checkup",
      subtitle: "Comprehensive health screening",
      price: "₹4,999",
      duration: "4-5 Hours",
      tests: ["Blood Count", "Lipid Profile", "Liver Function", "Kidney Function", "Blood Sugar", "ECG", "Chest X-Ray"],
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-100",
      popular: true
    },
    {
      title: "Cardiac Screening",
      subtitle: "Heart health orientation",
      price: "₹3,499",
      duration: "2-3 Hours",
      tests: ["ECG", "ECHO", "TMT", "Lipid Profile", "Cardiac Consult"],
      color: "text-red-600 bg-red-50",
      borderColor: "border-red-100",
      popular: false
    },
    {
      title: "Diabetes Package",
      subtitle: "Sugar & metabolic screening",
      price: "₹2,199",
      duration: "1-2 Hours",
      tests: ["HbA1c", "Average Glucose", "Microalbuminuria", "BMI & Vital Check"],
      color: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-100",
      popular: false
    }
  ];

  return (
    <div className="space-y-10 pb-12 font-sans">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
             <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-2">Health Checkup Packages</h1>
             <p className="text-charcoal-blue-500 font-medium">Preventive healthcare solutions tailored for your well-being. Book a slot today.</p>
          </div>
          <div className="flex items-center gap-2 bg-deep-teal-500/10 text-deep-teal-600 px-4 py-3 rounded-2xl border border-deep-teal-500/20">
             <Info className="h-5 w-5" />
             <span className="text-xs font-bold uppercase tracking-widest">NABL Accredited Labs</span>
          </div>
       </div>

       {/* Packages Grid */}
       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
             <motion.div
                key={pkg.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative flex flex-col rounded-[32px] bg-white p-8 border ${pkg.borderColor} shadow-sm transition-all hover:shadow-2xl hover:border-transparent`}
             >
                {pkg.popular && (
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-charcoal-blue-500 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                     <Layers className="h-3 w-3" /> Popular
                  </div>
                )}

                <div className="mb-8">
                   <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-6 ${pkg.color}`}>
                      {pkg.title.includes('Full') ? <ShieldPlus className="h-8 w-8" /> : pkg.title.includes('Cardiac') ? <Heart className="h-8 w-8" /> : <ActivityIcon className="h-8 w-8" />}
                   </div>
                   <h2 className="text-2xl font-bold text-dark-slate-grey-500 mb-1">{pkg.title}</h2>
                   <p className="text-sm font-bold text-charcoal-blue-400 uppercase tracking-widest">{pkg.subtitle}</p>
                </div>

                <div className="mb-8 flex items-end gap-2">
                   <span className="text-3xl font-black text-dark-slate-grey-500">{pkg.price}</span>
                   <span className="text-xs font-bold text-charcoal-blue-400 mb-2">/ per person</span>
                </div>

                <div className="mb-10 space-y-4">
                   <div className="flex items-center gap-2 text-xs font-bold text-charcoal-blue-500">
                      <Clock className="h-4 w-4" />
                      Duration: {pkg.duration}
                   </div>
                   <div className="space-y-3 pt-2 border-t border-ash-grey-700">
                      <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Includes {pkg.tests.length} Tests</p>
                      {pkg.tests.map((test) => (
                        <div key={test} className="flex items-center gap-3 text-xs font-bold text-charcoal-blue-600">
                           <CheckCircle2 className="h-4 w-4 text-deep-teal-500" />
                           {test}
                        </div>
                      ))}
                   </div>
                </div>

                <button className="mt-auto w-full rounded-2xl bg-charcoal-blue-500 py-4 text-sm font-bold text-white transition-all hover:bg-charcoal-blue-400 flex items-center justify-center gap-2 group">
                   Book Package
                   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
             </motion.div>
          ))}
       </div>

       {/* Comparison Banner */}
       <div className="rounded-[40px] bg-white border border-ash-grey-700 p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
             <h3 className="text-2xl font-bold text-dark-slate-grey-500 tracking-tight">Need a custom health package?</h3>
             <p className="text-charcoal-blue-500 font-medium">Talk to our medical advisors to create a personalized screening plan based on your family history and lifestyle.</p>
             <div className="flex gap-4 pt-2">
                <button className="rounded-xl bg-ash-grey-900 px-6 py-3 text-xs font-bold text-charcoal-blue-600 border border-ash-grey-700 hover:bg-white transition-all">Chat with Expert</button>
                <button className="rounded-xl bg-deep-teal-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-deep-teal-500/20">Call Advisor</button>
             </div>
          </div>
          <div className="h-48 w-48 rounded-[32px] bg-ash-grey-900 border border-ash-grey-700 flex items-center justify-center relative shrink-0 overflow-hidden">
             <ShieldPlus className="h-24 w-24 text-ash-grey-800 absolute" />
             <div className="relative z-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Trust Score</p>
                <p className="text-4xl font-black text-deep-teal-500">99%</p>
                <p className="text-[10px] font-bold text-charcoal-blue-600">Accuracy</p>
             </div>
          </div>
       </div>
    </div>
  );
}

// Diagnostic services icons are now imported correctly
