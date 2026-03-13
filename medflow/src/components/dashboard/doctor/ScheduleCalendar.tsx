"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScheduleCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Mock slots for selected day
    const slots = [
        { id: 1, time: "09:00 AM", task: "Post-op Consultation", patient: "Vikram Singh" },
        { id: 2, time: "10:30 AM", task: "New Patient Walk-in", patient: "Rahul Sharma" },
        { id: 3, time: "02:00 PM", task: "Staff Meeting", patient: "Department" },
        { id: 4, time: "04:30 PM", task: "Follow-up Call", patient: "Anjali Gupta" },
    ];

    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-sm border border-ash-grey-600/30 overflow-hidden">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
                {/* Calendar Side */}
                <div className="lg:col-span-8 p-8 border-r border-ash-grey-600/30 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-dark-slate-grey-500 tracking-tight">
                                {format(currentDate, "MMMM yyyy")}
                            </h2>
                            <p className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest mt-1">
                                Real-time Schedule Sync
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2.5 rounded-xl bg-ash-grey-900 border border-ash-grey-800 hover:bg-ash-grey-800 transition-colors">
                                <ChevronLeft className="w-5 h-5 text-dark-slate-grey-800" />
                            </button>
                            <button onClick={nextMonth} className="p-2.5 rounded-xl bg-ash-grey-900 border border-ash-grey-800 hover:bg-ash-grey-800 transition-colors">
                                <ChevronRight className="w-5 h-5 text-dark-slate-grey-800" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest mb-4">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 grid grid-cols-7 gap-2">
                        {days.map((day, idx) => {
                            const isSelected = isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, new Date());
                            return (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedDate(day)}
                                    className={`relative aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${
                                        isSelected 
                                        ? 'bg-dark-slate-grey-500 text-white border-dark-slate-grey-500 shadow-xl shadow-dark-slate-grey-500/20' 
                                        : 'bg-white border-ash-grey-600/30 hover:border-deep-teal-500/50'
                                    }`}
                                >
                                    <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-dark-slate-grey-500'}`}>
                                        {format(day, "d")}
                                    </span>
                                    {isToday && !isSelected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-deep-teal-500" />
                                    )}
                                    {/* Mock dots for appointments */}
                                    <div className="flex gap-0.5 mt-1">
                                        {[1, 2, 3].slice(0, (idx % 3) + 1).map(i => (
                                            <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/40' : 'bg-ash-grey-800'}`} />
                                        ))}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Details Side */}
                <div className="lg:col-span-4 bg-ash-grey-900/50 p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest mb-1 font-mono">
                                {format(selectedDate, "EEEE")}
                            </p>
                            <h3 className="text-xl font-black text-dark-slate-grey-500 tracking-tight">
                                {format(selectedDate, "do MMM")}
                            </h3>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-deep-teal-500 text-white flex items-center justify-center shadow-lg transform hover:rotate-90 transition-transform duration-300">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedDate.toISOString()}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                {slots.map(slot => (
                                    <div key={slot.id} className="bg-white p-5 rounded-3xl border border-ash-grey-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-deep-teal-600 bg-muted-teal-50 px-2 py-0.5 rounded-lg border border-muted-teal-100">
                                                <Clock className="w-3 h-3" /> {slot.time}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-dark-slate-grey-500 text-sm mb-1">{slot.task}</h4>
                                        <p className="text-[11px] font-bold text-ash-grey-600 uppercase tracking-widest">{slot.patient}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
