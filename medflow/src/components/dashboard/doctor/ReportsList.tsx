"use client";

import React, { useEffect, useState } from "react";
import { 
    FileText, 
    Download, 
    ExternalLink, 
    Calendar, 
    User, 
    Search, 
    Filter,
    ClipboardIcon,
    Stethoscope
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
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

interface ReportCardProps {
    type: 'Summary' | 'Prescription';
    report: SessionReport;
    formatDate: (d?: string) => string;
}

const ReportCard = ({ type, report, formatDate }: ReportCardProps) => {
    const isSummary = type === 'Summary';
    const url = isSummary ? report.summaryPdfUrl : report.prescriptionUrl;

    if (!url) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="group bg-white border border-ash-grey-700 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-deep-teal-500/5 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-2xl ${isSummary ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'} transition-transform group-hover:scale-110`}>
                    {isSummary ? <Stethoscope className="w-8 h-8" /> : <ClipboardIcon className="w-8 h-8" />}
                </div>
                <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isSummary ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {type}
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-xl font-black text-dark-slate-grey-500 group-hover:text-deep-teal-600 transition-colors truncate">
                    {report.patientName || "Unknown Patient"}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-dark-slate-grey-800 uppercase tracking-widest mt-2">
                    <Calendar className="w-3.5 h-3.5 text-deep-teal-500" />
                    {formatDate(report.startTime)}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-dark-slate-grey-800 uppercase tracking-widest mt-1">
                    <User className="w-3.5 h-3.5 text-deep-teal-500" />
                    {report.patientAge}Y • {report.patientGender}
                </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-ash-grey-600/30">
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-ash-grey-900 hover:bg-ash-grey-800 text-dark-slate-grey-500 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                    View PDF
                </a>
                <a 
                    href={url} 
                    download
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-deep-teal-500 hover:bg-deep-teal-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-deep-teal-500/20"
                >
                    <Download className="w-4 h-4" />
                    Download
                </a>
            </div>
        </motion.div>
    );
};

export default function ReportsList() {
    const [reports, setReports] = useState<SessionReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'All' | 'Summaries' | 'Prescriptions'>('All');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const sessionsRef = collection(db, "sessions");
        const unsubscribe = onSnapshot(sessionsRef, (snapshot) => {
            const fetched: SessionReport[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.summaryPdfUrl || data.prescriptionUrl) {
                    fetched.push({ id: doc.id, ...data });
                }
            });
            fetched.sort((a, b) => {
                if (!a.startTime) return 1;
                if (!b.startTime) return -1;
                return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
            });
            setReports(fetched);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const filteredReports = reports.filter(r => 
        r.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <h2 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight">Clinical Reports</h2>
                    <p className="text-charcoal-blue-500 font-medium mt-1">Manage and access your patient session history & clinical documentation.</p>
                </div>
                
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-grey-600 group-focus-within:text-deep-teal-500 transition-all" />
                    <input 
                        type="text" 
                        placeholder="Search by patient name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-14 w-full md:w-80 rounded-2xl border border-ash-grey-700 bg-white pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-deep-teal-500/10 focus:border-deep-teal-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 px-2">
                {['All', 'Summaries', 'Prescriptions'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                            activeTab === tab 
                            ? 'bg-dark-slate-grey-500 text-white border-dark-slate-grey-500 shadow-xl shadow-dark-slate-grey-500/20' 
                            : 'bg-white text-dark-slate-grey-500 border-ash-grey-700 hover:border-deep-teal-500 hover:text-deep-teal-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-muted-teal-200 border-t-deep-teal-600 animate-spin" />
                        <p className="text-xs font-black text-ash-grey-600 uppercase tracking-widest">Fetching records...</p>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-20 h-20 bg-ash-grey-900 rounded-[2rem] flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-ash-grey-600" />
                        </div>
                        <h3 className="text-xl font-bold text-dark-slate-grey-500 mb-2">No Reports Found</h3>
                        <p className="text-sm text-ash-grey-600 font-medium max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                        <AnimatePresence mode="popLayout">
                            {filteredReports.flatMap(report => {
                                const cards = [];
                                if ((activeTab === 'All' || activeTab === 'Summaries') && report.summaryPdfUrl) {
                                    cards.push(<ReportCard key={`${report.id}-summary`} type="Summary" report={report} formatDate={formatDate} />);
                                }
                                if ((activeTab === 'All' || activeTab === 'Prescriptions') && report.prescriptionUrl) {
                                    cards.push(<ReportCard key={`${report.id}-presc`} type="Prescription" report={report} formatDate={formatDate} />);
                                }
                                return cards;
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

