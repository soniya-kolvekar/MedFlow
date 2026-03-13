"use client";

import { useState } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  Bell, 
  HelpCircle, 
  Settings,
  Search,
  LogOut,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
  { name: 'Patients', icon: Users, href: '/dashboard/patients' },
  { name: 'Appointments', icon: Calendar, href: '/dashboard/appointments' },
  { name: 'Records', icon: ClipboardList, href: '/dashboard/reports' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/admin' }, // Analytics could be a sub-section
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F1F8F1] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2C332F] text-white flex flex-col fixed h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-8 bg-[#3D7C65] rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">MedFlow AI</span>
          </div>

          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-[#3D7C65] text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4">
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium text-sm text-[12px] uppercase tracking-widest">Support</span>
          </button>
          <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4">
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm text-[12px] uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-10">
          <div className="relative w-[500px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search medical records, patients, or logs..." 
              className="w-full h-12 bg-white rounded-full pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-[#3D7C65]/5 border-none shadow-sm placeholder:text-gray-300"
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5 text-gray-600">
              <button className="hover:text-black transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="hover:text-black transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="hover:text-black transition-colors">
                <Settings className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white pl-1 pr-6 py-1 rounded-full shadow-sm border border-gray-100">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" alt="Admin" />
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">Dr. Julian Vance</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Chief Administrator</p>
                </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-10 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
