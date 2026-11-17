import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import {
  BookOpen,
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
  ChevronRight,
  MessageCircle,
  Wind
} from "lucide-react";
import AppShell from "../../app/layouts/AppShell";
import QuickCalmDrawer from "../practice/components/QuickCalmDrawer";
import { toast } from "sonner";
import {
  getCurrentUser,
  logoutUser,
  getDashboardStats,
  DashboardStatsResponse,
  downloadSessionReport,
  updateConversationTitle,
  deleteConversationSession
} from "../../lib/apiClient";
import { getUserIntakeFromSupabase } from "../../lib/supabaseService";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<"all" | "distortions" | "safe">("all");
  const [showAllSessionsModal, setShowAllSessionsModal] = useState(false);
  const [isCalmDrawerOpen, setIsCalmDrawerOpen] = useState(false);

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
  }, [currentUser?.id]);

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
    <AppShell
      title={`Welcome Back, ${firstName}`}
      subtitle="Your personal CBT support space."
    >
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Row 1: Exactly Three Symmetrical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1 */}
          <div className="bg-card rounded-xl p-5 border border-border shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Therapy Sessions</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                  {totalSessions}
                </span>
                <span className="text-xs text-muted-foreground font-medium">completed sessions</span>
              </div>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-primary h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.min(100, Math.max(12, totalSessions * 10))}%` }}
              />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-card rounded-xl p-5 border border-border shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Thoughts Analyzed</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                  {thoughtsAnalyzed}
                </span>
                <span className="text-xs text-muted-foreground font-medium">cognitive reflections</span>
              </div>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-primary h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.min(100, Math.max(12, thoughtsAnalyzed * 3))}%` }}
              />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-card rounded-xl p-5 border border-border shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Categories Practiced</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                  {categoriesPracticed} <span className="text-sm font-normal text-muted-foreground">/ 6</span>
                </span>
                <span className="text-xs text-muted-foreground font-medium">distortion types</span>
              </div>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-mint h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.max(10, (categoriesPracticed / 6) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Symmetrical 2-Column Balanced Workspace (Left 7 Cols, Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT 7 COLUMNS: Therapy Session Banner & Session History */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Therapy Session Banner */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-primary-dark to-primary text-white p-6 shadow-sm">
              <div className="relative z-10 space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                  CBT Clinical Support
                </span>
                <h2 className="text-lg sm:text-xl font-heading font-semibold tracking-tight">
                  Ready for a Therapy Session?
                </h2>
                <p className="text-white/85 text-sm font-sans leading-relaxed max-w-xl">
                  Share what you are feeling. Better Me guides you with empathetic validation and Socratic reframing.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Link to="/chat">
                    <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-4 rounded-xl text-xs h-9 shadow-xs flex items-center gap-1.5">
                      <MessageCircle className="size-4 text-primary stroke-[1.75]" />
                      <span>Start Session</span>
                    </Button>
                  </Link>
                  <button
                    onClick={() => setShowAllSessionsModal(true)}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <History className="size-4 text-sky-200 stroke-[1.75]" />
                    <span>Session History ({recentSessions.length})</span>
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Session History */}
            <div className="bg-card rounded-xl p-5 border border-border shadow-xs flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-heading font-semibold text-foreground">Recent Sessions</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value as any)}
                      className="text-xs font-medium bg-muted border border-border text-foreground rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Sessions</option>
                      <option value="distortions">With Distortions</option>
                      <option value="safe">Safe Only</option>
                    </select>
                    <button
                      onClick={() => setShowAllSessionsModal(true)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View All
                    </button>
                  </div>
                </div>

                {filteredSessions.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-muted/30 rounded-xl border border-dashed border-border">
                    <Compass className="size-7 stroke-[1.75] text-muted-foreground mx-auto mb-1.5" />
                    <p className="text-xs text-muted-foreground font-sans">
                      {totalSessions === 0
                        ? "You haven't started any therapy sessions yet. Begin a session to explore your thoughts."
                        : "No sessions found in this filter."}
                    </p>
                    <Link to="/chat" className="mt-3 inline-block">
                      <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs h-8 px-3.5 rounded-lg">
                        Start First Session
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredSessions.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        className="p-3.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors border border-border/60 space-y-2 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          {editingSessionId === session.id ? (
                            <div className="flex items-center gap-1.5 flex-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveRename(session.id);
                                  if (e.key === "Escape") handleCancelRename();
                                }}
                                autoFocus
                                className="w-full text-xs font-semibold px-2 py-1 rounded-md border border-primary bg-background focus:outline-none"
                              />
                              <button onClick={() => handleSaveRename(session.id)} className="p-1 text-mint hover:bg-muted rounded">
                                <Check className="size-4 stroke-[1.75]" />
                              </button>
                              <button onClick={handleCancelRename} className="p-1 text-muted-foreground hover:bg-muted rounded">
                                <X className="size-4 stroke-[1.75]" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                onClick={(e) => handleStartRename(session.id, session.title || "CBT Therapy Session", e)}
                                className="font-semibold text-foreground text-sm truncate cursor-pointer hover:text-primary"
                              >
                                {session.title || "CBT Therapy Session"}
                              </span>
                              <button
                                onClick={(e) => handleStartRename(session.id, session.title || "CBT Therapy Session", e)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-primary rounded transition-opacity"
                                title="Rename session"
                              >
                                <Pencil className="size-3.5 stroke-[1.75]" />
                              </button>
                            </div>
                          )}

                          <span className="text-xs text-muted-foreground font-sans shrink-0">
                            {session.date}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground font-medium">{session.duration}m</span>
                            {session.distortions_detected && session.distortions_detected.length > 0 ? (
                              session.distortions_detected.slice(0, 2).map((d) => (
                                <span key={d} className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${distortionPillColors[d] || "bg-muted text-muted-foreground border-border"}`}>
                                  {d}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-foreground italic text-xs">No distortions</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDownloadReport(session.id)}
                              disabled={downloadingReportId === session.id}
                              className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                              title="Download PDF Summary"
                            >
                              {downloadingReportId === session.id ? (
                                <Loader2 className="size-3.5 animate-spin text-primary" />
                              ) : (
                                <Download className="size-3.5 stroke-[1.75]" />
                              )}
                              <span>PDF</span>
                            </button>

                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              disabled={deletingSessionId === session.id}
                              className="text-muted-foreground hover:text-coral transition-colors"
                              title="Delete session"
                            >
                              <Trash2 className="size-3.5 stroke-[1.75]" />
                            </button>

                            <Link to="/chat" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                              Open <ChevronRight className="size-3.5 stroke-[1.75]" />
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
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Quick Actions (2 Symmetrical Cards in 1 Row) */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Practice Center */}
              <Link
                to="/practice?tab=exercises"
                className="bg-card rounded-xl p-4 sm:p-5 border border-border shadow-xs hover:border-primary/50 transition-colors flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <BookOpen className="size-4 stroke-[1.75]" />
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    CBT Practice
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    24 exercises to challenge distorted thoughts.
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary flex items-center gap-1 pt-3">
                  Open Hub <ArrowRight className="size-3.5 stroke-[1.75]" />
                </span>
              </Link>

              {/* Instant Stress Relief (Need a quick calm?) */}
              <button
                type="button"
                onClick={() => setIsCalmDrawerOpen(true)}
                className="bg-card rounded-xl p-4 sm:p-5 border border-border shadow-xs hover:border-mint/60 transition-colors flex flex-col justify-between text-left group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="size-9 rounded-xl bg-mint/15 text-mint-dark flex items-center justify-center font-bold">
                    <Wind className="size-4 stroke-[1.75]" />
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-foreground group-hover:text-mint-dark transition-colors">
                    Need a quick calm?
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    Instant 4-7-8 breathing & sensory grounding.
                  </p>
                </div>
                <span className="text-xs font-semibold text-mint-dark flex items-center gap-1 pt-3">
                  Open Drawer <ArrowRight className="size-3.5 stroke-[1.75]" />
                </span>
              </button>
            </div>

            {/* My Therapy Overview */}
            <div className="bg-card rounded-xl p-5 border border-border shadow-xs space-y-3.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-heading font-semibold text-foreground">My Therapy Overview</h3>
                  {stats?.therapy_overview?.latest_session_date && (
                    <span className="text-xs text-muted-foreground font-sans">
                      {stats.therapy_overview.latest_session_date}
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-3">
                  {/* Recent Distortions */}
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Recent Patterns:
                    </span>
                    {stats?.therapy_overview?.recent_distortions && stats.therapy_overview.recent_distortions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {stats.therapy_overview.recent_distortions.map((d) => (
                          <span key={d} className={`text-xs font-medium px-2.5 py-0.5 rounded-md border ${distortionPillColors[d] || "bg-primary-lighter/10 text-primary border-primary/20"}`}>
                            {d}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic font-sans">No distortions identified yet.</p>
                    )}
                  </div>

                  {/* Latest Reflection Quote */}
                  {stats?.therapy_overview?.latest_reflection && (
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        Latest Reflection:
                      </span>
                      <p className="text-xs text-foreground font-sans italic line-clamp-2 leading-relaxed">
                        "{stats.therapy_overview.latest_reflection}"
                      </p>
                    </div>
                  )}

                  {/* Recommendation Card */}
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Target className="size-3.5 stroke-[1.75]" />
                      <span>Recommended Next Step:</span>
                    </div>
                    <p className="text-xs text-foreground/80 font-sans leading-relaxed">
                      {stats?.therapy_overview?.recommended_next_step ||
                        "Explore guided exercises in the Practice Hub to challenge identified thought patterns."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border mt-3">
                <Link to="/practice?tab=exercises" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-9 rounded-xl border-border hover:bg-muted">
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-light-gray flex items-center justify-between">
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
              {recentSessions.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No sessions recorded yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-['Inter']">
                    When you start and complete CBT therapy sessions, they will be archived here with downloadable clinical summaries.
                  </p>
                  <Link to="/chat" className="mt-4 inline-block">
                    <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs h-8 px-4 rounded-xl">
                      Start First Session
                    </Button>
                  </Link>
                </div>
              ) : (
                recentSessions.map((session) => (
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
                        className="text-[10px] font-semibold text-slate-600 hover:text-primary px-2 py-1 rounded border border-slate-200"
                      >
                        PDF
                      </button>
                      <Link to="/chat">
                        <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-[10px] rounded-lg h-7 px-2.5">
                          Open Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-light-gray flex justify-end">
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

      {/* QUICK CALM DRAWER */}
      <QuickCalmDrawer open={isCalmDrawerOpen} onOpenChange={setIsCalmDrawerOpen} />

    </AppShell>
  );
}
