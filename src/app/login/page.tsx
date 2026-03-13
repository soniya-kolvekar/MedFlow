"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldPlus, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateRoleInCookie } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch role from Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userRole = docSnap.data().role;
        // 3. Update cookie to sync with Next.js Middleware
        updateRoleInCookie(userRole);
        
        // 4. Redirect to proper dashboard
        router.push(`/dashboard/${userRole}`);
      } else {
        setError("User role not found. Please contact support.");
        await auth.signOut(); // Log them back out if broken state
      }
    } catch (err: any) {
      alert("Invalid email or password. Please try again.");
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ash-grey-900 font-sans">
      {/* Left side: Branding / Illustration */}
      <div className="hidden w-1/2 flex-col justify-between bg-charcoal-blue-500 p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <ShieldPlus className="h-8 w-8 text-muted-teal-500" />
          <span className="text-2xl font-bold tracking-tight text-white">MedFlow AI</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome back.</h2>
          <p className="text-charcoal-blue-800 text-lg max-w-md">
            Log in to your account to securely access your personalized dashboard and clinical intelligence tools.
          </p>
        </div>
        <div className="text-sm text-charcoal-blue-700">
          © {new Date().getFullYear()} MedFlow AI. All rights reserved.
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 sm:px-16">
        <div className="mx-auto w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex lg:hidden items-center gap-2 mb-8">
              <ShieldPlus className="h-8 w-8 text-deep-teal-500" />
              <span className="text-2xl font-bold tracking-tight text-dark-slate-grey-500">MedFlow AI</span>
            </Link>
            <h1 className="text-3xl font-bold text-dark-slate-grey-500 mb-2">Log in</h1>
            <p className="text-charcoal-blue-500 font-medium">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-bold text-charcoal-blue-500">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-charcoal-blue-700" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-ash-grey-700 bg-white p-3 pl-11 text-sm text-dark-slate-grey-500 focus:border-deep-teal-500 focus:outline-none focus:ring-1 focus:ring-deep-teal-500 placeholder:text-charcoal-blue-700 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                 <label className="block text-sm font-bold text-charcoal-blue-500">Password</label>
                 <Link href="#" className="text-xs font-bold text-deep-teal-500 hover:text-dark-slate-grey-500 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-charcoal-blue-700" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-ash-grey-700 bg-white p-3 pl-11 text-sm text-dark-slate-grey-500 focus:border-deep-teal-500 focus:outline-none focus:ring-1 focus:ring-deep-teal-500 placeholder:text-charcoal-blue-700 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-deep-teal-500 p-3 text-sm font-bold text-white transition-all hover:bg-dark-slate-grey-500 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-charcoal-blue-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-deep-teal-500 hover:text-dark-slate-grey-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
