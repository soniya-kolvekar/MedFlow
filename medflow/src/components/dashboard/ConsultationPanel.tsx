import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, Activity, CheckCircle2, FileText, ChevronRight, Play, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultationPanel() {
  const [isRecording, setIsRecording] = useState(true);
  
  const transcription = [
    { role: 'patient', name: 'SARAH MILLER', text: "I've noticed my inhaler isn't providing the same relief as it used to. It's becoming more frequent." },
    { role: 'doctor', name: 'DR. ELENA VANCE', text: "Thank you for sharing that, Sarah. How many times a day are you finding yourself reaching for the rescue inhaler?" },
    { role: 'patient', name: 'SARAH MILLER', text: "Usually about three or four times now. It used to be once every few days." }
  ];

  const insights = [
    "Increasing rescue inhaler dependency noted (3-4x daily).",
    "Symptoms correlate with seasonal pollen spike in current geo-location."
  ];

  const actions = [
    "Schedule Pulmonary Function Test (PFT) for next week.",
    "Evaluate transition to daily controller medication."
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Session in Progress</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-ash-grey-900 px-3 py-1.5 rounded-full border border-ash-grey-800">
             <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-dark-slate-grey-500">REC: 14:22</span>
          </div>
          <button className="px-5 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/20">
            End Session
          </button>
        </div>
      </div>

      <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tighter">AI-Assisted Consultation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Live Feed Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Audio Visualizer & Mic Area */}
          <div className="relative aspect-video rounded-[32px] bg-white border border-ash-grey-700/50 shadow-xl shadow-charcoal-blue-500/5 flex flex-col items-center justify-center p-8 overflow-hidden">
             {/* Waveform Visualization Mockup */}
             <div className="flex items-end gap-1.5 mb-12 h-20">
               {[0.3, 0.5, 0.8, 0.4, 0.9, 0.6, 1.0, 0.7, 0.4, 0.8, 0.5, 0.3].map((val, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: isRecording ? [`${val * 100}%`, `${(val * 0.5 + 0.2) * 100}%`, `${val * 100}%`] : `${val * 20}%` }}
                   transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                   className="w-1.5 bg-deep-teal-500/40 rounded-full" 
                 />
               ))}
               {[0.3, 0.5, 0.8, 0.4, 0.9, 0.6, 1.0, 0.7, 0.4, 0.8, 0.5, 0.3].reverse().map((val, i) => (
                 <motion.div 
                   key={i+12}
                   animate={{ height: isRecording ? [`${val * 100}%`, `${(val * 0.5 + 0.2) * 100}%`, `${val * 100}%`] : `${val * 20}%` }}
                   transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                   className="w-1.5 bg-deep-teal-500/40 rounded-full" 
                 />
               ))}
             </div>

             <button 
               onClick={() => setIsRecording(!isRecording)}
               className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10 ${isRecording ? 'bg-deep-teal-500 text-white hover:scale-105' : 'bg-ash-grey-900 text-charcoal-blue-300'}`}
             >
               {isRecording ? <Mic className="h-10 w-10" /> : <MicOff className="h-10 w-10" />}
               {isRecording && (
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute inset-0 rounded-full bg-deep-teal-500 -z-10" 
                 />
               )}
             </button>

             <div className="mt-8 text-center max-w-sm">
                <p className="text-xl font-bold text-dark-slate-grey-500 tracking-tight leading-relaxed italic opacity-80">
                  "I've been feeling a bit short of breath lately, especially when I climb stairs in the morning..."
                </p>
             </div>

             {/* Background dots pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          {/* Live Transcription Feed */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-charcoal-blue-600" />
                <h3 className="text-sm font-black text-dark-slate-grey-500 uppercase tracking-widest">Live Transcription</h3>
             </div>
             
             <div className="space-y-4">
                {transcription.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.2 }}
                    className={`flex items-start gap-4 p-4 rounded-3xl ${msg.role === 'doctor' ? 'bg-green-100/50 border border-green-200/30' : 'bg-white shadow-sm border border-ash-grey-700/50'}`}
                  >
                    <div className={`h-10 w-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xs ${msg.role === 'doctor' ? 'bg-deep-teal-500 text-white' : 'bg-ash-grey-900 text-charcoal-blue-500'}`}>
                      {msg.role === 'doctor' ? 'EV' : 'SM'}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-charcoal-blue-700 opacity-60">{msg.name} ({msg.role.toUpperCase()})</span>
                          <span className="text-[8px] font-black text-ash-grey-400">10:45 AM</span>
                       </div>
                       <p className="text-sm font-bold text-dark-slate-grey-500 leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Insights Section */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {/* Clinical Insights Card */}
           <div className="rounded-[40px] bg-green-100/30 border border-green-200/50 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="h-12 w-12 rounded-2xl bg-deep-teal-500 text-white flex items-center justify-center shadow-lg shadow-deep-teal-500/20">
                    <Sparkles className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-dark-slate-grey-500 tracking-tight leading-none">AI Clinical</h3>
                    <p className="text-[10px] font-black text-deep-teal-600 uppercase tracking-widest mt-1">Insights</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-4">Key Observations</p>
                    <ul className="space-y-4">
                       {insights.map((insight, i) => (
                         <li key={i} className="flex gap-3">
                           <CheckCircle2 className="h-4 w-4 text-deep-teal-500 flex-shrink-0 mt-0.5" />
                           <p className="text-xs font-bold text-dark-slate-grey-500 leading-relaxed">{insight}</p>
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-4">Recommended Actions</p>
                    <div className="space-y-3">
                       {actions.map((action, i) => (
                         <div key={i} className="p-4 rounded-2xl bg-white border border-ash-grey-700/50 text-[11px] font-bold text-dark-slate-grey-500 leading-relaxed group hover:border-deep-teal-500/30 transition-colors cursor-pointer">
                           {action}
                         </div>
                       ))}
                    </div>
                 </div>

                 <button className="w-full py-4 rounded-[24px] bg-dark-slate-grey-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-dark-slate-grey-500/20 hover:bg-charcoal-blue-600 transition-all active:scale-95">
                    Generate Full Session Report
                 </button>
              </div>
           </div>

           {/* Security Footer Card */}
           <div className="rounded-3xl bg-ash-grey-900/50 border border-ash-grey-800 p-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-green-500 shadow-sm">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <h4 className="text-xs font-black text-dark-slate-grey-500 uppercase tracking-wide">HIPAA Secure</h4>
                 <p className="text-[10px] text-charcoal-blue-500 font-medium">256-bit encryption active</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
