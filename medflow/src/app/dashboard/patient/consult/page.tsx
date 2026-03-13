"use client";

import { motion } from 'framer-motion';
import { MapPin, Video, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function ConsultDoctorPage() {
  const options = [
    {
      title: "Physical Consultation",
      subtitle: "Visit the hospital in person",
      description: "Best for comprehensive physical examinations, surgical follow-ups, and specialized diagnostic tests.",
      icon: MapPin,
      href: "/dashboard/patient/consult/physical",
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-100",
      benefits: ["Face-to-face examination", "On-site lab services", "Specialized equipment"]
    },
    {
      title: "Virtual Consultation",
      subtitle: "Secure video call from home",
      description: "Perfect for follow-ups, symptom discussion, and prescription renewals without traveling.",
      icon: Video,
      href: "/dashboard/patient/consult/virtual",
      color: "text-deep-teal-600 bg-deep-teal-50",
      borderColor: "border-deep-teal-100",
      benefits: ["No travel required", "AI Live Transcript", "Instant Clinical Summary"]
    }
  ];

  return (
    <div className="space-y-10 pb-12 font-sans">
       <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-4">Consult a Doctor</h1>
          <p className="text-lg font-medium text-charcoal-blue-600 leading-relaxed">
             Choose the type of consultation you need. Our AI-powered system will help match you with the right specialist.
          </p>
       </div>

       <div className="grid gap-8 md:grid-cols-2">
          {options.map((option, i) => (
             <motion.div
                key={option.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative flex flex-col rounded-[32px] bg-white p-8 border ${option.borderColor} shadow-sm transition-all hover:shadow-2xl hover:border-transparent`}
             >
                <div className="mb-8 flex items-center justify-between">
                   <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${option.color}`}>
                      <option.icon className="h-8 w-8" />
                   </div>
                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ash-grey-900 text-charcoal-blue-400 group-hover:bg-deep-teal-500 group-hover:text-white transition-all">
                      <ArrowRight className="h-5 w-5" />
                   </div>
                </div>

                <div className="mb-6">
                   <h2 className="text-2xl font-bold text-dark-slate-grey-500 mb-2">{option.title}</h2>
                   <p className="font-bold text-deep-teal-600 text-sm uppercase tracking-widest mb-4">{option.subtitle}</p>
                   <p className="text-charcoal-blue-500 text-sm font-medium leading-relaxed">
                      {option.description}
                   </p>
                </div>

                <div className="mt-auto space-y-3">
                   {option.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-3 text-xs font-bold text-charcoal-blue-600">
                         <ShieldCheck className="h-4 w-4 text-deep-teal-500" />
                         {benefit}
                      </div>
                   ))}
                </div>

                <Link 
                   href={option.href}
                   className="mt-10 block w-full rounded-2xl bg-charcoal-blue-500 py-4 text-center text-sm font-bold text-white transition-all hover:bg-charcoal-blue-400"
                >
                   Continue with {option.title.split(' ')[0]}
                </Link>
             </motion.div>
          ))}
       </div>

       {/* Features Highlight */}
       <div className="rounded-[32px] bg-ash-grey-900 border border-ash-grey-700 p-8">
          <div className="grid gap-8 sm:grid-cols-3">
             <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-ash-grey-700">
                   <Clock className="h-6 w-6 text-deep-teal-500" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-dark-slate-grey-500">24/7 Availability</h4>
                   <p className="text-[10px] font-bold text-charcoal-blue-500 mt-1 uppercase tracking-widest">Connect anytime</p>
                </div>
             </div>
             <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-ash-grey-700">
                   <Users className="h-6 w-6 text-deep-teal-500" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-dark-slate-grey-500">Expert Doctors</h4>
                   <p className="text-[10px] font-bold text-charcoal-blue-500 mt-1 uppercase tracking-widest">Board certified</p>
                </div>
             </div>
             <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-ash-grey-700">
                   <ShieldCheck className="h-6 w-6 text-deep-teal-500" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-dark-slate-grey-500">Secure AI</h4>
                   <p className="text-[10px] font-bold text-charcoal-blue-500 mt-1 uppercase tracking-widest">HIPAA Compliant</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
