"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Modal from '@/components/ui/Modal';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Check, 
  X, 
  Trash2,
  Video,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Activity
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function AppointmentsPage() {
  const { role } = useAuth();
  const { 
    appointments, 
    doctors, 
    loading, 
    bookAppointment, 
    updateAppointmentStatus 
  } = useAppointments();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<any>(null);

  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    doctorName: '',
    condition: '',
    type: 'Physical' as 'Physical' | 'Virtual',
    date: '',
    time: ''
  });

  const handleBook = async () => {
    try {
      if (!bookingForm.doctorId || !bookingForm.date || !bookingForm.time) return;
      
      const selectedDoc = doctors.find(d => d.uid === bookingForm.doctorId);
      
      await bookAppointment({
        doctorId: bookingForm.doctorId,
        doctorName: selectedDoc?.name || 'Doctor',
        condition: bookingForm.condition || 'Consultation',
        type: bookingForm.type,
        requestedDate: bookingForm.date,
        requestedTime: bookingForm.time,
        notes: ''
      });
      setIsAddModalOpen(false);
      setBookingForm({ doctorId: '', doctorName: '', condition: '', type: 'Physical', date: '', time: '' });
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (a.patientName?.toLowerCase().includes(term)) || 
      (a.doctorName?.toLowerCase().includes(term)) ||
      (a.condition?.toLowerCase().includes(term));
      
    const matchesFilter = activeFilter === 'all' || a.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    pending:   { label: "Scheduled",   color: "bg-middle-green-100/30 text-dark-slate-grey-800 border-ash-grey-800", icon: Clock },
    accepted:  { label: "Confirmed",   color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
    rejected:  { label: "Declined",    color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    completed: { label: "Completed",   color: "bg-ash-grey-100 text-ash-grey-600 border-ash-grey-200", icon: Check },
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 mt-8">
        <div>
          <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tighter uppercase">
            {role === 'doctor' ? 'Patient Consultations' : 'My Appointments'}
          </h1>
          <p className="text-charcoal-blue-700 mt-2 font-medium opacity-60">
            {role === 'doctor' ? 'Manage and review your patient schedule' : 'Track your medical consultation history and status'}
          </p>
        </div>
        {role !== 'doctor' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-dark-slate-grey-500/10 active:scale-95 group"
          >
            <Plus className="h-5 w-5" />
            <span className="font-black uppercase tracking-widest text-[11px]">Request New Slot</span>
          </button>
        )}
      </div>

      {/* Search & Filters - Only for Doctors */}
      {role === 'doctor' && (
        <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-4 border border-white/40 flex flex-wrap items-center gap-4 mb-8">
          <div className="flex-1 min-w-[300px] relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-blue-700 opacity-30 group-focus-within:text-deep-teal-500" />
            <input 
              type="text" 
              placeholder="Search by name, condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ash-grey-900/30 border border-ash-grey-700/20 rounded-2xl py-4 pl-14 text-sm font-bold text-dark-slate-grey-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-deep-teal-500/5 transition-all"
            />
          </div>
          <div className="flex p-1 bg-ash-grey-800/50 rounded-2xl">
            {['all', 'pending', 'accepted', 'rejected'].map((f) => (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === f 
                  ? 'bg-white text-dark-slate-grey-500 shadow-sm' 
                  : 'text-charcoal-blue-700 opacity-40 hover:opacity-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Appointment List / Status Cards */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
            <div className="w-12 h-12 border-4 border-ash-grey-800 border-t-deep-teal-500 rounded-full animate-spin" />
            <p className="font-black text-[10px] uppercase tracking-widest">Retrieving Medical Data...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-ash-grey-700/30">
            <Calendar className="w-16 h-16 text-ash-grey-700 mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-black text-dark-slate-grey-500 opacity-40">No entries found</h3>
            <p className="text-charcoal-blue-700 mt-2 font-medium opacity-40 max-w-xs mx-auto">
              {role === 'doctor' ? 'Try adjusting your filters.' : 'You have no scheduled consultations yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAppointments.map((appt, idx) => {
                const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon || Clock;
                
                return (
                  <motion.div
                    key={appt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`group bg-white rounded-[20px] p-4 border ${appt.status === 'accepted' ? 'border-green-200 shadow-md shadow-green-500/5' : 'border-ash-grey-700/20'} hover:shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center gap-4`}
                  >
                    {/* Icon Section */}
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border border-white shadow-sm ${appt.type === 'Virtual' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      {appt.type === 'Virtual' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      {role !== 'doctor' && (
                        <div className="mb-1.5">
                          <p className={`text-[8px] font-black uppercase tracking-[0.2em] mb-0.5 ${appt.status === 'accepted' ? 'text-green-600' : appt.status === 'rejected' ? 'text-red-500' : 'text-ash-grey-600'}`}>
                            {appt.status === 'accepted' ? `ACCEPTED BY DR. ${(!appt.doctorName || String(appt.doctorName).toLowerCase().includes('undefined')) ? 'CLINICIAN' : appt.doctorName.toUpperCase()}` : appt.status === 'rejected' ? `REJECTED BY DR. ${(!appt.doctorName || String(appt.doctorName).toLowerCase().includes('undefined')) ? 'CLINICIAN' : appt.doctorName.toUpperCase()}` : 'PENDING REVIEW'}
                          </p>
                          <h4 className="text-base font-black text-dark-slate-grey-500 tracking-tight leading-none italic uppercase">
                            Booking Slot {appt.status === 'accepted' ? 'Accepted' : appt.status === 'rejected' ? 'Rejected' : 'Scheduled'}
                          </h4>
                        </div>
                      )}

                      {role === 'doctor' && (
                        <div className="mb-4">
                          <h4 className="text-2xl font-black text-dark-slate-grey-500 tracking-tight leading-none truncate uppercase italic underline decoration-deep-teal-500/20">
                            {appt.patientName}
                          </h4>
                          <span className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-current opacity-40`}>
                            {appt.type}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-charcoal-blue-700 font-bold opacity-70 text-sm">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-5 w-5 text-deep-teal-500" />
                           {appt.requestedDate}
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="h-5 w-5 text-deep-teal-500" />
                           {appt.requestedTime}
                        </div>
                        <div className="flex items-center gap-2 italic">
                           <Activity className="h-5 w-5 text-deep-teal-500" />
                           {appt.condition}
                        </div>
                      </div>

                      {/* Rejection Suggestion for all non-doctors */}
                      {appt.status === 'rejected' && role !== 'doctor' && (
                        <div className="mt-6 p-5 bg-red-50/50 border-2 border-red-100 rounded-[24px] flex items-start gap-4">
                          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-black text-red-600 uppercase tracking-widest">Reason: {appt.rejectionReason || 'Busy Schedule'}</p>
                            <p className="text-sm font-medium text-red-500/80 mt-1 max-w-md">The doctor is currently unavailable at this time. We suggest looking for other specialists for this slot.</p>
                            <button className="mt-4 flex items-center gap-2 text-xs font-black text-white bg-red-500 px-6 py-3 rounded-2xl hover:bg-black transition-all group/btn shadow-lg shadow-red-500/20">
                               Find Next Doctor <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Pill & Actions */}
                    <div className="flex flex-col items-end gap-4 shrink-0 ml-auto w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-ash-grey-800/10">
                      <div className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border ${cfg.color} shadow-lg shadow-black/5`}>
                         <StatusIcon className="h-4 w-4" />
                         {cfg.label}
                      </div>
                      
                      {role === 'doctor' && appt.status === 'pending' && (
                        <div className="flex gap-3 w-full md:w-auto">
                          <button 
                            onClick={() => {
                              const reason = confirm('Decline due to "Busy Schedule"?') ? 'Busy Schedule' : 'Other Conflict';
                              updateAppointmentStatus(appt.id, 'rejected', reason);
                            }}
                            className="flex-1 md:flex-none p-4 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                          >
                            <X className="h-6 w-6" />
                          </button>
                          <button 
                            onClick={() => updateAppointmentStatus(appt.id, 'accepted')}
                            className="flex-1 md:flex-none px-8 py-4 bg-dark-slate-grey-500 text-white font-black text-[12px] uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-dark-slate-grey-500/20"
                          >
                            Accept Request
                          </button>
                        </div>
                      )}

                      {role !== 'doctor' && appt.status === 'accepted' && (
                        <button 
                          onClick={() => setSelectedAppointmentDetails(appt)}
                          className="w-full md:w-auto px-8 py-3.5 bg-ash-grey-900 border border-ash-grey-800 text-dark-slate-grey-500 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-sm"
                        >
                           View Prep Instructions
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Schedule New Consultation">
        <div className="space-y-6">
          <div className="flex p-1 bg-ash-grey-900 rounded-2xl mb-6">
            <button 
              onClick={() => setBookingForm({...bookingForm, type: 'Physical'})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${bookingForm.type === 'Physical' ? 'bg-white text-dark-slate-grey-500 shadow-sm' : 'text-charcoal-blue-700'}`}
            >
              <MapPin className="w-3.5 h-3.5" /> Physical
            </button>
            <button 
              onClick={() => setBookingForm({...bookingForm, type: 'Virtual'})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${bookingForm.type === 'Virtual' ? 'bg-white text-dark-slate-grey-500 shadow-sm' : 'text-charcoal-blue-700'}`}
            >
              <Video className="w-3.5 h-3.5" /> Virtual
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Select Doctor</label>
              <select 
                value={bookingForm.doctorId}
                onChange={(e) => setBookingForm({...bookingForm, doctorId: e.target.value})}
                className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-5 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 transition-all"
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map(d => (
                  <option key={d.uid} value={d.uid}>Dr. {d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Consultation Reason</label>
              <input 
                type="text"
                placeholder="e.g. Regular Checkup"
                value={bookingForm.condition}
                onChange={(e) => setBookingForm({...bookingForm, condition: e.target.value})}
                className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-5 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Date</label>
                <input 
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                  className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-5 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Time</label>
                <input 
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                  className="w-full h-14 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-5 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleBook}
            disabled={!bookingForm.doctorId || !bookingForm.date || !bookingForm.time}
            className="w-full py-5 bg-dark-slate-grey-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-dark-slate-grey-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            Confirm Booking
          </button>
        </div>
      </Modal>

      {/* View Appointment Details Modal */}
      <Modal 
        isOpen={!!selectedAppointmentDetails} 
        onClose={() => setSelectedAppointmentDetails(null)} 
        title="Consultation Details"
      >
        {selectedAppointmentDetails && (
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center border-2 border-white shadow-sm ${selectedAppointmentDetails.type === 'Virtual' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {selectedAppointmentDetails.type === 'Virtual' ? <Video className="h-8 w-8" /> : <MapPin className="h-8 w-8" />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-dark-slate-grey-500 leading-none">
                  {role === 'doctor' ? selectedAppointmentDetails.patientName : `Dr. ${selectedAppointmentDetails.doctorName}`}
                </h3>
                <p className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mt-2">{selectedAppointmentDetails.condition} • {selectedAppointmentDetails.requestedTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-ash-grey-900/10 p-6 rounded-[32px] border border-ash-grey-800/20">
                  <h4 className="text-[9px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mb-3">Type</h4>
                  <div className={`flex items-end gap-2 ${selectedAppointmentDetails.type === 'Virtual' ? 'text-purple-600' : 'text-blue-600'}`}>
                     <span className="text-xl font-black uppercase tracking-tight">{selectedAppointmentDetails.type}</span>
                  </div>
               </div>
               <div className="bg-ash-grey-900/10 p-6 rounded-[32px] border border-ash-grey-800/20">
                  <h4 className="text-[9px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 mb-3">Health Status</h4>
                  <div className="flex items-center gap-2 text-deep-teal-600">
                     <Activity className="h-5 w-5" />
                     <span className="text-lg font-black uppercase tracking-tighter">Monitored</span>
                  </div>
               </div>
            </div>

            <div className="bg-dark-slate-grey-500 p-8 rounded-[40px] text-white">
               <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6 font-medium">Timeline Details</h4>
               <div className="space-y-6">
                  {[
                    { t: 'Requested', m: `${selectedAppointmentDetails.requestedDate} @ ${selectedAppointmentDetails.requestedTime}` },
                    { t: 'Current Status', m: selectedAppointmentDetails.status.toUpperCase() },
                    { t: role === 'doctor' ? 'Patient' : 'Practitioner', m: role === 'doctor' ? selectedAppointmentDetails.patientName : selectedAppointmentDetails.doctorName }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                       <span className="text-[9px] font-black opacity-40 whitespace-nowrap min-w-[100px]">{step.t}</span>
                       <p className="text-xs font-bold leading-tight">{step.m}</p>
                    </div>
                  ))}
               </div>
            </div>

            <button onClick={() => setSelectedAppointmentDetails(null)} className="w-full py-4 bg-ash-grey-900 text-charcoal-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-widest">Close Information</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
