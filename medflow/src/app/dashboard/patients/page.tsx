"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { usePatients, Patient } from '@/hooks/usePatients';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  Activity,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function PatientsPage() {
  const { patients, loading } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-dark-slate-grey-500 tracking-tight">Patients Repository</h1>
            <p className="text-charcoal-blue-700 mt-2 font-medium">Manage and monitor patient health records across all departments.</p>
          </div>
          <button className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3 rounded-xl hover:bg-dark-slate-grey-600 transition-all shadow-lg shadow-dark-slate-grey-500/10 active:scale-95">
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Add Patient</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Patients', value: patients.length, color: 'text-deep-teal-500', icon: Users },
            { label: 'Active Treatments', value: '24', color: 'text-blue-500', icon: Activity },
            { label: 'New This Month', value: '12', color: 'text-purple-500', icon: Calendar },
            { label: 'Urgent Cases', value: patients.filter(p => p.priority === 'Urgent').length, color: 'text-red-500', icon: Filter },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-ash-grey-700/30 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-ash-grey-900 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <MoreHorizontal className="h-5 w-5 text-ash-grey-500" />
              </div>
              <p className="text-sm font-bold text-charcoal-blue-700 opacity-60 uppercase tracking-widest">{stat.label}</p>
              <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-ash-grey-700/30">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-grey-500" />
            <input 
              type="text" 
              placeholder="Search by name, ID, or condition..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-ash-grey-900 border border-transparent rounded-2xl focus:bg-white focus:border-deep-teal-500 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-ash-grey-700/30 rounded-2xl text-charcoal-blue-700 font-bold text-sm bg-white hover:bg-ash-grey-900 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-5 py-3 border border-ash-grey-700/30 rounded-2xl text-charcoal-blue-700 font-bold text-sm bg-white hover:bg-ash-grey-900 transition-colors">
              Download CSV
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-[32px] overflow-hidden border border-ash-grey-700/30 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ash-grey-900 text-[11px] font-black uppercase tracking-widest text-charcoal-blue-700">
                <th className="px-8 py-5">Patient Name</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5">Last Visit</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ash-grey-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 border-4 border-deep-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-bold text-charcoal-blue-700">Loading records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-ash-grey-900/40 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-deep-teal-500/10 text-deep-teal-600 flex items-center justify-center font-bold text-lg">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate-grey-500 group-hover:text-deep-teal-600 transition-colors">{patient.name}</p>
                        <p className="text-xs text-charcoal-blue-700 opacity-60">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      patient.priority === 'Urgent' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {patient.priority || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-charcoal-blue-700">
                    {patient.dept || 'General'}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-dark-slate-grey-500">Oct 24, 2023</span>
                      <span className="text-[10px] text-charcoal-blue-700 opacity-40 uppercase tracking-widest font-black">Dr. Wilson</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 rounded-xl border border-ash-grey-700/30 hover:bg-white hover:shadow-md transition-all text-charcoal-blue-700">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-2.5 rounded-xl border border-ash-grey-700/30 hover:bg-white hover:shadow-md transition-all text-charcoal-blue-700">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2.5 rounded-xl bg-ash-grey-900 text-charcoal-blue-700 hover:bg-dark-slate-grey-500 hover:text-white transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
