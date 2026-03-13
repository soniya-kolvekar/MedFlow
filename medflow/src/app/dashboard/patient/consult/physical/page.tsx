"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  UserCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PhysicalConsultationBooking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    severity: 'Low',
    time: ''
  });

  const router = useRouter();

  const departments = [
    "Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Dermatology", "General Practice"
  ];

  const doctors = {
    "Cardiology": ["Dr. Mehta", "Dr. Jenkins", "Dr. Wilson"],
    "General Practice": ["Dr. Michael Chen", "Dr. Sarah Jenkins", "Dr. Amit Shah"],
    // Mocking others for now
    "Orthopedics": ["Dr. Bone", "Dr. Joint"],
    "Neurology": ["Dr. Brain", "Dr. Nerve"],
    "Pediatrics": ["Dr. Kid", "Dr. Child"],
    "Dermatology": ["Dr. Skin", "Dr. Face"]
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
          <h1 className="text-3xl font-extrabold text-dark-slate-grey-500 tracking-tight">Book Physical Consultation</h1>
          <p className="text-charcoal-blue-500 font-medium mt-2">Follow the steps below to schedule your hospital visit.</p>
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
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Building2 className="h-5 w-5" />
                   </div>
                   <h2 className="text-xl font-bold text-dark-slate-grey-500">Select Department</h2>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                   {departments.map((dept) => (
                      <button
                         key={dept}
                         onClick={() => { setFormData({ ...formData, department: dept }); nextStep(); }}
                         className={`p-4 text-left rounded-2xl border transition-all ${formData.department === dept ? 'bg-deep-teal-500/10 border-deep-teal-500 text-deep-teal-600 font-bold' : 'bg-white border-ash-grey-700 hover:border-deep-teal-500/50 font-medium text-charcoal-blue-600'}`}
                      >
                         {dept}
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
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <UserCircle className="h-5 w-5" />
                   </div>
                   <h2 className="text-xl font-bold text-dark-slate-grey-500">Choose Specialist</h2>
                </div>
                
                <div className="grid gap-4">
                   {doctors[formData.department as keyof typeof doctors]?.map((doc) => (
                      <button
                         key={doc}
                         onClick={() => { setFormData({ ...formData, doctor: doc }); nextStep(); }}
                         className="flex items-center justify-between p-5 rounded-3xl bg-white border border-ash-grey-700 hover:border-deep-teal-500 group transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-ash-grey-800 flex items-center justify-center text-charcoal-blue-500 group-hover:bg-deep-teal-500/10 group-hover:text-deep-teal-600 transition-all">
                               <UserCircle className="h-6 w-6" />
                            </div>
                            <div>
                               <p className="font-bold text-dark-slate-grey-500">{doc}</p>
                               <p className="text-xs font-medium text-charcoal-blue-400">{formData.department} Specialist</p>
                            </div>
                         </div>
                         <ArrowRight className="h-5 w-5 text-charcoal-blue-300 group-hover:text-deep-teal-500 transform transition-all group-hover:translate-x-1" />
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
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                   </div>
                   <h2 className="text-xl font-bold text-dark-slate-grey-500">Severity & Time Slot</h2>
                </div>

                <div className="space-y-6">
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-charcoal-blue-500 mb-4">Issue Severity</p>
                      <div className="flex gap-3">
                         {['Low', 'Medium', 'High'].map(level => (
                            <button
                               key={level}
                               onClick={() => setFormData({ ...formData, severity: level })}
                               className={`flex-1 py-3 rounded-2xl border font-bold text-sm transition-all ${formData.severity === level ? (level === 'High' ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-deep-teal-500 text-white border-deep-teal-500 shadow-lg shadow-deep-teal-500/20') : 'bg-white border-ash-grey-700 text-charcoal-blue-500'}`}
                            >
                               {level}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-charcoal-blue-500 mb-4">Available Slots</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                         {timeSlots.map(time => (
                            <button
                               key={time}
                               onClick={() => setFormData({ ...formData, time })}
                               className={`py-3 rounded-2xl border font-bold text-sm transition-all ${formData.time === time ? 'bg-charcoal-blue-500 text-white border-charcoal-blue-500 shadow-lg shadow-charcoal-blue-500/20' : 'bg-white border-ash-grey-700 text-charcoal-blue-500 hover:border-charcoal-blue-500/50'}`}
                            >
                               {time}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="pt-6">
                   <button 
                      onClick={handleSubmit}
                      disabled={!formData.time}
                      className="w-full rounded-2xl bg-deep-teal-500 py-4 text-sm font-bold text-white transition-all hover:bg-deep-teal-600 shadow-xl shadow-deep-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                      <CalendarCheck className="h-4 w-4" />
                      Request Appointment
                   </button>
                </div>
             </motion.div>
          )}

          {step === 4 && (
             <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-10 border border-ash-grey-700 text-center shadow-2xl"
             >
                <div className="mx-auto h-20 w-20 rounded-3xl bg-deep-teal-500/10 text-deep-teal-500 flex items-center justify-center mb-8">
                   <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-dark-slate-grey-500 mb-4">Request Sent!</h2>
                <p className="text-charcoal-blue-500 font-medium mb-10 max-w-sm mx-auto">
                   Your consultation request for <strong>{formData.department}</strong> with <strong>{formData.doctor}</strong> has been sent to our admin team for prioritization.
                </p>
                
                <div className="bg-ash-grey-900 rounded-3xl p-6 mb-10 border border-ash-grey-800 text-left">
                   <div className="flex items-center gap-3 text-deep-teal-600 font-bold text-xs uppercase tracking-widest mb-4">
                      <AlertCircle className="h-4 w-4" /> Priority Notice
                   </div>
                   <p className="text-xs font-bold text-charcoal-blue-600 leading-relaxed">
                      Our AI system is currently evaluating your severity (<strong>{formData.severity}</strong>). You will receive a notification as soon as Dr. {formData.doctor.split(' ')[1]} confirms the slot.
                   </p>
                </div>

                <button 
                   onClick={() => router.push('/dashboard/patient')}
                   className="w-full rounded-2xl bg-charcoal-blue-500 py-4 text-sm font-bold text-white transition-all hover:bg-charcoal-blue-400"
                >
                   Return to Dashboard
                </button>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
