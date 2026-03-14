"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
    User, 
    Mail, 
    Shield, 
    Save, 
    CheckCircle2, 
    AlertCircle,
    Building2,
    Stethoscope,
    Phone,
    MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfileEdit() {
    const { user, role, updateProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        displayName: "",
        department: "",
        specialty: "",
        phone: "",
        address: "",
        bio: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const userRef = doc(db, "users", user.uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setFormData({
                        displayName: data.displayName || user.email?.split('@')[0] || "",
                        department: data.department || "",
                        specialty: data.specialty || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        bio: data.bio || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus('idle');
        try {
            await updateProfile(formData);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error("Failed to update profile:", error);
            setStatus('error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-10 h-10 border-4 border-muted-teal-200 border-t-deep-teal-600 rounded-full animate-spin" />
                <p className="text-xs font-black text-ash-grey-600 uppercase tracking-widest">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 text-center">
                <div className="inline-flex h-24 w-24 rounded-[2.5rem] bg-white border-4 border-ash-grey-800 items-center justify-center text-deep-teal-600 shadow-xl mb-6">
                    <User className="h-10 w-10" />
                </div>
                <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tight">Account Settings</h1>
                <p className="text-ash-grey-600 font-bold uppercase tracking-widest text-[10px] mt-2">Update your personal and professional information</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-ash-grey-600/30 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-deep-teal-500" />
                        <h3 className="text-lg font-bold text-dark-slate-grey-500">Core Identity</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-600" />
                                <input 
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                                    className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-deep-teal-500/10 focus:border-deep-teal-500 transition-all outline-none"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative opacity-60">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-600" />
                                <input 
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl pl-12 pr-6 text-sm font-bold cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Account Role</label>
                            <div className="flex items-center gap-3 h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-5 text-sm font-bold text-dark-slate-grey-500 capitalize">
                                <Building2 className="h-4 w-4 text-deep-teal-500" />
                                {role || 'Patient'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-ash-grey-600/30 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Stethoscope className="h-5 w-5 text-deep-teal-500" />
                        <h3 className="text-lg font-bold text-dark-slate-grey-500">Professional Info</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Department / Unit</label>
                            <input 
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-6 text-sm font-bold focus:ring-4 focus:ring-deep-teal-500/10 focus:border-deep-teal-500 transition-all outline-none"
                                placeholder="e.g. Cardiology"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Title / Specialty</label>
                            <input 
                                type="text"
                                value={formData.specialty}
                                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-6 text-sm font-bold focus:ring-4 focus:ring-deep-teal-500/10 focus:border-deep-teal-500 transition-all outline-none"
                                placeholder="e.g. Senior Consultant"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-600" />
                                <input 
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-deep-teal-500/10 focus:border-deep-teal-500 transition-all outline-none"
                                    placeholder="Enter contact number"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio & Address (Full Width) */}
                <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-ash-grey-600/30 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Clinic / Home Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-5 h-4 w-4 text-ash-grey-600" />
                                <textarea 
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full bg-ash-grey-900 border border-ash-grey-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-deep-teal-500/10 focus:border-deep-teal-500 transition-all outline-none resize-none"
                                    placeholder="Enter physical address"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Short Biography</label>
                            <textarea 
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                className="w-full bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-deep-teal-500/10 focus:border-deep-teal-500 transition-all outline-none resize-none"
                                placeholder="Describe your background briefly"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex-1">
                            <AnimatePresence>
                                {status === 'success' && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-green-600 font-bold text-sm"
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                        Profile updated successfully!
                                    </motion.div>
                                )}
                                {status === 'error' && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-red-500 font-bold text-sm"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                        Error saving changes. Try again.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-3 px-10 py-5 bg-dark-slate-grey-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-dark-slate-grey-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Account Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
