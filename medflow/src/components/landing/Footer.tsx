import Link from "next/link";
import { ShieldPlus } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ash-grey-900 pt-16 pb-8 border-t border-ash-grey-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-2 w-max">
              <ShieldPlus className="h-6 w-6 text-dark-slate-grey-500" />
              <span className="text-lg font-bold tracking-tight text-dark-slate-grey-500">
                MedFlow AI
              </span>
            </Link>
            <p className="max-w-xs text-sm text-charcoal-blue-600 leading-relaxed font-medium">
              The future of clinical communication, powered by ethical AI and
              deep medical intelligence.
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-wider text-charcoal-blue-100">
              Platform
            </h4>
            <ul className="space-y-4 text-sm font-medium text-charcoal-blue-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  Multilingual Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  AI Records
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  API & Integration
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-wider text-charcoal-blue-100">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium text-charcoal-blue-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  Trust Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-wider text-charcoal-blue-100">
              Compliance
            </h4>
            <ul className="space-y-4 text-sm font-medium text-charcoal-blue-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  HIPAA Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  GDPR Standards
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  Data Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-deep-teal-500 transition-colors"
                >
                  Ethics & Safety
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-ash-grey-800 pt-8">
          <p className="text-xs font-medium text-charcoal-blue-700 mb-4 md:mb-0">
            © {new Date().getFullYear()} MedFlow AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium text-charcoal-blue-700">
            <Link
              href="#"
              className="hover:text-dark-slate-grey-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-dark-slate-grey-500 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="hover:text-dark-slate-grey-500 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="hover:text-dark-slate-grey-500 transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
