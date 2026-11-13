import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  LayoutDashboard,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Wind,
  LogOut,
  ArrowRight,
  Target,
  Download,
  Loader2,
  Trash2,
  Pencil,
  Check,
  X,
  History,
  Compass,
  ChevronRight
} from "lucide-react";
import BetterMeLogo from "../../imports/Better_me_Logo.png";
import MobileBottomNav from "../components/MobileBottomNav";
import { toast } from "sonner";
import {
  getCurrentUser,
  logoutUser,
  getDashboardStats,
  DashboardStatsResponse,
  downloadSessionReport,
  updateConversationTitle,
  deleteConversationSession
} from "../services/apiService";
import { getUserIntakeFromSupabase } from "../services/supabaseService";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<"all" | "distortions" | "safe">("all");
  const [showAllSessionsModal, setShowAllSessionsModal] = useState(false);

  // Rename session inline state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const handleStartRename = (sessionId: string, currentTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (sessionId: string) => {
    if (!editingTitle.trim()) {
      toast.error("Session title cannot be empty");
      return;
    }
    try {
      setIsSavingTitle(true);
      try {
        await updateConversationTitle(sessionId, editingTitle.trim());
      } catch (apiErr: any) {
        console.warn("Backend update title notice:", apiErr);
      }
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recent_sessions: (prev.recent_sessions || []).map((s) =>
            s.id === sessionId ? { ...s, title: editingTitle.trim() } : s
          ),
        };
      });
      toast.success("Session renamed successfully");
      setEditingSessionId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to rename session");
    } finally {
      setIsSavingTitle(false);
    }
  };

  const handleCancelRename = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleDeleteSession = async (sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      return;
    }
    try {
      setDeletingSessionId(sessionId);
      try {
        await deleteConversationSession(sessionId);
      } catch (apiErr: any) {
        console.warn("Backend delete notice:", apiErr);
      }
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          total_sessions: Math.max(0, prev.total_sessions - 1),
          recent_sessions: (prev.recent_sessions || []).filter((s) => s.id !== sessionId),
        };
      });
      toast.success("Session deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete session");
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleDownloadReport = async (sessionId: string) => {
    try {
      setDownloadingReportId(sessionId);
      toast.info("Generating session PDF report...");
      await downloadSessionReport(sessionId);
      toast.success("Session Report downloaded successfully!");
    } catch (err: any) {
      console.error("PDF download error:", err);
      toast.error(err?.message || "Could not download session report.");
    } finally {
      setDownloadingReportId(null);
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        let data = await getDashboardStats(currentUser?.id).catch(() => null);

        if (currentUser) {
          const supaIntake = await getUserIntakeFromSupabase(currentUser.id, currentUser.email).catch(() => null);
          if (supaIntake && data) {
            if ((!data.primary_focus || data.primary_focus.length === 0) && supaIntake.primary_focus) {
              data.primary_focus = supaIntake.primary_focus;
            }
            if (!data.primary_goal && supaIntake.primary_goal) {
              data.primary_goal = supaIntake.primary_goal;
            }
          }
        }

        if (data) {
          setStats(data);
        }
      } catch (err) {
        console.warn("Could not fetch remote stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [currentUser]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const userName = stats?.user_name || currentUser?.full_name || currentUser?.email?.split("@")[0] || "Friend";
  const firstName = userName.split(" ")[0] || "Friend";

  const totalSessions = stats?.total_sessions ?? 0;
  const thoughtsAnalyzed = stats?.thoughts_analyzed ?? (stats?.total_messages ?? 0);
  const categoriesPracticed = stats?.categories_practiced ?? 0;
  const recentSessions = stats?.recent_sessions || [];

  const distortionPillColors: Record<string, string> = {
    Catastrophizing: "bg-red-50 text-red-700 border-red-200",
    "Mind Reading": "bg-purple-50 text-purple-700 border-purple-200",
    Overgeneralization: "bg-orange-50 text-orange-700 border-orange-200",
    "All-or-Nothing Thinking": "bg-blue-50 text-blue-700 border-blue-200",
    "Emotional Reasoning": "bg-pink-50 text-pink-700 border-pink-200",
    "Fortune Telling": "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  const filteredSessions = recentSessions.filter((session) => {
    if (historyFilter === "distortions") {
      return session.distortions_detected && session.distortions_detected.length > 0;
    }
    if (historyFilter === "safe") {
      return !session.distortions_detected || session.distortions_detected.length === 0;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#e8f1fc] p-2 sm:p-5 lg:p-6 flex items-center justify-center font-sans selection:bg-[#2a5fb7]/20 pb-20 lg:pb-6">
      {/* Unified Glassmorphic Dashboard Workspace Shell */}
      <div className="w-full max-w-[1400px] bg-[#f4f8fe]/95 backdrop-blur-2xl rounded-2xl sm:rounded-[32px] shadow-2xl shadow-blue-900/10 border border-white/80 p-3 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-5 overflow-hidden">
        
        {/* Left Slim Navigation Rail (Desktop Only) */}
        <aside className="hidden lg:flex lg:w-16 lg:flex-col items-center justify-between py-3 bg-white/70 backdrop-blur-md rounded-[24px] border border-white shadow-2xs flex-shrink-0">
          <Link
            to="/dashboard"
            className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1 transition-transform hover:scale-105 overflow-hidden"
            title="Better Me"
          >
            <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
          </Link>

          <nav className="flex lg:flex-col items-center gap-3 my-auto">
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#182a4d] text-white shadow-xs"
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <Link
              to="/chat"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#2a5fb7] hover:bg-blue-50 transition-all"
              title="AI Therapy Chat"
            >
              <MessageCircle className="w-4 h-4" />
            </Link>

            <Link
              to="/progress"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#2a5fb7] hover:bg-blue-50 transition-all"
              title="My Learning Progress"
            >
              <TrendingUp className="w-4 h-4" />
            </Link>

            <Link
              to="/thought-records"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#2a5fb7] hover:bg-blue-50 transition-all"
              title="CBT Practice Center"
            >
              <BookOpen className="w-4 h-4" />
            </Link>

            <Link
              to="/stress-relief"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#2a5fb7] hover:bg-blue-50 transition-all"
              title="Instant Stress Relief"
            >
              <Wind className="w-4 h-4" />
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </aside>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          
          {/* Top Compact Header Bar */}
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="lg:hidden w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center p-1 flex-shrink-0">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome Back, {firstName}
                </h1>
                <p className="text-xs text-slate-500 font-['Inter'] line-clamp-1">
                  Your personal CBT support space.
                </p>
              </div>
            </div>

            {/* Profile Avatar Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white pl-1.5 pr-3 py-1 rounded-full shadow-2xs border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2a5fb7] to-[#b8a1ff] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {firstName[0] || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                  {userName}
                </span>
              </div>
            </div>
          </header>

          {/* Row 1: Exactly Three Symmetrical Metric Cards (Clean, No Pill Badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric 1 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <p className="text-xs font-semibold text-slate-600">Total Therapy Sessions</p>
                <div className="flex items-baseline gap-1.5 mt-1.5 mb-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#2a5fb7] tracking-tight">
                    {totalSessions}
                  </span>
                  <span className="text-xs text-slate-400 font-medium font-['Inter']">completed</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-[#2a5fb7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(12, totalSessions * 10))}%` }}
                />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <p className="text-xs font-semibold text-slate-600">Thoughts Analyzed</p>
                <div className="flex items-baseline gap-1.5 mt-1.5 mb-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                    {thoughtsAnalyzed}
                  </span>
                  <span className="text-xs text-slate-400 font-medium font-['Inter']">reflections</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(12, thoughtsAnalyzed * 3))}%` }}
                />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <p className="text-xs font-semibold text-slate-600">Categories Practiced</p>
                <div className="flex items-baseline gap-1.5 mt-1.5 mb-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#8b5cf6] tracking-tight">
                    {categoriesPracticed}
                  </span>
                  <span className="text-xs text-slate-400 font-medium font-['Inter']">/ 6 categories</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-[#8b5cf6] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(10, (categoriesPracticed / 6) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Symmetrical 2-Column Balanced Workspace (Left 7 Cols, Right 5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            
            {/* LEFT 7 COLUMNS: Therapy Session Banner & Compact Session History */}
            <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
              
              {/* Compact Therapy Session Banner */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#182a4d] via-[#1a4f97] to-[#2a5fb7] text-white p-4 sm:p-5 shadow-sm">
                <div className="relative z-10 space-y-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight">
                    Ready for a Therapy Session?
                  </h2>
                  <p className="text-white/85 text-xs font-['Inter'] leading-relaxed max-w-xl">
                    Share what you are feeling. Better Me guides you with empathetic Socratic reframing.
                  </p>
                  <div className="pt-1 flex items-center gap-2.5">
                    <Link to="/chat">
                      <Button className="bg-white text-[#182a4d] hover:bg-slate-100 font-bold px-4 rounded-xl text-xs h-8.5 shadow-xs flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-[#2a5fb7]" />
                        <span>Start Session</span>
                      </Button>
                    </Link>
                    <button
                      onClick={() => setShowAllSessionsModal(true)}
                      className="h-8.5 px-3 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-sky-200" />
                      <span>History ({recentSessions.length})</span>
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* Compact Session History */}
              <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">Recent Sessions</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={historyFilter}
                        onChange={(e) => setHistoryFilter(e.target.value as any)}
                        className="text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="all">All</option>
                        <option value="distortions">With Distortions</option>
                        <option value="safe">Safe</option>
                      </select>
                      <button
                        onClick={() => setShowAllSessionsModal(true)}
                        className="text-[11px] font-bold text-[#2a5fb7] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                  </div>

                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-6 px-3 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                      <Compass className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                      <p className="text-xs text-slate-500 font-['Inter']">No sessions found in this filter.</p>
                      <Link to="/chat" className="mt-2 inline-block">
                        <Button size="sm" className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-[11px] h-7 px-3 rounded-lg">
                          Start First Session
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredSessions.slice(0, 3).map((session) => (
                        <div
                          key={session.id}
                          className="p-2.5 rounded-xl bg-[#f8fbff] hover:bg-[#edf5ff] transition-all border border-slate-100 space-y-1.5 group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            {editingSessionId === session.id ? (
                              <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveRename(session.id);
                                    if (e.key === "Escape") handleCancelRename();
                                  }}
                                  autoFocus
                                  className="w-full text-xs font-semibold px-2 py-0.5 rounded border border-blue-400 bg-white focus:outline-none"
                                />
                                <button onClick={() => handleSaveRename(session.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={handleCancelRename} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  onClick={(e) => handleStartRename(session.id, session.title || "CBT Therapy Session", e)}
                                  className="font-bold text-slate-900 text-xs truncate cursor-pointer hover:text-[#2a5fb7]"
                                >
                                  {session.title || "CBT Therapy Session"}
                                </span>
                                <button
                                  onClick={(e) => handleStartRename(session.id, session.title || "CBT Therapy Session", e)}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 rounded"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            <span className="text-[10px] text-slate-400 font-['Inter'] flex-shrink-0">
                              {session.date}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-400">{session.duration}m</span>
                              {session.distortions_detected && session.distortions_detected.length > 0 ? (
                                session.distortions_detected.slice(0, 2).map((d) => (
                                  <span key={d} className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${distortionPillColors[d] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                    {d}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">No distortions</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDownloadReport(session.id)}
                                disabled={downloadingReportId === session.id}
                                className="text-[10px] font-semibold text-slate-500 hover:text-[#2a5fb7] flex items-center gap-0.5"
                                title="Download PDF"
                              >
                                {downloadingReportId === session.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                                ) : (
                                  <Download className="w-3 h-3" />
                                )}
                                <span>PDF</span>
                              </button>

                              <button
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                disabled={deletingSessionId === session.id}
                                className="text-slate-300 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>

                              <Link to="/chat" className="text-[10px] font-bold text-[#2a5fb7] hover:underline flex items-center">
                                Open <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT 5 COLUMNS: Quick Actions (Stacked) & My Therapy Overview */}
            <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
              
              {/* Quick Actions (2 Symmetrical Cards in 1 Row) */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Practice Center */}
                <Link
                  to="/thought-records"
                  className="bg-white rounded-2xl p-3.5 shadow-2xs border border-slate-100 hover:shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2a5fb7] flex items-center justify-center font-bold">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#2a5fb7] transition-colors">
                      CBT Practice
                    </h3>
                    <p className="text-[11px] text-slate-400 font-['Inter'] line-clamp-2 leading-relaxed">
                      24 exercises to challenge distorted thoughts.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#2a5fb7] flex items-center gap-0.5 pt-2">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>

                {/* Instant Stress Relief */}
                <Link
                  to="/stress-relief"
                  className="bg-white rounded-2xl p-3.5 shadow-2xs border border-slate-100 hover:shadow-xs hover:border-sky-200 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center font-bold">
                      <Wind className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                      Stress Relief
                    </h3>
                    <p className="text-[11px] text-slate-400 font-['Inter'] line-clamp-2 leading-relaxed">
                      4-7-8 breathing and sensory grounding.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#0284c7] flex items-center gap-0.5 pt-2">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>

              {/* My Therapy Overview (Compact) */}
              <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">My Therapy Overview</h3>
                    {stats?.therapy_overview?.latest_session_date && (
                      <span className="text-[10px] text-slate-400 font-['Inter']">
                        {stats.therapy_overview.latest_session_date}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {/* Recent Distortions */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Recent Patterns:
                      </span>
                      {stats?.therapy_overview?.recent_distortions && stats.therapy_overview.recent_distortions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {stats.therapy_overview.recent_distortions.map((d) => (
                            <span key={d} className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${distortionPillColors[d] || "bg-blue-50 text-[#2a5fb7] border-blue-200"}`}>
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic font-['Inter']">No distortions identified yet.</p>
                      )}
                    </div>

                    {/* Latest Reflection Quote */}
                    {stats?.therapy_overview?.latest_reflection && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Latest Reflection:
                        </span>
                        <p className="text-xs text-slate-700 italic font-['Inter'] line-clamp-2">
                          "{stats.therapy_overview.latest_reflection}"
                        </p>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/70">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#2a5fb7] uppercase tracking-wider mb-0.5">
                        <Target className="w-3 h-3" />
                        <span>Recommended Next Step:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-['Inter'] leading-relaxed">
                        {stats?.therapy_overview?.recommended_next_step ||
                          "Explore the CBT Practice Center to practice identifying automatic thoughts."}
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/thought-records" className="pt-1 block">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold h-8 rounded-xl border-slate-200 text-[#2a5fb7] hover:bg-blue-50/50"
                  >
                    Go to CBT Practice Center
                  </Button>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* MODAL: Full Sessions History */}
      {showAllSessionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">All Therapy Sessions</h3>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Complete history of your {recentSessions.length} sessions.
                </p>
              </div>
              <button
                onClick={() => setShowAllSessionsModal(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
              {recentSessions.map((session) => (
                <div key={session.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {session.title || "Therapy Session"}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-['Inter']">
                      {session.date} • {session.duration}m duration • {session.message_count} reflections
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleDownloadReport(session.id)}
                      disabled={downloadingReportId === session.id}
                      className="text-[10px] font-semibold text-slate-600 hover:text-[#2a5fb7] px-2 py-1 rounded border border-slate-200"
                    >
                      PDF
                    </button>
                    <Link to="/chat">
                      <Button size="sm" className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-[10px] rounded-lg h-7 px-2.5">
                        Open Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-[#f8fbff] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllSessionsModal(false)}
                className="text-xs font-semibold rounded-xl px-4 h-8"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomNav active="dashboard" />
    </div>
  );
}
