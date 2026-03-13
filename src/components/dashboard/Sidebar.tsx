import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldPlus, 
  LayoutDashboard, 
  Stethoscope, 
  Activity, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Bell, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const links = [
    { name: 'Dashboard', href: '/dashboard/patient', icon: LayoutDashboard },
    { name: 'Consult Doctor', href: '/dashboard/patient/consult', icon: Stethoscope },
    { name: 'Health Checkups', href: '/dashboard/patient/checkups', icon: Activity },
    { name: 'Specialities', href: '/dashboard/patient/specialities', icon: ShieldCheck },
    { name: 'My Records', href: '/dashboard/patient/records', icon: FileText },
    { name: 'Appointments', href: '/dashboard/patient/appointments', icon: Calendar },
    { name: 'Notifications', href: '/dashboard/patient/notifications', icon: Bell },
    { name: 'Profile', href: '/dashboard/patient/profile', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-charcoal-blue-400 bg-charcoal-blue-500 transition-transform sm:translate-x-0">
      <div className="flex h-full flex-col px-4 py-6">
        
        {/* Brand */}
        <Link href="/" className="mb-10 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-deep-teal-500 text-white">
             <ShieldPlus className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">MedFlow AI</span>
        </Link>
        
        {/* Nav Links */}
        <div className="flex-1 space-y-1 overflow-y-auto pr-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-deep-teal-500 text-white shadow-lg shadow-deep-teal-500/20' 
                    : 'text-charcoal-blue-900 hover:bg-charcoal-blue-400 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-charcoal-blue-800'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-auto border-t border-charcoal-blue-400 pt-4">
           <button 
             onClick={() => logout()}
             className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
           >
             <LogOut className="h-5 w-5" />
             Log Out
           </button>
        </div>
      </div>
    </aside>
  );
}
