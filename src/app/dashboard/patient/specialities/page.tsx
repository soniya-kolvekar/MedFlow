"use client";

import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Stethoscope, 
  Baby, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Search,
  Users
} from 'lucide-react';
import { useState } from 'react';

export default function SpecialitiesPage() {
  const [activeTab, setActiveTab] = useState('Speciality Services');

  const tabs = ['Speciality Services', 'Super Speciality Services', 'Diagnostic Services'];

  const specialities = {
    'Speciality Services': [
      { name: 'Cardiology', icon: Heart, drs: 8, desc: 'Advanced heart care focusing on prevention, diagnosis, and treatment of cardiovascular diseases.' },
      { name: 'Neurology', icon: Brain, drs: 5, desc: 'Comprehensive care for disorders of the nervous system, including the brain and spinal cord.' },
      { name: 'General Practice', icon: Stethoscope, drs: 12, desc: 'Primary healthcare for all ages, focusing on holistic well-being and preventive care.' },
      { name: 'Pediatrics', icon: Baby, drs: 6, desc: 'Expert medical care for infants, children, and adolescents.' },
    ],
    'Super Speciality Services': [
      { name: 'Oncology', icon: ShieldCheck, drs: 4, desc: 'Specialized cancer care including diagnosis, therapy, and supportive services.' },
      { name: 'Nephrology', icon: Activity, drs: 3, desc: 'Expert care for kidney-related conditions and hypertension.' },
    ],
    'Diagnostic Services': [
      { name: 'Radiology', icon: Search, drs: 10, desc: 'Advanced imaging services including MRI, CT, and X-ray for precise diagnosis.' },
      { name: 'Pathology', icon: FlaskConical, drs: 15, desc: 'Comprehensive laboratory testing and analysis for accurate disease detection.' },
    ]
  };

  return (
    <div className="space-y-10 pb-12 font-sans">
       <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-2">Hospital Specialities</h1>
          <p className="text-charcoal-blue-500 font-medium">Explore our world-class departments and find the right specialist for your needs.</p>
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

       {/* Speciality Grid */}
       <div className="grid gap-6 md:grid-cols-2">
          {specialities[activeTab as keyof typeof specialities]?.map((spec, i) => (
             <motion.div
                key={spec.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-[32px] bg-white p-8 border border-ash-grey-700 shadow-sm transition-all hover:shadow-xl hover:border-deep-teal-500/30"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ash-grey-900 text-charcoal-blue-400 group-hover:bg-deep-teal-500 group-hover:text-white transition-all">
                      <spec.icon className="h-8 w-8" />
                   </div>
                   <div className="flex items-center gap-2 text-deep-teal-600 font-bold text-xs uppercase tracking-widest bg-deep-teal-50 px-3 py-1.5 rounded-lg">
                      <Users className="h-3.5 w-3.5" />
                      {spec.drs} Doctors
                   </div>
                </div>

                <h3 className="text-2xl font-bold text-dark-slate-grey-500 mb-4">{spec.name}</h3>
                <p className="text-charcoal-blue-500 font-medium text-sm leading-relaxed mb-8">
                   {spec.desc}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-ash-grey-700">
                   <button className="text-sm font-bold text-deep-teal-600 hover:underline flex items-center gap-2">
                      View Department Details
                      <ChevronRight className="h-4 w-4" />
                   </button>
                   <button className="h-10 w-10 flex items-center justify-center rounded-full bg-ash-grey-900 border border-ash-grey-700 text-charcoal-blue-400 group-hover:bg-deep-teal-500 group-hover:text-white transition-all">
                      <ArrowRight className="h-5 w-5" />
                   </button>
                </div>
             </motion.div>
          ))}
       </div>

       {/* CTAs */}
       <div className="grid gap-6 sm:grid-cols-3">
          <div className="col-span-1 rounded-3xl bg-charcoal-blue-500 p-8 text-white shadow-xl shadow-charcoal-blue-500/20">
             <h4 className="text-xl font-bold mb-3">Emergency?</h4>
             <p className="text-sm text-charcoal-blue-800 font-medium mb-6">Our trauma center is open 24/7 for urgent care needs.</p>
             <button className="w-full rounded-xl bg-red-500 py-3 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105">
                Call Emergency
             </button>
          </div>
          <div className="sm:col-span-2 rounded-3xl bg-deep-teal-500 p-8 text-white shadow-xl shadow-deep-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-8">
             <div className="max-w-md">
                <h4 className="text-xl font-bold mb-3">Not sure which doctor to see?</h4>
                <p className="text-sm text-deep-teal-100 font-medium">Use our AI-powered symptoms checker to get matched with the right specialist in minutes.</p>
             </div>
             <button className="whitespace-nowrap rounded-xl bg-white px-8 py-4 text-sm font-bold text-deep-teal-600 shadow-lg transition-transform hover:scale-105">
                Check Symptoms Now
             </button>
          </div>
       </div>
    </div>
  );
}

// Dummy components for missing icons used above
function Activity(props: any) { return <span {...props} /> }
function FlaskConical(props: any) { return <span {...props} /> }
