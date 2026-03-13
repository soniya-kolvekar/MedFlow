"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  FileText, 
  AlertTriangle, 
  HeartPulse, 
  Loader2,
  ChevronRight,
  ShieldCheck,
  VideoOff,
  PhoneOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConsultationRoom() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<{sender: string, text: string, translated?: string}[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [patientLang, setPatientLang] = useState("hi"); // Default to Hindi for patient
  const [doctorLang, setDoctorLang] = useState("en"); // Default to English for doctor
  
  const [summary, setSummary] = useState({
    symptoms: ["Chest pain", "Fatigue"],
    condition: "Cardiac stress (High Risk)",
    recommendedTests: ["ECG", "Blood test (Troponin)"]
  });
  const [safetyGuard, setSafetyGuard] = useState({
    status: 'warning',
    message: 'Allergy Conflict: Patient allergic to penicillin. Prescribed medicine may conflict.'
  });
  const [status, setStatus] = useState('Connected');
  const router = useRouter();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // WebSocket & Audio Streaming State
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startStreaming = async () => {
    try {
      // 1. Initialize WebSocket
      // Note: In a real app, the target language would depend on who is speaking (bi-directional logic)
      // For now, we'll demonstrate Patient (Hindi) -> Doctor (English)
      const wsUrl = `ws://localhost:8000/ws/translate?target_language=${doctorLang}`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.translated_text) {
          setCurrentSubtitle(data.translated_text);
        }
        if (data.transcript && data.is_final) {
           setTranscript(prev => [...prev, { 
             sender: 'Patient', 
             text: data.transcript, 
             translated: data.translated_text 
           }]);
           setCurrentSubtitle("");
        }
      };

      // 2. Start Audio Capture
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(event.data);
        }
      };

      mediaRecorder.start(500); // 500ms chunks
      setIsListening(true);
    } catch (err) {
      console.error("Streaming error:", err);
      alert("Microphone access is required for real-time translation.");
    }
  };

  const stopStreaming = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    socketRef.current?.close();
    setIsListening(false);
    setCurrentSubtitle("");
  };

  const toggleMic = () => {
    if (isListening) {
      stopStreaming();
    } else {
      startStreaming();
    }
  };

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Mock initial conversation
  useEffect(() => {
    if (transcript.length === 0) {
      setTimeout(() => {
        setTranscript([
          { sender: 'Doctor', text: 'Hello Rahul, I can see you have selected chest pain as your primary concern.' },
          { sender: 'Patient', text: 'Yes doctor, I have been having chest pain for two days. It feels like a heavy weight.', translated: 'हां डॉक्टर, मुझे दो दिनों से सीने में दर्द हो रहा है। यह भारी वजन जैसा महसूस होता है।' }
        ]);
      }, 1000);
    }
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 font-sans">
      
      {/* Top Status Bar */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[24px] border border-ash-grey-700 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-charcoal-blue-400">Consultation Live</p>
               <p className="text-sm font-bold text-dark-slate-grey-500">Dr. Mehta • Cardiology</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-charcoal-blue-500 bg-ash-grey-900 px-3 py-1.5 rounded-lg border border-ash-grey-700">Elapsed: 08:42</span>
            <button onClick={() => router.push('/dashboard/patient')} className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all">
               <PhoneOff className="h-5 w-5" />
            </button>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
         
         {/* Left Panel: Live Transcript */}
         <div className="flex-1 flex flex-col rounded-[32px] bg-white border border-ash-grey-700 shadow-sm min-h-0">
            <div className="px-8 py-6 border-b border-ash-grey-700 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                     <MessageSquare className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold text-dark-slate-grey-500">Live Transcript</h2>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Translation: </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-deep-teal-600 bg-deep-teal-50 px-2 py-0.5 rounded">English (Live)</span>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-ash-grey-700 scrollbar-track-transparent">
               {transcript.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === 'Patient' ? 'items-end' : 'items-start'}`}
                  >
                     <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400 mb-2">{msg.sender}</p>
                     <div className={`max-w-[80%] rounded-2xl p-4 text-sm font-medium leading-relaxed ${msg.sender === 'Patient' ? 'bg-deep-teal-500 text-white rounded-tr-none' : 'bg-ash-grey-900 text-dark-slate-grey-500 rounded-tl-none border border-ash-grey-800'}`}>
                        {msg.text}
                        {msg.translated && (
                           <div className="mt-2 pt-2 border-t border-white/20 text-[10px] italic opacity-80">
                              Translated: {msg.translated}
                           </div>
                        )}
                     </div>
                  </motion.div>
               ))}
               
               {/* Live Subtitle Overlay */}
               <AnimatePresence>
                  {currentSubtitle && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md px-10 py-4 rounded-3xl border border-white/10 shadow-2xl max-w-2xl text-center"
                     >
                        <p className="text-deep-teal-400 text-[10px] font-black uppercase tracking-widest mb-1">Live Translation</p>
                        <p className="text-white text-lg font-bold leading-tight">{currentSubtitle}</p>
                     </motion.div>
                  )}
               </AnimatePresence>
               
               <div ref={transcriptEndRef} />
            </div>

            {/* Mic Control Bar */}
            <div className="p-6 bg-ash-grey-900/50 border-t border-ash-grey-700 shrink-0">
               {/* Language Config */}
               <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-ash-grey-700 shadow-sm">
                     <span className="text-[10px] font-black uppercase text-charcoal-blue-400">Patient:</span>
                     <select 
                        value={patientLang} 
                        onChange={(e) => setPatientLang(e.target.value)}
                        className="text-xs font-bold text-dark-slate-grey-500 bg-transparent outline-none cursor-pointer"
                     >
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="bn">Bengali</option>
                     </select>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-ash-grey-700 shadow-sm">
                     <span className="text-[10px] font-black uppercase text-charcoal-blue-400">Doctor Prefers:</span>
                     <select 
                        value={doctorLang} 
                        onChange={(e) => setDoctorLang(e.target.value)}
                        className="text-xs font-bold text-deep-teal-600 bg-transparent outline-none cursor-pointer"
                     >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                     </select>
                  </div>
               </div>
               
               <div className="flex items-center justify-center gap-6">
                  <button className="h-12 w-12 rounded-2xl bg-white border border-ash-grey-700 flex items-center justify-center text-charcoal-blue-600 hover:text-red-500 transition-all">
                     <VideoOff className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={toggleMic}
                    className={`h-20 w-20 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-red-500/30' : 'bg-charcoal-blue-500 text-white shadow-charcoal-blue-500/30'}`}
                  >
                     {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </button>
                  <button className="h-12 w-12 rounded-2xl bg-white border border-ash-grey-700 flex items-center justify-center text-charcoal-blue-600">
                     <MessageSquare className="h-5 w-5" />
                  </button>
               </div>
               {isListening && (
                 <div className="text-center mt-3">
                   <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center justify-center gap-2">
                     <Loader2 className="h-3 w-3 animate-spin" /> Voice Capture Active
                   </p>
                 </div>
               )}
            </div>
         </div>

         {/* Right Panel: AI Summary & Safety */}
         <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
            
            {/* AI Safety Guard */}
            <AnimatePresence>
               {safetyGuard && (
                 <motion.div 
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`rounded-3xl p-6 border shadow-xl ${safetyGuard.status === 'warning' ? 'bg-red-500 border-red-400 text-white shadow-red-500/20' : 'bg-green-500 border-green-400 text-white shadow-green-500/20'}`}
                 >
                    <div className="flex items-center gap-3 mb-4">
                       {safetyGuard.status === 'warning' ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                       <h3 className="font-bold text-sm tracking-tight uppercase tracking-widest">AI Safety Guard</h3>
                    </div>
                    <p className="text-xs font-bold leading-relaxed">{safetyGuard.message}</p>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* AI Clinical Summary */}
            <div className="flex-1 flex flex-col rounded-[32px] bg-charcoal-blue-500 p-8 text-white shadow-2xl border border-charcoal-blue-400 min-h-0">
               <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-deep-teal-500/20 flex items-center justify-center text-deep-teal-400 border border-deep-teal-500/20">
                     <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">AI Summary</h3>
               </div>

               <div className="space-y-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-charcoal-blue-400 scrollbar-track-transparent">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-800 mb-4 flex items-center gap-2">
                        <HeartPulse className="h-3.5 w-3.5 text-red-400" /> Symptoms Identified
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {summary.symptoms.map(s => (
                           <span key={s} className="text-[10px] font-bold bg-charcoal-blue-400 px-3 py-1.5 rounded-lg border border-charcoal-blue-300">{s}</span>
                        ))}
                     </div>
                  </div>

                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-800 mb-4">Possible Condition</p>
                     <p className="text-sm font-bold text-deep-teal-400 leading-relaxed bg-black/10 p-4 rounded-2xl border border-white/5">{summary.condition}</p>
                  </div>

                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-800 mb-4">Recommended Actions</p>
                     <div className="space-y-2">
                        {summary.recommendedTests.map(test => (
                           <div key={test} className="flex items-center justify-between p-3 rounded-xl bg-charcoal-blue-400 border border-charcoal-blue-300 text-xs font-bold group hover:bg-deep-teal-500 transition-all cursor-pointer">
                              {test}
                              <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="mt-auto pt-6 border-t border-charcoal-blue-400">
                  <p className="text-[9px] font-bold text-charcoal-blue-800 uppercase tracking-widest text-center">AI generated insights update in real-time</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
