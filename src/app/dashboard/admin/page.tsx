"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  UserPlus,
  Clock,
  MoreVertical,
  Search,
  Bell,
  Settings
} from 'lucide-react';

const stats = [
  { label: 'Total Patients', value: '1,284', change: '+12.5%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Avg. Consultation', value: '24 min', change: '-2.1%', trend: 'down', icon: Clock, color: 'text-deep-teal-600', bg: 'bg-deep-teal-50' },
  { label: 'Revenue Forecast', value: '$420K', change: '+8.4%', trend: 'up', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'System Uptime', value: '99.9%', change: 'Stable', trend: 'up', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const recentActivity = [
  { user: 'Dr. Sarah Jenkins', action: 'Approved Prescription', time: '2m ago', id: '#P-9281' },
  { user: 'Nurse Mark Thorne', action: 'Checked-in Patient', time: '5m ago', id: '#A-4432' },
  { user: 'Lab Tech Elena', action: 'Uploaded MRI Scans', time: '12m ago', id: '#L-1092' },
  { user: 'Admin System', action: 'Daily Backup Complete', time: '45m ago', id: '#S-0000' },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tight leading-none uppercase">Admin Overview</h1>
            <p className="text-charcoal-blue-700 mt-3 font-medium opacity-60 italic">"Efficiency is the foundation of patient care excellence."</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex p-1 bg-ash-grey-900/40 rounded-2xl border border-ash-grey-700/30">
                {['24h', '7d', '30d', 'Quarterly'].map((range) => (
                    <button 
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            timeRange.toLowerCase().includes(range.toLowerCase()) 
                            ? 'bg-white text-dark-slate-grey-500 shadow-sm' 
                            : 'text-charcoal-blue-700 opacity-40 hover:opacity-100'
                        }`}
                    >
                        {range}
                    </button>
                ))}
            </div>
            <button className="p-3 bg-white border border-ash-grey-700/50 rounded-2xl text-dark-slate-grey-500 hover:bg-ash-grey-900 transition-all shadow-sm relative">
                <Bell className="h-5 w-5" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-[40px] p-8 border border-ash-grey-700/20 shadow-xl shadow-charcoal-blue-500/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-[24px] ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                </div>
              </div>
              <h3 className="text-3xl font-black text-dark-slate-grey-500 mb-1 tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Visual/Chart Replacement */}
            <div className="lg:col-span-2 bg-dark-slate-grey-500 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-dark-slate-grey-500/20 group">
                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Department Performance</h3>
                            <p className="text-ash-grey-700 text-xs font-bold mt-1 opacity-60">Real-time throughput analysis</p>
                        </div>
                        <Settings className="h-5 w-5 opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center gap-8">
                        {[
                            { label: 'Cardiology', val: 88, color: 'bg-blue-400' },
                            { label: 'Radiology', val: 64, color: 'bg-deep-teal-500' },
                            { label: 'Emergency', val: 95, color: 'bg-red-400' },
                            { label: 'Neurology', val: 42, color: 'bg-purple-400' },
                        ].map((dept, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="opacity-60">{dept.label}</span>
                                    <span>{dept.val}% Load</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${dept.color} transition-all duration-1000 ease-out delay-[${i * 200}ms]`}
                                        style={{ width: `${dept.val}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-deep-teal-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Side Activity */}
            <div className="bg-ash-grey-900/30 rounded-[48px] p-10 border border-ash-grey-700/20">
                <h3 className="text-xl font-black text-dark-slate-grey-500 mb-10 flex items-center justify-between uppercase tracking-tighter">
                    Recent Activity
                    <Clock className="h-5 w-5 text-deep-teal-500" />
                </h3>
                
                <div className="space-y-8">
                    {recentActivity.map((act, i) => (
                        <div key={i} className="flex gap-5 group cursor-pointer animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="h-12 w-12 rounded-2xl bg-white border border-ash-grey-800/20 shadow-sm flex items-center justify-center group-hover:bg-dark-slate-grey-500 group-hover:text-white transition-all duration-300">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                            <div className="flex-1 border-b border-ash-grey-800/10 pb-5 last:border-0 group-hover:border-ash-grey-800/40 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-black text-sm text-dark-slate-grey-500">{act.user}</h4>
                                    <span className="text-[9px] font-black text-charcoal-blue-700 opacity-30 uppercase">{act.time}</span>
                                </div>
                                <p className="text-[11px] text-charcoal-blue-700 font-bold opacity-60">{act.action} <span className="text-deep-teal-600 ml-1">{act.id}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button className="w-full mt-10 py-4 bg-white border border-ash-grey-700 text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest rounded-2xl hover:bg-ash-grey-900 transition-all active:scale-95">
                    View System Logs
                </button>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
