"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, UploadCloud, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
}

interface LineItem {
    id: string;
    text: string;
}

export default function SmartPrescription({ sessionId = "demo-session-123" }: { sessionId?: string }) {
    const [patientInfo, setPatientInfo] = useState({ name: "Rahul Sharma", age: 45, gender: "Male" });
    const [diagnoses, setDiagnoses] = useState<LineItem[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [advices, setAdvices] = useState<LineItem[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Sync with Firestore
    useEffect(() => {
        const sessionRef = doc(db, "sessions", sessionId);
        const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.diagnoses) setDiagnoses(data.diagnoses);
                else setDiagnoses([]);
                if (data.medications) setMedications(data.medications);
                if (data.advices) setAdvices(data.advices);
                else setAdvices([]);
                if (data.patientName) setPatientInfo(prev => ({ ...prev, name: data.patientName }));
                if (data.patientAge) setPatientInfo(prev => ({ ...prev, age: data.patientAge }));
                if (data.patientGender) setPatientInfo(prev => ({ ...prev, gender: data.patientGender }));
            }
        });
        return () => unsubscribe();
    }, [sessionId]);


    const generatePDFAndUpload = async () => {
        setIsGenerating(true);
        try {
            const docPdf = new jsPDF();
            
            // PDF Styling
            docPdf.setFontSize(22);
            docPdf.setTextColor(20, 80, 80);
            docPdf.text("MedFlow AI - Digital Prescription", 20, 20);
            
            docPdf.setFontSize(12);
            docPdf.setTextColor(0, 0, 0);
            docPdf.text(`Patient: ${patientInfo.name}`, 20, 40);
            docPdf.text(`Age/Gender: ${patientInfo.age} / ${patientInfo.gender}`, 20, 50);
            docPdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
            docPdf.text(`Session ID: ${sessionId}`, 20, 70);
            
            docPdf.setDrawColor(200, 200, 200);
            docPdf.line(20, 75, 190, 75);
            
            docPdf.setFontSize(14);
            docPdf.text("Diagnosis:", 20, 85);
            let yPos = 95;
            if (diagnoses.length === 0) {
                docPdf.setFontSize(12);
                docPdf.text("No diagnosis provided", 20, yPos);
                yPos += 10;
            } else {
                diagnoses.forEach((d, i) => {
                    docPdf.setFontSize(12);
                    docPdf.text(`${i+1}. ${d.text}`, 25, yPos);
                    yPos += 10;
                });
            }
            
            yPos += 5;
            docPdf.setFontSize(14);
            docPdf.text("Medications:", 20, yPos);
            yPos += 10;
            if (medications.length === 0) {
                docPdf.setFontSize(12);
                docPdf.text("No medications prescribed", 20, yPos);
                yPos += 10;
            } else {
                medications.forEach((med, i) => {
                    docPdf.setFontSize(12);
                    docPdf.text(`${i+1}. ${med.name} - ${med.dosage} (${med.frequency})`, 25, yPos);
                    yPos += 10;
                });
            }
            
            yPos += 5;
            docPdf.setFontSize(14);
            docPdf.text("Advice / Instructions:", 20, yPos);
            yPos += 10;
            if (advices.length === 0) {
                docPdf.setFontSize(12);
                docPdf.text("No advice provided", 20, yPos);
            } else {
                advices.forEach((a, i) => {
                    docPdf.setFontSize(12);
                    docPdf.text(`${i+1}. ${a.text}`, 25, yPos);
                    yPos += 10;
                });
            }

            // Convert PDF to Blob
            const pdfBlob = docPdf.output('blob');
            
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', pdfBlob);
            formData.append('upload_preset', 'ml_default');
            formData.append('resource_type', 'auto');
            
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            console.log("Prescription Uploaded:", result.secure_url);
            
            // Save to Firestore
            await updateDoc(doc(db, "sessions", sessionId), {
                prescriptionUrl: result.secure_url,
                medications: medications,
                diagnoses: diagnoses,
                advices: advices
            });

            alert("Prescription generated and synced successfully!");
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to export prescription.");
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Diagnosis Logic ---
    const addDiagnosis = async () => {
        const updated = [...diagnoses, { id: Date.now().toString(), text: "" }];
        setDiagnoses(updated);
        await updateDoc(doc(db, "sessions", sessionId), { diagnoses: updated });
    };

    const removeDiagnosis = async (id: string) => {
        const updated = diagnoses.filter(d => d.id !== id);
        setDiagnoses(updated);
        await updateDoc(doc(db, "sessions", sessionId), { diagnoses: updated });
    };

    const updateDiagnosis = async (id: string, text: string) => {
        const updated = diagnoses.map(d => d.id === id ? { ...d, text } : d);
        setDiagnoses(updated);
        await updateDoc(doc(db, "sessions", sessionId), { diagnoses: updated });
    };

    const addMedication = async () => {
        const newMed = { id: Date.now().toString(), name: "", dosage: "", frequency: "" };
        const updated = [...medications, newMed];
        setMedications(updated);
        await updateDoc(doc(db, "sessions", sessionId), { medications: updated });
    };

    const removeMedication = async (id: string) => {
        const updated = medications.filter(m => m.id !== id);
        setMedications(updated);
        await updateDoc(doc(db, "sessions", sessionId), { medications: updated });
    };

    const updateMedication = async (id: string, field: keyof Medication, value: string) => {
        const updated = medications.map(m => m.id === id ? { ...m, [field]: value } : m);
        setMedications(updated);
        await updateDoc(doc(db, "sessions", sessionId), { medications: updated });
    };

    // --- Advice Logic ---
    const addAdvice = async () => {
        const updated = [...advices, { id: Date.now().toString(), text: "" }];
        setAdvices(updated);
        await updateDoc(doc(db, "sessions", sessionId), { advices: updated });
    };

    const removeAdvice = async (id: string) => {
        const updated = advices.filter(a => a.id !== id);
        setAdvices(updated);
        await updateDoc(doc(db, "sessions", sessionId), { advices: updated });
    };

    const updateAdvice = async (id: string, text: string) => {
        const updated = advices.map(a => a.id === id ? { ...a, text } : a);
        setAdvices(updated);
        await updateDoc(doc(db, "sessions", sessionId), { advices: updated });
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
                <div className="flex items-center gap-1.5 bg-ash-grey-900 px-3 py-1 rounded-full border border-ash-grey-800">
                    <span className="text-[10px] font-bold text-dark-slate-grey-500 uppercase tracking-wider">Manual Entry</span>
                </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Patient Header */}
                <div className="bg-ash-grey-900/50 p-4 rounded-2xl border border-ash-grey-800">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-ash-grey-600 uppercase tracking-widest">Active Patient</span>
                        <span className="text-[10px] font-bold text-dark-slate-grey-500">{patientInfo.name} ({patientInfo.age}Y)</span>
                    </div>
                </div>

                {/* Diagnosis */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-dark-slate-grey-800 uppercase tracking-wider flex items-center gap-1.5">
                            Diagnosis <Info className="w-3 h-3 text-ash-grey-600" />
                        </label>
                        <button
                            onClick={addDiagnosis}
                            className="text-xs font-bold text-deep-teal-500 hover:text-deep-teal-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-muted-teal-50"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Line
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        <AnimatePresence>
                            {diagnoses.length === 0 && (
                                <div className="text-xs text-ash-grey-600 font-medium italic px-2 py-1">No diagnosis added.</div>
                            )}
                            {diagnoses.map((d) => (
                                <motion.div
                                    key={d.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative group bg-ash-grey-900 rounded-xl px-4 py-3 border border-ash-grey-800 focus-within:border-deep-teal-500 focus-within:ring-1 focus-within:ring-deep-teal-500 transition-all text-sm text-dark-slate-grey-500 font-medium shadow-inner"
                                >
                                    <input
                                        type="text"
                                        placeholder="Enter diagnosis line..."
                                        value={d.text}
                                        onChange={(e) => updateDiagnosis(d.id, e.target.value)}
                                        className="w-full bg-transparent focus:outline-none pr-8"
                                    />
                                    <button
                                        onClick={() => removeDiagnosis(d.id)}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 text-ash-grey-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
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
                                        className="absolute -top-2 -right-2 bg-red-50 text-red-500 hover:text-white hover:bg-red-500 transition-colors p-1.5 rounded-full shadow-sm border border-red-100 opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Drug Name (e.g. Paracetamol)"
                                            value={med.name}
                                            onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                                            className="w-full font-bold text-dark-slate-grey-500 bg-ash-grey-900/50 hover:bg-ash-grey-900 focus:bg-white border border-transparent focus:border-deep-teal-500/50 rounded-xl px-3 py-2 text-sm focus:outline-none transition-all placeholder:text-ash-grey-600 placeholder:font-medium"
                                        />
                                        <div className="flex gap-2 text-sm">
                                            <input
                                                type="text"
                                                placeholder="Dosage (e.g. 500mg)"
                                                value={med.dosage}
                                                onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                                                className="w-1/2 bg-ash-grey-900/50 hover:bg-ash-grey-900 focus:bg-white border border-transparent focus:border-deep-teal-500/50 px-3 py-2 rounded-xl text-dark-slate-grey-500 font-bold text-[11px] focus:outline-none transition-all placeholder:text-ash-grey-600 placeholder:font-medium"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Frequency (e.g. 1-0-1)"
                                                value={med.frequency}
                                                onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                                                className="w-1/2 bg-ash-grey-900/50 hover:bg-ash-grey-900 focus:bg-white border border-transparent focus:border-deep-teal-500/50 px-3 py-2 rounded-xl text-dark-slate-grey-500 font-bold text-[11px] focus:outline-none transition-all placeholder:text-ash-grey-600 placeholder:font-medium text-center"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Advice / Instructions */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-dark-slate-grey-800 uppercase tracking-wider flex items-center gap-1.5">
                            Advice / Instructions <Info className="w-3 h-3 text-ash-grey-600" />
                        </label>
                        <button
                            onClick={addAdvice}
                            className="text-xs font-bold text-deep-teal-500 hover:text-deep-teal-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-muted-teal-50"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Line
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        <AnimatePresence>
                            {advices.length === 0 && (
                                <div className="text-xs text-ash-grey-600 font-medium italic px-2 py-1">No advice added.</div>
                            )}
                            {advices.map((a) => (
                                <motion.div
                                    key={a.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative group bg-ash-grey-900 rounded-xl px-4 py-3 border border-ash-grey-800 focus-within:border-deep-teal-500 focus-within:ring-1 focus-within:ring-deep-teal-500 transition-all text-sm text-dark-slate-grey-500 font-medium shadow-inner"
                                >
                                    <input
                                        type="text"
                                        placeholder="Enter advice line..."
                                        value={a.text}
                                        onChange={(e) => updateAdvice(a.id, e.target.value)}
                                        className="w-full bg-transparent focus:outline-none pr-8"
                                    />
                                    <button
                                        onClick={() => removeAdvice(a.id)}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 text-ash-grey-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <button 
                onClick={generatePDFAndUpload}
                disabled={isGenerating}
                className="mt-6 shrink-0 w-full bg-dark-slate-grey-500 hover:bg-dark-slate-grey-400 disabled:opacity-50 text-white rounded-2xl py-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-dark-slate-grey-500/20 active:scale-[0.98]"
            >
                <UploadCloud className={`w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} />
                {isGenerating ? "Generating & Syncing..." : "Complete & Sync Session"}
            </button>
        </div>
    );
}
