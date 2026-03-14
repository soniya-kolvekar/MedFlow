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
                if (data.diagnoses && data.diagnoses.length > 0) setDiagnoses(data.diagnoses);
                else setDiagnoses([{ id: 'init-diag', text: "" }]);
                
                if (data.medications && data.medications.length > 0) setMedications(data.medications);
                else setMedications([{ id: 'init-med', name: "", dosage: "", frequency: "" }]);
                
                if (data.advices && data.advices.length > 0) setAdvices(data.advices);
                else setAdvices([{ id: 'init-adv', text: "" }]);
                
                if (data.patientName) setPatientInfo(prev => ({ ...prev, name: data.patientName }));
                if (data.patientAge) setPatientInfo(prev => ({ ...prev, age: data.patientAge }));
                if (data.patientGender) setPatientInfo(prev => ({ ...prev, gender: data.patientGender }));
            } else {
                // Initialize with one empty line each if no doc
                setDiagnoses([{ id: 'init-diag', text: "" }]);
                setMedications([{ id: 'init-med', name: "", dosage: "", frequency: "" }]);
                setAdvices([{ id: 'init-adv', text: "" }]);
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
            
            docPdf.setDrawColor(200, 200, 200);
            docPdf.line(20, 75, 190, 75);
            
            let yPos = 85;

            // Diagnosis
            docPdf.setFontSize(14);
            docPdf.text("Diagnosis:", 20, yPos);
            yPos += 10;
            const activeDiagnoses = diagnoses.filter(d => d.text.trim() !== "");
            if (activeDiagnoses.length === 0) {
                docPdf.setFontSize(12);
                docPdf.text("General Consultation", 25, yPos);
                yPos += 10;
            } else {
                activeDiagnoses.forEach((d, i) => {
                    docPdf.setFontSize(12);
                    docPdf.text(`${i+1}. ${d.text}`, 25, yPos);
                    yPos += 10;
                });
            }
            
            // Medications
            yPos += 5;
            docPdf.setFontSize(14);
            docPdf.text("Medications:", 20, yPos);
            yPos += 10;
            const activeMeds = medications.filter(m => m.name.trim() !== "");
            if (activeMeds.length === 0) {
                docPdf.setFontSize(12);
                docPdf.text("No medications prescribed", 25, yPos);
                yPos += 10;
            } else {
                activeMeds.forEach((med, i) => {
                    docPdf.setFontSize(12);
                    docPdf.text(`${i+1}. ${med.name} - ${med.dosage} (${med.frequency})`, 25, yPos);
                    yPos += 10;
                });
            }
            
            // Advice
            yPos += 5;
            docPdf.setFontSize(14);
            docPdf.text("Advice / Instructions:", 20, yPos);
            yPos += 10;
            const activeAdvices = advices.filter(a => a.text.trim() !== "");
            if (activeAdvices.length === 0) {
                docPdf.setFontSize(12);
                docPdf.text("Follow up as needed.", 25, yPos);
            } else {
                activeAdvices.forEach((a, i) => {
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
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col min-h-[500px] border border-ash-grey-600/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-deep-teal-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-dark-slate-grey-500 uppercase tracking-tight">
                        Prescription
                    </h3>
                </div>
                <div className="bg-ash-grey-900 px-3 py-1 rounded-full border border-ash-grey-800">
                    <span className="text-[10px] font-black text-dark-slate-grey-500 uppercase tracking-wider">Manual Entry</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8 min-h-0">
                
                {/* 1. Diagnosis Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-ash-grey-600 uppercase tracking-[0.2em] flex items-center gap-2">
                           I. Diagnosis
                        </h4>
                        <button onClick={addDiagnosis} className="text-[10px] font-bold text-deep-teal-600 hover:text-deep-teal-700 flex items-center gap-1 transition-all">
                            <Plus className="w-3 h-3" /> Add Line
                        </button>
                    </div>
                    <div className="space-y-2">
                        {diagnoses.map((d) => (
                            <div key={d.id} className="group relative flex items-center gap-3 bg-ash-grey-900/40 rounded-xl p-1 border border-transparent focus-within:border-deep-teal-500/30 focus-within:bg-white transition-all shadow-sm">
                                <input
                                    type="text"
                                    placeholder="Enter diagnosis..."
                                    value={d.text}
                                    onChange={(e) => updateDiagnosis(d.id, e.target.value)}
                                    className="flex-1 bg-transparent px-3 py-2 text-sm text-dark-slate-grey-500 font-medium focus:outline-none"
                                />
                                <button onClick={() => removeDiagnosis(d.id)} className="p-2 text-ash-grey-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Medicine Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-ash-grey-600 uppercase tracking-[0.2em] flex items-center gap-2">
                           II. Medications
                        </h4>
                        <button onClick={addMedication} className="text-[10px] font-bold text-deep-teal-600 hover:text-deep-teal-700 flex items-center gap-1 transition-all">
                            <Plus className="w-3 h-3" /> Add Drug
                        </button>
                    </div>
                    <div className="space-y-2">
                        {medications.map((med) => (
                            <div key={med.id} className="group relative flex flex-col gap-2 bg-ash-grey-900/40 rounded-xl p-3 border border-transparent focus-within:border-deep-teal-500/30 focus-within:bg-white transition-all shadow-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Medicine Name"
                                        value={med.name}
                                        onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                                        className="flex-1 bg-transparent text-sm text-dark-slate-grey-500 font-bold focus:outline-none"
                                    />
                                    <button onClick={() => removeMedication(med.id)} className="p-1 text-ash-grey-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Dosage"
                                        value={med.dosage}
                                        onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                                        className="w-1/2 bg-ash-grey-900/50 px-2 py-1 rounded-lg text-[11px] text-dark-slate-grey-800 font-bold focus:outline-none focus:bg-white border border-transparent focus:border-ash-grey-800"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Freq (1-0-1)"
                                        value={med.frequency}
                                        onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                                        className="w-1/2 bg-ash-grey-900/50 px-2 py-1 rounded-lg text-[11px] text-dark-slate-grey-800 font-bold focus:outline-none focus:bg-white border border-transparent focus:border-ash-grey-800 text-center"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Advice Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-ash-grey-600 uppercase tracking-[0.2em] flex items-center gap-2">
                           III. Advice & Instructions
                        </h4>
                        <button onClick={addAdvice} className="text-[10px] font-bold text-deep-teal-600 hover:text-deep-teal-700 flex items-center gap-1 transition-all">
                            <Plus className="w-3 h-3" /> Add Line
                        </button>
                    </div>
                    <div className="space-y-2">
                        {advices.map((a) => (
                            <div key={a.id} className="group relative flex items-center gap-3 bg-ash-grey-900/40 rounded-xl p-1 border border-transparent focus-within:border-deep-teal-500/30 focus-within:bg-white transition-all shadow-sm">
                                <input
                                    type="text"
                                    placeholder="Enter advice..."
                                    value={a.text}
                                    onChange={(e) => updateAdvice(a.id, e.target.value)}
                                    className="flex-1 bg-transparent px-3 py-2 text-sm text-dark-slate-grey-500 font-medium focus:outline-none"
                                />
                                <button onClick={() => removeAdvice(a.id)} className="p-2 text-ash-grey-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <button 
                onClick={generatePDFAndUpload}
                disabled={isGenerating}
                className="mt-6 shrink-0 w-full bg-deep-teal-600 hover:bg-deep-teal-700 disabled:opacity-50 text-white rounded-2xl py-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-deep-teal-500/20 active:scale-[0.98]"
            >
                {isGenerating ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span>Syncing Session...</span>
                   </>
                ) : (
                   <>
                     <UploadCloud className="w-5 h-5" />
                     <span>Complete & Sync Session</span>
                   </>
                )}
            </button>
        </div>
    );
}
