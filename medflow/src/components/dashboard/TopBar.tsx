/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Search, Bell, HelpCircle, Settings } from "lucide-react";

export default function TopBar() {
    return (
        <header className="flex items-center justify-between pb-6 pt-2 w-full bg-transparent">
            <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-slate-grey-500" />
                <input
                    type="text"
                    placeholder="Search patients, records, or symptoms..."
                    className="w-full bg-white text-dark-slate-grey-500 rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-muted-teal-500 text-sm shadow-sm"
                />
            </div>

            <div className="flex items-center gap-6 text-dark-slate-grey-800">
                <button className="relative hover:text-dark-slate-grey-500 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-400 rounded-full border-2 border-ash-grey-900"></span>
                </button>
                <button className="hover:text-dark-slate-grey-500 transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="hover:text-dark-slate-grey-500 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-ash-grey-600">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-dark-slate-grey-500">
                            Dr. Elena Rodriguez
                        </p>
                        <p className="text-xs text-dark-slate-grey-800">Chief Oncologist</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-deep-teal-200 overflow-hidden border-2 border-white shadow-sm">
                        <img
                            src="https://ui-avatars.com/api/?name=Elena+Rodriguez&background=52796f&color=fff"
                            alt="Dr. Elena Rodriguez"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
