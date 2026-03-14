import React from "react";
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart2,
  HelpCircle,
  LogOut,
  ShieldPlus,
  Package,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useAuth();
  
  const allMenuItems = [
    { id: "patient-dashboard", label: "Dashboard", icon: Home, href: "/dashboard/patient", roles: ["patient"] },
    { id: "pharmacy-dashboard", label: "Dashboard", icon: Package, href: "/dashboard/pharmacy", roles: ["pharmacy"] },
    { id: "lab-dashboard", label: "Dashboard", icon: FileText, href: "/dashboard/lab", roles: ["lab"] },
    { id: "admin-dashboard", label: "Dashboard", icon: ShieldPlus, href: "/dashboard/admin", roles: ["admin"] },
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard/doctor", roles: ["doctor"] },
    { id: "patients", label: "Patients", icon: Users, href: "/dashboard/patients", roles: ["admin", "doctor", "pharmacy"] },
    { id: "appointments", label: "Appointments", icon: Calendar, href: "/dashboard/appointments", roles: ["patient", "doctor", "admin"] },
    { id: "reports", label: "Reports", icon: FileText, href: "/dashboard/reports", roles: ["patient", "doctor", "admin"] },
    { id: "analytics", label: "Analytics", icon: BarChart2, href: "/dashboard/analytics", roles: ["admin", "pharmacy", "lab"] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(role || ""));

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    if (onViewChange) {
      // If we are on a page that uses state-based switching (like DoctorDashboard),
      // and the clicked item is one of the handled views, prevent navigation and switch state instead.
      const handledViews = ["dashboard", "patients", "appointments", "reports"];
      if (handledViews.includes(item.id)) {
        e.preventDefault();
        onViewChange(item.id);
      }
    }
  };

  return (
    <aside className="w-64 bg-dark-slate-grey-500 text-white min-h-screen flex flex-col m-4 rounded-3xl overflow-hidden shadow-xl shadow-dark-slate-grey-200/20 fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-deep-teal-500">
          <ShieldPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight tracking-tight">
            MedFlow AI
          </h2>
          <p className="text-[10px] text-dark-slate-grey-800 uppercase tracking-widest font-semibold">
            Medical Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Determine activity: either by state (currentView) or by URL pathname
          const isActive = onViewChange 
            ? currentView === item.id 
            : pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleItemClick(e, item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all group ${
                isActive 
                ? "bg-deep-teal-500 text-white shadow-md shadow-deep-teal-500/20" 
                : "text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-ash-grey-800" : "group-hover:text-ash-grey-500"} transition-colors`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <Link href="/support" className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all text-sm">
          <HelpCircle className="w-4 h-4" />
          Support
        </Link>
        <Link href="/logout" className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-white hover:bg-dark-slate-grey-400 rounded-2xl font-medium transition-all text-sm">
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
