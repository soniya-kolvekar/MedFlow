"use client";

import { motion } from "framer-motion";
import { User, Activity, FileText, Pill } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Patient Intake",
    description:
      "Multilingual pre-screening and history gathering using AI avatars.",
    icon: User,
  },
  {
    number: "02",
    title: "Doctor Sync",
    description:
      "Live translation during the physical exam with automated notation.",
    icon: Activity,
  },
  {
    number: "03",
    title: "Lab Analysis",
    description:
      "Direct data integration from diagnostics for patient reporting.",
    icon: FileText,
  },
  {
    number: "04",
    title: "Pharmacy",
    description: "Translated prescriptions and medication guides for patients.",
    icon: Pill,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-ash-grey-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-dark-slate-grey-500 md:text-3xl">
              The Unified Patient Journey
            </h2>
            <p className="text-charcoal-blue-500 font-medium">
              See how MedFlow AI accelerates the entire diagnostic pipeline from
              initial intake to final prescription.
            </p>
          </div>
          <div className="hidden md:block w-32 h-[2px] bg-dark-slate-grey-500" />
        </div>

        {/* Horizontal Step Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-[24px] bg-ash-grey-800 p-6 shadow-sm border border-ash-grey-700 transition-all hover:bg-white"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ash-grey-700 text-dark-slate-grey-500">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold text-ash-grey-600 tracking-tighter">
                  {step.number}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-dark-slate-grey-500">
                {step.title}
              </h3>
              <p className="text-sm text-charcoal-blue-600 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] bg-charcoal-blue-200 py-20 px-8 text-center shadow-xl border border-charcoal-blue-300"
        >
          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl mb-12">
            Ready to transform your <br className="hidden sm:block" /> clinical
            communication?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="h-14 rounded-xl bg-deep-teal-500 px-8 text-base font-semibold text-white transition-colors hover:bg-deep-teal-600 w-full sm:w-auto hover:shadow-lg">
              Book a Demo
            </button>
            <button className="h-14 rounded-xl bg-charcoal-blue-400 px-8 text-base font-semibold text-white transition-colors hover:bg-charcoal-blue-500 border border-charcoal-blue-500 w-full sm:w-auto">
              Contact Sales
            </button>
          </div>

          {/* Decorative elements behind CTA */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-deep-teal-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-muted-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
