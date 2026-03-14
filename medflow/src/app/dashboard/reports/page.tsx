"use client";

import { useState } from 'react';
import { useReports, Report } from '@/hooks/useReports';
import Modal from '@/components/ui/Modal';
import { 
  Search, 
  FileText, 
  Plus, 
  ChevronDown, 
  Eye, 
  Download, 
  Activity, 
  ShieldCheck, 
  Clock,
  Filter,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  Calendar,
  FileSearch,
  CheckCircle2
} from 'lucide-react';

const metrics = [
  {
    title: 'REPORT EFFICIENCY',
    mainValue: '12% Increase',
    desc: 'Average report generation time has decreased by 4.2 minutes.',
    icon: Activity,
    color: 'text-dark-slate-grey-500 bg-ash-grey-900/40'
  },
  {
    title: 'COMPLIANCE STATUS',
    mainValue: '98.4%',
    desc: 'All recent discharge summaries meet the updated CMS guidelines.',
    icon: ShieldCheck,
    color: 'text-dark-slate-grey-500 bg-ash-grey-900/40'
  },
  {
    title: 'PENDING APPROVALS',
    mainValue: '7 Reports',
    desc: "Requires Chief Medical Officer's signature before finalization.",
    icon: Clock,
    color: 'text-dark-slate-grey-500 bg-ash-grey-900/40'
  }
];

export default function ReportsPage() {
  const { reports, loading } = useReports();
  const [activeNav, setActiveNav] = useState('Overview');
  const [activeType, setActiveType] = useState('All Reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [viewReportDetails, setViewReportDetails] = useState<Report | null>(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === 'All Reports' || report.type === activeType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-deep-teal-500 animate-spin" />
        <p className="text-charcoal-blue-700 font-bold animate-pulse">Syncing Medical Archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Sub Navigation */}
      <div className="flex items-center gap-8 border-b border-ash-grey-800/50 -mt-2 mb-6">
        {['Overview', 'Analytics', 'Archives'].map((tab) => (
          <button 
              key={tab} 
              onClick={() => setActiveNav(tab)}
              className={`pb-4 text-sm font-black transition-all relative uppercase tracking-widest ${activeNav === tab ? 'text-dark-slate-grey-500' : 'text-charcoal-blue-700 opacity-40 hover:opacity-100'}`}
          >
            {tab}
            {activeNav === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-deep-teal-500 rounded-full animate-in fade-in duration-500"></div>}
          </button>
        ))}
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tight leading-none uppercase">Reports Management</h1>
          <p className="text-charcoal-blue-700 mt-3 font-medium opacity-60">Comprehensive medical and administrative data insights.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-7 py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-dark-slate-grey-500/10 active:scale-95 group"
        >
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-black uppercase tracking-widest text-[11px]">Generate New Report</span>
        </button>
      </div>

      {/* Table Filters */}
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-4 border border-white/40 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-charcoal-blue-700 opacity-30 group-focus-within:text-deep-teal-500 transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by ID, Title, or Patient..." 
            className="w-full bg-ash-grey-900/30 border border-ash-grey-700/20 rounded-2xl py-4 pl-14 text-sm text-dark-slate-grey-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all placeholder:text-charcoal-blue-700/30 font-bold"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className="flex items-center gap-4 bg-ash-grey-900/30 px-6 py-4 rounded-2xl border border-ash-grey-700/20 group hover:bg-white transition-all cursor-pointer"
            >
               <span className="text-[10px] font-black text-charcoal-blue-700 opacity-30 uppercase tracking-widest">Type:</span>
               <button className="flex items-center gap-2 text-sm font-black text-dark-slate-grey-500">
                  {activeType}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
               </button>
            </div>
            {isTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-[32px] shadow-2xl border border-ash-grey-700/30 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {['All Reports', 'Clinical', 'Administrative', 'Inventory', 'Financial'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => {
                      setActiveType(type);
                      setIsTypeDropdownOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 text-xs font-bold text-charcoal-blue-700 hover:bg-ash-grey-900 transition-colors flex items-center justify-between group"
                  >
                    {type}
                    {activeType === type && <div className="w-1.5 h-1.5 rounded-full bg-deep-teal-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-charcoal-blue-500/5 overflow-hidden border border-ash-grey-700/30 animate-in fade-in duration-700">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-charcoal-blue-700 border-b border-ash-grey-800">
              <th className="px-10 py-7 font-black opacity-40">Report Name & ID</th>
              <th className="px-6 py-7 font-black opacity-40">Category</th>
              <th className="px-6 py-7 font-black opacity-40">Date Generated</th>
              <th className="px-6 py-7 font-black opacity-40">Status</th>
              <th className="px-10 py-7 font-black opacity-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ash-grey-800/10">
            {filteredReports.map((report, i) => (
              <tr key={i} className="group hover:bg-ash-grey-900/40 transition-all duration-300 animate-in slide-in-from-top-2" style={{ animationDelay: `${i * 50}ms` }}>
                <td className="px-10 py-6">
                  <h4 className="font-black text-dark-slate-grey-500 leading-tight uppercase tracking-tight">{report.name}</h4>
                  <p className="text-[10px] text-charcoal-blue-700 font-black opacity-40 mt-1 tracking-widest">{report.id}</p>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${
                    report.type === 'Clinical' ? 'bg-blue-100 text-blue-600' :
                    report.type === 'Administrative' ? 'bg-ash-grey-700/20 text-charcoal-blue-600' :
                    report.type === 'Inventory' ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {report.category}
                  </span>
                </td>
                <td className="px-6 py-6 font-black text-[11px] text-charcoal-blue-700 uppercase tracking-wider opacity-60">
                  {report.date}
                </td>
                <td className="px-6 py-6">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${report.statusColor}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${report.dotColor} animate-pulse`}></div>
                      {report.status}
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => setViewReportDetails(report)}
                        className="p-2.5 bg-white border border-ash-grey-700 text-charcoal-blue-700 hover:text-deep-teal-500 hover:border-deep-teal-500 rounded-xl transition-all shadow-sm"
                      >
                          <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2.5 bg-white border border-ash-grey-700 text-charcoal-blue-700 hover:text-deep-teal-500 hover:border-deep-teal-500 rounded-xl transition-all shadow-sm">
                          <Download className="h-4 w-4" />
                      </button>
                  </div>
                  {/* Fallback indicator */}
                  <div className="flex justify-end group-hover:hidden">
                      < MoreVertical className="h-4 w-4 text-ash-grey-400 opacity-50" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-10 py-7 flex items-center justify-between bg-ash-grey-900/30 border-t border-ash-grey-800/10">
          <p className="text-[10px] font-black text-charcoal-blue-700 opacity-30 uppercase tracking-widest">
              Showing <span className="text-dark-slate-grey-500 opacity-100 font-black">1 to {filteredReports.length}</span> of <span className="text-dark-slate-grey-500 opacity-100 font-black">24</span> entries
          </p>
          <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 text-[10px] font-black bg-white border border-ash-grey-700 text-charcoal-blue-700 rounded-xl hover:bg-ash-grey-900 transition-all uppercase tracking-widest disabled:opacity-20" disabled>Previous</button>
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center bg-dark-slate-grey-500 text-white rounded-xl text-xs font-black shadow-xl shadow-dark-slate-grey-500/20">1</button>
                <button className="w-10 h-10 flex items-center justify-center bg-white border border-ash-grey-700 text-dark-slate-grey-500 rounded-xl text-xs font-black hover:bg-ash-grey-900 transition-all">2</button>
              </div>
              <button className="px-5 py-2.5 text-[10px] font-black bg-white border border-ash-grey-700 text-charcoal-blue-700 rounded-xl hover:bg-ash-grey-900 transition-all uppercase tracking-widest">Next</button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 pb-12">
        {metrics.map((metric, i) => (
          <div key={i} className="group bg-ash-grey-900/30 border border-ash-grey-700/20 rounded-[40px] p-10 hover:bg-white hover:shadow-2xl hover:shadow-charcoal-blue-500/5 transition-all duration-700 flex flex-col items-center text-center">
            <div className="bg-white p-5 rounded-[24px] w-fit mb-8 shadow-sm group-hover:scale-110 group-hover:bg-ash-grey-900/40 transition-all duration-700 border border-ash-grey-800/20">
                <metric.icon className="h-7 w-7 text-dark-slate-grey-500" />
            </div>
            <p className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest mb-3 opacity-40">{metric.title}</p>
            <h3 className="text-4xl font-black text-dark-slate-grey-500 mb-5 tracking-tighter leading-none">{metric.mainValue}</h3>
            <p className="text-[11px] font-bold text-charcoal-blue-700 leading-relaxed opacity-60 italic max-w-[200px]">{metric.desc}</p>
          </div>
        ))}
      </div>

      {/* Generate Report Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="System Report Generation">
        <div className="space-y-6">
          <div className="bg-ash-grey-900/40 p-8 rounded-[40px] border border-ash-grey-800/20">
            <h4 className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mb-6">Select Parameters</h4>
            <div className="space-y-4">
              {['Full Clinical Audit', 'Inventory Turnover', 'Staff Attendance', 'Financial Summary'].map(p => (
                <div key={p} className="flex items-center justify-between p-4 bg-white border border-ash-grey-800 rounded-2xl">
                  <span className="text-xs font-bold text-dark-slate-grey-500">{p}</span>
                  <div className="w-5 h-5 rounded-md border-2 border-ash-grey-700" />
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setIsAddModalOpen(false)} className="w-full py-5 bg-dark-slate-grey-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-dark-slate-grey-500/20 active:scale-95 transition-all">Compile Report</button>
        </div>
      </Modal>

      {/* View Report Modal */}
      <Modal 
        isOpen={!!viewReportDetails} 
        onClose={() => setViewReportDetails(null)} 
        title="Medical Archive Preview"
      >
        {viewReportDetails && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-dark-slate-grey-500 leading-none">{viewReportDetails.name}</h3>
                <p className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mt-2">{viewReportDetails.id} • Generated on {viewReportDetails.date}</p>
              </div>
              <div className={`p-4 rounded-2xl ${viewReportDetails.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-ash-grey-800 text-charcoal-blue-500'}`}>
                 {viewReportDetails.status === 'Completed' ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
              </div>
            </div>

            <div className="bg-ash-grey-900/10 p-8 rounded-[40px] border border-ash-grey-800/20 space-y-6">
              <h4 className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40">Validation Checklist</h4>
              <div className="space-y-4">
                 {[
                   'HIPAA Compliance Verified',
                   'Chief Physician Signature (Digital)',
                   'Data Integrity Hash: #0x92f...a1',
                   'Encryption (AES-256) Active'
                 ].map((check, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-deep-teal-500 rounded-md flex items-center justify-center">
                         <div className="w-2 h-1 border-b-2 border-l-2 border-white -rotate-45 mb-0.5" />
                      </div>
                      <span className="text-[13px] font-bold text-dark-slate-grey-500">{check}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="py-4 bg-ash-grey-900 font-black text-[10px] uppercase tracking-widest text-charcoal-blue-700 rounded-2xl hover:bg-ash-grey-800 transition-colors">Download PDF</button>
               <button className="py-4 bg-dark-slate-grey-500 font-black text-[10px] uppercase tracking-widest text-white rounded-2xl shadow-xl shadow-dark-slate-grey-500/10 hover:bg-black transition-all">Secure Share</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
