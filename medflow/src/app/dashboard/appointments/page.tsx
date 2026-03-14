"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  ChevronRight, 
  Plus,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const mockAppointments = [
  { id: '1', patient: 'Sarah Jenkins', time: '09:30 AM', date: 'Today', dept: 'Cardiology', status: 'Confirmed', doctor: 'Dr. Sarah Chen' },
  { id: '2', patient: 'Robert Wilson', time: '11:00 AM', date: 'Today', dept: 'Neurology', status: 'Pending', doctor: 'Dr. James Wilson' },
  { id: '3', patient: 'David Chen', time: '02:15 PM', date: 'Today', dept: 'Pediatrics', status: 'Confirmed', doctor: 'Dr. Elena Rodriguez' },
  { id: '4', patient: 'Maria Garcia', time: '04:00 PM', date: 'Today', dept: 'Emergency', status: 'Urgent', doctor: 'Dr. Sarah Chen' },
  { id: '5', patient: 'John Doe', time: '10:00 AM', date: 'Tomorrow', dept: 'General', status: 'Confirmed', doctor: 'Dr. Miller' },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-dark-slate-grey-500 tracking-tight">Consultation Schedule</h1>
            <p className="text-charcoal-blue-700 mt-2 font-medium">Coordinate patient visits and specialist availability.</p>
          </div>
          <button className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3 rounded-xl hover:bg-dark-slate-grey-600 transition-all shadow-lg shadow-dark-slate-grey-500/10 active:scale-95">
            <Plus className="h-5 w-5" />
            <span className="font-semibold">New Appointment</span>
          </button>
        </div>

        {/* Calendar Strip (Mock) */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18', 'Sat 19', 'Sun 20'].map((day, i) => (
            <div key={i} className={`flex flex-col items-center justify-center min-w-[100px] h-24 rounded-3xl border transition-all cursor-pointer ${i === 0 ? 'bg-deep-teal-500 border-transparent text-white shadow-lg shadow-deep-teal-500/20 scale-105' : 'bg-white border-ash-grey-700/30 text-charcoal-blue-700 hover:border-deep-teal-500/50'}`}>
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60">{day.split(' ')[0]}</span>
              <span className="text-2xl font-black mt-1">{day.split(' ')[1]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main List */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex bg-ash-grey-900 p-1.5 rounded-2xl w-fit border border-ash-grey-800">
              {['Upcoming', 'Past', 'Cancelled'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-dark-slate-grey-500 shadow-sm' : 'text-charcoal-blue-700 opacity-50 hover:opacity-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {mockAppointments.map((apt) => (
                <div key={apt.id} className="bg-white p-6 rounded-[32px] border border-ash-grey-700/30 shadow-sm hover:shadow-xl hover:shadow-charcoal-blue-500/5 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center h-16 w-16 bg-ash-grey-900 rounded-2xl border border-ash-grey-800">
                        <Clock className="h-5 w-5 text-deep-teal-500 mb-1" />
                        <span className="text-[10px] font-black text-dark-slate-grey-500 opacity-60 uppercase tracking-tighter">{apt.time.split(' ')[1]}</span>
                        <span className="text-xs font-black text-dark-slate-grey-500">{apt.time.split(' ')[0]}</span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-black text-dark-slate-grey-500 group-hover:text-deep-teal-500 transition-colors uppercase tracking-tight">{apt.patient}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-charcoal-blue-700 opacity-60">
                            <User className="h-3.5 w-3.5" />
                            {apt.doctor}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-charcoal-blue-700 opacity-60">
                            <MapPin className="h-3.5 w-3.5" />
                            {apt.dept}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        apt.status === 'Urgent' ? 'bg-red-100 text-red-600 animate-pulse' : 
                        apt.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {apt.status}
                      </span>
                      <div className="h-10 w-10 rounded-full bg-ash-grey-900 flex items-center justify-center text-charcoal-blue-700 group-hover:bg-dark-slate-grey-500 group-hover:text-white transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-dark-slate-grey-500 rounded-[32px] p-8 text-white shadow-xl shadow-dark-slate-grey-500/20">
              <h3 className="text-xl font-bold mb-4">Daily Insights</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-[10px]">Confirmed Today</span>
                  </div>
                  <span className="text-xl font-black">24</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-[10px]">Critical Alerts</span>
                  </div>
                  <span className="text-xl font-black text-red-400">03</span>
                </div>
              </div>
              <button className="w-full mt-6 py-4 bg-deep-teal-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-deep-teal-600 transition-all active:scale-95 shadow-lg shadow-deep-teal-600/20">
                View Full Summary
              </button>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-ash-grey-700/30">
              <h3 className="text-xl font-bold text-dark-slate-grey-500 mb-6">Active Doctors</h3>
              <div className="space-y-4">
                {[
                  { name: 'Dr. Sarah Chen', status: 'In Consultation', color: 'bg-green-500' },
                  { name: 'Dr. James Wilson', status: 'Available', color: 'bg-green-500' },
                  { name: 'Dr. Elena Rodriguez', status: 'Surgery', color: 'bg-red-500' }
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-ash-grey-900 rounded-2xl border border-ash-grey-800">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden bg-white">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`} alt={doc.name} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-dark-slate-grey-500">{doc.name}</p>
                        <p className="text-[9px] font-black uppercase text-charcoal-blue-700 opacity-40">{doc.status}</p>
                      </div>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${doc.color}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
