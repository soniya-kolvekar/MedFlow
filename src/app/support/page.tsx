"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { LifeBuoy, Mail, MessageSquare, FileText, ChevronRight, ExternalLink } from 'lucide-react';

const faqs = [
  {
    q: 'How do I reset a patient record?',
    a: 'Navigate to Patient Management, search for the patient, click View, then use the Edit Record option to update any fields.',
  },
  {
    q: 'How do I seed the database with test data?',
    a: 'Go to the Pharmacy Dashboard and click the "Seed Live Data" button. This populates Firestore with sample patients and inventory.',
  },
  {
    q: 'Why am I being redirected to login?',
    a: 'Your session cookie may have expired or been cleared. Simply log in again and you will be redirected to your role dashboard.',
  },
  {
    q: 'How do I add a new department?',
    a: 'Visit the Departments page and click "New Department" in the top-right corner to register a new unit.',
  },
];

const channels = [
  {
    icon: Mail,
    title: 'Email Support',
    desc: 'Reach our team for non-urgent queries.',
    action: 'support@medflow.ai',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    desc: 'Chat with an agent during business hours.',
    action: 'Start Chat',
    color: 'bg-deep-teal-50 text-deep-teal-600',
  },
  {
    icon: FileText,
    title: 'Documentation',
    desc: 'Read our full system documentation and guides.',
    action: 'View Docs',
    color: 'bg-purple-50 text-purple-600',
  },
];

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-12">
        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="p-4 bg-deep-teal-500 rounded-[24px] text-white shadow-lg shadow-deep-teal-500/20">
            <LifeBuoy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-dark-slate-grey-500 tracking-tight uppercase">
              Support Center
            </h1>
            <p className="text-charcoal-blue-700 mt-1 font-medium opacity-60">
              Get help with MedFlow AI — documentation, FAQs, and direct contact.
            </p>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((ch, i) => (
            <div
              key={i}
              className="bg-white rounded-[40px] p-8 border border-ash-grey-700/20 shadow-xl shadow-charcoal-blue-500/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col gap-6"
            >
              <div className={`p-4 rounded-[20px] w-fit ${ch.color}`}>
                <ch.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-dark-slate-grey-500">{ch.title}</h3>
                <p className="text-sm text-charcoal-blue-700 font-medium opacity-60 mt-1">{ch.desc}</p>
              </div>
              <button className="mt-auto flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-deep-teal-600 hover:text-dark-slate-grey-500 transition-colors">
                {ch.action} <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-[40px] p-10 border border-ash-grey-700/20 shadow-xl shadow-charcoal-blue-500/5">
          <h2 className="text-2xl font-black text-dark-slate-grey-500 uppercase tracking-tight mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="group p-6 bg-ash-grey-900/30 rounded-[24px] border border-ash-grey-700/20 hover:bg-white hover:border-deep-teal-500/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-black text-dark-slate-grey-500 text-sm">{faq.q}</h4>
                    <p className="text-xs text-charcoal-blue-700 font-medium opacity-60 mt-2 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ash-grey-400 shrink-0 mt-0.5 group-hover:text-deep-teal-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-dark-slate-grey-500 rounded-[40px] p-10 text-white flex items-center justify-between shadow-2xl shadow-dark-slate-grey-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Still need help?</p>
            <h3 className="text-2xl font-black">Contact the MedFlow AI team directly</h3>
          </div>
          <a
            href="mailto:support@medflow.ai"
            className="relative z-10 shrink-0 px-8 py-4 bg-white text-dark-slate-grey-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ash-grey-900 transition-all active:scale-95"
          >
            Send Email
          </a>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>
    </DashboardLayout>
  );
}
