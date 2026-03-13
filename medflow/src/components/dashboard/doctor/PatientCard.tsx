"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, User } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function PatientCard({ sessionId = "demo-session-123" }: { sessionId?: string }) {
    const [patient, setPatient] = useState({
        name: "Awaiting Patient...",
        age: 0,
        gender: "---",
        id: "---",
        lastVisit: "No history found",
        allergies: []
    });

    useEffect(() => {
        const sessionRef = doc(db, "sessions", sessionId);
        const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setPatient(prev => ({
                    ...prev,
                    name: data.patientName || prev.name,
                    age: data.patientAge || prev.age,
                    gender: data.patientGender || prev.gender,
                    id: data.patientId || prev.id,
                    allergies: data.allergies || prev.allergies,
                }));
            }
        });
        return () => unsubscribe();
    }, [sessionId]);

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden h-fit border border-ash-grey-600/30">
            <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-muted-teal-200 overflow-hidden shadow-inner flex items-center justify-center">
                    <img
                        src={`https://ui-avatars.com/api/?name=${patient.name}&background=84a98c&color=fff`}
                        alt={patient.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="bg-muted-teal-100 text-deep-teal-600 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                        Active Session
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-dark-slate-grey-800 font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-deep-teal-500 animate-pulse" />
                        Live
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-dark-slate-grey-500 mb-1 tracking-tight">
                    {patient.name}
                </h3>
                <p className="text-xs text-dark-slate-grey-800 font-bold uppercase tracking-wider flex items-center gap-2">
                    {patient.age} years <span className="w-1 h-1 bg-ash-grey-600 rounded-full" /> {patient.gender} <span className="w-1 h-1 bg-ash-grey-600 rounded-full" /> ID: #{patient.id}
                </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-4 bg-ash-grey-900 rounded-2xl p-4 border border-ash-grey-800/50 group transition-all hover:bg-ash-grey-800">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-muted-teal-600 shadow-sm transition-transform group-hover:scale-110">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-dark-slate-grey-800 uppercase tracking-wider mb-0.5">
                            Last Encounter
                        </p>
                        <p className="text-sm font-bold text-dark-slate-grey-500">
                            {patient.lastVisit}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-orange-50 rounded-2xl p-4 border border-orange-100 group transition-all hover:bg-orange-100/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm transition-transform group-hover:scale-110">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider mb-0.5">
                            Critical Alerts
                        </p>
                        <p className="text-sm font-bold text-orange-900">
                            {patient.allergies.length > 0 ? patient.allergies.join(", ") : "No known allergies"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
