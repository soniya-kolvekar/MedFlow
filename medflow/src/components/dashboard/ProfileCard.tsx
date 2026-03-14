import React from 'react';
import { Edit3, Download, User, Activity, AlertCircle } from 'lucide-react';

interface PatientProfileProps {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
}

export default function ProfileCard({ 
  name, 
  age, 
  gender, 
  bloodGroup, 
  allergies, 
  conditions 
}: PatientProfileProps) {
  return (
    <div className="overflow-hidden rounded-[32px] bg-white border border-ash-grey-700/50 shadow-xl shadow-charcoal-blue-500/5 transition-all hover:shadow-2xl hover:shadow-charcoal-blue-500/10 p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Avatar and Basic Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="relative group">
            <div className="h-24 w-24 rounded-3xl bg-ash-grey-900 flex items-center justify-center text-charcoal-blue-500 border-2 border-white shadow-xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
               <User className="h-12 w-12" />
               <div className="absolute inset-0 bg-gradient-to-tr from-deep-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-deep-teal-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
               <Activity className="h-4 w-4" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-dark-slate-grey-500 tracking-tight leading-none mb-2">{name}</h2>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-dark-slate-grey-500">Age: {age}</span>
              <span className="text-ash-grey-500">•</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-dark-slate-grey-500">{bloodGroup} Blood group</span>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest border border-green-200/50">
              Active Care
            </span>
            <span className="px-3 py-1.5 rounded-full bg-deep-teal-50 text-deep-teal-700 text-[9px] font-black uppercase tracking-widest border border-deep-teal-200/50">
              Priority Patient
            </span>
          </div>
        </div>

        {/* Right: Medical Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-[24px] bg-red-50/30 border border-red-100 flex flex-col justify-between group hover:bg-red-50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Allergies</p>
              </div>
              <p className="text-sm font-bold text-dark-slate-grey-500 leading-relaxed">
                {allergies.join(', ') || 'No known allergies'}
              </p>
            </div>
            <p className="text-[9px] font-black text-red-500/50 uppercase tracking-widest mt-4 group-hover:text-red-500 transition-colors">Critical Info</p>
          </div>

          <div className="p-5 rounded-[24px] bg-ash-grey-900 border border-ash-grey-800 flex flex-col justify-between group hover:bg-white transition-all hover:shadow-lg hover:shadow-charcoal-blue-500/5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-3.5 w-3.5 text-charcoal-blue-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-600">Conditions</p>
              </div>
              <p className="text-sm font-bold text-dark-slate-grey-500 leading-relaxed">
                {conditions.join(', ') || 'None reported'}
              </p>
            </div>
            <p className="text-[9px] font-black text-charcoal-blue-500/50 uppercase tracking-widest mt-4 group-hover:text-charcoal-blue-500 transition-colors">Active Monitoring</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-ash-grey-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-8">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-ash-grey-500 uppercase tracking-widest mb-1">Last BP Reading</span>
              <span className="text-sm font-bold text-dark-slate-grey-500">120/80 mmHg</span>
           </div>
           <button className="text-xs font-bold text-deep-teal-600 hover:text-deep-teal-700 transition-colors flex items-center gap-2 group">
              Full Medical History
              <Activity className="h-3 w-3 group-hover:animate-pulse" />
           </button>
        </div>
        
        <div className="flex gap-2">
          <button className="p-3 rounded-2xl border border-ash-grey-700 text-charcoal-blue-600 hover:bg-ash-grey-900 transition-all active:scale-95">
             <Edit3 className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-dark-slate-grey-500 text-white text-xs font-black uppercase tracking-widest hover:bg-charcoal-blue-600 transition-all active:scale-95 shadow-xl shadow-dark-slate-grey-500/10">
             <Download className="h-4 w-4" />
             Download ID
          </button>
        </div>
      </div>
    </div>
  );
}
