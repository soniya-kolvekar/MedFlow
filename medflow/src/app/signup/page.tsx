"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldPlus,
  Mail,
  Lock,
  User,
  Activity,
  FileText,
  Pill,
  ShieldCheck,
} from "lucide-react";

const roles = [
  { id: "patient", label: "Patient", icon: User },
  { id: "doctor", label: "Doctor", icon: Activity },
  { id: "pharmacy", label: "Pharmacy", icon: Pill },
  { id: "lab", label: "Laboratory", icon: FileText },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateRoleInCookie } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Save User Role & Info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role: selectedRole,
        createdAt: new Date().toISOString(),
      });

      // 3. Update local cookie so middleware immediately knows the role
      updateRoleInCookie(selectedRole);

      // 4. Redirect to respective dashboard
      router.push(`/dashboard/${selectedRole}`);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to create an account. Please try again.");
      setError((err as Error).message || "Failed to create an account.");
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
          <span className="text-2xl font-bold tracking-tight text-white">
            MedFlow AI
          </span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Join the future of healthcare.
          </h2>
          <p className="text-charcoal-blue-800 text-lg max-w-md">
            Create an account to experience seamless multilingual consultations,
            smart workflows, and secure medical records.
          </p>
        </div>
        <div className="text-sm text-charcoal-blue-700">
          © {new Date().getFullYear()} MedFlow AI. All rights reserved.
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 sm:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link
              href="/"
              className="inline-flex lg:hidden items-center gap-2 mb-8"
            >
              <ShieldPlus className="h-8 w-8 text-deep-teal-500" />
              <span className="text-2xl font-bold tracking-tight text-dark-slate-grey-500">
                MedFlow AI
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-dark-slate-grey-500 mb-2">
              Create an account
            </h1>
            <p className="text-charcoal-blue-500 font-medium">
              Please enter your details to sign up.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-bold text-charcoal-blue-500">
                I am a...
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${isSelected
                          ? "border-deep-teal-500 bg-deep-teal-500/10 text-deep-teal-600"
                          : "border-ash-grey-700 bg-white text-charcoal-blue-600 hover:border-deep-teal-500/50"
                        }`}
                    >
                      <Icon
                        className={`h-6 w-6 mb-2 ${isSelected ? "text-deep-teal-500" : "text-charcoal-blue-600"}`}
                      />
                      <span className="text-xs font-bold">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-charcoal-blue-500">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-charcoal-blue-700" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-ash-grey-700 bg-white p-3 pl-11 text-sm text-dark-slate-grey-500 focus:border-deep-teal-500 focus:outline-none focus:ring-1 focus:ring-deep-teal-500 placeholder:text-charcoal-blue-700"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-charcoal-blue-500">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-charcoal-blue-700" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-ash-grey-700 bg-white p-3 pl-11 text-sm text-dark-slate-grey-500 focus:border-deep-teal-500 focus:outline-none focus:ring-1 focus:ring-deep-teal-500 placeholder:text-charcoal-blue-700"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-charcoal-blue-500">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-charcoal-blue-700" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-ash-grey-700 bg-white p-3 pl-11 text-sm text-dark-slate-grey-500 focus:border-deep-teal-500 focus:outline-none focus:ring-1 focus:ring-deep-teal-500 placeholder:text-charcoal-blue-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-deep-teal-500 p-3 text-sm font-bold text-white transition-all hover:bg-dark-slate-grey-500 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-charcoal-blue-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-deep-teal-500 hover:text-dark-slate-grey-500 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
