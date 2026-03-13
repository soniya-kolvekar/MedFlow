"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      // The logout function from AuthContext clears Firebase auth,
      // clears the cookie, and redirects to login.
      await logout();
      
      // Fallback redirect just in case
      router.push('/login');
    };
    
    performLogout();
  }, [logout, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-ash-grey-900">
      <div className="flex flex-col items-center justify-center gap-4 text-charcoal-blue-500 bg-white p-12 rounded-[40px] shadow-2xl shadow-charcoal-blue-500/10 border border-ash-grey-700/20">
        <Loader2 className="h-10 w-10 animate-spin text-deep-teal-500" />
        <h2 className="text-xl font-black text-dark-slate-grey-500 tracking-tight uppercase">Logging Out</h2>
        <p className="text-sm font-bold opacity-60">Securely ending your session...</p>
      </div>
    </div>
  );
}
