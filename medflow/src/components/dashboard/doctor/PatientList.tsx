"use client";

import React, { useState, useEffect } from "react";
import { 
    User, Clock, Search, CheckCircle2, XCircle, 
    Stethoscope, Calendar, Phone, AlertTriangle, 
    ChevronRight, Filter, MessageSquare, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
    collection, query, where, onSnapshot,
    doc, updateDoc, Timestamp, addDoc, getDocs
} from "firebase/firestore";

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientAge?: number;
    patientGender?: string;
    condition: string;
    notes?: string;
    requestedDate: string;
    requestedTime: string;
    status: "pending" | "accepted" | "rejected" | "completed";
    doctorId: string;
    rejectionReason?: string;
    createdAt: Timestamp;
}

const STATUS_CONFIG = {
    pending:   { label: "Pending Review", color: "bg-amber-50 text-amber-600 border-amber-200" },
    accepted:  { label: "Accepted",       color: "bg-green-50 text-green-600 border-green-100" },
    rejected:  { label: "Rejected",       color: "bg-red-50 text-red-500 border-red-100" },
    completed: { label: "Completed",      color: "bg-ash-grey-100 text-ash-grey-600 border-ash-grey-200" },
};

const REJECTION_REASONS = [
    "Slot no longer available",
    "Patient needs specialist referral",
    "Insufficient medical history provided",
    "Time conflict with emergency",
    "Please reschedule to a different date",
    "Other (specify below)",
];

export default function PatientList({ onStartSession }: { onStartSession: (apt: any) => void }) {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
    const [loading, setLoading] = useState(true);

    // Reject modal state
    const [rejectTarget, setRejectTarget] = useState<Appointment | null>(null);
    const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
    const [customReason, setCustomReason] = useState("");
    const [rejecting, setRejecting] = useState(false);
    const [accepting, setAccepting] = useState<string | null>(null);

    // Real-time appointment listener
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "appointments"),
            where("doctorId", "==", user.uid)
        );
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Appointment[];
            // Sort client-side: pending first, then by date
            list.sort((a, b) => {
                const order = { pending: 0, accepted: 1, rejected: 2, completed: 3 };
                if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
                return a.requestedDate.localeCompare(b.requestedDate);
            });
            setAppointments(list);
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    // Seed demo data if none
    useEffect(() => {
        if (!user) return;
        const seed = async () => {
            const q = query(collection(db, "appointments"), where("doctorId", "==", user.uid));
            const snap = await getDocs(q);
            if (!snap.empty) return;

            const today = new Date();
            const fmt = (d: Date) => d.toISOString().split("T")[0];
            const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
            const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

            const demos = [
                { patientName: "Rahul Sharma", patientEmail: "rahul@demo.com", patientAge: 45, patientGender: "Male", condition: "Chronic Hypertension", notes: "Experiencing headaches and dizziness for the past week.", requestedDate: fmt(today), requestedTime: "10:30", status: "pending" },
                { patientName: "Anjali Gupta", patientEmail: "anjali@demo.com", patientAge: 28, patientGender: "Female", condition: "Routine Checkup", notes: "Annual health screening.", requestedDate: fmt(today), requestedTime: "11:00", status: "accepted" },
                { patientName: "Vikram Singh", patientEmail: "vikram@demo.com", patientAge: 52, patientGender: "Male", condition: "Post-op Follow-up", notes: "Surgery was 3 weeks ago, sutures need review.", requestedDate: fmt(tomorrow), requestedTime: "09:00", status: "pending" },
                { patientName: "Sneha Patil", patientEmail: "sneha@demo.com", patientAge: 34, patientGender: "Female", condition: "Dermatitis", notes: "Recurring skin issue.", requestedDate: fmt(dayAfter), requestedTime: "14:00", status: "pending" },
                { patientName: "Arjun Verma", patientEmail: "arjun@demo.com", patientAge: 61, patientGender: "Male", condition: "Diabetes Management", notes: "HbA1c review and medication adjustment.", requestedDate: fmt(today), requestedTime: "15:30", status: "accepted" },
            ];

            for (const d of demos) {
                await addDoc(collection(db, "appointments"), {
                    ...d, patientId: "demo-" + d.patientEmail.split("@")[0],
                    doctorId: user.uid, createdAt: Timestamp.now(),
                });
            }
        };
        seed();
    }, [user]);

    const handleAccept = async (apt: Appointment) => {
        setAccepting(apt.id);
        try {
            await updateDoc(doc(db, "appointments", apt.id), {
                status: "accepted",
                updatedAt: Timestamp.now(),
            });
        } finally { setAccepting(null); }
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        setRejecting(true);
        const finalReason = selectedReason === "Other (specify below)" ? customReason : selectedReason;
        try {
            await updateDoc(doc(db, "appointments", rejectTarget.id), {
                status: "rejected",
                rejectionReason: finalReason,
                updatedAt: Timestamp.now(),
            });
            setRejectTarget(null);
            setSelectedReason(REJECTION_REASONS[0]);
            setCustomReason("");
        } finally { setRejecting(false); }
    };

    const filtered = appointments.filter(a => {
        const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
            a.condition.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || a.status === filter;
        return matchSearch && matchFilter;
    });

    const pendingCount = appointments.filter(a => a.status === "pending").length;

    return (
        <div className="flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-ash-grey-600/30 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-ash-grey-800/50">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-dark-slate-grey-500 tracking-tight">Patient Appointments</h2>
                        <div className="flex items-center gap-3 mt-1.5">
                            <p className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest">
                                {appointments.length} total
                            </p>
                            {pendingCount > 0 && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    {pendingCount} awaiting review
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash-grey-600" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by patient or condition..."
                            className="w-full h-12 pl-11 pr-4 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl text-sm font-bold focus:outline-none focus:border-deep-teal-500 focus:ring-2 focus:ring-deep-teal-500/10 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "pending", "accepted", "rejected"] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${filter === f ? "bg-dark-slate-grey-500 text-white border-dark-slate-grey-500" : "bg-ash-grey-900 border-ash-grey-800 text-ash-grey-600 hover:border-dark-slate-grey-800"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[68vh] p-8 space-y-4">
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-ash-grey-800 border-t-deep-teal-500 rounded-full animate-spin" />
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Calendar className="w-12 h-12 text-ash-grey-700 mb-3" />
                        <p className="text-sm font-bold text-ash-grey-600">No appointments found</p>
                        <p className="text-[11px] text-ash-grey-700 mt-1">Try adjusting your search or filter</p>
                    </div>
                )}

                <AnimatePresence>
                    {filtered.map((apt, idx) => {
                        const statusCfg = STATUS_CONFIG[apt.status];
                        const isAccepting = accepting === apt.id;

                        return (
                            <motion.div
                                key={apt.id}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ delay: idx * 0.04 }}
                                className={`group p-5 border rounded-3xl transition-all ${apt.status === "pending" ? "border-amber-200 bg-amber-50/30 hover:shadow-md hover:shadow-amber-500/10" : "border-ash-grey-800 bg-white hover:shadow-sm"}`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-ash-grey-800 shrink-0">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName)}&background=84a98c&color=fff&bold=true`}
                                            alt={apt.patientName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h4 className="font-black text-dark-slate-grey-500 text-base tracking-tight">{apt.patientName}</h4>
                                            {apt.patientAge && apt.patientGender && (
                                                <span className="text-[10px] font-black text-dark-slate-grey-800 bg-ash-grey-900 border border-ash-grey-800 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                                                    {apt.patientAge}Y • {apt.patientGender}
                                                </span>
                                            )}
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${statusCfg.color}`}>
                                                {statusCfg.label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-ash-grey-600">
                                                <Stethoscope className="w-3.5 h-3.5 text-deep-teal-500" />
                                                {apt.condition}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-ash-grey-600">
                                                <Clock className="w-3.5 h-3.5 text-deep-teal-500" />
                                                {apt.requestedDate} at {apt.requestedTime}
                                            </span>
                                        </div>
                                        {apt.notes && (
                                            <p className="text-[12px] text-ash-grey-600 line-clamp-2 italic">"{apt.notes}"</p>
                                        )}
                                        {apt.status === "rejected" && apt.rejectionReason && (
                                            <div className="flex items-start gap-2 mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                                <p className="text-[11px] font-bold text-red-500">Reason: {apt.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {apt.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(apt)}
                                                    disabled={isAccepting}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 active:scale-95 transition-all shadow-sm shadow-green-500/20 disabled:opacity-60"
                                                >
                                                    {isAccepting ? (
                                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    )}
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => setRejectTarget(apt)}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 border border-red-200 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-100 active:scale-95 transition-all"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {apt.status === "accepted" && (
                                            <button
                                                onClick={() => onStartSession(apt)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-dark-slate-grey-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-deep-teal-600 active:scale-95 transition-all shadow-md"
                                            >
                                                Start Session
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Reject Modal */}
            <AnimatePresence>
                {rejectTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-slate-grey-500/40 backdrop-blur-sm"
                        onClick={e => { if (e.target === e.currentTarget) setRejectTarget(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-dark-slate-grey-500">Reject Appointment</h3>
                                    <p className="text-[11px] font-bold text-ash-grey-600 uppercase tracking-widest">{rejectTarget.patientName}</p>
                                </div>
                            </div>

                            <p className="text-sm text-ash-grey-600 mb-6 mt-3">Please select or provide a reason for rejection. This will be visible to the patient.</p>

                            <div className="space-y-2 mb-4">
                                {REJECTION_REASONS.map(reason => (
                                    <button
                                        key={reason}
                                        type="button"
                                        onClick={() => setSelectedReason(reason)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${
                                            selectedReason === reason
                                            ? "bg-red-50 border-red-300 text-red-600"
                                            : "border-ash-grey-800 bg-ash-grey-900 text-ash-grey-600 hover:border-ash-grey-700"
                                        }`}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>

                            {selectedReason === "Other (specify below)" && (
                                <textarea
                                    rows={3}
                                    value={customReason}
                                    onChange={e => setCustomReason(e.target.value)}
                                    placeholder="Type your reason here..."
                                    className="w-full bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all resize-none mb-4"
                                />
                            )}

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setRejectTarget(null)}
                                    className="flex-1 h-12 rounded-2xl border border-ash-grey-800 bg-ash-grey-900 text-sm font-black text-ash-grey-600 hover:bg-ash-grey-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={rejecting || (selectedReason === "Other (specify below)" && !customReason.trim())}
                                    className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-sm font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {rejecting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <XCircle className="w-4 h-4" />
                                    )}
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
