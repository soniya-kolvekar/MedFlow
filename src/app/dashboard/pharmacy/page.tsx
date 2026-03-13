"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { usePatients, Patient } from '@/hooks/usePatients';
import { useInventory } from '@/hooks/useInventory';
import { seedDatabase } from '@/lib/seed';
import Modal from '@/components/ui/Modal';
import PatientForm from '@/components/forms/PatientForm';
import { 
  Plus, 
  ChevronRight, 
  MoreHorizontal, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Package,
  Truck,
  Search,
  Trash2,
  Database,
  Loader2,
  ChevronDown,
  User,
  History,
  ClipboardList,
  Activity
} from 'lucide-react';

export default function PharmacyDashboard() {
  const { patients, loading: loadingPatients } = usePatients();
  const { inventory, loading: loadingInventory } = useInventory();
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [showFullInventory, setShowFullInventory] = useState(false);
  const [activeDeptFilter, setActiveDeptFilter] = useState('All Departments');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  // Set initial selection when data loads
  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedDatabase();
    setIsSeeding(false);
  };

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  if (loadingPatients || loadingInventory) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="h-12 w-12 text-deep-teal-500 animate-spin" />
          <p className="text-charcoal-blue-700 font-bold animate-pulse">Syncing Pharmacy Records...</p>
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
            <h1 className="text-4xl font-bold text-dark-slate-grey-500">Pharmacy Dashboard</h1>
            <p className="text-charcoal-blue-700 mt-2 font-medium">
              Live database connected. <span className="font-semibold text-deep-teal-500">{patients.length} active prescriptions</span> and <span className="font-semibold text-red-500">{inventory.filter(i => i.stock < i.threshold).length} alerts</span>.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="flex items-center gap-2 bg-ash-grey-900 text-charcoal-blue-700 px-6 py-3 rounded-xl hover:bg-ash-grey-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <Database className={`h-4 w-4 ${isSeeding ? 'animate-spin' : ''}`} />
              <span className="font-semibold">{isSeeding ? 'Seeding...' : 'Seed Live Data'}</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3 rounded-xl hover:bg-dark-slate-grey-600 transition-all shadow-lg shadow-dark-slate-grey-500/10 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              <span className="font-semibold">New Entry</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Prescriptions and Processing (8 cols) */}
          <div className="col-span-8 space-y-8">
            
            {/* Incoming Prescriptions */}
            <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-dark-slate-grey-500">Incoming Prescriptions</h2>
                  <span className="bg-ash-grey-500/20 text-deep-teal-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">12 New</span>
                </div>
                <button 
                  onClick={() => setShowAllPatients(true)}
                  className="text-sm font-semibold text-deep-teal-500 hover:underline active:scale-95 transition-transform"
                >
                  View All
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {['All Units', 'Cardiology', 'Neurology', 'Pediatrics', 'Emergency'].map((dept) => (
                    <button 
                      key={dept}
                      onClick={() => setActiveDeptFilter(dept === 'All Units' ? 'All Departments' : dept)}
                      className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 border rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
                        (activeDeptFilter === dept || (dept === 'All Units' && activeDeptFilter === 'All Departments'))
                        ? 'bg-deep-teal-500 text-white border-transparent shadow-lg shadow-deep-teal-500/20' 
                        : 'bg-white border-ash-grey-700/30 text-charcoal-blue-700 hover:bg-ash-grey-900'
                      }`}
                    >
                      {dept}
                      {dept !== 'All Units' && <ChevronDown className="h-3 w-3 opacity-30" />}
                    </button>
                  ))}
                  
                  <div className="h-8 w-[1px] bg-ash-grey-700/30 mx-2" />
                  
                  <button 
                    onClick={() => setActiveStatusFilter(activeStatusFilter === 'Urgent' ? 'All' : 'Urgent')}
                    className={`whitespace-nowrap px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                      activeStatusFilter === 'Urgent' 
                      ? 'bg-red-500 text-white border-transparent' 
                      : 'bg-ash-grey-900/40 border-ash-grey-700/30 text-charcoal-blue-600 hover:bg-white'
                    }`}
                  >
                    Urgent Only
                  </button>
                </div>

                <div className="relative group min-w-[300px]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-charcoal-blue-700 opacity-30 group-focus-within:text-deep-teal-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient..." 
                    className="w-full bg-white border border-ash-grey-700/30 rounded-2xl py-2.5 pl-11 text-xs text-dark-slate-grey-500 focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all placeholder:text-charcoal-blue-700/30 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {patients
                  .filter(p => activeDeptFilter === 'All Departments' || p.dept === activeDeptFilter)
                  .filter(p => {
                    if (activeStatusFilter === 'All') return true;
                    if (activeStatusFilter === 'Urgent') return p.priority === 'Urgent';
                    if (activeStatusFilter === 'New Today') {
                      const today = new Date().toLocaleDateString();
                      let patientDate = today;
                      if (p.createdAt) {
                        if (typeof p.createdAt === 'object' && 'toDate' in p.createdAt) {
                          patientDate = (p.createdAt as any).toDate().toLocaleDateString();
                        } else if (typeof p.createdAt === 'string') {
                          patientDate = new Date(p.createdAt).toLocaleDateString();
                        }
                      }
                      return patientDate === today;
                    }
                    if (activeStatusFilter === 'Processing') return p.status === 'Processing' || p.status === 'In-session';
                    return true;
                  })
                  .map((patient: Patient) => {
                    const isActive = selectedPatientId === patient.id;
                  return (
                    <div 
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white border-deep-teal-500 shadow-xl shadow-deep-teal-500/5 ring-1 ring-deep-teal-500/20' 
                          : 'bg-white/40 border-transparent hover:border-ash-grey-500/50 hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-deep-teal-500 text-white' : 'bg-ash-grey-800 text-deep-teal-600'}`}>
                          <UserIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className={`font-bold transition-colors ${isActive ? 'text-dark-slate-grey-500' : 'text-dark-slate-grey-500/70'}`}>{patient.name}</h3>
                          <p className="text-[11px] text-charcoal-blue-700">ID: {patient.id} • Dr. {patient.id === '2' ? 'Sarah Chen' : 'James Wilson'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase tracking-tighter text-charcoal-blue-700 mb-1.5 opacity-60">Items</span>
                          <div className="flex -space-x-1">
                            {patient.items?.map((item: any, i: number) => (
                              <div key={i} className="h-6 w-6 rounded-full bg-deep-teal-500/20 border border-white flex items-center justify-center text-[10px] font-bold text-deep-teal-600 shadow-sm">
                                {item.code}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                            patient.priority === 'Urgent' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-ash-grey-500/20 text-deep-teal-600'
                          }`}>
                            {patient.priority || 'Normal'}
                          </span>
                        </div>

                        <div className={`transition-all ${isActive ? 'text-deep-teal-500 translate-x-1' : 'text-charcoal-blue-700 group-hover:translate-x-1'}`}>
                          {isActive ? <Clock className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Processing Component */}
            <section className="bg-white rounded-[32px] p-8 shadow-2xl shadow-charcoal-blue-500/5 border border-ash-grey-700/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activePatient ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-dark-slate-grey-500 flex items-center gap-3">
                        Processing: {activePatient.name}
                      </h2>
                      <p className="text-sm text-charcoal-blue-700 mt-1 font-medium">Verify stock level and fill prescription.</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-2.5 rounded-xl border-2 border-ash-grey-700/50 font-bold text-charcoal-blue-500 hover:bg-ash-grey-900 transition-colors active:scale-95">On Hold</button>
                      <button className="px-6 py-2.5 rounded-xl bg-dark-slate-grey-500 text-white font-bold hover:bg-charcoal-blue-600 transition-all shadow-lg shadow-dark-slate-grey-500/10 active:scale-95">Mark Complete</button>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-charcoal-blue-700 border-b border-ash-grey-800">
                          <th className="text-left pb-4 font-black">Medicine Name</th>
                          <th className="text-left pb-4 font-black">Dosage</th>
                          <th className="text-left pb-4 font-black">Availability</th>
                          <th className="text-right pb-4 font-black">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ash-grey-800/50">
                        {activePatient?.items?.map((med: any, i: number) => (
                          <tr key={i} className="group hover:bg-ash-grey-900/40 transition-colors">
                            <td className="py-5">
                              <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-8 rounded-full ${med.color}`}></div>
                                <span className="font-bold text-dark-slate-grey-500">{med.name}</span>
                              </div>
                            </td>
                            <td className="py-5 text-sm font-medium text-charcoal-blue-600">{med.dosage}</td>
                            <td className="py-5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-charcoal-blue-500">{med.qty}</span>
                                {med.status.includes('Stock') ? (
                                  <div className="flex items-center gap-1 text-[9px] font-black tracking-widest uppercase text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {med.status}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-[9px] font-black tracking-widest uppercase text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                                    <AlertCircle className="h-3 w-3" />
                                    {med.status}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-5 text-right">
                              <button className="p-2 text-charcoal-blue-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all group-hover:scale-110">
                                {med.status.includes('Low') ? (
                                  <span className="text-[10px] font-black border border-red-500 px-3 py-1.5 rounded-lg text-red-500 bg-red-50">REORDER NOW</span>
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Package className="h-12 w-12 text-ash-grey-500/50" />
                  <p className="text-charcoal-blue-700 font-bold opacity-60">No pending prescriptions selected.</p>
                  <p className="text-xs text-charcoal-blue-700/50">Click "Seed Live Data" to populate records if database is empty.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Availability, Inventory, Deliveries (4 cols) */}
          <div className="col-span-4 space-y-8">
            
            {/* Availability Check */}
            <section className="bg-dark-slate-grey-500 rounded-[32px] p-8 text-white shadow-xl shadow-dark-slate-grey-500/20">
              <h3 className="text-xl font-bold mb-2">Availability Check</h3>
              <p className="text-ash-grey-500 text-xs mb-6 font-medium">Quickly verify stock levels across storage.</p>
              
              <div className="relative group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${searchQuery ? 'text-white' : 'text-ash-grey-400'}`} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Generic Name..." 
                  className="w-full h-12 bg-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-ash-grey-500 border border-white/10 transition-all font-medium"
                />
              </div>
            </section>

            {/* Inventory Status */}
            <section className="bg-ash-grey-500/10 backdrop-blur-sm rounded-[32px] p-8 border border-white/40 shadow-xl shadow-charcoal-blue-500/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-dark-slate-grey-500">Inventory Status</h3>
                <button className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-charcoal-blue-700" />
                </button>
              </div>

              <div className="space-y-6">
                {inventory.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any, i: number) => {
                  const pct = Math.min(100, (item.stock / item.threshold) * 50); // Scale for UI
                  const color = item.status === 'Critical' ? 'bg-red-500' : item.status === 'Low Stock' ? 'bg-orange-500' : 'bg-green-500';
                  return (
                    <div key={i} className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-sm text-dark-slate-grey-500">{item.name}</span>
                        <span className="text-[11px] font-black text-charcoal-blue-700">{item.stock} Units</span>
                      </div>
                      <div className="h-2 w-full bg-ash-grey-700/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      {item.status !== 'Available' && (
                        <p className="text-[9px] font-black text-red-600 tracking-widest flex items-center gap-1 uppercase">
                          <AlertCircle className="h-3 w-3" /> {item.status}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowFullInventory(true)}
                className="w-full mt-8 py-4 rounded-2xl border-2 border-ash-grey-700 text-charcoal-blue-700 font-black text-xs tracking-widest uppercase hover:bg-ash-grey-900 transition-all active:scale-95"
              >
                Full Inventory Report
              </button>
            </section>

            {/* Upcoming Deliveries */}
            <section className="bg-ash-grey-500/10 backdrop-blur-sm rounded-[32px] p-8 border border-white/40">
              <h3 className="text-xl font-bold text-dark-slate-grey-500 mb-6 tracking-tight">Upcoming Deliveries</h3>
              <div className="space-y-4">
                {[
                  { name: 'PharmaLogix Logistics', eta: 'Today, 2:45 PM', icon: Truck },
                  { name: 'Global Med Supplies', eta: 'Tomorrow, 9:00 AM', icon: Package }
                ].map((delivery, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/40 p-4 rounded-2xl border border-transparent hover:border-ash-grey-700/50 hover:bg-white hover:shadow-lg hover:shadow-charcoal-blue-500/5 transition-all cursor-pointer group">
                    <div className="h-10 w-10 rounded-xl bg-ash-grey-500/30 flex items-center justify-center text-deep-teal-600 group-hover:scale-110 transition-transform">
                      <delivery.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate-grey-500">{delivery.name}</h4>
                      <p className="text-[10px] text-charcoal-blue-700 mt-0.5 font-medium">ETA: {delivery.eta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* Add Patient Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Prescription Entry">
        <PatientForm onSuccess={() => setIsAddModalOpen(false)} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View All Patients Modal */}
      <Modal isOpen={showAllPatients} onClose={() => setShowAllPatients(false)} title="Incoming Prescription History">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
             {['Recent', 'Critical', 'Completed', 'Archived'].map(f => (
               <button key={f} className="py-2 bg-ash-grey-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-charcoal-blue-700 hover:bg-ash-grey-800 transition-colors">
                 {f}
               </button>
             ))}
          </div>
          <div className="space-y-3">
            {patients.map((p: Patient) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-ash-grey-800 rounded-2xl hover:bg-ash-grey-900/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-deep-teal-500/10 flex items-center justify-center text-deep-teal-600 font-bold text-xs">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-dark-slate-grey-500">{p.name}</h5>
                    <p className="text-[10px] text-charcoal-blue-700 opacity-60">ID: {p.id} • {p.dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${p.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {p.priority || 'Normal'}
                  </span>
                  <ChevronRight className="h-4 w-4 text-ash-grey-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Full Inventory Modal */}
      <Modal isOpen={showFullInventory} onClose={() => setShowFullInventory(false)} title="Full Hospital Inventory Analytics">
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-dark-slate-grey-500 p-6 rounded-[28px] text-white overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Global Inventory Health</h4>
              <p className="text-3xl font-black">Stable — 94%</p>
            </div>
            <Activity className="absolute right-[-10px] bottom-[-20px] h-32 w-32 text-white/5 opacity-20" />
          </div>
          
          <div className="overflow-hidden border border-ash-grey-800 rounded-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-ash-grey-900/50 text-[10px] font-black uppercase tracking-widest text-charcoal-blue-700">
                  <th className="px-6 py-4">Medication</th>
                  <th className="px-6 py-4 text-center">In Stock</th>
                  <th className="px-6 py-4 text-center">Batch ID</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash-grey-800">
                {inventory.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-ash-grey-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-bold text-dark-slate-grey-500">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-charcoal-blue-700">{item.stock}</td>
                    <td className="px-6 py-4 text-center text-[10px] font-black text-ash-grey-500 uppercase">#B-88712</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        item.status === 'Available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    </svg>
  );
}
