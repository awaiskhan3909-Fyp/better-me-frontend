import React, { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  PieChart,
  Filter,
  Cpu,
  Activity,
  Server,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import BetterMeLogo from "../../imports/Better_me_Logo.png";
import { getCurrentUser, logoutUser } from "../../lib/apiClient";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";

export interface AdminShellProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
  contentClassName,
}: AdminShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const currentUser = getCurrentUser();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Role Gate: Redirect non-admins
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not admin (and not testing with dev key), redirect to /dashboard
  const hasDevKey = typeof window !== "undefined" && Boolean(localStorage.getItem("better_me_admin_key"));
  if (currentUser.role !== "admin" && !hasDevKey) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navItems = [
    {
      id: "overview",
      path: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      isActive: currentPath === "/admin" || currentPath === "/admin/overview",
    },
    {
      id: "users",
      path: "/admin/users",
      label: "Users Cohort",
      icon: Users,
      isActive: currentPath === "/admin/users",
    },
    {
      id: "safety",
      path: "/admin/safety",
      label: "Safety & Crisis",
      icon: ShieldAlert,
      isActive: currentPath === "/admin/safety",
    },
    {
      id: "distortions",
      path: "/admin/distortions",
      label: "Distortions",
      icon: PieChart,
      isActive: currentPath === "/admin/distortions",
    },
    {
      id: "sessions-funnel",
      path: "/admin/sessions-funnel",
      label: "Session Funnel",
      icon: Filter,
      isActive: currentPath === "/admin/sessions-funnel",
    },
    {
      id: "ai-ops",
      path: "/admin/ai-ops",
      label: "AI Operations",
      icon: Cpu,
      isActive: currentPath === "/admin/ai-ops",
    },
    {
      id: "engagement",
      path: "/admin/engagement",
      label: "Engagement",
      icon: Activity,
      isActive: currentPath === "/admin/engagement",
    },
    {
      id: "system",
      path: "/admin/system",
      label: "System Health",
      icon: Server,
      isActive: currentPath === "/admin/system",
    },
  ];

  return (
    <div className="min-h-dvh bg-light-gray flex flex-col font-sans">
      {/* Mobile Header Bar */}
      <header className="lg:hidden h-14 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="size-5 stroke-[1.75]" /> : <Menu className="size-5 stroke-[1.75]" />}
          </button>
          <img src={BetterMeLogo} alt="Better Me" className="h-6 w-auto object-contain" />
          <Badge variant="secondary" className="text-[10px] font-semibold">
            Admin
          </Badge>
        </div>

        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-xs font-medium h-8">
            <ArrowLeft className="size-3.5 stroke-[1.75] mr-1" />
            Patient View
          </Button>
        </Link>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 animate-in fade-in-50">
          <div className="w-64 bg-card h-full flex flex-col p-4 shadow-md border-r border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={BetterMeLogo} alt="Better Me" className="h-6 w-auto object-contain" />
                <Badge variant="secondary" className="text-[10px] font-semibold">Admin Console</Badge>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4 stroke-[1.75]" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                      item.isActive
                        ? "bg-primary text-white font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <IconComponent className="size-4 stroke-[1.75]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-border space-y-2">
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start h-9">
                  <ArrowLeft className="size-3.5 stroke-[1.75] mr-2" />
                  Exit to Patient App
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full text-xs justify-start text-coral hover:bg-coral/10 h-9"
              >
                <LogOut className="size-3.5 stroke-[1.75] mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Main Layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar (Collapsible) */}
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-card border-r border-border shrink-0 sticky top-0 h-screen transition-[width] duration-200 z-30",
            isCollapsed ? "w-16" : "w-60"
          )}
        >
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center gap-2 min-w-0">
                <img src={BetterMeLogo} alt="Better Me" className="h-7 w-auto object-contain shrink-0" />
                <Badge variant="secondary" className="text-[10px] font-semibold shrink-0">
                  Admin
                </Badge>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted mx-auto"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="size-4 stroke-[1.75]" /> : <ChevronLeft className="size-4 stroke-[1.75]" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    item.isActive
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <IconComponent className="size-4 stroke-[1.75] shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border space-y-1.5">
            <Link to="/dashboard" title={isCollapsed ? "Return to Patient App" : undefined}>
              <button
                type="button"
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <ArrowLeft className="size-4 stroke-[1.75] shrink-0" />
                {!isCollapsed && <span className="truncate">Patient App</span>}
              </button>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title={isCollapsed ? "Log Out" : undefined}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-coral hover:bg-coral/10 transition-colors font-medium",
                isCollapsed && "justify-center px-2"
              )}
            >
              <LogOut className="size-4 stroke-[1.75] shrink-0" />
              {!isCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="hidden lg:flex h-16 bg-card border-b border-border items-center justify-between px-8 sticky top-0 z-20">
            <div>
              <h1 className="text-base font-heading font-semibold text-foreground tracking-tight">
                {title || "Admin Console"}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground font-sans">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {actions}
              <div className="flex items-center gap-2 pl-3 border-l border-border text-xs">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                  <ShieldCheck className="size-4 stroke-[1.75]" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-semibold text-foreground block leading-tight">
                    {currentUser.full_name || "Admin"}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">Clinical Supervisor</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Page Content */}
          <main className={cn("flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto", contentClassName)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminShell;
