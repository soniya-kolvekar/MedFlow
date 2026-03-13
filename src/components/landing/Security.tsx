"use client";

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function Security() {
  return (
    <section id="security" className="relative overflow-hidden bg-blue-600 py-24 dark:bg-blue-900 border-t border-blue-500/30">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-8 shadow-inner border border-white/20"
        >
          <Lock className="h-10 w-10 text-white" />
        </motion.div>
        <h2 className="mb-6 mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
          Bank-Grade Security for Your Sensitive Medical Data
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-blue-100 mb-12 leading-relaxed">
          We treat patient privacy as our highest priority. MedFlow AI is built with advanced encryption protocols and designed to strictly adhere to global healthcare compliance standards.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-white font-medium">
          <span className="flex items-center gap-2 rounded-full bg-blue-700/50 px-5 py-2.5 backdrop-blur-sm dark:bg-black/20 dark:border dark:border-white/10 shadow-sm border border-transparent">End-to-End Encryption</span>
          <span className="flex items-center gap-2 rounded-full bg-blue-700/50 px-5 py-2.5 backdrop-blur-sm dark:bg-black/20 dark:border dark:border-white/10 shadow-sm border border-transparent">HIPAA Compliant Architecture</span>
          <span className="flex items-center gap-2 rounded-full bg-blue-700/50 px-5 py-2.5 backdrop-blur-sm dark:bg-black/20 dark:border dark:border-white/10 shadow-sm border border-transparent">Role-Based Access Controls</span>
        </div>
      </div>
    </section>
  );
}
