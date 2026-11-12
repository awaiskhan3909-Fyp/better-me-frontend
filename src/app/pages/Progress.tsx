import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import BetterMeLogo from "../../imports/Better_me_Logo.png";
import MobileBottomNav from "../components/MobileBottomNav";
import {
  LayoutDashboard,
  MessageCircle,
  TrendingUp,
  BookOpen,
  LogOut,
  AlertTriangle,
  Eye,
  Globe,
  Split,
  HeartPulse,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Check,
  X,
  ChevronRight,
  Brain,
  History,
  FileText,
  Target,
  Loader2,
  Layers,
  Wind
} from "lucide-react";
import {
  getCurrentUser,
  getUserCBTExercises,
  getUserCBTExerciseProgress,
  CBTExerciseRecord,
  CBTExerciseProgressSummary
} from "../services/apiService";
import {
  CBT_DISTORTION_CATEGORIES,
  TOTAL_PRACTICE_EXERCISES,
  DistortionCategory,
  CBTExerciseItem
} from "../data/cbtExercisesData";

export default function Progress() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [exerciseProgress, setExerciseProgress] = useState<CBTExerciseProgressSummary | null>(null);
  const [submissions, setSubmissions] = useState<CBTExerciseRecord[]>([]);
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
      const [prog, subs] = await Promise.all([
        getUserCBTExerciseProgress(currentUser.id).catch(() => null),
        getUserCBTExercises(currentUser.id).catch(() => [])
      ]);
      if (prog) setExerciseProgress(prog);
      setSubmissions(subs || []);
    } catch (err) {
      console.warn("Could not load user learning progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [currentUser]);

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
  // - Prioritize distortion categories with fewer completed exercises.
  // - If equal progress, select in consistent list order.
  // - Pick first uncompleted exercise in that category.
  // - If user has 0 completed, recommends Catastrophizing (first exercise).
  const getRecommendedExercise = (): CBTExerciseItem | null => {
    const categoriesWithCount = CBT_DISTORTION_CATEGORIES.map((cat) => {
      const count = cat.exercises.filter((ex) => completedIds.includes(ex.id)).length;
      return { cat, count };
    });

    const incomplete = categoriesWithCount.filter((item) => item.count < 4);
    if (incomplete.length === 0) {
      return null; // All 24 completed!
    }

    const minCompleted = Math.min(...incomplete.map((item) => item.count));
    const targetCategory = incomplete.find((item) => item.count === minCompleted)!.cat;

    const nextExercise = targetCategory.exercises.find((ex) => !completedIds.includes(ex.id));
    return nextExercise || targetCategory.exercises[0];
  };

  const recommendedExercise = getRecommendedExercise();

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
        return <Brain className={className} />;
    }
  };

  const userName = currentUser?.full_name || currentUser?.email?.split("@")[0] || "Friend";
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#e8f1fc] p-2 sm:p-6 lg:p-8 flex items-center justify-center font-sans selection:bg-[#2a5fb7]/20 pb-20 lg:pb-8">
      {/* Unified Glassmorphic Workspace Shell */}
      <div className="w-full max-w-[1480px] bg-[#f4f8fe]/95 backdrop-blur-2xl rounded-2xl sm:rounded-[36px] shadow-2xl shadow-blue-900/10 border border-white/80 p-3.5 sm:p-7 flex flex-col lg:flex-row gap-4 sm:gap-6 overflow-hidden">
        
        {/* Left Slim Icon Navigation Rail (Desktop Only) */}
        <aside className="hidden lg:flex lg:w-20 lg:flex-col items-center justify-between py-4 px-0 bg-white/70 backdrop-blur-md rounded-[28px] border border-white shadow-xs flex-shrink-0">
          <Link
            to="/dashboard"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-blue-900/10 flex items-center justify-center p-1.5 transition-transform hover:scale-105 overflow-hidden"
            title="Better Me"
          >
            <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
          </Link>

          <nav className="flex lg:flex-col items-center gap-3 sm:gap-4 my-auto">
            <Link
              to="/dashboard"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>

            <Link
              to="/chat"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="CBT Chat Session"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>

            <button
              className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#182a4d] text-white shadow-md shadow-slate-900/20"
              title="My Learning Progress"
            >
              <TrendingUp className="w-5 h-5" />
            </button>

            <Link
              to="/thought-records"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="CBT Practice Center"
            >
              <BookOpen className="w-5 h-5" />
            </Link>

            <Link
              to="/stress-relief"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="Instant Stress Relief"
            >
              <Wind className="w-5 h-5" />
            </Link>
          </nav>

          <div className="flex lg:flex-col items-center gap-3">
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
          
          {/* Top Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="lg:hidden w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1.5 flex-shrink-0">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>My Learning Progress</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-['Inter'] line-clamp-1 sm:line-clamp-none">
                  Track your CBT learning journey, practice activities, and progress in understanding your thinking patterns.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
              <Link to="/thought-records">
                <Button size="sm" className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs h-8.5 sm:h-9 px-3.5 rounded-xl shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  Practice Center
                </Button>
              </Link>

              <div className="flex items-center gap-2 bg-white pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-full shadow-xs border border-slate-100">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#2a5fb7] to-[#b8a1ff] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {firstName[0] || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                  {userName}
                </span>
              </div>
            </div>
          </header>

          {/* SECTION 1: Practice Overview (2 Simple Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Exercises Completed */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">Exercises Completed</p>
                <div className="flex items-baseline gap-2 mt-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#2a5fb7] tracking-tight">
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
                  className="bg-[#2a5fb7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, overallPercentage)}%` }}
                />
              </div>
            </div>

            {/* Card 2: Distortions Practiced */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">Distortions Practiced</p>
                <div className="flex items-baseline gap-2 mt-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#8b5cf6] tracking-tight">
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
                  className="bg-[#8b5cf6] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(6, (distortionsPracticedCount / 6) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Recommended Next Practice */}
          <div className="bg-gradient-to-br from-[#182a4d] via-[#1a3a6d] to-[#2a5fb7] text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
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
                      All 24 Exercises Mastered! 🎉
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
                    className="w-full md:w-auto bg-white text-[#182a4d] hover:bg-slate-100 font-bold text-xs h-9 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Start Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Link to="/thought-records" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-white text-[#182a4d] hover:bg-slate-100 font-bold text-xs h-9 px-4 rounded-xl">
                      Browse Center
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* SECTION 2: My Practice Progress (All 6 Categories with Real Progress Bars) */}
          <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-7 shadow-xs border border-slate-100 space-y-4">
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
                const stat = exerciseProgress?.categories_progress?.[cat.name] || {
                  completed: cat.exercises.filter((ex) => completedIds.includes(ex.id)).length,
                  total: 4,
                  percentage: Math.round(
                    (cat.exercises.filter((ex) => completedIds.includes(ex.id)).length / 4) * 100
                  ),
                };
                const isMastered = stat.completed === 4;

                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-[#f8fbff] hover:bg-[#edf5ff] border border-slate-100/90 transition-all flex flex-col justify-between space-y-3"
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
                              ? "bg-blue-50 text-[#2a5fb7] border border-blue-200"
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
                          className="h-full rounded-full transition-all duration-300"
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
          <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-7 shadow-xs border border-slate-100 space-y-4">
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
                  className="text-xs font-semibold text-[#2a5fb7] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
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
                <Link to="/thought-records">
                  <Button size="sm" className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs rounded-xl mt-2 h-9 px-4">
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
                      className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {sub.exercise_title}
                          </h4>
                          <span className="text-[10px] font-bold text-[#2a5fb7] bg-blue-50 border border-blue-200/80 px-2 py-0.2 rounded-full flex-shrink-0">
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
                          className="text-xs text-[#2a5fb7] hover:bg-blue-50 font-semibold h-8 px-2.5 rounded-lg"
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
      </div>

      {/* MODAL: Full Practice History View */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
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
                        <span className="text-[10px] font-bold text-[#2a5fb7] bg-blue-50 border border-blue-200/80 px-2 py-0.2 rounded-full">
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

            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-[#f8fbff] flex justify-end">
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#2a5fb7] block">
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

            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-[#f8fbff] flex justify-end">
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

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomNav active="progress" />
    </div>
  );
}
