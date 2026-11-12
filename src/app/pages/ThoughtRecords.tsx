import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
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
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Clock,
  Check,
  X,
  ChevronRight,
  FileText,
  Brain,
  ShieldCheck,
  Calendar,
  Layers,
  Loader2,
  Wind
} from "lucide-react";
import {
  getCurrentUser,
  submitCBTExercise,
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
import ServerStatusIndicator from "../components/ServerStatusIndicator";
import { toast } from "sonner";

export default function ThoughtRecords() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = getCurrentUser();

  // Active Top Tab: 'categories' (Main Grid) | 'history' (Saved Records)
  const [activeTab, setActiveTab] = useState<"categories" | "history">("categories");

  // Progress & Submissions state from real database
  const [progressSummary, setProgressSummary] = useState<CBTExerciseProgressSummary | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<CBTExerciseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Category modal view (when clicking 'Start Practice' on a category card)
  const [selectedCategory, setSelectedCategory] = useState<DistortionCategory | null>(null);

  // Active Exercise flow
  const [activeExercise, setActiveExercise] = useState<CBTExerciseItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionSuccessData, setCompletionSuccessData] = useState<{
    exerciseTitle: string;
    distortionCategory: string;
    answers: Record<string, string>;
  } | null>(null);

  // Review mode for previously completed exercise
  const [reviewRecord, setReviewRecord] = useState<CBTExerciseRecord | null>(null);

  // Load progress and submissions from backend
  const fetchUserPracticeData = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [progress, subs] = await Promise.all([
        getUserCBTExerciseProgress(currentUser.id).catch(() => null),
        getUserCBTExercises(currentUser.id).catch(() => [])
      ]);
      if (progress) {
        setProgressSummary(progress);
      }
      setUserSubmissions(subs || []);
    } catch (err) {
      console.warn("Could not load user CBT practice data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPracticeData();
  }, [currentUser]);

  // Open exercise if requested via URL query params (e.g. from Progress page recommendations)
  useEffect(() => {
    const exerciseParam = searchParams.get("exercise");
    if (exerciseParam) {
      for (const cat of CBT_DISTORTION_CATEGORIES) {
        const found = cat.exercises.find((ex) => ex.id === exerciseParam);
        if (found) {
          handleStartExercise(found);
          break;
        }
      }
    }
  }, [searchParams]);

  const handleLogout = () => {
    navigate("/login");
  };

  // Helper to check if an exercise is completed
  const isExerciseCompleted = (exerciseId: string): boolean => {
    if (progressSummary?.completed_exercise_ids) {
      return progressSummary.completed_exercise_ids.includes(exerciseId);
    }
    return userSubmissions.some((s) => s.exercise_id === exerciseId && s.is_completed);
  };

  // Helper to get category completed count
  const getCategoryCompletedCount = (categoryName: string): number => {
    if (progressSummary?.categories_progress) {
      const match = Object.entries(progressSummary.categories_progress).find(
        ([catKey]) => catKey.toLowerCase() === categoryName.toLowerCase()
      );
      if (match) return match[1].completed;
    }
    return userSubmissions.filter(
      (s) => s.distortion_category.toLowerCase() === categoryName.toLowerCase() && s.is_completed
    ).length;
  };

  // Open Exercise Modal for Practice
  const handleStartExercise = (exercise: CBTExerciseItem) => {
    setActiveExercise(exercise);
    setCurrentQuestionIndex(0);

    // If already completed previously, pre-populate saved answers
    const existing = userSubmissions.find((s) => s.exercise_id === exercise.id);
    if (existing && existing.answers) {
      setAnswers({
        q1: existing.answers.q1 || "",
        q2: existing.answers.q2 || "",
        q3: existing.answers.q3 || "",
        q4: existing.answers.q4 || "",
        q5: existing.answers.q5 || ""
      });
    } else {
      setAnswers({ q1: "", q2: "", q3: "", q4: "", q5: "" });
    }
    setCompletionSuccessData(null);
  };

  // Review a previously completed exercise
  const handleOpenReview = (record: CBTExerciseRecord) => {
    setReviewRecord(record);
  };

  // Step Navigation in Active Exercise
  const handleNextQuestion = () => {
    if (!activeExercise) return;
    const currentKey = `q${currentQuestionIndex + 1}`;
    if (!answers[currentKey]?.trim()) {
      toast.error("Please enter your reflection before moving to the next question.");
      return;
    }
    if (currentQuestionIndex < activeExercise.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Submit Completed Exercise
  const handleCompleteExercise = async () => {
    if (!activeExercise || !currentUser?.id) return;

    // Validate final question
    const currentKey = `q${currentQuestionIndex + 1}`;
    if (!answers[currentKey]?.trim()) {
      toast.error("Please complete your balanced reframe before finishing.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        user_id: currentUser.id,
        distortion_category: activeExercise.categoryName,
        exercise_id: activeExercise.id,
        exercise_title: activeExercise.title,
        scenario: activeExercise.scenario,
        answers: answers,
        is_completed: true
      };

      const result = await submitCBTExercise(payload);

      // Update local state immediately for seamless UX
      setUserSubmissions((prev) => {
        const filtered = prev.filter((s) => s.exercise_id !== activeExercise.id);
        return [result, ...filtered];
      });

      // Show completion congratulations modal
      setCompletionSuccessData({
        exerciseTitle: activeExercise.title,
        distortionCategory: activeExercise.categoryName,
        answers: { ...answers }
      });

      toast.success("Exercise completed & saved to your profile!");
      fetchUserPracticeData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save exercise submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Category Icon Helper
  const renderDistortionIcon = (iconName: string, className: string = "w-6 h-6") => {
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

  const totalCompleted = progressSummary?.total_completed ?? userSubmissions.length;
  const overallPercentage = progressSummary?.completion_percentage ?? Math.round((totalCompleted / 24) * 100);

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

            <Link
              to="/progress"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="Analytics & Trends"
            >
              <TrendingUp className="w-5 h-5" />
            </Link>

            <button
              className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#182a4d] text-white shadow-md shadow-slate-900/20"
              title="CBT Practice Center"
            >
              <BookOpen className="w-5 h-5" />
            </button>

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
          
          {/* Top Header Bar */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="lg:hidden w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1.5 flex-shrink-0">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>CBT Practice Center</span>
                  <span className="text-xs font-semibold text-[#2a5fb7] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full hidden sm:inline">
                    Interactive Studio
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-['Inter'] line-clamp-1 sm:line-clamp-none">
                  Explore your thinking patterns, challenge unhelpful thoughts, and develop healthier perspectives through guided exercises.
                </p>
              </div>
            </div>

            {/* Top Right Actions & Profile */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
              {/* Tab Selector Pill */}
              <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "categories"
                      ? "bg-[#2a5fb7] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  6 Distortions
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "history"
                      ? "bg-[#2a5fb7] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>My Submissions</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
                    {userSubmissions.length}
                  </span>
                </button>
              </div>

              <ServerStatusIndicator />

              {/* User Profile Avatar */}
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

          {/* Overall Studio Milestone Banner */}
          <div className="bg-white rounded-2xl sm:rounded-[26px] p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Cognitive Mastery Progress
                </p>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {totalCompleted} of {TOTAL_PRACTICE_EXERCISES} Guided Exercises Completed ({overallPercentage}%)
              </h2>
              <p className="text-xs text-slate-500 font-['Inter']">
                Each exercise challenges an automatic distortion using Socratic questions to build neural resilience.
              </p>
            </div>

            <div className="w-full md:w-64 flex flex-col gap-1.5 flex-shrink-0">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Overall Completion</span>
                <span className="text-[#2a5fb7] font-bold">{overallPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#2a5fb7] to-[#8b5cf6] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(5, overallPercentage)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                {24 - totalCompleted} exercises remaining
              </p>
            </div>
          </div>

          {/* TAB 1: 6 Distortions Practice Grid */}
          {activeTab === "categories" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {CBT_DISTORTION_CATEGORIES.map((category) => {
                const completedCount = getCategoryCompletedCount(category.name);
                const percent = Math.round((completedCount / 4) * 100);
                const isAllDone = completedCount === 4;

                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-2xl sm:rounded-[26px] p-5 sm:p-6 shadow-xs border border-slate-100/90 flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all group"
                  >
                    <div>
                      {/* Top Category Badge & Icon */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: `${category.themeColor}15`,
                            color: category.themeColor,
                          }}
                        >
                          {renderDistortionIcon(category.iconName, "w-5 h-5")}
                        </div>

                        <span className="text-xs font-semibold text-slate-500 font-['Inter']">
                          {completedCount} / 4 completed
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#2a5fb7] transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-['Inter'] mt-1.5 leading-relaxed min-h-[38px]">
                        {category.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                      {/* Mini Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold mb-1 text-slate-500">
                          <span>Progress</span>
                          <span style={{ color: category.themeColor }}>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: category.themeColor,
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => setSelectedCategory(category)}
                        className="w-full bg-[#182a4d] hover:bg-[#2a5fb7] text-white text-xs font-semibold h-9.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        {isAllDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Review Exercises</span>
                          </>
                        ) : completedCount > 0 ? (
                          <>
                            <span>Continue Practice</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Start Practice</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: All Saved Completed Records View */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Saved Practice Reflections</h2>
                  <p className="text-xs text-slate-400 font-['Inter']">
                    Revisit any completed exercise to review your original thoughts and rational reframes.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                  {userSubmissions.length} Submissions Logged
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Loading your exercise history...</span>
                </div>
              ) : userSubmissions.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-700">No Exercises Completed Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Choose one of the six cognitive distortions above and complete your first guided practice session.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("categories")}
                    className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white rounded-xl text-xs mt-2"
                  >
                    Browse Categories
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {userSubmissions.map((sub) => {
                    const completedDate = new Date(sub.completed_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });

                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleOpenReview(sub)}
                        className="p-4 rounded-2xl bg-[#f8fbff] hover:bg-[#edf5ff] border border-slate-100 transition-all cursor-pointer space-y-2.5 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-[#2a5fb7] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                            {sub.distortion_category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-['Inter']">{completedDate}</span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2a5fb7] transition-colors">
                            {sub.exercise_title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-['Inter']">
                            {sub.scenario}
                          </p>
                        </div>

                        {sub.answers?.q5 && (
                          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/90 text-xs text-emerald-950">
                            <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-700 mb-0.5">
                              Your Balanced Reframe:
                            </span>
                            <span className="line-clamp-2 italic">"{sub.answers.q5}"</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                          <span className="font-semibold text-[#2a5fb7] inline-flex items-center gap-0.5 group-hover:underline">
                            View Full Answers <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Category Exercises Selection Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#f8fbff]">
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs flex-shrink-0"
                  style={{
                    backgroundColor: `${selectedCategory.themeColor}20`,
                    color: selectedCategory.themeColor,
                  }}
                >
                  {renderDistortionIcon(selectedCategory.iconName, "w-5 h-5")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCategory.name} Practice</h3>
                  <p className="text-xs text-slate-500 font-['Inter'] mt-0.5">{selectedCategory.description}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Exercises List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
              {selectedCategory.exercises.map((ex, index) => {
                const done = isExerciseCompleted(ex.id);

                return (
                  <div
                    key={ex.id}
                    className={`pt-3.5 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl transition-all ${
                      done ? "bg-emerald-50/30 border border-emerald-100/60" : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">{ex.title}</h4>
                        {done && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded-full inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-['Inter'] line-clamp-2 leading-relaxed">
                        {ex.scenario}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{ex.estimatedMinutes} mins
                        </span>
                        <span>•</span>
                        <span>{ex.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-end sm:self-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(null);
                          handleStartExercise(ex);
                        }}
                        className={`text-xs font-semibold rounded-xl h-8.5 px-3.5 shadow-2xs ${
                          done
                            ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            : "bg-[#2a5fb7] hover:bg-[#1a4f97] text-white"
                        }`}
                      >
                        {done ? "Retake / Edit" : "Begin Exercise"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Interactive Step-by-Step Exercise Modal */}
      {activeExercise && !completionSuccessData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Exercise Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#2a5fb7] block">
                  {activeExercise.categoryName} Practice
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {activeExercise.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveExercise(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scenario Callout */}
            <div className="px-4 sm:px-6 pt-4 pb-2">
              <div className="bg-slate-50 border border-slate-200/70 p-3 sm:p-3.5 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  The Situation Context:
                </p>
                <p className="text-xs sm:text-sm text-slate-700 font-['Inter'] leading-relaxed">
                  "{activeExercise.scenario}"
                </p>
              </div>
            </div>

            {/* Step Progress Dots */}
            <div className="px-4 sm:px-6 py-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span>
                  Question {currentQuestionIndex + 1} of {activeExercise.questions.length}
                </span>
                <span className="text-[#2a5fb7] font-bold">
                  {Math.round(((currentQuestionIndex + 1) / activeExercise.questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#2a5fb7] to-[#4a7fd7] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / activeExercise.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Question & Text Area */}
            <div className="p-4 sm:px-6 sm:py-4 overflow-y-auto flex-1 space-y-3">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {activeExercise.questions[currentQuestionIndex].question}
                </h4>
                <p className="text-xs text-slate-400 font-['Inter']">
                  💡 {activeExercise.questions[currentQuestionIndex].guidance}
                </p>
              </div>

              <textarea
                rows={4}
                value={answers[`q${currentQuestionIndex + 1}`] || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [`q${currentQuestionIndex + 1}`]: e.target.value,
                  })
                }
                placeholder={activeExercise.questions[currentQuestionIndex].placeholder}
                className="w-full rounded-2xl border border-slate-200 p-3 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a5fb7]/25 focus:border-[#2a5fb7] transition-all resize-none bg-white shadow-2xs font-['Inter']"
                autoFocus
              />
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-[#f8fbff] flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="text-xs font-semibold rounded-xl h-9 px-3.5 border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>

              {currentQuestionIndex < activeExercise.questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={handleNextQuestion}
                  className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs font-semibold rounded-xl h-9 px-4 shadow-xs"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleCompleteExercise}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl h-9 px-5 shadow-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Complete Exercise</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Completion Congratulations Modal */}
      {completionSuccessData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in zoom-in-95">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-700 block">
                Exercise Completed
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Great job challenging this distortion!
              </h3>
              <p className="text-xs text-slate-500 font-['Inter'] mt-1">
                You successfully broke down <strong>{completionSuccessData.exerciseTitle}</strong> into realistic, objective evidence.
              </p>
            </div>

            {/* Quick summary comparison */}
            <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2.5 border border-slate-100 text-xs font-['Inter']">
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                  Original Distorted Thought:
                </span>
                <p className="text-slate-700 italic">"{completionSuccessData.answers.q1}"</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  New Balanced Perspective:
                </span>
                <p className="text-slate-900 font-semibold">"{completionSuccessData.answers.q5}"</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button
                onClick={() => {
                  setCompletionSuccessData(null);
                  setActiveExercise(null);
                }}
                className="w-full bg-[#182a4d] hover:bg-[#2a5fb7] text-white text-xs font-semibold rounded-xl h-10 shadow-xs"
              >
                Back to Practice Center
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Review Saved Exercise Modal */}
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

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Scenario:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-['Inter'] leading-relaxed">
                  "{reviewRecord.scenario}"
                </p>
              </div>

              {/* Saved Q&A */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-red-50/50 border border-red-100 text-xs">
                  <span className="font-bold text-red-700 block text-[10px] uppercase">
                    1. Distorted Thought:
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q1 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    2. Supporting Evidence:
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q2 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    3. Contradicting Evidence:
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q3 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    4. Alternative Explanation:
                  </span>
                  <p className="text-slate-800 mt-0.5 font-['Inter']">{reviewRecord.answers?.q4 || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-700 block text-[10px] uppercase">
                    5. Balanced & Compassionate Perspective:
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
      <MobileBottomNav active="thought-records" />
    </div>
  );
}
