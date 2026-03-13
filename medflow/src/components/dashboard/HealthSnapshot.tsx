import { Calendar, User, FileText, Pill, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SnapshotItem {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  borderColor: string;
}

export default function HealthSnapshot() {
  const snapshots: SnapshotItem[] = [
    {
      title: "Upcoming Appointment",
      value: "Dr. Mehta",
      subtitle: "Cardiology • Tomorrow 10:30 AM",
      icon: Calendar,
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "Recent Consultation",
      value: "Dr. Sarah Jenkins",
      subtitle: "Completed • Today 10:00 AM",
      icon: User,
      color: "text-deep-teal-600 bg-deep-teal-50",
      borderColor: "border-deep-teal-100"
    },
    {
      title: "Pending Test",
      value: "Full Blood Count",
      subtitle: "Scheduled for Mar 15",
      icon: FileText,
      color: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-100"
    },
    {
      title: "Prescription Status",
      value: "Ready for Pickup",
      subtitle: "City Central Pharmacy",
      icon: Pill,
      color: "text-purple-600 bg-purple-50",
      borderColor: "border-purple-100"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {snapshots.map((item, i) => (
        <motion.div
           key={item.title}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.1 }}
           className={`group relative overflow-hidden rounded-2xl bg-white p-5 border ${item.borderColor} shadow-sm transition-all hover:shadow-md hover:border-transparent cursor-pointer`}
        >
           <div className="flex items-center gap-4 mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                 <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-blue-500">{item.title}</span>
           </div>
           
           <div>
              <h4 className="text-lg font-bold text-dark-slate-grey-500 mb-1">{item.value}</h4>
              <p className="text-xs font-medium text-charcoal-blue-600">{item.subtitle}</p>
           </div>
           
           <div className={`absolute bottom-0 left-0 h-1 w-full bg-current ${item.color.split(' ')[0]} opacity-20`} />
           
           <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-charcoal-blue-400 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
        </motion.div>
      ))}
    </div>
  );
}
