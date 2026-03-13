"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  UserCircle, 
  Clock, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  Video,
  MonitorPlay
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VirtualConsultationBooking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    speciality: '',
    doctor: '',
    severity: 'Low',
    time: ''
  });

  const router = useRouter();

  const specialities = [
    "Cardiology", "Neurology", "General Practice", "Psychiatry", "Dermatology"
  ];

  const doctors = {
    "Cardiology": ["Dr. Mehta", "Dr. Jenkins"],
    "General Practice": ["Dr. Michael Chen", "Dr. Sarah Jenkins"],
    "Neurology": ["Dr. Brain", "Dr. Nerve"],
    "Psychiatry": ["Dr. Mind", "Dr. Soul"],
    "Dermatology": ["Dr. Skin", "Dr. Glow"]
  };

  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setStep(4); // Success step
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 font-sans">
       {/* Header */}
       <div className="mb-10">
          <button onClick={() => step === 1 ? router.back() : prevStep()} className="group mb-6 flex items-center gap-2 text-sm font-bold text-charcoal-blue-400 hover:text-deep-teal-500 transition-colors">
             <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
             Back
          </button>
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-deep-teal-500/10 text-deep-teal-600 flex items-center justify-center">
                <Video className="h-6 w-6" />
             </div>
             <h1 className="text-3xl font-extrabold text-dark-slate-grey-500 tracking-tight">Virtual Consultation</h1>
          </div>
       </div>

       {/* Stepper */}
       <div className="mb-12 flex items-center gap-4">
          {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-deep-teal-500 text-white shadow-lg shadow-deep-teal-500/20' : 'bg-ash-grey-800 text-charcoal-blue-400'}`}>
                   {s}
                </div>
                {s < 3 && <div className={`h-0.5 w-12 rounded-full transition-all ${step > s ? 'bg-deep-teal-500' : 'bg-ash-grey-800'}`} />}
             </div>
          ))}
       </div>

       <AnimatePresence mode="wait">
          {step === 1 && (
             <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
             >
                <div className="flex items-center gap-2 mb-6 text-xs font-black uppercase tracking-[0.2em] text-charcoal-blue-400">
                   Step 1: Select Speciality
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                   {specialities.map((spec) => (
                      <button
                         key={spec}
                         onClick={() => { setFormData({ ...formData, speciality: spec }); nextStep(); }}
                         className={`p-6 text-left rounded-3xl border-2 transition-all ${formData.speciality === spec ? 'bg-deep-teal-500 border-deep-teal-500 text-white shadow-xl shadow-deep-teal-500/20' : 'bg-white border-ash-grey-700 hover:border-deep-teal-500/50 font-bold text-dark-slate-grey-500'}`}
                      >
                         <div className="flex items-center justify-between">
                            {spec}
                            <Stethoscope className={`h-5 w-5 ${formData.speciality === spec ? 'text-white' : 'text-ash-grey-700'}`} />
                         </div>
                      </button>
                   ))}
                </div>
             </motion.div>
          )}

          {step === 2 && (
             <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
             >
                <div className="flex items-center gap-2 mb-6 text-xs font-black uppercase tracking-[0.2em] text-charcoal-blue-400">
                   Step 2: Choose Doctor
                </div>
                
                <div className="grid gap-4">
                   {doctors[formData.speciality as keyof typeof doctors]?.map((doc) => (
                      <button
                         key={doc}
                         onClick={() => { setFormData({ ...formData, doctor: doc }); nextStep(); }}
                         className="flex items-center justify-between p-6 rounded-[32px] bg-white border border-ash-grey-700 hover:border-deep-teal-500 hover:shadow-xl transition-all group"
                      >
                         <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-3xl bg-ash-grey-800 flex items-center justify-center text-charcoal-blue-500 group-hover:bg-deep-teal-500 group-hover:text-white transition-all">
                               <UserCircle className="h-8 w-8" />
                            </div>
                            <div className="text-left">
                               <p className="text-lg font-bold text-dark-slate-grey-500">{doc}</p>
                               <p className="text-xs font-bold text-charcoal-blue-400 uppercase tracking-widest">{formData.speciality} Expert</p>
                            </div>
                         </div>
                         <div className="h-10 w-10 rounded-full border border-ash-grey-700 flex items-center justify-center text-ash-grey-700 group-hover:bg-deep-teal-500 group-hover:border-deep-teal-500 group-hover:text-white transition-all">
                            <ArrowRight className="h-5 w-5" />
                         </div>
                      </button>
                   ))}
                </div>
             </motion.div>
          )}

          {step === 3 && (
             <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
             >
                <div className="flex items-center gap-3 mb-6 text-xs font-black uppercase tracking-[0.2em] text-charcoal-blue-400">
                   Step 3: Appointment Details
                </div>

                <div className="grid gap-8">
                   <div className="rounded-3xl bg-ash-grey-900 border border-ash-grey-700 p-8 space-y-8">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-4">Severity of Concern</p>
                         <div className="flex gap-4">
                            {['Low', 'Medium', 'High'].map(level => (
                               <button
                                  key={level}
                                  onClick={() => setFormData({ ...formData, severity: level })}
                                  className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.severity === level ? 'bg-deep-teal-500 text-white border-deep-teal-500 shadow-lg' : 'bg-white border-ash-grey-700 text-charcoal-blue-500 hover:border-deep-teal-500/30'}`}
                               >
                                  {level}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-4">Select Time Slot</p>
                         <div className="grid grid-cols-2 gap-3">
                            {timeSlots.map(time => (
                               <button
                                  key={time}
                                  onClick={() => setFormData({ ...formData, time })}
                                  className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.time === time ? 'bg-charcoal-blue-500 text-white border-charcoal-blue-500 shadow-lg' : 'bg-white border-ash-grey-700 text-charcoal-blue-500 hover:border-charcoal-blue-500/50'}`}
                               >
                                  <div className="flex items-center justify-center gap-2">
                                     <Clock className="h-4 w-4" />
                                     {time}
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-4 px-2">
                   <button 
                      onClick={handleSubmit}
                      disabled={!formData.time}
                      className="w-full rounded-2xl bg-deep-teal-500 py-5 text-base font-bold text-white transition-all hover:bg-deep-teal-600 shadow-2xl shadow-deep-teal-500/30 disabled:opacity-50 flex items-center justify-center gap-3 group"
                   >
                      Confirm Virtual Visit
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                   </button>
                </div>
             </motion.div>
          )}

          {step === 4 && (
             <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[48px] p-12 border border-ash-grey-700 text-center shadow-2xl"
             >
                <div className="mx-auto h-24 w-24 rounded-[32px] bg-deep-teal-500/10 text-deep-teal-500 flex items-center justify-center mb-8 relative">
                   <CheckCircle2 className="h-12 w-12" />
                   <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-deep-teal-500 border-4 border-white flex items-center justify-center">
                      <Video className="h-3.5 w-3.5 text-white" />
                   </div>
                </div>
                
                <h2 className="text-4xl font-extrabold text-dark-slate-grey-500 mb-4">Confirmed!</h2>
                <p className="text-charcoal-blue-500 font-medium mb-12 max-w-sm mx-auto leading-relaxed">
                   Your virtual consultation with <strong>{formData.doctor}</strong> is scheduled for <strong>today at {formData.time}</strong>.
                </p>
                
                <div className="bg-deep-teal-500 p-8 rounded-[32px] mb-10 text-left text-white shadow-xl shadow-deep-teal-500/20">
                   <h3 className="font-bold text-lg mb-2">Ready to start?</h3>
                   <p className="text-sm text-deep-teal-100 mb-6 font-medium">You can enter the consultation room 5 minutes before your scheduled time.</p>
                   <button 
                      onClick={() => router.push('/dashboard/patient/consult/room')}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white py-4 text-sm font-bold text-deep-teal-600 transition-transform hover:scale-105"
                   >
                      <MonitorPlay className="h-5 w-5" />
                      Enter Virtual Room
                   </button>
                </div>

                <button 
                   onClick={() => router.push('/dashboard/patient')}
                   className="text-sm font-bold text-charcoal-blue-400 hover:text-charcoal-blue-600 transition-colors"
                >
                   Return to Overview
                </button>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
