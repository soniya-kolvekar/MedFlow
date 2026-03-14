"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Filter,
  Download,
  Calendar
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-dark-slate-grey-500 tracking-tight">Performance Analytics</h1>
            <p className="text-charcoal-blue-700 mt-2 font-medium">Real-time data visualization of clinic operations and patient throughput.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-3 border border-ash-grey-700/30 rounded-2xl text-charcoal-blue-700 font-bold text-sm bg-white hover:bg-ash-grey-900 transition-colors">
              <Calendar className="h-4 w-4" />
              This Month
            </button>
            <button className="flex items-center gap-2 bg-dark-slate-grey-500 text-white px-6 py-3 rounded-xl hover:bg-dark-slate-grey-600 transition-all shadow-lg shadow-dark-slate-grey-500/10 active:scale-95">
              <Download className="h-5 w-5" />
              <span className="font-semibold">Export Report</span>
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Patient Volume', value: '1,284', change: '+12.5%', trend: 'up', icon: Users, color: 'text-deep-teal-500' },
            { label: 'Avg. Wait Time', value: '14m', change: '-2.4%', trend: 'down', icon: Clock, color: 'text-blue-500' },
            { label: 'Clinic Efficiency', value: '94.2%', change: '+3.1%', trend: 'up', icon: TrendingUp, color: 'text-purple-500' },
            { label: 'Critical Cases', value: '08', change: '-12%', trend: 'down', icon: Activity, color: 'text-red-500' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-7 rounded-[32px] border border-ash-grey-700/30 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-ash-grey-900 ${kpi.color} group-hover:scale-110 transition-transform`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-sm font-bold text-charcoal-blue-700 opacity-60 uppercase tracking-widest">{kpi.label}</p>
                <h3 className="text-4xl font-black text-dark-slate-grey-500 mt-1 tracking-tighter">{kpi.value}</h3>
              </div>
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-2xl flex items-center justify-center font-black text-6xl ${kpi.color.replace('text', 'bg')}`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Chart Area (Mock) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-[40px] p-10 border border-ash-grey-700/30 shadow-sm min-h-[500px] relative">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-dark-slate-grey-500 uppercase tracking-tight">Patient Throughput</h3>
                <p className="text-sm text-charcoal-blue-700 opacity-60 font-bold mt-1">Daily volume by department across the primary facility.</p>
              </div>
              <div className="flex gap-2">
                 <div className="flex items-center gap-2 px-3 py-1 bg-ash-grey-900 rounded-full border border-ash-grey-800">
                    <div className="h-2 w-2 rounded-full bg-deep-teal-500"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-charcoal-blue-700">In-Patient</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-ash-grey-900 rounded-full border border-ash-grey-800">
                    <div className="h-2 w-2 rounded-full bg-ash-grey-700"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-charcoal-blue-700">Out-Patient</span>
                 </div>
              </div>
            </div>

            {/* Visual Bars Mockup */}
            <div className="relative h-[300px] flex items-end justify-between px-6 pb-12 border-b border-ash-grey-800/50 group">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-4 w-12 h-full justify-end relative h-full">
                  <div className="flex gap-1.5 items-end w-full h-full">
                    <div 
                      className="w-1/2 bg-ash-grey-700/50 rounded-t-xl transition-all duration-1000 group-hover:bg-ash-grey-700/80" 
                      style={{ height: `${[50, 70, 45, 85, 60, 40, 20][i]}%` }}
                    ></div>
                    <div 
                      className="w-1/2 bg-deep-teal-500 rounded-t-xl transition-all duration-1000 shadow-lg shadow-deep-teal-500/10 group-hover:scale-y-105 origin-bottom" 
                      style={{ height: `${[65, 45, 80, 60, 75, 30, 15][i]}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-charcoal-blue-700 uppercase tracking-widest opacity-40 absolute -bottom-8">{day}</span>
                </div>
              ))}

              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-0 bottom-12 flex flex-col justify-between pointer-events-none opacity-20">
                 {[1,2,3,4].map(l => <div key={l} className="w-full h-[1px] bg-charcoal-blue-700 border-dashed"></div>)}
              </div>
            </div>
            
            <div className="mt-20 grid grid-cols-4 gap-4">
               {[
                 { label: 'Emergency', value: '42%' },
                 { label: 'Cardiology', value: '28%' },
                 { label: 'Pediatrics', value: '18%' },
                 { label: 'Others', value: '12%' }
               ].map((dept, i) => (
                 <div key={i} className="text-center">
                    <p className="text-[9px] font-black uppercase text-charcoal-blue-700 opacity-40 tracking-widest mb-1">{dept.label}</p>
                    <p className="text-xl font-black text-dark-slate-grey-500">{dept.value}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Side Module: Clinic Health */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-charcoal-blue-500 rounded-[40px] p-10 text-white shadow-xl shadow-charcoal-blue-500/20 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-8">System Health</h3>
                 <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Server Uptime</span>
                        <span className="text-sm font-black">99.98%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 w-[99.98%] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">API Response</span>
                        <span className="text-sm font-black">124ms</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Security Level</span>
                        <span className="text-sm font-black">Tier 4</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 w-[95%] rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                      </div>
                    </div>
                 </div>
                 
                 <div className="mt-12 p-6 bg-white/10 border border-white/10 rounded-3xl">
                    <p className="text-xs font-medium opacity-80 italic">"Global system performance is optimal. All nodes reporting stable status."</p>
                 </div>
               </div>
               <Activity className="absolute -right-20 -bottom-20 h-64 w-64 text-white opacity-5 pointer-events-none" />
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-ash-grey-700/30 shadow-sm">
               <h3 className="text-xl font-bold text-dark-slate-grey-500 mb-8 tracking-tight">Department Efficiency</h3>
               <div className="space-y-6">
                  {[
                    { name: 'Pharmacy', value: 98, color: 'bg-deep-teal-500' },
                    { name: 'Laboratory', value: 92, color: 'bg-blue-500' },
                    { name: 'Radiology', value: 85, color: 'bg-purple-500' },
                    { name: 'Emergency', value: 94, color: 'bg-red-500' },
                  ].map((dept, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className={`h-2.5 w-2.5 rounded-full ${dept.color}`}></div>
                       <span className="flex-1 text-sm font-bold text-dark-slate-grey-500 opacity-80">{dept.name}</span>
                       <span className="text-sm font-black text-dark-slate-grey-500">{dept.value}%</span>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 rounded-3xl border-2 border-ash-grey-700 font-black text-[10px] uppercase tracking-widest text-charcoal-blue-700 hover:bg-ash-grey-900 transition-all active:scale-95">
                  View Detailed Logs
               </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
