"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, UploadCloud, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { db } from "../../../../lib/firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
}

export default function SmartPrescription({ sessionId = "demo-session-123" }: { sessionId?: string }) {
    const [diagnosis, setDiagnosis] = useState("Acute Bronchitis");
    const [medications, setMedications] = useState<Medication[]>([
        { id: "1", name: "Amoxicillin", dosage: "500mg", frequency: "TID (3x daily)" }
    ]);
    const [patientAllergies, setPatientAllergies] = useState<string[]>(["Penicillin", "Shellfish"]);
    const [warnings, setWarnings] = useState<{ id: string; msg: string }[]>([]);

    // Sync with Firestore
    useEffect(() => {
        const sessionRef = doc(db, "sessions", sessionId);
        const unsubscribe = onSnapshot(sessionRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.diagnosis) setDiagnosis(data.diagnosis);
                if (data.medications) setMedications(data.medications);
                if (data.allergies) setPatientAllergies(data.allergies);
            }
        });
        return () => unsubscribe();
    }, [sessionId]);

    // AI Safety Guard Logic
    useEffect(() => {
        const newWarnings: { id: string; msg: string }[] = [];
        medications.forEach(med => {
            // Simple rule-based check: Amoxicillin is a Penicillin derivative
            if (med.name.toLowerCase().includes("amoxicillin") &&
                patientAllergies.some(a => a.toLowerCase().includes("penicillin"))) {
                newWarnings.push({
                    id: med.id,
                    msg: `AI Guard: Possible Allergy Conflict. ${med.name} is a penicillin derivative.`
                });
            }
        });
        setWarnings(newWarnings);
    }, [medications, patientAllergies]);

    const updateDiagnosis = async (val: string) => {
        setDiagnosis(val);
        await updateDoc(doc(db, "sessions", sessionId), { diagnosis: val });
    };

    const addMedication = async () => {
        const newMed = { id: Date.now().toString(), name: "New Drug", dosage: "---", frequency: "---" };
        const updated = [...medications, newMed];
        setMedications(updated);
        await updateDoc(doc(db, "sessions", sessionId), { medications: updated });
    };

    const removeMedication = async (id: string) => {
        const updated = medications.filter(m => m.id !== id);
        setMedications(updated);
        await updateDoc(doc(db, "sessions", sessionId), { medications: updated });
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col h-full min-h-0 border border-ash-grey-600/30">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-deep-teal-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-dark-slate-grey-500">
                        Smart Prescription
                    </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-muted-teal-50 px-3 py-1 rounded-full border border-muted-teal-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-deep-teal-600" />
                    <span className="text-[10px] font-bold text-deep-teal-600 uppercase tracking-wider">AI Protected</span>
                </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Diagnosis */}
                <div>
                    <label className="text-[11px] font-bold text-dark-slate-grey-800 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                        Diagnosis <Info className="w-3 h-3 text-ash-grey-600" />
                    </label>
                    <div className="bg-ash-grey-900 rounded-xl px-4 py-3 border border-ash-grey-800 focus-within:border-deep-teal-500 focus-within:ring-1 focus-within:ring-deep-teal-500 transition-all text-sm text-dark-slate-grey-500 font-medium shadow-inner">
                        <input
                            type="text"
                            value={diagnosis}
                            onChange={(e) => updateDiagnosis(e.target.value)}
                            className="w-full bg-transparent focus:outline-none"
                        />
                    </div>
                </div>

                {/* Medications */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-dark-slate-grey-800 uppercase tracking-wider block">
                            Medications
                        </label>
                        <button
                            onClick={addMedication}
                            className="text-xs font-bold text-deep-teal-500 hover:text-deep-teal-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-muted-teal-50"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Drug
                        </button>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {medications.map((med) => (
                                <motion.div
                                    key={med.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white border border-ash-grey-600/40 rounded-2xl p-4 relative shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <button
                                        onClick={() => removeMedication(med.id)}
                                        className="absolute top-4 right-4 text-dark-slate-grey-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <h4 className="font-bold text-dark-slate-grey-500 mb-2">
                                        {med.name}
                                    </h4>
                                    <div className="flex gap-2 text-sm">
                                        <span className="bg-ash-grey-900 px-3 py-1.5 rounded-xl text-dark-slate-grey-500 font-bold text-[11px] border border-ash-grey-800/50">
                                            {med.dosage}
                                        </span>
                                        <span className="bg-ash-grey-900 px-3 py-1.5 rounded-xl text-dark-slate-grey-500 font-bold text-[11px] border border-ash-grey-800/50 flex-1 text-center">
                                            {med.frequency}
                                        </span>
                                    </div>

                                    {/* Warning tag */}
                                    {warnings.find(w => w.id === med.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-3 bg-red-50 text-red-600 text-[10px] py-2 px-3 rounded-lg flex items-center gap-2 border border-red-100 font-bold leading-tight"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                            <span>{warnings.find(w => w.id === med.id)?.msg}</span>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Lab Tests */}
                <div>
                    <label className="text-[11px] font-bold text-dark-slate-grey-800 uppercase tracking-wider mb-2 block">
                        Lab Tests / Imaging
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-muted-teal-100 text-deep-teal-600 px-3 py-1.5 rounded-xl text-[10px] font-extrabold border border-muted-teal-200/50 flex items-center gap-1.5 shadow-sm">
                            Chest X-Ray{" "}
                            <X className="w-3 h-3 cursor-pointer hover:text-deep-teal-800" />
                        </span>
                        <span className="bg-muted-teal-100 text-deep-teal-600 px-3 py-1.5 rounded-xl text-[10px] font-extrabold border border-muted-teal-200/50 flex items-center gap-1.5 shadow-sm">
                            CBC Profile{" "}
                            <X className="w-3 h-3 cursor-pointer hover:text-deep-teal-800" />
                        </span>
                    </div>
                </div>
            </div>

            <button className="mt-6 shrink-0 w-full bg-dark-slate-grey-500 hover:bg-dark-slate-grey-400 text-white rounded-2xl py-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-dark-slate-grey-500/20 active:scale-[0.98]">
                <UploadCloud className="w-5 h-5" />
                Sync to Pharmacy & Lab
            </button>
        </div>
    );
}
