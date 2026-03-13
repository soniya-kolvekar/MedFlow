import Sidebar from './Sidebar';
import { Search, Bell, HelpCircle, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-ash-grey-900">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-transparent flex items-center justify-between px-8">
          {/* Search */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-blue-700" />
            <input 
              type="text" 
              placeholder="Search prescriptions, medicines..." 
              className="w-full h-11 bg-ash-grey-800 rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 text-charcoal-blue-500 placeholder:text-charcoal-blue-700 transition-all border border-transparent focus:border-deep-teal-500/30"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-charcoal-blue-600 hover:bg-ash-grey-800 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-ash-grey-900"></span>
            </button>
            <button className="p-2 text-charcoal-blue-600 hover:bg-ash-grey-800 rounded-full transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
            <button className="p-2 text-charcoal-blue-600 hover:bg-ash-grey-800 rounded-full transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-ash-grey-700">
              <div className="text-right">
                <p className="text-sm font-semibold text-charcoal-blue-500">Dr. Sarah Chen</p>
                <p className="text-[10px] text-charcoal-blue-700 uppercase tracking-tighter">Chief Pharmacist</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-ash-grey-400 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-deep-teal-500">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 pt-4">
          {children}
        </main>

        <footer className="px-8 py-6 flex items-center justify-between text-[11px] text-charcoal-blue-700 uppercase tracking-widest border-t border-ash-grey-700/50 mt-auto">
          <p>© 2024 Pharmacy Portal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Contact</a>
            <a href="#" className="hover:text-deep-teal-500 transition-colors">Security</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
