import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import AppShell from "../../app/layouts/AppShell";
import {
  BookOpen,
  AlertTriangle,
  Eye,
  Globe,
  Split,
  HeartPulse,
  Compass,
  CheckCircle2,
  ArrowRight,
  Clock,
  Check,
  X,
  ChevronRight,
  History,
  FileText,
  Target,
  Loader2,
  Layers,
  Tag,
  TrendingUp,
  Wind
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import {
  getCurrentUser,
  getUserCBTExercises,
  getUserCBTExerciseProgress,
  getDashboardStats,
  getUserConversations,
  CBTExerciseRecord,
  CBTExerciseProgressSummary,
  DashboardStatsResponse,
  ConversationResponse
} from "../../lib/apiClient";
import {
  CBT_DISTORTION_CATEGORIES,
  TOTAL_PRACTICE_EXERCISES,
  DistortionCategory,
  CBTExerciseItem
} from "../practice/data/cbtExercisesData";

export default function Progress() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [exerciseProgress, setExerciseProgress] = useState<CBTExerciseProgressSummary | null>(null);
  const [submissions, setSubmissions] = useState<CBTExerciseRecord[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null);
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [reviewRecord, setReviewRecord] = useState<CBTExerciseRecord | null>(null);

  const fetchProgressData = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [prog, subs, statsData, convs] = await Promise.all([
        getUserCBTExerciseProgress(currentUser.id).catch(() => null),
        getUserCBTExercises(currentUser.id).catch(() => []),
        getDashboardStats(currentUser.id).catch(() => null),
        getUserConversations(currentUser.id).catch(() => []),
      ]);
      if (prog) setExerciseProgress(prog);
      setSubmissions(subs || []);
      if (statsData) setDashboardStats(statsData);
      setConversations(convs || []);
    } catch (err) {
      console.warn("Could not load user learning progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [currentUser?.id]);

  const handleLogout = () => {
    navigate("/login");
  };

  // 1. Overview Statistics
  const totalCompleted = exerciseProgress?.total_completed ?? submissions.length;
  const overallPercentage = exerciseProgress?.completion_percentage ?? Math.round((totalCompleted / 24) * 100);

  // Count unique distortion categories practiced (completed at least 1 exercise)
  const completedIds = exerciseProgress?.completed_exercise_ids || submissions.map((s) => s.exercise_id);
  const distortionsPracticedCount = CBT_DISTORTION_CATEGORIES.filter((cat) =>
    cat.exercises.some((ex) => completedIds.includes(ex.id))
  ).length;

  // 2. Recommendation Engine Logic:
  const getRecommendedExercise = (): CBTExerciseItem | null => {
    const categoriesWithCount = CBT_DISTORTION_CATEGORIES.map((cat) => {
      const count = cat.exercises.filter((ex) => completedIds.includes(ex.id)).length;
      return { cat, count };
    });

    const incomplete = categoriesWithCount.filter((item) => item.count < item.cat.exercises.length);
    if (incomplete.length === 0) {
      return null; // All completed!
    }

    const minCompleted = Math.min(...incomplete.map((item) => item.count));
    const targetCategory = incomplete.find((item) => item.count === minCompleted)!.cat;

    const nextExercise = targetCategory.exercises.find((ex) => !completedIds.includes(ex.id));
    return nextExercise || targetCategory.exercises[0];
  };

  const recommendedExercise = getRecommendedExercise();

  // Cognitive Distortion Trends Over Time (memoized to prevent resize observer jitter on scroll)
  const distortionTrendData = useMemo(() => {
    return [...(dashboardStats?.emotional_trends || [])]
      .reverse()
      .map((item, idx) => {
        const d = new Date(item.date);
        const formattedDate = isNaN(d.getTime())
          ? item.date
          : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return {
          sessionLabel: formattedDate || `Session ${idx + 1}`,
          date: item.date,
          Catastrophizing: item.distortion_counts?.["Catastrophizing"] || 0,
          "Mind Reading": item.distortion_counts?.["Mind Reading"] || 0,
          Overgeneralization: item.distortion_counts?.["Overgeneralization"] || 0,
          "All-or-Nothing Thinking": item.distortion_counts?.["All-or-Nothing Thinking"] || 0,
          "Emotional Reasoning": item.distortion_counts?.["Emotional Reasoning"] || 0,
          "Fortune Telling": item.distortion_counts?.["Fortune Telling"] || 0,
          totalMessages: item.total_messages || 0,
        };
      });
  }, [dashboardStats?.emotional_trends]);

  const totalDistortionsRecorded = useMemo(() => {
    return distortionTrendData.reduce((acc, curr) => {
      return (
        acc +
        curr.Catastrophizing +
        curr["Mind Reading"] +
        curr.Overgeneralization +
        curr["All-or-Nothing Thinking"] +
        curr["Emotional Reasoning"] +
        curr["Fortune Telling"]
      );
    }, 0);
  }, [distortionTrendData]);

  // Render Icon Helper
  const renderDistortionIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case "AlertTriangle":
        return <AlertTriangle className={className} />;
      case "Eye":
        return <Eye className={className} />;
      case "Globe":
        return <Globe className={className} />;
      case "Split":
        return <Split className={className} />;
      case "HeartPulse":
        return <HeartPulse className={className} />;
      case "Compass":
        return <Compass className={className} />;
      default:
        return <Tag className={className} />;
    }
  };

  const userName = currentUser?.full_name || currentUser?.email?.split("@")[0] || "Friend";
  const firstName = userName.split(" ")[0];

  return (
    <AppShell
      title="My Learning Progress"
      subtitle="Track your CBT learning journey, practice activities, and progress in understanding your thinking patterns."
      actions={
        <Link to="/practice">
          <Button size="sm" className="bg-primary text-primary-foreground text-xs h-8.5 sm:h-9 px-3.5 rounded-xl shadow-xs">
            <BookOpen className="size-3.5 stroke-[1.75] mr-1.5" />
            Practice Center
          </Button>
        </Link>
      }
    >
      <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
        {/* SECTION 1: Practice Overview (2 Simple Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Exercises Completed */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">Exercises Completed</p>
                <div className="flex items-baseline gap-2 mt-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                    {totalCompleted}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold font-['Inter']">
                    / {TOTAL_PRACTICE_EXERCISES} total available ({overallPercentage}%)
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Guided Socratic cognitive distortion exercises completed
                </p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-primary h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.max(4, overallPercentage)}%` }}
                />
              </div>
            </div>

            {/* Card 2: Distortions Practiced */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">Distortions Practiced</p>
                <div className="flex items-baseline gap-2 mt-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-lavender-dark tracking-tight">
                    {distortionsPracticedCount}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold font-['Inter']">
                    / 6 categories ({Math.round((distortionsPracticedCount / 6) * 100)}%)
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Thinking patterns with at least one completed practice reflection
                </p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-lavender h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.max(6, (distortionsPracticedCount / 6) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Recommended Next Practice */}
          <div className="bg-gradient-to-br from-slate-900 via-primary-dark to-primary text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-1.5 max-w-2xl">
                <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider block">
                  Recommended Next Practice
                </span>

                {recommendedExercise ? (
                  <>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight">
                      {recommendedExercise.title}
                    </h2>
                    <p className="text-xs text-white/85 font-['Inter'] leading-relaxed line-clamp-2">
                      "{recommendedExercise.scenario}"
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-white/75 font-['Inter']">
                      <span>Target: {recommendedExercise.categoryName}</span>
                      <span>•</span>
                      <span>~{recommendedExercise.estimatedMinutes} mins</span>
                      <span>•</span>
                      <span>{recommendedExercise.difficulty}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight">
                      All 24 Exercises Mastered!
                    </h2>
                    <p className="text-xs text-white/85 font-['Inter'] leading-relaxed">
                      Congratulations! You have completed all guided exercises across the six cognitive distortions.
                    </p>
                  </>
                )}
              </div>

              <div className="flex-shrink-0 w-full md:w-auto pt-1 md:pt-0">
                {recommendedExercise ? (
                  <Button
                    onClick={() => navigate(`/thought-records?exercise=${recommendedExercise.id}`)}
                    className="w-full md:w-auto bg-white text-foreground hover:bg-slate-100 font-bold text-xs h-9 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Start Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Link to="/thought-records" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-white text-foreground hover:bg-slate-100 font-bold text-xs h-9 px-4 rounded-xl">
                      Browse Center
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* SECTION: Cognitive Distortion Trends Over Time (Recharts Chart) */}
          <div className="bg-white rounded-2xl sm:rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-100 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2 className="text-base font-bold text-slate-900">Cognitive Distortion Trends Over Time</h2>
                </div>
                <p className="text-xs text-slate-400 font-['Inter'] mt-0.5">
                  Frequency of thinking patterns detected by the clinical AI classifier across your therapy sessions.
                </p>
              </div>

              {totalDistortionsRecorded > 0 && (
                <span className="text-[11px] font-semibold text-primary bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  {totalDistortionsRecorded} Distortions Identified
                </span>
              )}
            </div>

            {totalDistortionsRecorded === 0 || distortionTrendData.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-primary mx-auto flex items-center justify-center mb-2.5">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Distortion Trends Recorded Yet</h3>
                <p className="text-xs text-slate-400 font-['Inter'] max-w-sm mx-auto mt-1 leading-relaxed">
                  As you engage in CBT therapy sessions, your identified cognitive distortions and thinking patterns over time will automatically appear here.
                </p>
                <Link to="/chat" className="mt-3.5 inline-block">
                  <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs h-8 px-4 rounded-xl shadow-xs">
                    Start CBT Session <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="w-full pt-2">
                <div className="h-[280px] sm:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distortionTrendData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="sessionLabel"
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          border: "1px solid var(--border)",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                        iconType="circle"
                      />
                      <Bar dataKey="Catastrophizing" stackId="distortions" fill="var(--coral)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Mind Reading" stackId="distortions" fill="var(--lavender)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Overgeneralization" stackId="distortions" fill="var(--primary-lighter)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="All-or-Nothing Thinking" stackId="distortions" fill="var(--primary)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Emotional Reasoning" stackId="distortions" fill="var(--mint)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Fortune Telling" stackId="distortions" fill="var(--primary-dark)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: My Practice Progress (All 6 Categories with Real Progress Bars) */}
          <div className="bg-white rounded-2xl sm:rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-100 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="text-base font-bold text-slate-900">My Practice Progress</h2>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Real-time completion tracking across each of the six cognitive distortion categories (4 exercises per distortion).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
              {CBT_DISTORTION_CATEGORIES.map((cat) => {
                const totalInCat = cat.exercises.length;
                const completedInCat = cat.exercises.filter((ex) => completedIds.includes(ex.id)).length;
                const stat = exerciseProgress?.categories_progress?.[cat.name] || {
                  completed: completedInCat,
                  total: totalInCat,
                  percentage: totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0,
                };
                const isMastered = stat.completed >= totalInCat;

                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-light-gray hover:bg-light-blue/20 border border-slate-100/90 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${cat.themeColor}15`,
                              color: cat.themeColor,
                            }}
                          >
                            {renderDistortionIcon(cat.iconName, "w-4 h-4")}
                          </div>
                          <span className="text-xs font-bold text-slate-900 truncate">{cat.name}</span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isMastered
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : stat.completed > 0
                              ? "bg-blue-50 text-primary border border-blue-200"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {stat.completed} / 4 Completed
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-['Inter'] line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                        <span>Progress</span>
                        <span style={{ color: cat.themeColor }}>{stat.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-300"
                          style={{
                            width: `${stat.percentage}%`,
                            backgroundColor: cat.themeColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Recent Practice Activity (Latest 5 Exercises) */}
          <div className="bg-white rounded-2xl sm:rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-100 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Practice Activity</h2>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Your latest completed CBT cognitive reframing exercises.
                </p>
              </div>

              {submissions.length > 0 && (
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>View All History ({submissions.length})</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-10 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Loading your practice activity...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-700">No Practice Activity Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-['Inter']">
                  Begin your learning journey by completing your first guided exercise in the CBT Practice Center.
                </p>
                <Link to="/practice">
                  <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs rounded-xl mt-2 h-9 px-4">
                    Explore CBT Practice Center <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {submissions.slice(0, 5).map((sub) => {
                  const dateStr = new Date(sub.completed_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={sub.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 px-3 rounded-xl transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {sub.exercise_title}
                          </h4>
                          <span className="text-[10px] font-bold text-primary bg-blue-50 border border-blue-200/80 px-2 py-0.2 rounded-full flex-shrink-0">
                            {sub.distortion_category}
                          </span>
                        </div>
                        {sub.answers?.q5 && (
                          <p className="text-xs text-slate-500 line-clamp-1 italic font-['Inter']">
                            "{sub.answers.q5}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                        <span className="text-[11px] text-slate-400 font-['Inter']">{dateStr}</span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Completed
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReviewRecord(sub)}
                          className="text-xs text-primary hover:bg-blue-50 font-semibold h-8 px-2.5 rounded-lg"
                        >
                          Review Answers
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      {/* MODAL: Full Practice History View */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-light-gray flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">All Practice History</h3>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Complete record of your {submissions.length} completed CBT practice reflections.
                </p>
              </div>

              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
              {submissions.map((sub) => {
                const dateStr = new Date(sub.completed_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={sub.id}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary bg-blue-50 border border-blue-200/80 px-2 py-0.2 rounded-full">
                          {sub.distortion_category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{sub.exercise_title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 font-['Inter']">Completed: {dateStr}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowHistoryModal(false);
                          setReviewRecord(sub);
                        }}
                        className="text-xs font-semibold h-8 px-3 rounded-xl border-slate-200 hover:bg-slate-50"
                      >
                        Revisit Answers
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-light-gray flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryModal(false)}
                className="text-xs font-semibold rounded-xl px-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Review Saved Answers */}
      {reviewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-light-gray flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-primary block">
                  {reviewRecord.distortion_category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {reviewRecord.exercise_title}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Completed on {new Date(reviewRecord.completed_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => setReviewRecord(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Scenario:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-['Inter'] leading-relaxed">
                  "{reviewRecord.scenario}"
                </p>
              </div>

              {/* Saved Q&A list */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-red-50/50 border border-red-100 text-xs">
                  <span className="font-bold text-red-700 block text-[10px] uppercase">
                    1. What negative thought or assumption were you experiencing?
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q1 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    2. What evidence supported that thought?
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q2 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    3. What evidence contradicted that thought?
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q3 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    4. What was another possible explanation?
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q4 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-700 block text-[10px] uppercase">
                    5. Balanced & Realistic Perspective:
                  </span>
                  <p className="text-emerald-950 font-semibold mt-0.5 font-['Inter']">
                    "{reviewRecord.answers?.q5 || "N/A"}"
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-light-gray flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReviewRecord(null)}
                className="text-xs font-semibold rounded-xl px-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </AppShell>
  );
}
