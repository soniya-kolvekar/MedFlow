"use client";

import React, { useEffect, useState } from "react";
import { FileText, Download, ExternalLink, Calendar, User } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface SessionReport {
    id: string;
    patientName?: string;
    patientAge?: number;
    patientGender?: string;
    startTime?: string;
    summaryPdfUrl?: string;
    prescriptionUrl?: string;
    status?: string;
}

export default function ReportsList() {
    const [reports, setReports] = useState<SessionReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = () => {
            const sessionsRef = collection(db, "sessions");
            const q = query(sessionsRef); // Order by startTime desc if possible, requires index or simple fetch

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedReports: SessionReport[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // Only show sessions that have a summary PDF
                    if (data.summaryPdfUrl) {
                        fetchedReports.push({
                            id: doc.id,
                            ...data
                        });
                    }
                });
                
                // Sort by startTime descending locally
                fetchedReports.sort((a, b) => {
                    if (!a.startTime) return 1;
                    if (!b.startTime) return -1;
                    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
                });

                setReports(fetchedReports);
                setLoading(false);
            });

            return unsubscribe;
        };

        const unsubscribe = fetchReports();
        return () => unsubscribe();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] p-8 shadow-sm border border-ash-grey-600/30 overflow-hidden">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-dark-slate-grey-500 tracking-tight">AI Clinical Reports</h2>
                    <p className="text-xs font-bold text-dark-slate-grey-800 uppercase tracking-widest mt-1">
                        {reports.length} Reports Available
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 rounded-full border-4 border-deep-teal-200 border-t-deep-teal-600 animate-spin" />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-20 h-20 bg-ash-grey-900 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-ash-grey-600" />
                        </div>
                        <h3 className="text-xl font-bold text-dark-slate-grey-500 mb-2">No Reports Found</h3>
                        <p className="text-sm text-dark-slate-grey-800 max-w-sm">
                            Generate AI summaries by completing clinical sessions. They will appear here automatically.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {reports.map((report, idx) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group flex items-center justify-between p-5 bg-ash-grey-900/50 border border-ash-grey-800 hover:border-deep-teal-500/30 hover:bg-white hover:shadow-lg hover:shadow-deep-teal-500/5 rounded-3xl transition-all"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-deep-teal-600 border border-ash-grey-800 group-hover:scale-105 transition-transform">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark-slate-grey-500 group-hover:text-deep-teal-600 transition-colors uppercase tracking-tight text-lg mb-1">
                                            {report.patientName || "Unknown Patient"}
                                        </h4>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-ash-grey-800">
                                                <Calendar className="w-3 h-3 text-deep-teal-500" />
                                                {formatDate(report.startTime)}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-ash-grey-800">
                                                <User className="w-3 h-3 text-deep-teal-500" />
                                                {report.patientAge}Y • {report.patientGender}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {report.summaryPdfUrl && (
                                        <a 
                                            href={report.summaryPdfUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-white hover:bg-ash-grey-900 border border-ash-grey-800 text-dark-slate-grey-500 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm"
                                        >
                                            <ExternalLink className="w-4 h-4 text-deep-teal-600" />
                                            View Report
                                        </a>
                                    )}
                                    {report.prescriptionUrl && (
                                        <a 
                                            href={report.prescriptionUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-deep-teal-600 hover:bg-deep-teal-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            Prescription
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
