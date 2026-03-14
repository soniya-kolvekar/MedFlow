"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileText, Workflow } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="bg-ash-grey-900 py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-dark-slate-grey-500 md:text-4xl">
            Clinical Intelligence Suite
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-charcoal-blue-600">
            Seamlessly integrated AI tools designed for modern healthcare
            environments.
          </p>
        </div>

        {/* Feature Grid based on Design Mockup */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Multilingual (Large) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-[24px] bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex h-full flex-col justify-between relative z-10">
              <div>
                <div className="mb-2 w-1 h-6 bg-muted-teal-500 rounded-full inline-block align-middle mr-3" />
                <h3 className="inline-block align-middle text-2xl font-bold text-dark-slate-grey-500">
                  Multilingual Consultation
                </h3>
                <p className="mt-4 max-w-lg text-charcoal-blue-500 leading-relaxed font-medium">
                  Break the silence. Our AI supports over 120 languages with
                  medical-grade accuracy, providing real-time audio and text
                  translation during patient encounters.
                </p>
              </div>

              {/* Language Tags */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "English ↔ Spanish",
                  "English ↔ Mandarin",
                  "English ↔ Arabic",
                  "+117 More",
                ].map((lang, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-ash-grey-900 px-4 py-2 text-xs font-bold text-dark-slate-grey-500"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: AI Clinical Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-[24px] bg-deep-teal-500 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex flex-col justify-between h-full text-white">
              <div>
                <FileText className="h-10 w-10 text-white/50 mb-6" />
                <h3 className="text-2xl font-bold mb-3">AI Clinical Records</h3>
                <p className="text-deep-teal-900 leading-relaxed font-medium">
                  Auto-generated EHR notes directly from your consultation.
                  Reduce charting time by up to 40% per patient.
                </p>
              </div>
            </div>
            {/* Decorative background element overlay */}
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          </motion.div>

          {/* Card 3: Seamless Workflow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-[24px] bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            <h3 className="text-2xl font-bold text-dark-slate-grey-500 mb-3">
              Seamless Workflow
            </h3>
            <p className="text-charcoal-blue-500 leading-relaxed font-medium mb-8">
              Integrates directly into your existing hospital management systems
              with zero friction.
            </p>
            <div className="h-32 w-full rounded-xl bg-ash-grey-800 flex items-center justify-center border border-ash-grey-700">
              <Workflow className="h-8 w-8 text-charcoal-blue-700" />
            </div>
          </motion.div>

          {/* Card 4: HIPAA & GDPR Ready (Large) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-[24px] bg-dark-slate-grey-500 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col sm:flex-row items-center justify-between"
          >
            <div className="sm:w-2/3 mb-6 sm:mb-0">
              <h3 className="text-2xl font-bold text-white mb-3">
                HIPAA & GDPR Ready
              </h3>
              <p className="text-dark-slate-grey-900 leading-relaxed font-medium max-w-md">
                Military-grade encryption for patient data. We prioritize
                security so you can focus on saving lives.
              </p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/20">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-deep-teal-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
