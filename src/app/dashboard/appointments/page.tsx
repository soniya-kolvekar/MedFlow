"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Modal from '@/components/ui/Modal';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  MapPin, 
  Check, 
  X, 
  MoreVertical,
  ChevronDown,
  Activity,
  Shield,
  Stethoscope,
  Trash2
} from 'lucide-react';

const scheduleData = [
  { time: '08:00 AM', patient: 'Sarah Jenkins', type: 'Consultation', color: 'bg-blue-500' },
  { time: '09:30 AM', patient: 'Marcus Thorne', type: 'MRI Review', color: 'bg-deep-teal-500' },
  { time: '11:00 AM', patient: 'Linda Blair', type: 'Follow-up', color: 'bg-orange-500' },
];

const initialRequests = [
  { id: '1', patient: 'Robert Wilson', age: '67', type: 'Cardiology', time: '10:30 AM', message: 'Experiencing mild chest discomfort since yesterday.' },
  { id: '2', patient: 'Emma Watson', age: '24', type: 'General', time: '02:15 PM', message: 'Regular health checkup and blood work.' },
];

export default function AppointmentsPage() {
  const [activeView, setActiveView] = useState('Weekly');
  const [requests, setRequests] = useState(initialRequests);
  const [activeDept, setActiveDept] = useState('All Departments');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<any>(null);

  const handleAction = (id: string, action: 'accept' | 'decline') => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="flex gap-8 pb-12">
        {/* Main Calendar View */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tight">Schedules</h1>
              <p className="text-charcoal-blue-700 mt-2 font-medium">Manage your weekly appointments and consultations</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3.5 rounded-2xl hover:bg-charcoal-blue-600 transition-all shadow-xl shadow-dark-slate-grey-500/10 active:scale-95 group"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
              <span className="font-black">New Appointment</span>
            </button>
          </div>

          {/* Calendar Controls */}
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-4 border border-white/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronLeft className="h-5 w-5 text-charcoal-blue-700" /></button>
                <h2 className="text-xl font-black text-dark-slate-grey-500 min-w-[180px] text-center">October 21 - 27, 2024</h2>
                <button className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronRight className="h-5 w-5 text-charcoal-blue-700" /></button>
              </div>
              <div className="h-8 w-[1px] bg-ash-grey-700/50 hidden md:block"></div>
              <div className="relative">
                <button 
                  onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-ash-grey-700/50 text-dark-slate-grey-500 rounded-2xl text-sm font-bold shadow-sm active:scale-95 transition-all hover:bg-ash-grey-900"
                >
                    {activeDept}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDeptDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-[24px] shadow-2xl border border-ash-grey-700/30 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {['All Departments', 'Emergency', 'Cardiology', 'Neurology', 'Pediatrics'].map((dept) => (
                      <button 
                        key={dept}
                        onClick={() => {
                          setActiveDept(dept);
                          setIsDeptDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-3.5 text-xs font-bold text-charcoal-blue-700 hover:bg-ash-grey-900 transition-colors"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex p-1 bg-ash-grey-800/50 rounded-2xl">
              {['Monthly', 'Weekly', 'Daily'].map((view) => (
                <button 
                  key={view} 
                  onClick={() => setActiveView(view)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                    activeView === view 
                    ? 'bg-white text-dark-slate-grey-500 shadow-sm' 
                    : 'text-charcoal-blue-700 hover:text-dark-slate-grey-500'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Grid */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-charcoal-blue-500/5 border border-ash-grey-700/30 overflow-hidden animate-in fade-in duration-700">
            <div className="grid grid-cols-8 border-b border-ash-grey-800">
              <div className="p-6 border-r border-ash-grey-800 bg-ash-grey-900/30"></div>
              {['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'].map((day, i) => (
                <div key={i} className={`p-6 text-center border-r border-ash-grey-800 last:border-0 ${day.includes('23') ? 'bg-deep-teal-500/5' : ''}`}>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${day.includes('23') ? 'text-deep-teal-500' : 'text-charcoal-blue-700 opacity-60'}`}>{day.split(' ')[0]}</span>
                  <p className={`text-lg font-black mt-1 ${day.includes('23') ? 'text-deep-teal-600' : 'text-dark-slate-grey-500'}`}>{day.split(' ')[1]}</p>
                </div>
              ))}
            </div>
            
            <div className="relative h-[600px] overflow-y-auto">
              {/* Current Time Indicator */}
              <div className="absolute top-[180px] left-0 right-0 z-10 flex items-center pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
                <div className="flex-1 h-[1px] bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              </div>

              {/* Time Slots */}
              {[8, 9, 10, 11, 12].map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-ash-grey-800/10 h-32 group">
                  <div className="p-4 border-r border-ash-grey-800/10 text-[10px] font-black text-charcoal-blue-700 opacity-40 text-right pr-6 uppercase tracking-widest bg-ash-grey-900/10 group-hover:bg-ash-grey-900/30 transition-colors">
                    {hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                  </div>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div key={day} className="border-r border-ash-grey-800/10 last:border-0 p-2 relative hover:bg-ash-grey-900/20 transition-colors group/cell">
                      {hour === 9 && day === 3 && (
                         <div className="absolute inset-2 bg-deep-teal-500 text-white p-4 rounded-[28px] shadow-xl shadow-deep-teal-500/20 z-20 hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden border border-white/20">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">09:30 - 10:45</p>
                            <h4 className="font-black text-sm mt-1 truncate">Marcus Thorne</h4>
                            <p className="text-[10px] font-bold opacity-70 truncate uppercase tracking-wider">MRI Review</p>
                         </div>
                      )}
                      {hour === 8 && day === 1 && (
                         <div className="absolute inset-2 bg-blue-500 text-white p-4 rounded-[28px] shadow-xl shadow-blue-500/20 z-20 hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden border border-white/20">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">08:00 - 09:15</p>
                            <h4 className="font-black text-sm mt-1 truncate">Sarah Jenkins</h4>
                            <p className="text-[10px] font-bold opacity-70 truncate uppercase tracking-wider">Consultation</p>
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-[380px] space-y-8 hidden xl:block">
          {/* Today's Schedule */}
          <section className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 border border-white/40 shadow-xl shadow-charcoal-blue-500/5">
            <h3 className="text-xl font-black text-dark-slate-grey-500 mb-8 flex items-center justify-between uppercase tracking-tighter">
              Today's Schedule
              <Calendar className="h-5 w-5 text-deep-teal-500" />
            </h3>
            <div className="space-y-8">
              {scheduleData.map((item, i) => (
                <div key={i} className="flex gap-5 group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-black text-dark-slate-grey-500 uppercase tracking-widest">{item.time.split(' ')[0]}</div>
                    <div className="h-full w-[2px] bg-ash-grey-800 my-2 relative">
                         <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white ${item.color}`}></div>
                    </div>
                  </div>
                  <div className="pb-4">
                    <h4 className="font-black text-dark-slate-grey-500 group-hover:text-deep-teal-600 transition-colors uppercase tracking-tight">{item.patient}</h4>
                    <p className="text-[10px] text-charcoal-blue-700 font-black uppercase tracking-widest opacity-40 mt-1">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-8 bg-dark-slate-grey-500 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-dark-slate-grey-500/20 group">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Upgrade to Pro</p>
                    <h4 className="text-xl font-black mb-6 leading-tight">Unlock Advanced Analytics & AI Assistant</h4>
                    <button className="w-full bg-white text-dark-slate-grey-500 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ash-grey-900 transition-all active:scale-95">Get Pro Now</button>
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          </section>

          {/* Pending Requests */}
          <section className="bg-ash-grey-900/40 rounded-[40px] p-8 border border-ash-grey-700/30">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-dark-slate-grey-500 uppercase tracking-tighter">Pending Requests</h3>
              <span className="bg-white text-deep-teal-600 text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-sm">{requests.length}</span>
            </div>

            <div className="space-y-6">
              {requests.map((req) => (
                <div key={req.id} className="bg-white p-6 rounded-[32px] shadow-lg shadow-charcoal-blue-500/5 border border-ash-grey-700/20 group animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-ash-grey-800 flex items-center justify-center border border-white/50">
                        <User className="h-5 w-5 text-charcoal-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-black text-dark-slate-grey-500 text-sm italic">{req.patient}, {req.age}</h4>
                        <p className="text-[9px] text-charcoal-blue-700 font-black uppercase tracking-widest mt-0.5">{req.type} • {req.time}</p>
                      </div>
                    </div>
                    <button className="text-charcoal-blue-700 opacity-20 hover:opacity-100 transition-opacity"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                  <p className="text-[11px] text-charcoal-blue-700 leading-relaxed opacity-60 line-clamp-2 italic mb-6">"{req.message}"</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleAction(req.id, 'decline')}
                      className="flex items-center justify-center gap-2 py-3.5 bg-ash-grey-900 hover:bg-red-50 hover:text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                      <X className="h-3.5 w-3.5" /> Decline
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'accept')}
                      className="flex items-center justify-center gap-2 py-3.5 bg-dark-slate-grey-500 text-white hover:bg-deep-teal-500 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-deep-teal-500/20 active:scale-95"
                    >
                      <Check className="h-3.5 w-3.5" /> Accept
                    </button>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="py-12 text-center text-charcoal-blue-700 font-black uppercase tracking-widest text-[10px] opacity-30 italic">
                  All requests processed.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      {/* New Appointment Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Schedule New Consultation">
        <div className="space-y-6">
          <div className="p-8 bg-ash-grey-900/30 rounded-[32px] border border-ash-grey-800/20">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-deep-teal-500 flex items-center justify-center text-white">
                   <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-dark-slate-grey-500">Booking Engine</h4>
                  <p className="text-[10px] text-charcoal-blue-700 font-black uppercase tracking-widest opacity-40">Select Date & Time Slot</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-ash-grey-800 rounded-2xl">
                   <span className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest block mb-2 opacity-30">Date</span>
                   <p className="text-xs font-bold text-dark-slate-grey-500">Oct 24, 2024</p>
                </div>
                <div className="p-4 bg-white border border-ash-grey-800 rounded-2xl">
                   <span className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest block mb-2 opacity-30">Time</span>
                   <p className="text-xs font-bold text-dark-slate-grey-500">10:00 AM</p>
                </div>
             </div>
          </div>
          <button onClick={() => setIsAddModalOpen(false)} className="w-full py-5 bg-dark-slate-grey-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-dark-slate-grey-500/20 active:scale-95 transition-all">Confirm Booking</button>
        </div>
      </Modal>

      {/* View Appointment Details Modal */}
      <Modal 
        isOpen={!!selectedAppointmentDetails} 
        onClose={() => setSelectedAppointmentDetails(null)} 
        title="Consultation Insights"
      >
        {selectedAppointmentDetails && (
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-[24px] bg-ash-grey-800 flex items-center justify-center text-deep-teal-500 border-2 border-white shadow-sm">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-dark-slate-grey-500 leading-none">{selectedAppointmentDetails.patient}</h3>
                <p className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mt-2">{selectedAppointmentDetails.type} • {selectedAppointmentDetails.time}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-ash-grey-900/10 p-6 rounded-[32px] border border-ash-grey-800/20">
                  <h4 className="text-[9px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mb-3">Vitals Check</h4>
                  <div className="flex items-end gap-2 text-deep-teal-600">
                     <span className="text-3xl font-black">98</span>
                     <span className="text-[10px] font-bold mb-1 opacity-60 uppercase">BPM</span>
                  </div>
               </div>
               <div className="bg-ash-grey-900/10 p-6 rounded-[32px] border border-ash-grey-800/20">
                  <h4 className="text-[9px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mb-3">Priority</h4>
                  <div className="flex items-center gap-2 text-red-500">
                     <Activity className="h-5 w-5" />
                     <span className="text-lg font-black uppercase tracking-tighter">High</span>
                  </div>
               </div>
            </div>

            <div className="bg-dark-slate-grey-500 p-8 rounded-[40px] text-white">
               <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6 font-medium">Medical Timeline</h4>
               <div className="space-y-6">
                  {[
                    { t: '09:00 AM', m: 'Patient admitted to observation' },
                    { t: '09:15 AM', m: 'Vitals recorded by RN' },
                    { t: '09:30 AM', m: 'MRI Scan initiated' }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                       <span className="text-[9px] font-black opacity-40 whitespace-nowrap">{step.t}</span>
                       <p className="text-xs font-bold leading-tight">{step.m}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex gap-4">
               <button className="flex-1 py-4 bg-ash-grey-900 text-charcoal-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-widest">Reschedule</button>
               <button onClick={() => setSelectedAppointmentDetails(null)} className="flex-1 py-4 bg-white border-2 border-ash-grey-800 text-dark-slate-grey-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
