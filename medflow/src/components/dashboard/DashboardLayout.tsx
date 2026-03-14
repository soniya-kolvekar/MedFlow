"use client";

import { useAuth } from '@/context/AuthContext';
import { Bell, Search, User, Menu, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';
import ProfileEdit from './ProfileEdit';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [langOpen, setLangOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'];

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
    <div className="min-h-screen bg-ash-grey-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
         <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
           <div className="absolute inset-0 bg-charcoal-blue-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
           <div className="absolute left-0 top-0 h-full w-64 transform transition-transform shadow-2xl">
             <Sidebar currentView={currentView} onViewChange={(view) => {
               setCurrentView(view);
               setMobileMenuOpen(false);
             }} />
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col sm:ml-64 relative min-w-0">
         
         {/* Top Header */}
         <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-ash-grey-700 bg-ash-grey-900/80 backdrop-blur-md px-4 sm:px-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 sm:hidden text-charcoal-blue-600"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="relative flex-1 max-w-md hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-blue-600" />
                  <input 
                    type="text" 
                    placeholder="Search medical records..." 
                    className="h-10 w-64 rounded-xl border border-ash-grey-700 bg-white pl-10 pr-4 text-sm focus:border-deep-teal-500 focus:outline-none focus:ring-1 focus:ring-deep-teal-500 placeholder:text-charcoal-blue-600 transition-all focus:w-80"
                  />
              </div>
            </div>

            <div className="flex items-center gap-3">
               {/* Language Selector */}
               <div className="relative">
                  <button 
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-2 rounded-xl border border-ash-grey-700 bg-white px-3 py-2 text-xs font-bold text-dark-slate-grey-500 hover:bg-ash-grey-800 transition-colors"
                  >
                    <Globe className="h-4 w-4 text-charcoal-blue-600" />
                    <span className="hidden md:inline">{currentLang}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {langOpen && (
                    <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-ash-grey-700 bg-white shadow-xl">
                      {languages.map(lang => (
                        <button
                          key={lang}
                          onClick={() => {
                            setCurrentLang(lang);
                            setLangOpen(false);
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-xs font-bold text-charcoal-blue-600 hover:bg-ash-grey-800 hover:text-deep-teal-600 text-left"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
               </div>

               <button className="relative p-2 text-charcoal-blue-600 hover:text-deep-teal-500 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
               </button>
               
               <div className="flex items-center gap-3 border-l border-ash-grey-700 pl-4">
                  <div className="hidden md:flex flex-col items-end">
                     <span className="text-sm font-bold text-dark-slate-grey-500 leading-tight">
                       {user?.email?.split('@')[0] || 'User'}
                     </span>
                     <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-blue-500">
                       {role || 'patient'}
                     </span>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-teal-500/10 text-deep-teal-600 border border-deep-teal-500/20 shadow-sm cursor-pointer hover:bg-deep-teal-500/20 transition-all" onClick={() => setCurrentView('profile')}>
                     <User className="h-5 w-5" />
                  </div>
               </div>
            </div>
         </header>

         {/* Page Content */}
         <main className="flex-1 p-4 sm:p-8">
            <div className="w-full">
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>
         </main>
      </div>
    </div>
  );
}
