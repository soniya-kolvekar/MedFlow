import {
  Home,
  Users,
  Calendar,
  FileText,
  HelpCircle,
  LogOut,
  ShieldPlus,
  UserCircle,
  Bell
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ 
  currentView = "dashboard", 
  onViewChange 
}: { 
  currentView?: string; 
  onViewChange?: (view: string) => void 
}) {
  const { logout, role } = useAuth();
  const pathname = usePathname();
  
  // Custom menu items per role (limited to 3-4 items)
  const getMenuItems = () => {
    switch(role) {
      case 'doctor':
        return [
          { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
          { id: "patients", label: "Patients", icon: Users, href: "/dashboard/patients" },
          { id: "appointments", label: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
          { id: "profile", label: "Profile", icon: UserCircle, href: "/dashboard/profile" },
        ];
      case 'pharmacy':
        return [
          { id: "dashboard", label: "Inventory", icon: Home, href: "/dashboard/pharmacy" },
          { id: "reports", label: "Analytics", icon: FileText, href: "/dashboard/reports" },
          { id: "profile", label: "Account", icon: UserCircle, href: "/dashboard/profile" },
        ];
      case 'lab':
        return [
          { id: "dashboard", label: "Lab Queue", icon: Home, href: "/dashboard/lab" },
          { id: "reports", label: "Results", icon: FileText, href: "/dashboard/reports" },
          { id: "profile", label: "Account", icon: UserCircle, href: "/dashboard/profile" },
        ];
      case 'admin':
        return [
          { id: "dashboard", label: "System", icon: Home, href: "/dashboard/admin" },
          { id: "reports", label: "Logs", icon: FileText, href: "/dashboard/reports" },
          { id: "profile", label: "Admin Profile", icon: UserCircle, href: "/dashboard/profile" },
        ];
      default: // patient
        return [
          { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
          { id: "appointments", label: "Schedule", icon: Calendar, href: "/dashboard/appointments" },
          { id: "notifications", label: "Notifications", icon: Bell, href: "/dashboard/patient/notifications" },
          { id: "reports", label: "Health Records", icon: FileText, href: "/dashboard/reports" },
          { id: "profile", label: "My Profile", icon: UserCircle, href: "/dashboard/profile" },
        ];
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    if (onViewChange) {
      const handledViews = ["profile"];
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
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-ash-grey-500"} transition-colors`} />
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
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-dark-slate-grey-800 hover:text-red-500 hover:bg-red-50 rounded-2xl font-medium transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
