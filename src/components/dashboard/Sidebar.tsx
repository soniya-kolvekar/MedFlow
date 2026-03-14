"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  LifeBuoy, 
  LogOut,
  ShieldPlus,
  Building2,
  Activity,
  ShieldCheck
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { role, logout } = useAuth();

  const getMenuItems = () => {
    switch(role) {
      case 'doctor':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
          { name: 'Patients', icon: Users, href: '/dashboard/patients' },
          { name: 'Appointments', icon: Calendar, href: '/dashboard/appointments' },
          { name: 'Profile', icon: ShieldPlus, href: '/dashboard/profile' },
        ];
      case 'pharmacy':
        return [
          { name: 'Inventory', icon: Building2, href: '/dashboard/pharmacy' },
          { name: 'Analytics', icon: BarChart3, href: '/dashboard/reports' },
          { name: 'Account', icon: ShieldPlus, href: '/dashboard/profile' },
        ];
      case 'lab':
        return [
          { name: 'Lab Queue', icon: Activity, href: '/dashboard/lab' },
          { name: 'Results', icon: FileText, href: '/dashboard/reports' },
          { name: 'Account', icon: ShieldPlus, href: '/dashboard/profile' },
        ];
      case 'admin':
        return [
          { name: 'System', icon: LayoutDashboard, href: '/dashboard/admin' },
          { name: 'Logs', icon: FileText, href: '/dashboard/reports' },
          { name: 'Admin Profile', icon: ShieldPlus, href: '/dashboard/profile' },
        ];
      default: // patient
        return [
          { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
          { name: 'Schedule', icon: Calendar, href: '/dashboard/appointments' },
          { name: 'Health Records', icon: FileText, href: '/dashboard/reports' },
          { name: 'My Profile', icon: ShieldPlus, href: '/dashboard/profile' },
        ];
    }
  };

  const navItems = getMenuItems();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-charcoal-blue-500 text-ash-grey-500 flex flex-col z-50 shadow-2xl">
      {/* Hospital Branding */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
          <div className="bg-deep-teal-500 p-2 rounded-xl text-white shadow-lg shadow-deep-teal-500/20">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Central Hospital</h2>
            <p className="text-[10px] text-ash-grey-400 font-medium">Healthcare Mgmt</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center gap-2 opacity-50">
        <ShieldPlus className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">MedFlow AI</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-deep-teal-500 text-white shadow-lg shadow-deep-teal-500/20' 
                  : 'hover:bg-ash-grey-200/5 text-ash-grey-400 hover:text-ash-grey-200'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-4 py-6 border-t border-white/5 space-y-2">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-ash-grey-400 hover:text-ash-grey-200 hover:bg-white/5 transition-all"
          >
            <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
