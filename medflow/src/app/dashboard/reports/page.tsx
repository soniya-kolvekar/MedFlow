"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Share2
} from 'lucide-react';

export default function ReportsPage() {
  const { patientId, testPatientId } = useAuth();
  const [filter, setFilter] = useState('All');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const effectiveId = testPatientId || patientId;

  useEffect(() => {
    if (!effectiveId) return;

    const cleanId = effectiveId.replace('#', '');
    const q = query(
      collection(db, 'reports'),
      where('patientId', '==', cleanId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveReports = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().testName || doc.data().fileName,
        patient: doc.data().patientName,
        date: new Date(doc.data().uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: doc.data().status || 'Finalized',
        category: doc.data().department || 'Laboratory',
        size: 'PDF Report',
        url: doc.data().url
      }));

      // Combine with some mock data for visual padding if library is empty
      const mockData = [
        { id: 'R-9025', name: 'Pulmonary Function', patient: 'Elena Rodriguez', date: 'Oct 20, 2023', status: 'In Review', category: 'Pulmonary', size: '3.2 MB' },
      ].filter(r => liveReports.length === 0);

      setReports([...liveReports, ...mockData]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [effectiveId]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-dark-slate-grey-500 tracking-tight">Medical Archives</h1>
            <p className="text-charcoal-blue-700 mt-2 font-medium">Securely access and manage diagnostic reports and clinical documentation.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-ash-grey-700/30 rounded-2xl text-charcoal-blue-700 font-bold text-sm bg-white hover:bg-ash-grey-900 transition-colors">
              <Download className="h-4 w-4" />
              Batch Export
            </button>
            <button className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3 rounded-xl hover:bg-dark-slate-grey-600 transition-all shadow-lg shadow-dark-slate-grey-500/10 active:scale-95">
              <Share2 className="h-5 w-5" />
              <span className="font-semibold">Share Records</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-ash-grey-700/30 shadow-sm flex items-center gap-6">
            <div className="h-16 w-16 bg-ash-grey-900 rounded-[24px] flex items-center justify-center text-deep-teal-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-charcoal-blue-700 opacity-40 tracking-widest leading-none mb-1">Finalized</p>
              <h3 className="text-3xl font-black text-dark-slate-grey-500">142</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-ash-grey-700/30 shadow-sm flex items-center gap-6">
            <div className="h-16 w-16 bg-ash-grey-900 rounded-[24px] flex items-center justify-center text-orange-500">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-charcoal-blue-700 opacity-40 tracking-widest leading-none mb-1">Awaiting Review</p>
              <h3 className="text-3xl font-black text-dark-slate-grey-500">12</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-ash-grey-700/30 shadow-sm flex items-center gap-6">
            <div className="h-16 w-16 bg-ash-grey-900 rounded-[24px] flex items-center justify-center text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-charcoal-blue-700 opacity-40 tracking-widest leading-none mb-1">Critical Results</p>
              <h3 className="text-3xl font-black text-dark-slate-grey-500">03</h3>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-[40px] p-10 border border-ash-grey-700/30 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'Laboratory', 'Radiology', 'Cardiology', 'Pulmonary'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-deep-teal-500 text-white shadow-lg shadow-deep-teal-500/20' : 'bg-ash-grey-900 text-charcoal-blue-700 hover:bg-ash-grey-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-500" />
              <input 
                type="text" 
                placeholder="Search by patient or ID..." 
                className="w-full pl-11 pr-4 py-2.5 bg-ash-grey-900 border border-transparent rounded-2xl focus:bg-white focus:border-deep-teal-500 outline-none transition-all font-medium text-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            {reports.filter(r => filter === 'All' || r.category === filter).map((report) => (
              <div key={report.id} className="group flex items-center justify-between p-6 rounded-[28px] border border-transparent hover:border-ash-grey-800 hover:bg-ash-grey-900/40 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-white rounded-2xl border border-ash-grey-800 flex items-center justify-center text-charcoal-blue-700 group-hover:bg-deep-teal-500 group-hover:text-white group-hover:border-transparent transition-all">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-dark-slate-grey-500 uppercase tracking-tight">{report.name}</h4>
                    <p className="text-xs text-charcoal-blue-700 font-bold opacity-60 mt-0.5">{report.patient} • {report.id}</p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[9px] font-black uppercase text-ash-grey-500 tracking-widest">{report.category}</span>
                       <div className="h-1 w-1 rounded-full bg-ash-grey-500"></div>
                       <span className="text-[9px] font-black uppercase text-ash-grey-500 tracking-widest">{report.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase text-charcoal-blue-700 opacity-40 tracking-widest mb-1">Filed Date</p>
                    <p className="text-xs font-bold text-dark-slate-grey-500">{report.date}</p>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    report.status === 'Finalized' ? 'bg-green-100 text-green-600' :
                    report.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {report.status}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => report.url && window.open(report.url, '_blank')}
                      className="p-2.5 rounded-xl border border-ash-grey-800 hover:bg-white hover:shadow-md transition-all text-charcoal-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => report.url && window.open(report.url, '_blank')}
                      className="p-2.5 rounded-xl border border-ash-grey-800 hover:bg-white hover:shadow-md transition-all text-charcoal-blue-700"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-ash-grey-900 text-charcoal-blue-700 hover:bg-dark-slate-grey-500 hover:text-white transition-all">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="group-hover:translate-x-1 transition-transform sm:hidden">
                    <ChevronRight className="h-5 w-5 text-ash-grey-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-10 py-4 bg-ash-grey-900 border border-ash-grey-800 rounded-3xl text-charcoal-blue-700 font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-lg transition-all active:scale-95">
            Load More Records
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
