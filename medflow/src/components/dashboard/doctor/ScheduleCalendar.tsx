"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval as eachDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Clock, X, Calendar, User, AlignLeft, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
  getDocs,
} from "firebase/firestore";

interface ScheduleEvent {
  id: string;
  title: string;
  patientName: string;
  time: string;
  type: "appointment" | "meeting" | "break" | "call";
  notes: string;
  date: string; // YYYY-MM-DD
  createdAt: Timestamp;
}

const EVENT_TYPES = [
  { id: "appointment", label: "Appointment", color: "bg-deep-teal-500", light: "bg-muted-teal-50 border-muted-teal-200 text-deep-teal-600" },
  { id: "meeting", label: "Meeting", color: "bg-charcoal-blue-500", light: "bg-charcoal-blue-50 border-charcoal-blue-200 text-charcoal-blue-600" },
  { id: "break", label: "Break", color: "bg-amber-500", light: "bg-amber-50 border-amber-200 text-amber-600" },
  { id: "call", label: "Follow-up Call", color: "bg-purple-500", light: "bg-purple-50 border-purple-200 text-purple-600" },
];

function getTypeStyle(type: string) {
  return EVENT_TYPES.find((t) => t.id === type) || EVENT_TYPES[0];
}

export default function ScheduleCalendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    patientName: "",
    time: "09:00",
    type: "appointment",
    notes: "",
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);

  // Generate days for the calendar grid (include leading/trailing days for alignment)
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const allDays = eachDay({ start: calStart, end: calEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Real-time Firestore Listener (no orderBy to avoid composite index)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "scheduleEvents"),
      where("doctorId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList: ScheduleEvent[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ScheduleEvent[];
      setEvents(eventList);
    });

    return () => unsubscribe();
  }, [user]);

  // Seed dummy data once if the doctor has no events yet
  useEffect(() => {
    if (!user) return;
    const seedDummy = async () => {
      const q = query(collection(db, "scheduleEvents"), where("doctorId", "==", user.uid));
      const snap = await getDocs(q);
      if (!snap.empty) return; // already has events

      const today = format(new Date(), "yyyy-MM-dd");
      const tomorrow = format(addMonths(new Date(), 0), "yyyy-MM-dd"); // same month

      const dummyEvents = [
        { title: "Post-op Consultation", patientName: "Vikram Singh", time: "09:00", type: "appointment", notes: "Review surgical recovery and prescribe follow-up meds.", date: today },
        { title: "Staff Meeting", patientName: "Department", time: "11:30", type: "meeting", notes: "Monthly OPD performance review.", date: today },
        { title: "Follow-up Call", patientName: "Anjali Gupta", time: "14:00", type: "call", notes: "Check blood pressure readings.", date: today },
        { title: "Lunch Break", patientName: "", time: "13:00", type: "break", notes: "", date: today },
        { title: "New Patient Walk-in", patientName: "Rahul Sharma", time: "10:30", type: "appointment", notes: "Initial assessment for chronic back pain.", date: format(addMonths(new Date(), 0), "yyyy-MM-") + String(new Date().getDate() + 1).padStart(2, "0") },
      ];

      for (const ev of dummyEvents) {
        await addDoc(collection(db, "scheduleEvents"), {
          ...ev,
          doctorId: user.uid,
          createdAt: Timestamp.now(),
        });
      }
    };
    seedDummy();
  }, [user]);

  const eventsForSelectedDate = events.filter(
    (e) => e.date === format(selectedDate, "yyyy-MM-dd")
  );

  const getEventsForDay = (day: Date) =>
    events.filter((e) => e.date === format(day, "yyyy-MM-dd"));

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "scheduleEvents"), {
        ...form,
        date: format(selectedDate, "yyyy-MM-dd"),
        doctorId: user.uid,
        createdAt: Timestamp.now(),
      });
      setForm({ title: "", patientName: "", time: "09:00", type: "appointment", notes: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "scheduleEvents", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-ash-grey-600/30 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Calendar Side */}
        <div className="lg:col-span-8 p-8 border-r border-ash-grey-600/30">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-dark-slate-grey-500 tracking-tight">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <p className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest mt-1">
                {events.length} events this month
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2.5 rounded-xl bg-ash-grey-900 border border-ash-grey-800 hover:bg-ash-grey-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-dark-slate-grey-800" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2.5 rounded-xl bg-ash-grey-900 border border-ash-grey-800 hover:bg-ash-grey-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-dark-slate-grey-800" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {allDays.map((day, idx) => {
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDay = isToday(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const dayEvents = getEventsForDay(day);

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedDate(day)}
                  className={`relative p-1.5 rounded-2xl min-h-[52px] flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? "bg-dark-slate-grey-500 text-white shadow-xl shadow-dark-slate-grey-500/20"
                      : isTodayDay
                      ? "bg-deep-teal-500/10 border-2 border-deep-teal-500"
                      : isCurrentMonth
                      ? "hover:bg-ash-grey-900 border border-transparent"
                      : "opacity-30"
                  }`}
                >
                  <span className={`text-sm font-bold leading-none mt-1 ${isSelected ? "text-white" : isTodayDay ? "text-deep-teal-600" : "text-dark-slate-grey-500"}`}>
                    {format(day, "d")}
                  </span>
                  {/* Event Dots */}
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((ev, i) => {
                        const style = getTypeStyle(ev.type);
                        return (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/60" : style.color}`}
                          />
                        );
                      })}
                    </div>
                  )}
                  {dayEvents.length > 3 && (
                    <span className={`text-[8px] font-black ${isSelected ? "text-white/70" : "text-ash-grey-600"}`}>
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-ash-grey-800">
            {EVENT_TYPES.map((type) => (
              <div key={type.id} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${type.color}`} />
                <span className="text-[10px] font-bold text-ash-grey-600 uppercase tracking-widest">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events Side */}
        <div className="lg:col-span-4 bg-ash-grey-900/30 p-8 flex flex-col min-h-[600px]">
          {/* Selected Date Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-black text-dark-slate-grey-800 uppercase tracking-widest mb-1">
                {format(selectedDate, "EEEE")}
              </p>
              <h3 className="text-xl font-black text-dark-slate-grey-500 tracking-tight">
                {format(selectedDate, "do MMMM")}
              </h3>
            </div>
            <motion.button
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 rounded-xl bg-deep-teal-500 text-white flex items-center justify-center shadow-lg hover:bg-deep-teal-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Event List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <AnimatePresence mode="popLayout">
              {eventsForSelectedDate.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <Calendar className="w-10 h-10 text-ash-grey-700 mb-3" />
                  <p className="text-sm font-bold text-ash-grey-600">No events scheduled</p>
                  <p className="text-[11px] text-ash-grey-700 mt-1">Click the + button to add one</p>
                </motion.div>
              ) : (
                eventsForSelectedDate
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((event) => {
                    const style = getTypeStyle(event.type);
                    return (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, x: 20, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.97 }}
                        className="group bg-white rounded-3xl border border-ash-grey-800 p-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest mb-2 ${style.light}`}>
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </div>
                            <h4 className="font-bold text-dark-slate-grey-500 text-sm truncate">{event.title}</h4>
                            {event.patientName && (
                              <div className="flex items-center gap-1 mt-1">
                                <User className="w-3 h-3 text-ash-grey-600" />
                                <p className="text-[11px] font-bold text-ash-grey-600 uppercase tracking-widest truncate">{event.patientName}</p>
                              </div>
                            )}
                            {event.notes && (
                              <p className="text-[11px] text-ash-grey-600 mt-1.5 line-clamp-2">{event.notes}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-ash-grey-700 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 pt-2 border-t border-ash-grey-900">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${style.light}`}>
                            {style.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-slate-grey-500/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-dark-slate-grey-500">New Event</h3>
                  <p className="text-[11px] font-bold text-ash-grey-600 uppercase tracking-widest mt-1">
                    {format(selectedDate, "EEEE, do MMMM")}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl text-ash-grey-600 hover:bg-ash-grey-900 hover:text-dark-slate-grey-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                {/* Event Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Event Title *</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-12 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl px-4 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all"
                    placeholder="e.g. Post-op Consultation"
                  />
                </div>

                {/* Patient / Notes split */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Patient / Person</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash-grey-600" />
                      <input
                        type="text"
                        value={form.patientName}
                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                        className="w-full h-12 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl pl-10 pr-4 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all"
                        placeholder="Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash-grey-600" />
                      <input
                        required
                        type="time"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="w-full h-12 bg-ash-grey-900 border border-ash-grey-800 rounded-2xl pl-10 pr-4 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Event Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EVENT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setForm({ ...form, type: type.id })}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 text-[11px] font-bold transition-all ${
                          form.type === type.id
                            ? `${type.light} border-current`
                            : "border-ash-grey-800 bg-ash-grey-900 text-ash-grey-600 hover:border-ash-grey-700"
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${type.color}`} />
                        {type.label}
                        {form.type === type.id && <Check className="w-3 h-3 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-ash-grey-600 uppercase tracking-widest ml-1">Notes (optional)</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-ash-grey-600" />
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full bg-ash-grey-900 border border-ash-grey-800 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-dark-slate-grey-500 focus:outline-none focus:ring-2 focus:ring-deep-teal-500/20 focus:border-deep-teal-500 transition-all resize-none"
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-12 rounded-2xl border border-ash-grey-800 bg-ash-grey-900 text-sm font-black text-ash-grey-600 hover:bg-ash-grey-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-12 rounded-2xl bg-dark-slate-grey-500 text-white text-sm font-black shadow-lg shadow-dark-slate-grey-500/25 hover:bg-dark-slate-grey-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
