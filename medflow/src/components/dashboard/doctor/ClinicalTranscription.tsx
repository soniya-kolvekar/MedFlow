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
import { db } from "../../../../lib/firebase";
import { doc, onSnapshot, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { transcribeAudio, translateText, textToSpeech } from "@/lib/sarvam";

interface TranscriptMessage {
    role: "Doctor" | "Patient";
    text: string;
    timestamp: string;
    translation?: string;
}

export default function ClinicalTranscription({ sessionId = "demo-session-123" }: { sessionId?: string }) {
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<TranscriptMessage[]>([]);
    const [liveCaption, setLiveCaption] = useState("");
    const [inputLanguage, setInputLanguage] = useState("kok-IN"); // Default to Konkani per user request
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Sync with Firestore
    useEffect(() => {
        const sessionRef = doc(db, "sessions", sessionId);

        const unsubscribe = onSnapshot(sessionRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.messages) setMessages(data.messages);
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
            const wsUrl = `${backendUrl.replace('http', 'ws')}/ws/translate?target_language=en`;
            
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                
                // Sarvam Streaming responses
                if (data.translated_text) {
                    setLiveCaption(data.translated_text);
                    // Update Firestore for live sync
                    await updateDoc(doc(db, "sessions", sessionId), {
                        liveCaption: data.translated_text
                    });
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

                    // Optional: TTS for the final translated sentence
                    const ttsBase64 = await textToSpeech(finalTranscript, "en-IN");
                    if (ttsBase64) {
                        const audio = new Audio(`data:audio/mp3;base64,${ttsBase64}`);
                        audio.play().catch(err => console.error("TTS Playback Error:", err));
                    }
                }
            };

            socketRef.current.onerror = (err) => {
                console.error("WebSocket Error:", err);
            };

            // 2. Start Audio Capture
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const supportedTypes = ['audio/webm', 'audio/webm;codecs=opus', 'audio/ogg;codecs=opus'];
            const mimeType = supportedTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';

            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(e.data);
                }
            };

            // Start recording in small chunks (100ms for responsiveness)
            recorder.start(100);
            setIsRecording(true);

            intervalRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone or starting translation:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (socketRef.current) {
            socketRef.current.close();
        }
        
        if (intervalRef.current) clearInterval(intervalRef.current);

        setIsRecording(false);
        setLiveCaption("");
        updateDoc(doc(db, "sessions", sessionId), { liveCaption: "" });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col h-full relative overflow-hidden border border-ash-grey-600/30">
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
                            <select
                                value={inputLanguage}
                                onChange={(e) => setInputLanguage(e.target.value)}
                                className="bg-transparent text-[11px] font-bold text-deep-teal-600 uppercase tracking-wider focus:outline-none cursor-pointer hover:text-deep-teal-800 transition-colors"
                            >
                                <option value="kok-IN">Konkani</option>
                                <option value="en-IN">English</option>
                                <option value="hi-IN">Hindi</option>
                                <option value="mr-IN">Marathi</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
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

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto pr-4 space-y-8 pb-32 custom-scrollbar scroll-smooth">
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
                                {msg.translation && (
                                    <div className="mt-3 pt-3 border-t border-muted-teal-200/40">
                                        <p className="text-[10px] font-bold text-muted-teal-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <Globe className="w-3 h-3" /> Spanish Translation
                                        </p>
                                        <p className="text-dark-slate-grey-800 text-sm italic">
                                            "{msg.translation}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Captions Overlay */}
            <AnimatePresence>
                {liveCaption && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-[100px] left-6 right-6 z-20"
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

            {/* Bottom Status Bar */}
            <div className="absolute bottom-6 left-6 right-6 bg-ash-grey-800/90 backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between border border-ash-grey-700/50 shadow-lg shrink-0 z-10 transition-all">
                <div className="flex items-center gap-8 pl-2">
                    <div>
                        <p className="text-[10px] font-bold text-dark-slate-grey-800 uppercase tracking-wider mb-0.5">
                            Queue
                        </p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-dark-slate-grey-500">
                                02
                            </span>
                            <span className="text-sm font-semibold text-dark-slate-grey-800">
                                / 08
                            </span>
                            <Users className="w-4 h-4 text-dark-slate-grey-800 ml-1" />
                        </div>
                    </div>

                    <div className="w-px h-8 bg-ash-grey-600/50"></div>

                    <div>
                        <p className="text-[10px] font-bold text-dark-slate-grey-800 uppercase tracking-wider mb-0.5">
                            {isRecording ? "Duration" : "Session Time"}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-bold tracking-tight transition-colors ${isRecording ? 'text-deep-teal-500' : 'text-dark-slate-grey-500'}`}>
                                {isRecording ? formatTime(duration) : "12:45"}
                            </span>
                            <Clock className={`w-4 h-4 ${isRecording ? 'text-deep-teal-500' : 'text-dark-slate-grey-800'}`} />
                        </div>
                    </div>
                </div>

                <div className="bg-muted-teal-100 rounded-xl p-3 px-5 flex items-center gap-4 cursor-pointer hover:bg-muted-teal-200 transition-all border border-muted-teal-200 shadow-sm hover:shadow-md active:translate-y-0 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-deep-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-right">
                        <p className="text-[10px] font-extrabold text-deep-teal-600 uppercase tracking-wider mb-0.5">
                            Next Up
                        </p>
                        <p className="text-sm font-bold text-dark-slate-grey-500 leading-tight">
                            Maria Garcia
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-deep-teal-500 text-white flex items-center justify-center shadow-md shadow-deep-teal-500/30 group-hover:scale-110 transition-transform">
                        <ChevronRight className="w-5 h-5 ml-0.5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
