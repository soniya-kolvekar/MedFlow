"use client";

import React from "react";
import { User, Clock, ChevronRight, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    status: "Waiting" | "Ready" | "Completed";
    time: string;
    condition: string;
}

const mockPatients: Patient[] = [
    { id: "P001", name: "Rahul Sharma", age: 45, gender: "Male", status: "Ready", time: "10:30 AM", condition: "Chronic Hypertension" },
    { id: "P002", name: "Anjali Gupta", age: 28, gender: "Female", status: "Waiting", time: "11:00 AM", condition: "Routine Checkup" },
    { id: "P003", name: "Vikram Singh", age: 52, gender: "Male", status: "Waiting", time: "11:30 AM", condition: "Post-op Follow-up" },
    { id: "P004", name: "Sneha Patil", age: 34, gender: "Female", status: "Completed", time: "09:45 AM", condition: "Dermatitis" },
];

export default function PatientList({ onStartSession }: { onStartSession: (patient: Patient) => void }) {
    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] p-8 shadow-sm border border-ash-grey-600/30 overflow-hidden">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-dark-slate-grey-500 tracking-tight">Today's Patients</h2>
                    <p className="text-xs font-bold text-dark-slate-grey-800 uppercase tracking-widest mt-1">
                        {mockPatients.length} Appointments Scheduled
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash-grey-600" />
                        <input 
                            type="text" 
                            placeholder="Search patients..." 
                            className="pl-10 pr-4 py-2.5 bg-ash-grey-900 border border-ash-grey-800 rounded-xl text-xs font-medium focus:outline-none focus:border-deep-teal-500 w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {mockPatients.map((patient, idx) => (
                    <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group flex items-center justify-between p-5 bg-ash-grey-900/50 border border-ash-grey-800 hover:border-deep-teal-500/30 hover:bg-white hover:shadow-lg hover:shadow-deep-teal-500/5 rounded-3xl transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-ash-grey-800 group-hover:scale-105 transition-transform">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${patient.name}&background=84a98c&color=fff&bold=true`} 
                                    alt={patient.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-dark-slate-grey-500 group-hover:text-deep-teal-600 transition-colors uppercase tracking-tight text-lg">
                                    {patient.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest bg-ash-grey-900 px-2 py-0.5 rounded border border-ash-grey-800">
                                        {patient.age}Y • {patient.gender}
                                    </span>
                                    <span className="text-[10px] font-bold text-ash-grey-600 uppercase tracking-widest">• {patient.condition}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest mb-1 flex items-center justify-end gap-1.5">
                                    <Clock className="w-3 h-3 text-deep-teal-500" /> Appointment
                                </p>
                                <p className="text-sm font-bold text-dark-slate-grey-500">{patient.time}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    patient.status === 'Ready' ? 'bg-green-50 text-green-600 border-green-100' :
                                    patient.status === 'Waiting' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    'bg-ash-grey-100 text-ash-grey-600 border-ash-grey-200'
                                }`}>
                                    {patient.status}
                                </span>
                                
                                {patient.status !== 'Completed' && (
                                    <button 
                                        onClick={() => onStartSession(patient)}
                                        className="bg-dark-slate-grey-500 hover:bg-deep-teal-600 text-white p-3 rounded-2xl transition-all shadow-lg active:scale-95 group/btn"
                                    >
                                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
