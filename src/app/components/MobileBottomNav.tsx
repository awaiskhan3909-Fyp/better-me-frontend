import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Wind,
  LogOut,
} from "lucide-react";
import { logoutUser } from "../services/apiService";

interface MobileBottomNavProps {
  active?: "dashboard" | "chat" | "progress" | "thought-records" | "stress-relief";
}

export default function MobileBottomNav({ active }: MobileBottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Home",
      icon: LayoutDashboard,
      isActive: active === "dashboard" || currentPath === "/dashboard",
    },
    {
      id: "chat",
      path: "/chat",
      label: "AI Chat",
      icon: MessageCircle,
      isActive: active === "chat" || currentPath === "/chat",
    },
    {
      id: "thought-records",
      path: "/thought-records",
      label: "Practice",
      icon: BookOpen,
      isActive: active === "thought-records" || currentPath === "/thought-records",
    },
    {
      id: "stress-relief",
      path: "/stress-relief",
      label: "Relief",
      icon: Wind,
      isActive: active === "stress-relief" || currentPath === "/stress-relief",
    },
    {
      id: "progress",
      path: "/progress",
      label: "Trends",
      icon: TrendingUp,
      isActive: active === "progress" || currentPath === "/progress",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around lg:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 ${
              item.isActive
                ? "text-[#2a5fb7] font-bold"
                : "text-slate-400 hover:text-slate-700 font-medium"
            }`}
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                item.isActive ? "bg-[#ebf3fc] shadow-2xs" : ""
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}

      {/* Quick Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl text-slate-400 hover:text-red-600 transition-colors"
        title="Sign Out"
      >
        <div className="w-10 h-7 rounded-full flex items-center justify-center">
          <LogOut className="w-4 h-4 stroke-[2]" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Exit</span>
      </button>
    </nav>
  );
}

