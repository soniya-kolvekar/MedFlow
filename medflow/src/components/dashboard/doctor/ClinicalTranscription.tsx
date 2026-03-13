"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Mic,
    StopCircle,
    Zap,
    ChevronRight,
    Clock,
    Globe,
    Users,
    Activity,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { transcribeAudio, translateText, textToSpeech } from "@/lib/sarvam";
import { jsPDF } from "jspdf";

interface TranscriptMessage {
    role: "Doctor" | "Patient";
    text: string;
    timestamp: string;
    translation?: string;
}

interface AISummary {
    symptoms: string[];
    diagnosis: string;
    notes: string;
}

export default function ClinicalTranscription({ sessionId = "demo-session-123" }: { sessionId?: string }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [messages, setMessages] = useState<TranscriptMessage[]>([]);
    const [liveCaption, setLiveCaption] = useState("");
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
    const [inputLanguage, setInputLanguage] = useState("en-IN");
    const [targetLanguage, setTargetLanguage] = useState("hi-IN");
    const [aiSummary, setAiSummary] = useState<AISummary>({
        symptoms: ["Analysis in progress..."],
        diagnosis: "Awaiting session data",
        notes: "System is processing the live conversation..."
    });
    const [duration, setDuration] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Function to play base64 audio
    const playBase64Audio = async (base64Data: string) => {
        if (!isAutoPlayEnabled) return;
        try {
            const audioData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            // Initialize AudioContext if not already done
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const buffer = await audioContextRef.current.decodeAudioData(audioData.buffer);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start(0);
        } catch (error) {
            console.error("Error playing translated audio:", error);
        }
    };

    // Fetch AI Summary from Backend
    const updateSummary = async (newMessages: TranscriptMessage[]) => {
        if (newMessages.length < 2) return;
        
        try {
            const transcript = newMessages.map(m => `${m.role}: ${m.text}`).join("\n");
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://medflow-3.onrender.com";
            
            const response = await fetch(`${backendUrl}/api/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript })
            });
            
            if (response.ok) {
                const summary = await response.json();
                setAiSummary(summary);
            }
        } catch (error) {
            console.error("Summary fetch error:", error);
        }
    };

    // Sync with Firestore
    useEffect(() => {
        const sessionRef = doc(db, "sessions", sessionId);

        const unsubscribe = onSnapshot(sessionRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.messages) {
                    setMessages(data.messages);
                    // Update summary periodically? (e.g., every 3 messages)
                    if (data.messages.length > 0 && data.messages.length % 3 === 0) {
                        updateSummary(data.messages);
                    }
                }
                if (data.liveCaption) setLiveCaption(data.liveCaption);
            } else {
                // Initialize session if it doesn't exist
                setDoc(sessionRef, {
                    messages: [],
                    liveCaption: "",
                    status: "active",
                    startTime: new Date().toISOString()
                });
            }
        });

        return () => unsubscribe();
    }, [sessionId]);

    const startRecording = async () => {
        try {
            // 1. Initialize WebSocket via Backend Relay
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const wsUrl = `${backendUrl.replace('http', 'ws')}/ws/translate?source_language=${inputLanguage}&target_language=${targetLanguage}`;
            
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => {
                console.log("✅ WebSocket Relay connected successfully to:", wsUrl);
            };
            
            socketRef.current.onmessage = async (event) => {
                console.log("WS Received:", event.data);
                const data = JSON.parse(event.data);
                
                if (data.translated_text) {
                    setLiveCaption(data.translated_text);
                    await updateDoc(doc(db, "sessions", sessionId), {
                        liveCaption: data.translated_text
                    });
                }

                if (data.audio) {
                    playBase64Audio(data.audio);
                }
                
                if (data.transcript && data.is_final) {
                    const finalTranscript = data.translated_text || data.transcript;
                    const newMessage: TranscriptMessage = {
                        role: "Doctor",
                        text: finalTranscript,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };

                    await updateDoc(doc(db, "sessions", sessionId), {
                        messages: arrayUnion(newMessage),
                        liveCaption: ""
                    });
                    setLiveCaption("");
                }
            };

            // 2. Start Raw Audio Capture for Translation (ScriptProcessor)
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;
            
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                if (isPaused) return; // Skip if paused

                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    const s = Math.max(-1, Math.min(1, inputData[i]));
                    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }

                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(pcmData.buffer);
                }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

            // Audio capturing is still happening via ScriptProcessor for live translation, 
            // but we removed MediaRecorder since we no longer save raw audio files.

            setIsRecording(true);
            setIsPaused(false);
            intervalRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone or starting translation:", err);
        }
    };

    const togglePause = () => {
        if (!isRecording) return;
        
        // Since we removed MediaRecorder, we just toggle the state here.
        // The ScriptProcessor check (isPaused) handles pausing the audio send to backend.
        if (isPaused) {
            setIsPaused(false);
        } else {
            setIsPaused(true);
        }
    };

    const stopRecording = async () => {
        if (processorRef.current) processorRef.current.disconnect();
        if (audioContextRef.current) audioContextRef.current.close();
        
        // --- Generate PDF Summary & Upload to Cloudinary ---
        try {
            const docPdf = new jsPDF();
            
            // Header
            docPdf.setFontSize(22);
            docPdf.setTextColor(24, 69, 59); // deep-teal
            docPdf.text("MedFlow AI", 20, 20);
            
            docPdf.setFontSize(14);
            docPdf.setTextColor(100);
            docPdf.text("Clinical Session Summary", 20, 30);
            
            docPdf.setDrawColor(200, 200, 200);
            docPdf.line(20, 35, 190, 35);

            // Time & Date
            docPdf.setFontSize(10);
            const dateStr = new Date().toLocaleString();
            docPdf.text(`Session ID: ${sessionId}`, 20, 45);
            docPdf.text(`Date & Time: ${dateStr}`, 20, 52);
            docPdf.text(`Duration: ${formatTime(duration)}`, 20, 59);

            docPdf.line(20, 65, 190, 65);

            // AI Insights
            docPdf.setFontSize(14);
            docPdf.setTextColor(30);
            docPdf.text("AI Derived Insights:", 20, 75);

            docPdf.setFontSize(12);
            docPdf.text("Symptoms:", 20, 90);
            docPdf.setFontSize(10);
            docPdf.setTextColor(80);
            docPdf.text(aiSummary.symptoms.join(", ") || "None recorded", 25, 100);

            docPdf.setFontSize(12);
            docPdf.setTextColor(30);
            docPdf.text("Potential Diagnosis:", 20, 115);
            docPdf.setFontSize(10);
            docPdf.setTextColor(80);
            // Handling long text wrapping
            const splitDiagnosis = docPdf.splitTextToSize(aiSummary.diagnosis || "Awaiting data", 160);
            docPdf.text(splitDiagnosis, 25, 125);

            const nextY = 125 + (splitDiagnosis.length * 5) + 5;

            docPdf.setFontSize(12);
            docPdf.setTextColor(30);
            docPdf.text("Clinical Notes:", 20, nextY);
            docPdf.setFontSize(10);
            docPdf.setTextColor(80);
            const splitNotes = docPdf.splitTextToSize(aiSummary.notes || "No notes generated", 160);
            docPdf.text(splitNotes, 25, nextY + 10);
            
            // Convert PDF to Blob
            const pdfBlob = docPdf.output('blob');
            
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', pdfBlob);
            formData.append('upload_preset', 'ml_default');
            formData.append('resource_type', 'auto'); // Auto handles PDFs well
            
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.secure_url) {
                console.log("Clinical Summary PDF Uploaded:", result.secure_url);
                await updateDoc(doc(db, "sessions", sessionId), {
                    summaryPdfUrl: result.secure_url,
                    status: "completed"
                });
            } else {
                console.error("Cloudinary failed to return secure_url for PDF.");
                await updateDoc(doc(db, "sessions", sessionId), {
                    status: "completed_no_pdf"
                });
            }
        } catch (uploadError) {
            console.error("Clinical Summary PDF generation/upload failed:", uploadError);
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (socketRef.current) socketRef.current.close();
        if (intervalRef.current) clearInterval(intervalRef.current);

        setIsRecording(false);
        setIsPaused(false);
        setLiveCaption("");
        await updateDoc(doc(db, "sessions", sessionId), { liveCaption: "" });
    };

    const clearHistory = async () => {
        if (confirm("Are you sure you want to clear all transcription records for this session?")) {
            const sessionRef = doc(db, "sessions", sessionId);
            await updateDoc(sessionRef, {
                messages: [],
                liveCaption: ""
            });
            setMessages([]);
            setLiveCaption("");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col relative border border-ash-grey-600/30 min-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-ash-grey-600/50 mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative transition-all duration-500 ${isRecording ? 'bg-red-50 text-red-500 shadow-lg shadow-red-200/50' : 'bg-muted-teal-100 text-deep-teal-600'}`}>
                        {isRecording ? <Activity className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
                        <AnimatePresence>
                            {isRecording && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                    <div>
                        <h3 className="font-bold text-dark-slate-grey-500 text-lg">
                            Clinical AI Transcription
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs text-dark-slate-grey-800 font-bold uppercase tracking-wider">
                                <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-ash-grey-600'}`} />
                                {isRecording ? "Live" : "Standby"}
                            </span>
                            <span className="w-1 h-1 bg-ash-grey-300 rounded-full" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-ash-grey-600 uppercase tracking-widest">Input</span>
                                <select
                                    value={inputLanguage}
                                    onChange={(e) => setInputLanguage(e.target.value)}
                                    className="bg-transparent text-[11px] font-bold text-deep-teal-600 uppercase tracking-wider focus:outline-none cursor-pointer hover:text-deep-teal-800 transition-colors"
                                >
                                    <option value="en-IN">English</option>
                                    <option value="hi-IN">Hindi</option>
                                    <option value="kok-IN">Konkani</option>
                                    <option value="mr-IN">Marathi</option>
                                </select>
                            </div>
                            <div className="w-px h-6 bg-ash-grey-600/30 mx-1"></div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-ash-grey-600 uppercase tracking-widest">Output & Voice</span>
                                <select
                                    value={targetLanguage}
                                    onChange={(e) => setTargetLanguage(e.target.value)}
                                    className="bg-transparent text-[11px] font-bold text-deep-teal-600 uppercase tracking-wider focus:outline-none cursor-pointer hover:text-deep-teal-800 transition-colors"
                                >
                                    <option value="hi-IN">Hindi</option>
                                    <option value="en-IN">English</option>
                                    <option value="ta-IN">Tamil</option>
                                    <option value="bn-IN">Bengali</option>
                                </select>
                            </div>
                            <div className="w-px h-6 bg-ash-grey-600/30 mx-1"></div>
                            <button
                                onClick={() => setIsAutoPlayEnabled(!isAutoPlayEnabled)}
                                className={`flex flex-col gap-1 items-start transition-all hover:opacity-80 active:scale-95 ${isAutoPlayEnabled ? 'text-deep-teal-600' : 'text-ash-grey-600'}`}
                                title={isAutoPlayEnabled ? "Mute Auto-playback" : "Enable Auto-playback"}
                            >
                                <span className="text-[9px] font-black uppercase tracking-widest">Speech</span>
                                <div className="flex items-center gap-1">
                                    <Activity className={`w-3 h-3 ${isAutoPlayEnabled ? 'animate-pulse' : ''}`} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">
                                        {isAutoPlayEnabled ? "On" : "Off"}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={clearHistory}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold text-ash-grey-600 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-2 active:scale-95"
                        title="Clear all records"
                    >
                        Clear History
                    </button>
                    
                    {isRecording && (
                        <button
                            onClick={togglePause}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${
                                isPaused 
                                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                                : 'bg-ash-grey-900 text-dark-slate-grey-800 hover:bg-ash-grey-800'
                            }`}
                        >
                            {isPaused ? <Zap className="w-4 h-4 fill-current" /> : <StopCircle className="w-4 h-4" />}
                            {isPaused ? "Resume" : "Pause"}
                        </button>
                    )}

                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-deep-teal-500 hover:bg-deep-teal-600 transition-all shadow-md shadow-deep-teal-500/20 flex items-center gap-2 active:scale-95"
                        >
                            <Mic className="w-4 h-4" /> Start Session
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2 active:scale-95 shadow-sm"
                        >
                            <StopCircle className="w-4 h-4" /> End Session
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area with Summary Sidebar */}
            <div className="flex gap-6 mt-8">
                {/* Chat Area */}
                <div className="flex-1 space-y-8 pb-32 custom-scrollbar scroll-smooth">
                    {messages.length === 0 && !isRecording && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                            <div className="w-16 h-16 bg-ash-grey-900 rounded-2xl flex items-center justify-center mb-4">
                                <Mic className="w-8 h-8 text-dark-slate-grey-800" />
                            </div>
                            <p className="font-bold text-dark-slate-grey-500">No transcription data yet</p>
                            <p className="text-xs text-dark-slate-grey-800 font-medium">Click "Start Session" to begin real-time audio capture</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className="flex gap-4"
                        >
                            <div className="text-[10px] font-bold text-dark-slate-grey-800 pt-1 shrink-0 w-10">
                                {msg.timestamp}
                            </div>
                            <div className="flex-1">
                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${msg.role === 'Patient' ? 'text-muted-teal-600' : 'text-dark-slate-grey-800'}`}>
                                    {msg.role}
                                </p>
                                <div className={`${msg.role === 'Patient' ? 'bg-muted-teal-100/40 border border-muted-teal-200/50 p-4 rounded-2xl' : ''}`}>
                                    <p className="text-dark-slate-grey-500 text-[15px] leading-relaxed font-medium">
                                        {msg.text}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Summary Sidebar */}
                <div className="w-72 shrink-0 bg-ash-grey-900/40 rounded-[1.5rem] p-6 border border-ash-grey-800 flex flex-col gap-6 overflow-hidden">
                    <div className="flex items-center gap-2 px-1">
                        <Zap className="w-4 h-4 text-deep-teal-500 fill-current" />
                        <h4 className="text-[11px] font-black text-dark-slate-grey-500 uppercase tracking-widest flex-1">Real-time Summary</h4>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${isRecording ? 'bg-green-500' : 'bg-ash-grey-600'}`} />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                        <div>
                            <p className="text-[9px] font-black text-ash-grey-600 uppercase tracking-widest mb-3">Key Symptoms</p>
                            <div className="flex flex-wrap gap-2">
                                {aiSummary.symptoms.map((s, i) => (
                                    <span key={i} className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-bold text-dark-slate-grey-500 border border-ash-grey-800 shadow-sm">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] font-black text-ash-grey-600 uppercase tracking-widest mb-3">Potential Diagnoses</p>
                            <p className="text-xs font-bold text-deep-teal-600 leading-relaxed italic">
                                {aiSummary.diagnosis}
                            </p>
                        </div>
                        
                        <div className="pt-4 border-t border-ash-grey-600/30">
                            <p className="text-[9px] font-black text-ash-grey-600 uppercase tracking-widest mb-3">Clinical Notes</p>
                            <p className="text-[11px] leading-relaxed text-dark-slate-grey-800 font-medium whitespace-pre-wrap">
                                {aiSummary.notes}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => updateSummary(messages)}
                        className="w-full bg-white border border-ash-grey-800 text-dark-slate-grey-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ash-grey-900 transition-colors shadow-sm"
                    >
                        Refresh AI Insights
                    </button>
                </div>
            </div>

            {/* Live Captions Overlay */}
            <AnimatePresence>
                {liveCaption && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-[100px] left-6 right-[318px] z-20"
                    >
                        <div className="bg-dark-slate-grey-500 bg-opacity-90 backdrop-blur-md text-white rounded-[1.5rem] p-5 shadow-2xl border border-dark-slate-grey-400/50 ring-4 ring-deep-teal-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                                <p className="text-[10px] font-bold text-ash-grey-800 uppercase tracking-widest">Live Analysis</p>
                            </div>
                            <p className="font-bold text-lg leading-tight">
                                "{liveCaption}"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-6 left-6 right-6 bg-ash-grey-800/90 backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between border border-ash-grey-700/50 shadow-lg shrink-0 z-10 transition-all">
                <div className="flex items-center gap-8 pl-2">
                    <div>
                        <p className="text-[10px] font-bold text-dark-slate-grey-800 uppercase tracking-wider mb-0.5">
                            {isRecording ? "Duration" : "Session End Time"}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-bold tracking-tight transition-colors ${isRecording ? 'text-deep-teal-500' : 'text-dark-slate-grey-500'}`}>
                                {formatTime(duration)}
                            </span>
                            <Clock className={`w-4 h-4 ${isRecording ? 'text-deep-teal-500' : 'text-dark-slate-grey-800'}`} />
                        </div>
                    </div>
                </div>
                {isPaused && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-orange-500/20">
                        Session Paused
                    </span>
                )}
            </div>
        </div>
    );
}
