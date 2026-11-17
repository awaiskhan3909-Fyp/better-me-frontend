import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  MessageCircle,
  TrendingUp,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  User,
  Plus,
  Search,
  Trash2,
  CheckCircle,
  History,
  MessageSquare,
} from "lucide-react";
import BetterMeLogo from "../../imports/Better_me_Logo.png";
import MobileBottomNav from "./MobileBottomNav";
import {
  getCurrentUser,
  logoutUser,
  getUserConversations,
  deleteConversationSession,
  ConversationResponse,
} from "../../lib/apiClient";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { toast } from "sonner";

export interface AppShellProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  fullWidth?: boolean;
  hideBottomNav?: boolean;
  hideHeader?: boolean;
  fixedHeight?: boolean;
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
  contentClassName,
  fullWidth = false,
  hideBottomNav = false,
  hideHeader = false,
  fixedHeight = false,
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const currentUser = getCurrentUser();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<ConversationResponse[]>([]);
  const [isChatsDropdownOpen, setIsChatsDropdownOpen] = useState(true);
  const [isAllChatsModalOpen, setIsAllChatsModalOpen] = useState(false);
  const [allChatsSearch, setAllChatsSearch] = useState("");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const activeSessionId = location.search
    ? new URLSearchParams(location.search).get("session")
    : typeof window !== "undefined"
    ? localStorage.getItem("better_me_active_conversation_id")
    : null;

  const loadRecentChats = async () => {
    try {
      const list = await getUserConversations();
      if (Array.isArray(list)) {
        setRecentChats(list);
      }
    } catch {
      // silently ignore if not logged in
    }
  };

  useEffect(() => {
    loadRecentChats();

    const handleUpdate = () => {
      loadRecentChats();
    };

    window.addEventListener("better_me_sessions_updated", handleUpdate);
    return () => {
      window.removeEventListener("better_me_sessions_updated", handleUpdate);
    };
  }, []);

  const handleDeleteChatFromModal = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDeletingChatId(chatId);
      await deleteConversationSession(chatId);
      setRecentChats((prev) => prev.filter((c) => c.id !== chatId));
      toast.success("Chat deleted");
      window.dispatchEvent(new Event("better_me_sessions_updated"));
    } catch {
      toast.error("Could not delete conversation");
    } finally {
      setDeletingChatId(null);
    }
  };

  const filteredAllChats = recentChats.filter((c) =>
    (c.title || "New Session").toLowerCase().includes(allChatsSearch.toLowerCase())
  );

  const userName = currentUser?.full_name || currentUser?.email?.split("@")[0] || "User";
  const firstName = userName.split(" ")[0];

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: currentPath === "/dashboard",
    },
    {
      id: "chat",
      path: "/chat",
      label: "AI Chat Therapy",
      icon: MessageCircle,
      isActive: currentPath === "/chat",
    },
    {
      id: "practice",
      path: "/practice",
      label: "Practice",
      icon: BookOpen,
      isActive: currentPath.startsWith("/practice") || currentPath === "/thought-records" || currentPath === "/stress-relief",
    },
    {
      id: "progress",
      path: "/progress",
      label: "Learning Progress",
      icon: TrendingUp,
      isActive: currentPath === "/progress",
    },
  ];

  return (
    <div
      className={cn(
        "min-h-dvh bg-light-gray/50 flex flex-col md:flex-row font-sans text-foreground antialiased selection:bg-primary/20",
        fixedHeight && "h-dvh max-h-dvh overflow-hidden"
      )}
    >
      {/* =====================================================================
          DESKTOP SIDEBAR (240px Collapsible to 72px)
      ====================================================================== */}
      <aside
        className={cn(
          "hidden md:flex flex-col justify-between border-r border-border bg-card shadow-sm z-30 flex-shrink-0 transition-[width] duration-200 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-[240px]",
          fixedHeight ? "h-dvh max-h-dvh overflow-hidden" : "min-h-dvh"
        )}
      >
        {/* Top: Logo & Collapse Toggle */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-border/60">
            <Link
              to="/dashboard"
              className={cn("flex items-center gap-2.5 overflow-hidden transition-opacity", isCollapsed && "justify-center w-full")}
              title="Better Me"
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-border p-1 flex items-center justify-center shrink-0 shadow-sm">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-heading text-base font-semibold text-foreground tracking-tight truncate">
                    Better Me
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    CBT Companion
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray flex items-center justify-center transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="size-4 stroke-[1.75]" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.id === "chat") {
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center">
                      <Link
                        to={item.path}
                        title={item.label}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors select-none",
                          item.isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-light-gray",
                          isCollapsed && "justify-center px-0 py-3"
                        )}
                      >
                        <Icon className="size-5 stroke-[1.75] shrink-0" />
                        {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      </Link>
                      {!isCollapsed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsChatsDropdownOpen((prev) => !prev);
                          }}
                          className={cn(
                            "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray transition-colors ml-1",
                            item.isActive && "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20"
                          )}
                          title={isChatsDropdownOpen ? "Collapse chats" : "Expand chats"}
                        >
                          <ChevronDown
                            className={cn(
                              "size-3.5 transition-transform duration-200",
                              isChatsDropdownOpen ? "rotate-180" : ""
                            )}
                          />
                        </button>
                      )}
                    </div>

                    {/* Dropdown for 3 Recent Chats */}
                    {!isCollapsed && isChatsDropdownOpen && (
                      <div className="pl-5 pr-1 py-1 space-y-1">
                        {recentChats.slice(0, 3).map((chat) => {
                          const isCurrentActive = activeSessionId === chat.id;
                          return (
                            <Link
                              key={chat.id}
                              to={`/chat?session=${chat.id}`}
                              className={cn(
                                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors truncate group",
                                isCurrentActive
                                  ? "bg-primary/15 text-primary font-semibold"
                                  : "text-muted-foreground hover:text-foreground hover:bg-light-gray"
                              )}
                              title={chat.title || "New Session"}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  isCurrentActive ? "bg-primary" : "bg-muted-foreground/40 group-hover:bg-foreground/60"
                                )}
                              />
                              <span className="truncate">{chat.title || "New Session"}</span>
                            </Link>
                          );
                        })}

                        {recentChats.length === 0 && (
                          <p className="px-2.5 py-1 text-[11px] text-muted-foreground italic">No past sessions</p>
                        )}

                        {/* See All Button */}
                        <button
                          type="button"
                          onClick={() => setIsAllChatsModalOpen(true)}
                          className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-primary hover:text-primary-dark hover:underline transition-colors mt-0.5"
                        >
                          <span>See all {recentChats.length > 0 ? `(${recentChats.length})` : ""}</span>
                          <ChevronRight className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors select-none",
                    item.isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-light-gray",
                    isCollapsed && "justify-center px-0 py-3"
                  )}
                >
                  <Icon className="size-5 stroke-[1.75] shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Expand button (when collapsed), User badge & Logout */}
        <div className="p-3 border-t border-border/60 space-y-2">
          {isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-full h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray flex items-center justify-center transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="size-4 stroke-[1.75]" />
            </button>
          )}

          <div
            className={cn(
              "flex items-center gap-2.5 p-2 rounded-xl bg-light-gray/70 border border-border/50",
              isCollapsed && "justify-center p-2"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{currentUser?.email || "Personal account"}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-coral hover:bg-coral/10 transition-colors",
              isCollapsed && "justify-center px-0"
            )}
            title="Sign out"
          >
            <LogOut className="size-4 stroke-[1.75] shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MOBILE DRAWER BACKDROP & SIDEBAR (md:hidden)
      ====================================================================== */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
        />
      )}

      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-md z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-border p-1 flex items-center justify-center shrink-0">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-semibold text-foreground text-sm">Better Me</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <X className="size-5 stroke-[1.75]" />
            </button>
          </div>

          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.id === "chat") {
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center">
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          item.isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-light-gray"
                        )}
                      >
                        <Icon className="size-5 stroke-[1.75]" />
                        <span className="flex-1 text-left">{item.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIsChatsDropdownOpen((prev) => !prev)}
                        className={cn(
                          "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray transition-colors ml-1",
                          item.isActive && "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20"
                        )}
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isChatsDropdownOpen ? "rotate-180" : ""
                          )}
                        />
                      </button>
                    </div>

                    {isChatsDropdownOpen && (
                      <div className="pl-5 pr-1 py-1 space-y-1">
                        {recentChats.slice(0, 3).map((chat) => {
                          const isCurrentActive = activeSessionId === chat.id;
                          return (
                            <Link
                              key={chat.id}
                              to={`/chat?session=${chat.id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors truncate",
                                isCurrentActive
                                  ? "bg-primary/15 text-primary font-semibold"
                                  : "text-muted-foreground hover:text-foreground hover:bg-light-gray"
                              )}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  isCurrentActive ? "bg-primary" : "bg-muted-foreground/40"
                                )}
                              />
                              <span className="truncate">{chat.title || "New Session"}</span>
                            </Link>
                          );
                        })}

                        {recentChats.length === 0 && (
                          <p className="px-2.5 py-1 text-[11px] text-muted-foreground italic">No past sessions</p>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsAllChatsModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-primary hover:text-primary-dark hover:underline transition-colors mt-0.5"
                        >
                          <span>See all {recentChats.length > 0 ? `(${recentChats.length})` : ""}</span>
                          <ChevronRight className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    item.isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-light-gray"
                  )}
                >
                  <Icon className="size-5 stroke-[1.75]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-border/60 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-light-gray/70 border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{currentUser?.email || "Personal account"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-coral hover:bg-coral/10 transition-colors"
          >
            <LogOut className="size-4 stroke-[1.75] shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MAIN VIEWPORT & TOP BAR
      ====================================================================== */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          fixedHeight ? "h-dvh max-h-dvh overflow-hidden" : "min-h-dvh"
        )}
      >
        {/* Top Header Bar */}
        {!hideHeader && (
          <header className="h-16 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 sticky top-0 z-20 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray flex items-center justify-center transition-colors shrink-0"
                title="Open Navigation Menu"
              >
                <Menu className="size-5 stroke-[1.75]" />
              </button>

              {title && (
                <div className="min-w-0">
                  <h1 className="font-heading text-lg sm:text-xl font-semibold text-foreground tracking-tight truncate leading-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground truncate hidden sm:block">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </header>
        )}

        {/* Content Area: Starts at the top, max-w-6xl, no items-center, no backdrop-blur */}
        <main
          className={cn(
            "flex-1 flex flex-col items-stretch justify-start w-full py-6 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8",
            !fullWidth && "max-w-6xl mx-auto",
            fixedHeight && "min-h-0 overflow-hidden py-2 sm:py-3 px-2 sm:px-4 md:px-6 pb-2 md:pb-3",
            contentClassName
          )}
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        {!hideBottomNav && (
          <div className="md:hidden">
            <MobileBottomNav />
          </div>
        )}
      </div>

      {/* All Conversations Modal */}
      <Dialog open={isAllChatsModalOpen} onOpenChange={setIsAllChatsModalOpen}>
        <DialogContent className="max-w-md w-full max-h-[85vh] flex flex-col p-5 rounded-2xl bg-card border border-border shadow-xl">
          <DialogHeader className="pb-3 border-b border-border/80">
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-base font-bold text-foreground font-heading">
                All Conversations
              </DialogTitle>
              <Button
                size="sm"
                onClick={() => {
                  setIsAllChatsModalOpen(false);
                  navigate("/chat?new=true");
                }}
                className="h-7 text-xs px-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark flex items-center gap-1 shadow-xs"
              >
                <Plus className="size-3.5" />
                <span>New Chat</span>
              </Button>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select a conversation to resume your CBT reflections or view report summaries.
            </DialogDescription>
          </DialogHeader>

          {/* Search Box */}
          <div className="relative my-2">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations by title..."
              value={allChatsSearch}
              onChange={(e) => setAllChatsSearch(e.target.value)}
              className="w-full bg-light-gray pl-8.5 pr-3 py-1.5 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 border border-border/70"
            />
          </div>

          {/* Scrollable Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60 -mx-1 px-1 max-h-[50vh] min-h-[140px]">
            {filteredAllChats.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                {allChatsSearch ? "No conversations match your search." : "No past conversations found."}
              </div>
            ) : (
              filteredAllChats.map((chat) => {
                const isActive = activeSessionId === chat.id;
                const dateStr = new Date(chat.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setIsAllChatsModalOpen(false);
                      navigate(`/chat?session=${chat.id}`);
                    }}
                    className={cn(
                      "p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors rounded-xl my-0.5",
                      isActive ? "bg-primary/10 border-l-3 border-primary" : "hover:bg-light-gray/80"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MessageSquare className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {chat.title || "New Session"}
                          </p>
                          {chat.status === "completed" && (
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-md shrink-0">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{dateStr}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteChatFromModal(chat.id, e)}
                        disabled={deletingChatId === chat.id}
                        className="w-7 h-7 rounded-lg text-muted-foreground hover:text-coral hover:bg-coral/10 flex items-center justify-center transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AppShell;
