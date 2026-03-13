"use client";

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import {
  Activity,
  ArrowUpRight,
  Clock,
  FlaskConical,
  Truck,
  FileText,
  Loader2,
  Stethoscope,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'DELIVERY' | 'LAB' | 'SYSTEM';
  title?: string;
  message?: string;
  patientName?: string;
  fileName?: string;
  testName?: string;
  createdAt?: string;
  uploadedAt?: string;
}

function timeAgo(isoString?: string): string {
  if (!isoString) return '';
  const now = new Date();
  const past = new Date(isoString);
  const diff = now.getTime() - past.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const [patientCount, setPatientCount]     = useState<number | null>(null);
  const [reportCount, setReportCount]       = useState<number | null>(null);
  const [deliveryCount, setDeliveryCount]   = useState<number | null>(null);
  const [logs, setLogs]                     = useState<LogEntry[]>([]);
  const [newLogId, setNewLogId]             = useState<string | null>(null);
  const isFirstLogs = useRef(true);

  // Live Firestore listeners
  useEffect(() => {
    const unsubPatients = onSnapshot(collection(db, 'patients'), snap => setPatientCount(snap.size));
    const unsubReports = onSnapshot(collection(db, 'reports'), snap => setReportCount(snap.size));
    const unsubNotifs = onSnapshot(collection(db, 'notifications'), snap => setDeliveryCount(snap.size));

    // ─── Real-time system activity log (merges reports + notifications + patients) ───────
    const reportsUnsub = onSnapshot(
      query(collection(db, 'reports'), orderBy('uploadedAt', 'desc'), limit(10)),
      (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added' && !isFirstLogs.current) {
            setNewLogId(change.doc.id);
            setTimeout(() => setNewLogId(null), 4000);
          }
        });
        const entries = snap.docs.map(d => ({ id: d.id, type: 'LAB', ...d.data() })) as LogEntry[];
        setLogs(prev => mergeAndSort([...entries, ...prev.filter(e => e.type !== 'LAB')]));
        isFirstLogs.current = false;
      }
    );

    const notifUnsub = onSnapshot(
      query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(10)),
      (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added' && !isFirstLogs.current) {
            setNewLogId(change.doc.id);
            setTimeout(() => setNewLogId(null), 4000);
          }
        });
        const entries = snap.docs.map(d => ({ id: d.id, type: 'DELIVERY', ...d.data() })) as LogEntry[];
        setLogs(prev => mergeAndSort([...entries, ...prev.filter(e => e.type !== 'DELIVERY')]));
      }
    );

    // Also track new patients (e.g. "Elena Rodriguez registered")
    const patientsUnsub = onSnapshot(
      query(collection(db, 'patients'), orderBy('lastUpdated', 'desc'), limit(10)),
      (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added' && !isFirstLogs.current) {
            setNewLogId(change.doc.id);
            setTimeout(() => setNewLogId(null), 4000);
          }
        });
        const entries = snap.docs.map(d => ({ 
          id: d.id, 
          type: 'SYSTEM', 
          title: `New Patient: ${d.data().name}`, 
          message: `Medical record ${d.id} initialized in ${d.data().dept || 'Emergency'}.`,
          createdAt: d.data().lastUpdated || d.data().resolvedAt || new Date().toISOString()
        })) as LogEntry[];
        setLogs(prev => mergeAndSort([...entries, ...prev.filter(e => e.type !== 'SYSTEM')]));
      }
    );

    return () => { unsubPatients(); unsubReports(); unsubNotifs(); reportsUnsub(); notifUnsub(); patientsUnsub(); };
  }, []);

  function mergeAndSort(entries: LogEntry[]): LogEntry[] {
    const seen = new Set<string>();
    return entries
      .filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; })
      .sort((a, b) => new Date(b.createdAt || b.uploadedAt || 0).getTime() - new Date(a.createdAt || a.uploadedAt || 0).getTime())
      .slice(0, 10);
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        
        {/* Header Title Section */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-bold text-[#132A13] tracking-tight mb-2">System Overview</h1>
                <p className="text-gray-500 font-medium">A real-time snapshot of MedFlow AI infrastructure. Monitoring clinic efficiency and critical patient throughput.</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all">
                    Generate Report
                </button>
                <button className="px-6 py-3 rounded-2xl bg-[#3D7C65] text-white font-bold text-sm flex items-center gap-2 hover:bg-[#2F614E] transition-all shadow-lg shadow-[#3D7C65]/20">
                    <Plus className="h-4 w-4" />
                    New Intake
                </button>
            </div>
        </div>

        {/* Top Feature Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Consultations Card */}
            <div className="bg-[#3D7C65] rounded-[40px] p-10 text-white shadow-2xl shadow-[#3D7C65]/20 relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Consultations today</p>
                    <h2 className="text-7xl font-bold tracking-tighter mb-4">{patientCount || 142}</h2>
                    <p className="text-sm font-medium flex items-center gap-1 opacity-80">
                        <ArrowUpRight className="h-4 w-4" />
                        12% increase from yesterday
                    </p>

                    <div className="flex items-end gap-2 mt-10 h-24">
                        {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/20 rounded-t-lg transition-all duration-500 group-hover:bg-white/40" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Pending Prescriptions Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between">
                <div>
                   <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-[#D1E7DD] rounded-2xl flex items-center justify-center text-[#3D7C65]">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full">Urgent</span>
                   </div>
                   <p className="text-sm font-bold text-gray-400 mb-2">Pending prescriptions</p>
                   <h2 className="text-5xl font-bold text-gray-800 tracking-tighter mb-8">{deliveryCount || 28}</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase">Avg processing time</span>
                        <span className="text-gray-800 font-bold">14 mins</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3D7C65] w-[65%] rounded-full shadow-sm"></div>
                    </div>
                </div>
            </div>

            {/* Lab Requests Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between">
                <div>
                   <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                            <FlaskConical className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3D7C65] bg-gray-50 px-3 py-1.5 rounded-full">In Progress</span>
                   </div>
                   <p className="text-sm font-bold text-gray-400 mb-2">Lab requests</p>
                   <h2 className="text-5xl font-bold text-gray-800 tracking-tighter mb-8">{reportCount || 54}</h2>
                </div>
                <div className="flex items-center gap-1.5">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 overflow-hidden -ml-2 first:ml-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 100}`} alt="doctor" />
                        </div>
                    ))}
                    <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center -ml-2">
                        <span className="text-[10px] font-bold text-gray-400">+8</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Section: Chart + Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Consultation Stats Chart Area */}
            <div className="lg:col-span-8 bg-white/40 rounded-[48px] p-10 border border-white relative min-h-[500px]">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-2xl font-bold text-[#132A13]">Consultation Stats</h3>
                        <p className="text-gray-400 font-medium text-sm mt-1">Daily volume by department</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all">
                        Last 7 Days
                        <ChevronRight className="h-3 w-3 rotate-90" />
                    </button>
                </div>

                {/* Mock Chart Grid */}
                <div className="relative h-[300px] flex items-end justify-between px-4 pb-12 border-b border-gray-100">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={day} className="flex flex-col items-center gap-4 w-12 h-full justify-end group">
                            <div className="flex gap-1 items-end w-full h-full">
                                <div className="w-1/2 bg-[#2C332F] rounded-t-md transition-all duration-700 delay-[50ms]" style={{ height: `${[45, 65, 40, 80, 50, 45, 10][i]}%` }}></div>
                                <div className="w-1/2 bg-[#3D7C65] rounded-t-md transition-all duration-700 delay-[200ms]" style={{ height: `${[60, 40, 75, 55, 65, 30, 5][i]}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest absolute -bottom-8">{day}</span>
                        </div>
                    ))}
                    
                    {/* Horizontal background lines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-12 pr-4">
                        {[1,2,3,4].map(l => (
                            <div key={l} className="w-full border-t border-gray-50"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Activity Log Area */}
            <div className="lg:col-span-4 flex flex-col">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-xl font-bold text-[#132A13]">System activity log</h3>
                    <button className="text-[11px] font-bold text-[#3D7C65] uppercase tracking-widest border-b border-[#3D7C65]/20 hover:border-[#3D7C65] transition-all">View All</button>
                </div>

                <div className="space-y-6 flex-1">
                    {logs.length === 0 ? (
                        <div className="bg-white rounded-[32px] p-10 flex flex-col items-center text-center justify-center opacity-40">
                             <Loader2 className="h-10 w-10 animate-spin mb-4" />
                             <p className="text-xs font-bold uppercase tracking-widest tracking-tighter">Syncing realtime data...</p>
                        </div>
                    ) : logs.map((log) => {
                        const isNew = log.id === newLogId;
                        const isLab = log.type === 'LAB';
                        const isDelivery = log.type === 'DELIVERY';
                        
                        // Select indicator color and icon
                        let lineColor = 'bg-gray-300';
                        
                        if (isLab) {
                            lineColor = 'bg-[#3D7C65]';
                        } else if (isDelivery) {
                            lineColor = 'bg-blue-400';
                        } else {
                            lineColor = 'bg-amber-400';
                        }

                        return (
                            <div key={log.id} className={`flex gap-6 items-start transition-all duration-700 ${isNew ? 'scale-105 origin-left' : ''}`}>
                                <div className={`w-1 h-14 rounded-full ${lineColor} opacity-20`}></div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{timeAgo(log.createdAt || log.uploadedAt)}</span>
                                    <h4 className="font-bold text-[#132A13] text-sm mt-0.5 leading-tight">
                                        {isLab ? (log.testName || 'Lab Report Filed') : (log.title || 'System Event')}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                                        {isLab 
                                            ? `${log.patientName || 'Patient'}'s report successfully uploaded to Cloudinary.`
                                            : log.message || 'System activity tracked successfully.'}
                                    </p>
                                </div>
                                {isNew && (
                                    <div className={`w-2 h-2 rounded-full ${isLab ? 'bg-[#3D7C65]' : 'bg-red-500'} animate-ping mt-1`}></div>
                                )}
                            </div>
                        );
                    })}

                    {/* Filling the space if no logs */}
                    {logs.length > 0 && logs.length < 4 && Array(4 - logs.length).fill(0).map((_, i) => (
                         <div key={i} className="flex gap-6 items-start opacity-20 filter grayscale">
                         <div className="w-1 h-14 rounded-full bg-gray-300"></div>
                         <div className="flex-1">
                             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">08:30 AM</span>
                             <h4 className="font-bold text-gray-300 text-sm mt-0.5 leading-tight">Previous System Activity</h4>
                             <p className="text-xs text-gray-300 font-medium mt-1 leading-relaxed">Historical logging archive placeholder.</p>
                         </div>
                     </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </AdminLayout>

  );
}
