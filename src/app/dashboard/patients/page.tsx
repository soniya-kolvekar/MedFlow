"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { usePatients, Patient } from '@/hooks/usePatients';
import Modal from '@/components/ui/Modal';
import PatientForm from '@/components/forms/PatientForm';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit2, 
  MoreVertical,
  ChevronDown,
  Loader2,
  Calendar,
  Activity as ActivityIcon,
  Trash2
} from 'lucide-react';

export default function PatientsPage() {
  const { patients, loading } = usePatients();
  const [activeTab, setActiveTab] = useState('All Status');
  const [activeDeptFilter, setActiveDeptFilter] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewDetailsPatient, setViewDetailsPatient] = useState<Patient | null>(null);

  const filteredPatients = (patients as Patient[]).filter((patient: Patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'All Status' || 
                      (activeTab === 'In-session' && (patient.status === 'IN-SESSION' || patient.status === 'In-session')) ||
                      (activeTab === 'Waiting' && patient.status === 'Waiting') ||
                      (activeTab === 'Discharged' && patient.status === 'Discharged');

    const matchesDept = activeDeptFilter === 'All Departments' || patient.dept === activeDeptFilter;
    
    return matchesSearch && matchesTab && matchesDept;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="h-12 w-12 text-deep-teal-500 animate-spin" />
          <p className="text-charcoal-blue-700 font-bold animate-pulse">Syncing Patient Records...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-dark-slate-grey-500">Patient Management</h1>
            <p className="text-charcoal-blue-700 mt-2 font-medium">Monitor real-time patient status and departmental flow</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3 rounded-xl hover:bg-dark-slate-grey-600 transition-all shadow-lg shadow-dark-slate-grey-500/10 group active:scale-95"
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <UserPlus className="h-4 w-4" />
            </div>
            <span className="font-semibold">Add New Patient</span>
          </button>
        </div>

        {/* Filters and Tabs */}
        <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-4 border border-white/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {['All Departments', 'Cardiology', 'Neurology', 'Pediatrics', 'Emergency'].map((dept) => (
                <button 
                  key={dept} 
                  onClick={() => setActiveDeptFilter(dept)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border ${
                    activeDeptFilter === dept 
                    ? 'bg-white border-ash-grey-700 text-dark-slate-grey-500 shadow-sm' 
                    : 'bg-transparent border-ash-grey-700/30 text-charcoal-blue-600 hover:bg-white/50'
                  }`}
                >
                  {dept}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </div>

            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash-grey-400 group-focus-within:text-deep-teal-500 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full h-11 bg-white/50 border border-ash-grey-700/30 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
             <div className="flex p-1 bg-ash-grey-800/50 rounded-2xl w-fit">
                {['All Status', 'In-session', 'Waiting', 'Discharged'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab 
                            ? 'bg-white text-dark-slate-grey-500 shadow-sm' 
                            : 'text-charcoal-blue-700 hover:text-dark-slate-grey-500'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
             </div>
             
             <div className="flex items-center gap-2">
                <button className="p-2.5 bg-white border border-ash-grey-700 text-charcoal-blue-700 rounded-xl hover:bg-ash-grey-900 transition-colors">
                    <Filter className="h-5 w-5" />
                </button>
                <div className="h-10 w-[1px] bg-ash-grey-700/50 mx-1"></div>
                <button className="p-2.5 bg-ash-grey-800 text-charcoal-blue-700 rounded-xl">
                    <Grid className="h-5 w-5" />
                </button>
                <button className="p-2.5 bg-white border border-ash-grey-700 text-dark-slate-grey-500 rounded-xl shadow-sm">
                    <List className="h-5 w-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-charcoal-blue-500/5 overflow-hidden border border-ash-grey-700/30 animate-in fade-in duration-500">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-charcoal-blue-700 border-b border-ash-grey-800">
                <th className="px-8 py-6 font-bold">Patient</th>
                <th className="px-6 py-6 font-bold">Patient ID</th>
                <th className="px-6 py-6 font-bold">Department</th>
                <th className="px-6 py-6 font-bold">Condition</th>
                <th className="px-6 py-6 font-bold">Status</th>
                <th className="px-8 py-6 font-right font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ash-grey-800/50">
              {filteredPatients.map((patient, i) => (
                <tr key={i} className="group hover:bg-ash-grey-900/40 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-top-2" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-ash-grey-800 overflow-hidden border border-white/50 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                        <img src={patient.avatar} alt={patient.name} className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-dark-slate-grey-500 leading-tight">{patient.name}</h4>
                        <p className="text-[11px] text-charcoal-blue-700 font-medium">{patient.info}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-sm text-charcoal-blue-500">{patient.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-semibold text-sm text-charcoal-blue-600">{patient.dept}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-medium text-sm text-charcoal-blue-600">{patient.cond}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        patient.status.includes('session') ? 'bg-green-100 text-green-600' :
                        patient.status.includes('Waiting') ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            patient.status.includes('session') ? 'bg-green-500' : 
                            patient.status.includes('Waiting') ? 'bg-orange-500' : 
                            'bg-blue-500'
                        }`}></div>
                        {patient.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setViewDetailsPatient(patient)}
                          className="p-2 text-charcoal-blue-700 hover:text-deep-teal-500 hover:bg-deep-teal-500/10 rounded-lg transition-all active:scale-95"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-charcoal-blue-700 hover:text-deep-teal-500 hover:bg-deep-teal-500/10 rounded-lg transition-all">
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-charcoal-blue-700 hover:text-deep-teal-500 hover:bg-deep-teal-500/10 rounded-lg transition-all">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-charcoal-blue-700 font-medium opacity-50">
                    No patients found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-8 py-6 flex items-center justify-between bg-ash-grey-900/30 border-t border-ash-grey-800">
            <p className="text-sm font-medium text-charcoal-blue-700">
                Showing <span className="text-dark-slate-grey-500 font-bold">1-10</span> of <span className="text-dark-slate-grey-500 font-bold">254</span> patients
            </p>
            <div className="flex items-center gap-2">
                <button className="p-2 text-charcoal-blue-700 hover:bg-white rounded-lg transition-colors disabled:opacity-30" disabled>
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, '...', 26].map((p, i) => (
                        <button 
                            key={i} 
                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                                p === 1 
                                ? 'bg-dark-slate-grey-500 text-white shadow-md' 
                                : 'text-charcoal-blue-700 hover:bg-white'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <button className="p-2 text-charcoal-blue-700 hover:bg-white rounded-lg transition-colors">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Patient Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Patient Record"
      >
        <PatientForm 
          onSuccess={() => {
            setIsAddModalOpen(false);
          }} 
          onCancel={() => setIsAddModalOpen(false)} 
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewDetailsPatient}
        onClose={() => setViewDetailsPatient(null)}
        title="Patient Medical Profile"
      >
        {viewDetailsPatient && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-ash-grey-900/20 rounded-[32px] border border-ash-grey-700/30">
              <div className="h-24 w-24 rounded-[32px] overflow-hidden border-4 border-white shadow-xl">
                <img src={viewDetailsPatient.avatar} alt={viewDetailsPatient.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-3xl font-black text-dark-slate-grey-500 uppercase tracking-tight">{viewDetailsPatient.name}</h4>
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    viewDetailsPatient.status.includes('session') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {viewDetailsPatient.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-charcoal-blue-700 font-bold opacity-60">
                  <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {viewDetailsPatient.info}</div>
                  <div className="w-1.5 h-1.5 rounded-full bg-ash-grey-700/50"></div>
                  <div className="flex items-center gap-1.5"><ActivityIcon className="h-4 w-4" /> {viewDetailsPatient.dept}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border-2 border-ash-grey-800 rounded-[28px] p-6 space-y-4">
                <h5 className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40">Primary Condition</h5>
                <p className="text-xl font-bold text-dark-slate-grey-500">{viewDetailsPatient.cond}</p>
                <div className="h-2 w-full bg-ash-grey-900 rounded-full overflow-hidden">
                  <div className="h-full bg-deep-teal-500 w-[65%]" />
                </div>
                <p className="text-[10px] text-charcoal-blue-700 font-bold opacity-60 italic">Stable condition, continuing observation.</p>
              </div>

              <div className="bg-ash-grey-900/10 rounded-[28px] p-6 space-y-4">
                <h5 className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40">Prescription Status</h5>
                <div className="space-y-3">
                  {viewDetailsPatient.items?.length ? viewDetailsPatient.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-ash-grey-800/50">
                      <span className="text-xs font-bold text-dark-slate-grey-500">{item.name}</span>
                      <span className="text-[9px] font-black text-deep-teal-600 uppercase tracking-widest">{item.qty}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-charcoal-blue-700 italic opacity-50">No active prescriptions.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex-1 py-4 bg-ash-grey-900 rounded-2xl font-black text-xs uppercase tracking-widest text-charcoal-blue-700 hover:bg-ash-grey-800 transition-all flex items-center justify-center gap-2">
                <Edit2 className="h-4 w-4" /> Edit Record
              </button>
              <button className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                <Trash2 className="h-4 w-4" /> Archive
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
