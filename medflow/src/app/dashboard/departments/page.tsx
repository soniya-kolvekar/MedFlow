"use client";

import { useState } from 'react';
import { useDepartments } from '@/hooks/useDepartments';
import Modal from '@/components/ui/Modal';
import { 
  Building2, 
  Plus,
  Search,
  Users,
  ClipboardList,
  ChevronDown,
  Loader2,
  Activity,
  Shield,
  Layers
} from 'lucide-react';

export default function DepartmentsPage() {
  const { departments, loading, iconMap } = useDepartments();
  const [activeCategory, setActiveCategory] = useState('All Departments');
  const [activeStatus, setActiveStatus] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeptDetails, setSelectedDeptDetails] = useState<any>(null);

  const filteredDepts = departments.filter(dept => {
    const matchesCategory = activeCategory === 'All Departments' || dept.category === activeCategory;
    const matchesStatus = activeStatus === 'All' || 
                         (activeStatus === 'Active Only' && dept.status === 'Active') ||
                         (activeStatus === 'Critical Load' && dept.status === 'Critical') ||
                         (activeStatus === 'Staffing Highlights' && dept.pending > 40);
    return matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-deep-teal-500 animate-spin" />
        <p className="text-charcoal-blue-700 font-bold animate-pulse">Syncing Hospital Units...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tight">Hospital Departments</h1>
          <p className="text-charcoal-blue-700 mt-2 font-medium">Real-time status and resource overview across all units.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3.5 rounded-2xl hover:bg-charcoal-blue-500 transition-all shadow-xl shadow-dark-slate-grey-500/10 active:scale-95 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          <span className="font-bold">New Department</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-6 py-3.5 bg-white border border-ash-grey-700/50 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all hover:bg-ash-grey-900 active:scale-95 shadow-sm"
          >
            <Layers className="h-4 w-4 text-deep-teal-500" />
            {activeCategory}
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-[32px] shadow-2xl border border-ash-grey-700/30 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {['All Departments', 'Clinical', 'Diagnostic', 'Administrative'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 text-xs font-bold text-charcoal-blue-700 hover:bg-ash-grey-900 transition-colors flex items-center justify-between group"
                >
                  {cat}
                  {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-deep-teal-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
        {['All', 'Active Only', 'Critical Load', 'Staffing Highlights'].map((f) => (
          <button 
            key={f} 
            onClick={() => setActiveStatus(f)}
            className={`px-6 py-3.5 border rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
              activeStatus === f 
              ? 'bg-white border-ash-grey-700 text-dark-slate-grey-500 shadow-sm' 
              : 'bg-ash-grey-900/40 border-transparent text-charcoal-blue-600 hover:bg-white hover:border-ash-grey-700/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDepts.map((dept, i) => {
          const IconComponent = iconMap[dept.iconName] || Building2;
          return (
            <div key={i} className="group bg-white rounded-[40px] border border-ash-grey-700/20 shadow-xl shadow-charcoal-blue-500/5 hover:shadow-2xl hover:shadow-charcoal-blue-500/10 transition-all duration-500 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
              {/* Card Top */}
              <div className="p-8 pb-4 flex flex-col items-center text-center flex-1">
                <div className="w-full flex justify-end mb-4">
                  <div className={`px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${dept.statusColor}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    {dept.status}
                  </div>
                </div>
                
                <div className={`p-6 rounded-[28px] mb-8 group-hover:rotate-[360deg] transition-transform duration-1000 ${dept.iconBg} shadow-sm`}>
                  <IconComponent className="h-10 w-10" />
                </div>

              <h3 className="text-xl font-black text-dark-slate-grey-500 mb-1 leading-tight">{dept.name}</h3>
              <p className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mb-8">{dept.type}</p>

              <div className="grid grid-cols-2 w-full gap-4 border-t border-ash-grey-800/20 pt-8 mt-auto">
                <div className="text-left">
                  <p className="text-[9px] font-black text-charcoal-blue-700 uppercase tracking-widest mb-1.5 opacity-40">Staff Count</p>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-ash-grey-800/50 rounded-lg">
                      <Users className="h-3.5 w-3.5 text-charcoal-blue-500" />
                    </div>
                    <span className="text-sm font-black text-dark-slate-grey-500 tracking-tight">{dept.staff}</span>
                  </div>
                </div>
                <div className="text-left pl-5 border-l border-ash-grey-800/20">
                  <p className="text-[9px] font-black text-charcoal-blue-700 uppercase tracking-widest mb-1.5 opacity-40">Pending</p>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-ash-grey-800/50 rounded-lg">
                      <ClipboardList className="h-3.5 w-3.5 text-charcoal-blue-500" />
                    </div>
                    <span className={`text-sm font-black tracking-tight ${dept.pending > 30 ? 'text-red-500' : 'text-dark-slate-grey-500'}`}>{dept.pending}</span>
                  </div>
                </div>
              </div>
            </div>

              <div className="px-8 pb-8">
                <button 
                  onClick={() => setSelectedDeptDetails(dept)}
                  className="w-full py-4 bg-ash-grey-900/50 hover:bg-dark-slate-grey-500 hover:text-white border-2 border-transparent hover:shadow-xl hover:shadow-dark-slate-grey-500/10 rounded-2xl text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest transition-all active:scale-95 leading-none"
                >
                  View Full Unit Details
                </button>
              </div>
            </div>
          );
        })}
        {filteredDepts.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <p className="text-charcoal-blue-700 font-medium opacity-50 italic">No departments found in this category.</p>
          </div>
        )}
      </div>

      {/* New Department Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Department">
        <div className="space-y-6">
          <p className="text-sm text-charcoal-blue-700 font-medium">Register a new hospital unit to begin monitoring load and resources.</p>
          <div className="p-12 border-4 border-dashed border-ash-grey-800 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
             <Building2 className="h-12 w-12 text-ash-grey-500 opacity-30" />
             <p className="text-xs font-black uppercase tracking-widest text-charcoal-blue-700 opacity-40">Department Registration Form Placeholder</p>
          </div>
          <button onClick={() => setIsAddModalOpen(false)} className="w-full py-4 bg-dark-slate-grey-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Close</button>
        </div>
      </Modal>

      {/* View Unit Details Modal */}
      <Modal 
        isOpen={!!selectedDeptDetails} 
        onClose={() => setSelectedDeptDetails(null)} 
        title={`${selectedDeptDetails?.name} Monitoring`}
      >
        {selectedDeptDetails && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-ash-grey-900/10 p-8 rounded-[40px] space-y-4">
                <h4 className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40">Real-time Load</h4>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-dark-slate-grey-500">{selectedDeptDetails.pending}</span>
                  <span className="text-xs font-bold text-charcoal-blue-700 mb-2">Requests Pending</span>
                </div>
                <div className="h-2 w-full bg-ash-grey-800 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedDeptDetails.pending > 30 ? 'bg-red-500' : 'bg-deep-teal-500'}`} style={{ width: `${Math.min(100, (selectedDeptDetails.pending / 50) * 100)}%` }} />
                </div>
              </div>
              <div className="bg-white border-2 border-ash-grey-800 p-8 rounded-[40px] space-y-4">
                <h4 className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40">Staff Allocation</h4>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-dark-slate-grey-500">{selectedDeptDetails.staff}</span>
                  <span className="text-xs font-bold text-charcoal-blue-700 mb-2">Active Personnel</span>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-ash-grey-800 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                       {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full bg-ash-grey-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-charcoal-blue-700">+{selectedDeptDetails.staff - 5}</div>
                </div>
              </div>
            </div>

            <div className="bg-dark-slate-grey-500 p-8 rounded-[40px] text-white">
               <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6 font-medium">Unit Efficiency Timeline</h4>
               <div className="h-32 flex items-end gap-2 px-2">
                  {[40, 70, 45, 90, 65, 80, 50, 85, 45, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/20 rounded-t-lg hover:bg-white/40 transition-colors" style={{ height: `${h}%` }} />
                  ))}
               </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
