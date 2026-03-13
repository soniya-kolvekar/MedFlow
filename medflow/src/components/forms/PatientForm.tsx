"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, User, Phone, MapPin, Activity, Shield } from 'lucide-react';

interface PatientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PatientForm({ onSuccess, onCancel }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dept: 'Emergency',
    cond: '',
    status: 'Waiting',
    info: 'F, 28 yrs', // Default placeholder
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', // Placeholder
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "patients"), {
        ...formData,
        createdAt: serverTimestamp(),
        priority: formData.status === 'Waiting' ? 'Normal' : 'Urgent',
        items: [] // Initial empty prescriptions
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding patient: ", error);
      alert("Failed to add patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 ml-1">Patient Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-400 group-focus-within:text-deep-teal-500 transition-colors" />
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Full Name" 
              className="w-full h-12 bg-ash-grey-900/40 border border-ash-grey-700/20 rounded-2xl pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all font-bold text-dark-slate-grey-500"
            />
          </div>
        </div>

        {/* Info/Bio */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 ml-1">Age & Gender</label>
          <div className="relative group">
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-400 group-focus-within:text-deep-teal-500 transition-colors" />
            <input 
              required
              type="text" 
              value={formData.info}
              onChange={(e) => setFormData({...formData, info: e.target.value})}
              placeholder="e.g. F, 28 yrs" 
              className="w-full h-12 bg-ash-grey-900/40 border border-ash-grey-700/20 rounded-2xl pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all font-bold text-dark-slate-grey-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Department */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 ml-1">Department</label>
          <select 
            value={formData.dept}
            onChange={(e) => setFormData({...formData, dept: e.target.value})}
            className="w-full h-12 bg-ash-grey-900/40 border border-ash-grey-700/20 rounded-2xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all font-bold text-dark-slate-grey-500 appearance-none cursor-pointer"
          >
            {['Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Radiology', 'Laboratory'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 ml-1">Initial Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full h-12 bg-ash-grey-900/40 border border-ash-grey-700/20 rounded-2xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all font-bold text-dark-slate-grey-500 appearance-none cursor-pointer"
          >
            {['Waiting', 'In-session', 'Discharged'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 ml-1">Primary Condition</label>
        <div className="relative group">
          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-400 group-focus-within:text-deep-teal-500 transition-colors" />
          <input 
            required
            type="text" 
            value={formData.cond}
            onChange={(e) => setFormData({...formData, cond: e.target.value})}
            placeholder="e.g. Fracture - L Arm" 
            className="w-full h-12 bg-ash-grey-900/40 border border-ash-grey-700/20 rounded-2xl pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all font-bold text-dark-slate-grey-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 rounded-2xl border-2 border-ash-grey-700/50 font-black text-xs uppercase tracking-widest text-charcoal-blue-700 hover:bg-ash-grey-900 transition-all active:scale-95"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="flex-3 h-14 bg-dark-slate-grey-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-dark-slate-grey-500/10 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Patient Record"
          )}
        </button>
      </div>
    </form>
  );
}
