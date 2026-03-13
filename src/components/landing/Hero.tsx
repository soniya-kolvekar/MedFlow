"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Mic, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ash-grey-900 pt-16 pb-24">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-muted-teal-800/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-deep-teal-900/50 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/4 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Text Column */}
          <div className="lg:w-1/2 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-6 inline-flex items-center rounded-full bg-muted-teal-800 px-4 py-2 text-xs font-bold uppercase tracking-widest text-deep-teal-400"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI-Powered Multilingual Care</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="mb-8 text-5xl font-extrabold tracking-tight text-charcoal-blue-200 sm:text-6xl lg:text-[72px] leading-[1.05]"
            >
              Breaking <br />
              Language <br />
              <span className="text-deep-teal-500 italic opacity-90 font-serif">Barriers</span> in <br />
              Healthcare
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mb-10 max-w-md text-lg text-charcoal-blue-600 leading-relaxed font-medium"
            >
              Empowering clinicians with real-time translation. Bridge the communication gap in over 120 languages instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/login"
                className="group flex h-14 w-full sm:w-auto items-center justify-center rounded-2xl bg-deep-teal-500 px-8 text-base font-bold text-white transition-all hover:bg-dark-slate-grey-500 hover:scale-105 hover:shadow-xl hover:shadow-deep-teal-700/50"
              >
                Start Consultation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#technology"
                className="flex h-14 w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-ash-grey-700 bg-transparent px-8 text-base font-bold text-dark-slate-grey-500 transition-all hover:border-deep-teal-500 hover:bg-ash-grey-800"
              >
                Explore Platform
              </Link>
            </motion.div>
          </div>

          {/* Right Illustration Column */}
          <div className="lg:w-1/2 w-full relative">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative w-full aspect-[4/3] max-w-[600px] ml-auto rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-visible hidden md:block"
            >
               {/* Main Image */}
               <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] overflow-hidden bg-ash-grey-800">
                 {/*  Using a relevant placeholder image since we don't have the exact asset */}
                 <img 
                   src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" 
                   alt="Doctor consulting patient"
                   className="w-full h-full object-cover object-[center_top] opacity-90 mix-blend-multiply transition-transform duration-1000 hover:scale-105"
                 />
                 {/* Soft gradient overlay to blend with the UI */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-deep-teal-800/40" />
               </div>

               {/* Floating Waveform Card (Animated) */}
               <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ 
                    y: { type: "spring", stiffness: 100, damping: 15, delay: 0.5 },
                    opacity: { duration: 0.5, delay: 0.5 }
                  }}
                  className="absolute -bottom-8 -left-8 right-8 rounded-[24px] bg-white/90 backdrop-blur-xl shadow-2xl p-6 border border-white"
               >
                  <div className="flex items-center gap-4 mb-4">
                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ash-grey-900 text-deep-teal-500">
                        <Mic className="h-6 w-6" />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                           <p className="text-[10px] sm:text-xs uppercase tracking-widest text-charcoal-blue-700 font-bold">Real-time Analysis</p>
                           <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-ash-grey-800 text-[10px] font-bold text-dark-slate-grey-500">
                             <span className="w-1.5 h-1.5 rounded-full bg-deep-teal-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
                             LIVE
                           </span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-charcoal-blue-200">Consultation Translation</p>
                     </div>
                  </div>
                  
                  {/* Actual Animated Waveform bars */}
                  <div className="flex items-end gap-1.5 sm:gap-2 h-10 w-full rounded-xl bg-ash-grey-900/50 p-2">
                     {Array.from({ length: 16 }).map((_, i) => (
                       <motion.div 
                         key={i}
                         animate={{ 
                           height: [
                             `${Math.max(20, Math.random() * 100)}%`, 
                             `${Math.max(20, Math.random() * 100)}%`, 
                             `${Math.max(20, Math.random() * 100)}%`
                           ] 
                         }}
                         transition={{ 
                           repeat: Infinity, 
                           duration: 1.2 + Math.random(), 
                           delay: i * 0.05, 
                           ease: "easeInOut" 
                         }}
                         className="flex-1 rounded-sm bg-deep-teal-500/80"
                       />
                     ))}
                  </div>
               </motion.div>

               {/* Small floating decorative element */}
               <motion.div
                 animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="absolute -top-6 -right-6 h-16 w-16 rounded-2xl bg-muted-teal-500/80 backdrop-blur-md shadow-lg flex items-center justify-center border border-white/50"
               >
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1] }} 
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="h-6 w-6 rounded-full bg-white opacity-90"
                 />
               </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
