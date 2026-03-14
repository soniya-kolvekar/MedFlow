"use client";

import React, { useState, useEffect } from "react";
import { 
    Calendar, Clock, Stethoscope, Plus, X, CheckCircle2, 
    XCircle, AlertTriangle, User, ChevronDown, Search 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
    collection, query, where, onSnapshot,
    addDoc, Timestamp, getDocs
} from "firebase/firestore";

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    condition: string;
    notes?: string;
    requestedDate: string;
    requestedTime: string;
    status: "pending" | "accepted" | "rejected" | "completed";
    doctorId: string;
    doctorName?: string;
    rejectionReason?: string;
    createdAt: Timestamp;
}

interface Doctor {
    uid: string;
    name: string;
    email: string;
    specialty?: string;
    department?: string;
}

const STATUS_CONFIG = {
    pending:   { label: "Pending Review", icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-200" },
    accepted:  { label: "Confirmed",      icon: CheckCircle2, color: "bg-green-50 text-green-600 border-green-100" },
    rejected:  { label: "Rejected",       icon: XCircle, color: "bg-red-50 text-red-500 border-red-100" },
    completed: { label: "Completed",      icon: CheckCircle2, color: "bg-ash-grey-100 text-ash-grey-600 border-ash-grey-200" },
};

const CONDITION_OPTIONS = [
    "Routine Checkup", "Chronic Hypertension", "Diabetes Management",
    "Post-op Follow-up", "Dermatitis", "Respiratory Issue",
    "Gastro Problems", "Joint/Muscle Pain", "Mental Health",
    "Other (describe in notes)",
];

export default function PatientAppointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBook, setShowBook] = useState(false);
    const [booking, setBooking] = useState(false);
    const [form, setForm] = useState({
        doctorId: "",
        condition: CONDITION_OPTIONS[0],
        notes: "",
        requestedDate: "",
        requestedTime: "10:00",
    });

    // Real-time appointments for this patient
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "appointments"),
            where("patientId", "==", user.uid)
        );
        const unsub = onSnapshot(q, snap => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Appointment[];
            list.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setAppointments(list);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    // Fetch available doctors from Firestore
    useEffect(() => {
        const fetchDoctors = async () => {
            const q = query(collection(db, "users"), where("role", "==", "doctor"));
            const snap = await getDocs(q);
            const list = snap.docs.map(d => ({ uid: d.id, ...d.data() })) as Doctor[];
            setDoctors(list);
        };
        fetchDoctors();
    }, []);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !form.doctorId) return;
        setBooking(true);
        try {
            const selectedDoc = doctors.find(d => d.uid === form.doctorId);
            await addDoc(collection(db, "appointments"), {
                patientId: user.uid,
                patientName: user.displayName || user.email?.split("@")[0] || "Patient",
                patientEmail: user.email || "",
                doctorId: form.doctorId,
                doctorName: selectedDoc?.name || selectedDoc?.email || "Doctor",
                condition: form.condition,
                notes: form.notes,
                requestedDate: form.requestedDate,
                requestedTime: form.requestedTime,
                status: "pending",
                createdAt: Timestamp.now(),
            });
            setShowBook(false);
            setForm({ doctorId: "", condition: CONDITION_OPTIONS[0], notes: "", requestedDate: "", requestedTime: "10:00" });
        } finally {
            setBooking(false);
        }
    };

    // Set min date to today
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-dark-slate-grey-500 tracking-tight">My Appointments</h2>
                    <p className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest mt-1">
                        {appointments.length} total · {appointments.filter(a => a.status === "pending").length} pending
                    </p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBook(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-dark-slate-grey-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-dark-slate-grey-500/20 hover:bg-deep-teal-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Book Appointment
                </motion.button>
            </div>

            {/* Appointment Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-4 border-ash-grey-800 border-t-deep-teal-500 rounded-full animate-spin" />
                </div>
            ) : appointments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-ash-grey-800 text-center"
                >
                    <Calendar className="w-14 h-14 text-ash-grey-700 mb-4" />
                    <h3 className="text-lg font-black text-dark-slate-grey-500">No appointments yet</h3>
                    <p className="text-sm text-ash-grey-600 mt-1">Click "Book Appointment" to request a consultation</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {appointments.map((apt, idx) => {
                            const cfg = STATUS_CONFIG[apt.status];
                            const Icon = cfg.icon;
                            return (
                                <motion.div
                                    key={apt.id}
                                    layout
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className={`bg-white rounded-3xl border p-5 shadow-sm transition-all ${apt.status === "pending" ? "border-amber-200" : apt.status === "accepted" ? "border-green-200" : apt.status === "rejected" ? "border-red-200" : "border-ash-grey-800"}`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Status Icon Circle */}
                                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${cfg.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-black text-dark-slate-grey-500 text-base tracking-tight">{apt.condition}</h4>
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mb-2">
                                                {apt.doctorName && (
                                                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-ash-grey-600">
                                                        <User className="w-3.5 h-3.5 text-deep-teal-500" />
                                                        Dr. {apt.doctorName}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-ash-grey-600">
                                                    <Calendar className="w-3.5 h-3.5 text-deep-teal-500" />
                                                    {apt.requestedDate}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-ash-grey-600">
                                                    <Clock className="w-3.5 h-3.5 text-deep-teal-500" />
                                                    {apt.requestedTime}
                                                </span>
                                            </div>

                                            {apt.notes && (
                                                <p className="text-[12px] text-ash-grey-600 italic">"{apt.notes}"</p>
                                            )}

                                            {/* Rejection Message */}
                                            {apt.status === "rejected" && apt.rejectionReason && (
                                                <div className="flex items-start gap-2 mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-bold text-red-500">
                                                        Reason from doctor: {apt.rejectionReason}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Confirmation message */}
                                            {apt.status === "accepted" && (
                                                <div className="flex items-center gap-2 mt-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    <p className="text-[11px] font-bold text-green-600">
                                                        Your appointment has been confirmed! Please arrive 10 minutes early.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Book Appointment Modal */}
            <AnimatePresence>
                {showBook && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-slate-grey-500/40 backdrop-blur-sm"
                        onClick={e => { if (e.target === e.currentTarget) setShowBook(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-dark-slate-grey-500">Book Appointment</h3>
                                    <p className="text-[11px] font-bold text-ash-grey-600 uppercase tracking-widest mt-1">Request a consultation with a doctor</p>
                                </div>
                                <button onClick={() => setShowBook(false)} className="p-2 rounded-xl text-ash-grey-600 hover:bg-ash-grey-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleBook} className="space-y-4">
                                {/* Select Doctor */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Select Doctor *</label>
                                    <select
                                        required
                                        value={form.doctorId}
                                        onChange={e => setForm({ ...form, doctorId: e.target.value })}
                                        className="w-full h-12 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-4 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all"
                                    >
                                        <option value="">-- Choose a doctor --</option>
                                        {doctors.map(d => (
                                            <option key={d.uid} value={d.uid}>
                                                Dr. {d.name || d.email} {d.specialty ? `· ${d.specialty}` : ""}
                                            </option>
                                        ))}
                                        {doctors.length === 0 && (
                                            <option disabled>No doctors registered yet</option>
                                        )}
                                    </select>
                                </div>

                                {/* Condition */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Reason / Condition *</label>
                                    <select
                                        required
                                        value={form.condition}
                                        onChange={e => setForm({ ...form, condition: e.target.value })}
                                        className="w-full h-12 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-4 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all"
                                    >
                                        {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Preferred Date *</label>
                                        <input
                                            required
                                            type="date"
                                            min={today}
                                            value={form.requestedDate}
                                            onChange={e => setForm({ ...form, requestedDate: e.target.value })}
                                            className="w-full h-12 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-4 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Preferred Time *</label>
                                        <input
                                            required
                                            type="time"
                                            value={form.requestedTime}
                                            onChange={e => setForm({ ...form, requestedTime: e.target.value })}
                                            className="w-full h-12 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-4 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Additional Notes</label>
                                    <textarea
                                        rows={3}
                                        value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        placeholder="Describe your symptoms or any relevant medical history..."
                                        className="w-full bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-4 py-3 text-sm font-medium text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowBook(false)} className="flex-1 h-12 rounded-2xl border border-ash-grey-800 bg-ash-grey-900 text-sm font-black text-ash-grey-600 hover:bg-ash-grey-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={booking}
                                        className="flex-1 h-12 rounded-2xl bg-dark-slate-grey-500 text-white text-sm font-black shadow-lg shadow-dark-slate-grey-500/25 hover:bg-deep-teal-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {booking ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Stethoscope className="w-4 h-4" />}
                                        Send Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
