import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  LayoutDashboard,
  MessageCircle,
  Scale,
  TrendingUp,
  LogOut,
  PhoneCall,
  Menu,
  X,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import { getCurrentUser, logoutUser } from "../services/apiService";
import SafetyAlertModal from "./SafetyAlertModal";
import ServerStatusIndicator from "./ServerStatusIndicator";

interface TherapyNavbarProps {
  onOpenThoughtModal?: () => void;
}

export default function TherapyNavbar({ onOpenThoughtModal }: TherapyNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Therapy Session",
      path: "/chat",
      icon: MessageCircle,
      badge: "Real-time AI",
    },
    {
      label: "Thought Records",
      path: "/thought-records",
      icon: Scale,
    },
    {
      label: "Clinical Progress",
      path: "/progress",
      icon: TrendingUp,
    },
  ];

  const userName = currentUser?.full_name || currentUser?.email?.split("@")[0] || "Client";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo & Clinical Badge */}
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-2.5">
                <img src={logo} alt="Better Me" className="h-8 w-auto object-contain" />
              </Link>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                <Sparkles className="w-3 h-3 text-primary" />
                CBT Clinical Suite
              </span>
            </div>

            {/* Middle: Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`text-xs font-medium px-3.5 h-9 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold shadow-xs hover:bg-primary/15"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-1.5 ${isActive ? "text-primary" : "text-slate-500"}`} />
                      {item.label}
                      {item.badge && (
                        <span className="ml-1.5 text-[9px] font-bold bg-secondary-lighter text-secondary-dark px-1.5 py-0.2 rounded-full border border-secondary/30">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions, Server Status, SOS Help, Profile */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <ServerStatusIndicator />

              {/* Emergency SOS Crisis Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSafetyModalOpen(true)}
                className="border-red-200 bg-red-50/60 text-red-700 hover:bg-red-100 hover:text-red-800 text-xs font-semibold px-2.5 sm:px-3 h-8.5 rounded-lg flex items-center gap-1.5 shadow-2xs"
                title="Immediate 24/7 Helpline & Crisis Support"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span className="hidden sm:inline">SOS Help</span>
              </Button>

              {/* User Avatar & Logout */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full py-1 px-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                    {userInitials || "U"}
                  </div>
                  <span className="text-xs font-medium text-slate-800 max-w-[100px] truncate">
                    {userName}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-8.5 px-2.5 rounded-lg"
                  title="Sign out of Better Me"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Hamburger Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-9 w-9 p-0 text-slate-700"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-[10px] bg-secondary-lighter text-secondary-dark">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                  {userInitials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{userName}</p>
                  <p className="text-[10px] text-slate-500">Client Account</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Global Safety Alert / Crisis Helpline Modal */}
      <SafetyAlertModal open={safetyModalOpen} onOpenChange={setSafetyModalOpen} />
    </>
  );
}
