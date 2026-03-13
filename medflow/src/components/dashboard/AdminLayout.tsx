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
  Plus,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProfileEdit from '@/components/dashboard/ProfileEdit';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
  { id: 'patients', name: 'Patients', icon: Users, href: '/dashboard/admin' },
  { id: 'appointments', name: 'Appointments', icon: Calendar, href: '/dashboard/admin' },
  { id: 'reports', name: 'Records', icon: ClipboardList, href: '/dashboard/admin' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, href: '/dashboard/admin' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { logout, user, role } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    if (currentView === 'profile') {
      return (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mt-4"
        >
          <ProfileEdit />
        </motion.div>
      );
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-[#F1F8F1] flex text-dark-slate-grey-500">
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
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-[#3D7C65] text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
            <button
                  onClick={() => setCurrentView('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === 'profile'
                      ? 'bg-[#3D7C65] text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
            >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Account Settings</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4">
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium text-sm text-[12px] uppercase tracking-widest">Support</span>
          </button>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full px-4"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm text-[12px] uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-10 border-b border-ash-grey-700/30">
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
            </div>

            <div 
                className="flex items-center gap-3 bg-white pl-1 pr-6 py-1 rounded-full shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => setCurrentView('profile')}
            >
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    <UserCircle className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{user?.email?.split('@')[0] || 'Admin'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{role || 'Administrator'}</p>
                </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-10 py-6">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
