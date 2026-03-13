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

export default function ClinicalTranscription({ sessionId: initialSessionId }: { sessionId?: string }) {
    const [sessionId, setSessionId] = useState(initialSessionId || `session-${Date.now()}`);
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<TranscriptMessage[]>([]);
    const [liveCaption, setLiveCaption] = useState("");
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
    const [inputLanguage, setInputLanguage] = useState("hi-IN"); // Language spoken by user
    const [targetLanguage, setTargetLanguage] = useState("en-IN"); // Language to translate into (Subtitles & Speech)
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
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
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://medflow-3.onrender.com";
            const wsUrl = `${backendUrl.replace('http', 'ws')}/ws/translate?source_language=${inputLanguage}&target_language=${targetLanguage}`;
            
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => {
                console.log("✅ WebSocket Relay connected successfully to:", wsUrl);
            };
            
            socketRef.current.onmessage = async (event) => {
                console.log("WS Received:", event.data);
                const data = JSON.parse(event.data);
                
                // Sarvam Streaming responses
                if (data.translated_text) {
                    setLiveCaption(data.translated_text);
                    // Update Firestore for live sync
                    await updateDoc(doc(db, "sessions", sessionId), {
                        liveCaption: data.translated_text
                    });
                }

                // Play audio if available (from backend TTS)
                if (data.audio) {
                    playBase64Audio(data.audio);
                }
                if (data.transcript && data.is_final) {
                    console.log("🏁 Final segment received:", data.transcript);
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

            socketRef.current.onerror = (err) => {
                console.error("❌ WebSocket Connection Error!");
                console.error("Target URL:", wsUrl);
                console.error("Error Object Details:", err);
            };

            socketRef.current.onclose = (event) => {
                console.warn(`⚠️ WebSocket Closed. Code: ${event.code}, Reason: ${event.reason || 'None'}`);
                if (event.code === 1006) {
                    console.error("HINT: Code 1006 usually means the backend server isn't running or there is a CORS issue.");
                }
            };

            // 2. Start Audio Capture (Raw PCM)
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;
            
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Convert Float32 to Int16 PCM
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

            setIsRecording(true);

            intervalRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone or starting translation:", err);
        }
    };

    const stopRecording = () => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
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

            <div className="absolute bottom-6 left-6 right-6 bg-ash-grey-800/90 backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between border border-ash-grey-700/50 shadow-lg shrink-0 z-10 transition-all">
                <div className="flex items-center gap-8 pl-2">
                    <div>
                        <p className="text-[10px] font-bold text-dark-slate-grey-800 uppercase tracking-wider mb-0.5">
                            {isRecording ? "Duration" : "Session End Time"}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-bold tracking-tight transition-colors ${isRecording ? 'text-deep-teal-500' : 'text-dark-slate-grey-500'}`}>
                                {isRecording ? formatTime(duration) : formatTime(duration)}
                            </span>
                            <Clock className={`w-4 h-4 ${isRecording ? 'text-deep-teal-500' : 'text-dark-slate-grey-800'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
