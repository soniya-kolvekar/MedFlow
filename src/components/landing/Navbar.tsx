import Link from 'next/link';
import { ShieldPlus, Search, Bell, Settings, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-ash-grey-900/90 backdrop-blur-md border-b border-ash-grey-700">
      <div className="container mx-auto px-4 md:px-8 flex h-[72px] items-center justify-between">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <ShieldPlus className="h-6 w-6 text-deep-teal-500" />
            <span className="text-xl font-bold tracking-tight text-dark-slate-grey-500">MedFlow AI</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="#solutions" className="text-sm font-medium text-charcoal-blue-600 hover:text-deep-teal-500 transition-colors">Solutions</Link>
            <Link href="#technology" className="text-sm font-medium text-charcoal-blue-600 hover:text-deep-teal-500 transition-colors">Technology</Link>
            <Link href="#security" className="text-sm font-medium text-charcoal-blue-600 hover:text-deep-teal-500 transition-colors">Security</Link>
          </div>
        </div>

        {/* Right Side: Search & Icons */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-charcoal-blue-700" />
            <input 
              type="text" 
              placeholder="Search resource" 
              className="h-10 w-64 rounded-full bg-ash-grey-800 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-deep-teal-500 text-charcoal-blue-500 placeholder:text-charcoal-blue-700"
            />
          </div>
          <button className="p-2 text-charcoal-blue-600 hover:text-deep-teal-500 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-charcoal-blue-600 hover:text-deep-teal-500 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="flex items-center justify-center rounded-full bg-ash-grey-700 p-1 ml-2 h-8 w-8 hover:bg-ash-grey-600 transition-colors">
            <User className="h-5 w-5 text-dark-slate-grey-500" />
          </button>
        </div>

      </div>
    </nav>
  );
}
