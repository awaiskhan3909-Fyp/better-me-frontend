import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../components/ui/utils";
import {
  Search,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  X,
  ChevronRight,
  Filter,
  Loader2,
  BookOpen,
  AlertTriangle,
  Eye,
  Globe,
  Split,
  HeartPulse,
  Compass,
  Info,
  Calendar,
  History,
} from "lucide-react";
import {
  getCurrentUser,
  submitCBTExercise,
  getUserCBTExercises,
  getUserCBTExerciseProgress,
  getDashboardStats,
  CBTExerciseRecord,
  CBTExerciseProgressSummary,
} from "../../../lib/apiClient";
import {
  CBT_DISTORTION_CATEGORIES,
  ALL_PRACTICE_EXERCISES,
  TOTAL_PRACTICE_EXERCISES,
  CBTExerciseItem,
} from "../data/cbtExercisesData";
import { toast } from "sonner";

interface CbtExercisesTabProps {
  onNavigateTab?: (tab: "exercises" | "relief" | "records") => void;
}

export function CbtExercisesTab({ onNavigateTab }: CbtExercisesTabProps) {
  const currentUser = getCurrentUser();

  // Progress and API data
  const [progressSummary, setProgressSummary] = useState<CBTExerciseProgressSummary | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<CBTExerciseRecord[]>([]);
  const [recentDistortions, setRecentDistortions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistortion, setSelectedDistortion] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<"all" | "quick" | "deep">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "Beginner" | "Intermediate" | "Advanced">("all");
  const [page, setPage] = useState(1);

  // Detail Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeExercise, setActiveExercise] = useState<CBTExerciseItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  // History Review Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [reviewRecord, setReviewRecord] = useState<CBTExerciseRecord | null>(null);

  // Load initial progress and user stats
  const fetchData = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [summary, submissions, dashboardStats] = await Promise.all([
        getUserCBTExerciseProgress(currentUser.id).catch(() => null),
        getUserCBTExercises(currentUser.id).catch(() => []),
        getDashboardStats(currentUser.id).catch(() => null),
      ]);

      if (summary) setProgressSummary(summary);
      if (submissions) setUserSubmissions(submissions);

      // Extract recent distortions from dashboard stats
      const recent = dashboardStats?.therapy_overview?.recent_distortions || [];
      const fromBreakdown = Object.keys(dashboardStats?.distortions_breakdown || {});
      const combined = Array.from(new Set([...recent, ...fromBreakdown])).filter(Boolean);
      setRecentDistortions(combined);
    } catch (err) {
      console.warn("Could not load exercise progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.id]);

  // Close exercise popup modal on Escape key press
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  // Set of completed exercise IDs
  const completedIds = useMemo(() => {
    return new Set(userSubmissions.map((s) => s.exercise_id));
  }, [userSubmissions]);

  // Compute "Recommended for you" exercises based on user's recent distortions
  const recommendedExercises = useMemo(() => {
    if (ALL_PRACTICE_EXERCISES.length === 0) return [];

    // Helper to normalize distortion names
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

    const matched: CBTExerciseItem[] = [];

    // 1. Check if user's recent distortions match any categories
    recentDistortions.forEach((dist) => {
      const normDist = normalize(dist);
      const categoryMatches = ALL_PRACTICE_EXERCISES.filter(
        (ex) =>
          normalize(ex.categoryName).includes(normDist) ||
          normDist.includes(normalize(ex.categoryName))
      );
      categoryMatches.forEach((ex) => {
        if (!matched.some((m) => m.id === ex.id)) {
          matched.push(ex);
        }
      });
    });

    // 2. If fewer than 3, prioritize uncompleted exercises or General CBT foundations
    if (matched.length < 3) {
      const generalAndUncompleted = ALL_PRACTICE_EXERCISES.filter(
        (ex) => !matched.some((m) => m.id === ex.id)
      ).sort((a, b) => {
        const aComp = completedIds.has(a.id) ? 1 : 0;
        const bComp = completedIds.has(b.id) ? 1 : 0;
        return aComp - bComp;
      });

      matched.push(...generalAndUncompleted.slice(0, 3 - matched.length));
    }

    return matched.slice(0, 3);
  }, [recentDistortions, completedIds]);

  // Filter exercises based on Search, Distortion, Duration, Difficulty
  const filteredExercises = useMemo(() => {
    return ALL_PRACTICE_EXERCISES.filter((ex) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ex.title.toLowerCase().includes(q);
        const matchesCat = ex.categoryName.toLowerCase().includes(q);
        const matchesScenario = ex.scenario.toLowerCase().includes(q);
        const matchesTakeaway = ex.learningTakeaway.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesScenario && !matchesTakeaway) {
          return false;
        }
      }

      // 2. Distortion filter
      if (selectedDistortion !== "all") {
        if (ex.categoryId !== selectedDistortion) {
          return false;
        }
      }

      // 3. Duration filter
      if (selectedDuration === "quick" && ex.estimatedMinutes > 5) return false;
      if (selectedDuration === "deep" && ex.estimatedMinutes <= 5) return false;

      // 4. Difficulty filter
      if (selectedDifficulty !== "all" && ex.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDistortion, selectedDuration, selectedDifficulty]);

  // Open detail drawer for an exercise
  const handleOpenExercise = (exercise: CBTExerciseItem) => {
    setActiveExercise(exercise);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompletedSuccess(false);
    setDrawerOpen(true);
  };

  // Step navigation in Drawer
  const handleNextStep = () => {
    if (!activeExercise) return;
    const currentQKey = `q${currentQuestionIndex + 1}`;
    if (!answers[currentQKey] || !answers[currentQKey].trim()) {
      toast.error("Please answer the reflection prompt before proceeding.");
      return;
    }

    if (currentQuestionIndex < activeExercise.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitExercise();
    }
  };

  const handlePrevStep = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Submit exercise to backend API
  const handleSubmitExercise = async () => {
    if (!activeExercise || !currentUser?.id) return;
    try {
      setIsSubmitting(true);
      const userReflections: Record<string, string> = {};
      activeExercise.questions.forEach((q, idx) => {
        userReflections[q.question] = answers[`q${idx + 1}`] || "";
      });

      await submitCBTExercise({
        user_id: currentUser.id,
        exercise_id: activeExercise.id,
        distortion_category: activeExercise.categoryName,
        exercise_title: activeExercise.title,
        scenario: activeExercise.scenario,
        answers: userReflections,
        is_completed: true,
      });

      setIsCompletedSuccess(true);
      await fetchData();
      toast.success("Exercise successfully recorded to your progress!");
    } catch (err: any) {
      console.error("Failed to submit CBT exercise:", err);
      toast.error(err?.message || "Failed to save reflection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCompletedCount = completedIds.size;
  const completionPercentage = Math.round((totalCompletedCount / TOTAL_PRACTICE_EXERCISES) * 100);

  const CATEGORY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
    Catastrophizing: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
    "Mind Reading": { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
    Overgeneralization: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    "All-or-Nothing Thinking": { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    "Emotional Reasoning": { color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" },
    "Fortune Telling": { color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
    "General CBT Practice": { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  };

  const pageSize = 6;
  const totalPages = Math.ceil(filteredExercises.length / pageSize) || 1;
  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredExercises.slice(start, start + pageSize);
  }, [filteredExercises, page]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDistortion("all");
    setSelectedDuration("all");
    setSelectedDifficulty("all");
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedDistortion !== "all" ||
    selectedDuration !== "all" ||
    selectedDifficulty !== "all";

  return (
    <div className="space-y-6">
      {/* 1. PROGRESS HEADER */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <BookOpen className="size-4 stroke-[1.75]" />
            </div>
            <h2 className="text-base sm:text-lg font-heading font-semibold text-foreground">
              CBT Distortion Exercises
            </h2>
            <Badge variant="outline" className="text-xs font-semibold">
              {totalCompletedCount} / {TOTAL_PRACTICE_EXERCISES} Completed
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-sans max-w-xl pl-10.5">
            Target specific cognitive distortions with structured 5-step Socratic reframing exercises.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right">
            <span className="text-xs font-semibold text-foreground">{completionPercentage}%</span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-primary transition-[width] duration-300 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryModal(true)}
            className="text-xs font-semibold h-9 rounded-lg"
          >
            <History className="size-3.5 stroke-[1.75] mr-1.5" />
            <span>History ({userSubmissions.length})</span>
          </Button>
        </div>
      </div>

      {/* 2. RECOMMENDED FOR YOU ROW */}
      {recommendedExercises.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="size-4 stroke-[1.75] text-primary" />
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Recommended For You
              </h3>
              <span className="text-[11px] font-sans text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                {recentDistortions.length > 0
                  ? "Based on your recent sessions"
                  : "Foundational practice"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {recommendedExercises.map((ex) => {
              const isDone = completedIds.has(ex.id);
              const style = CATEGORY_STYLES[ex.categoryName] || {
                color: "text-primary",
                bg: "bg-primary/10",
                border: "border-primary/20",
              };

              return (
                <div
                  key={ex.id}
                  onClick={() => handleOpenExercise(ex)}
                  className="bg-card border border-primary/25 hover:border-primary rounded-xl p-4.5 shadow-xs hover:shadow-sm transition-[border-color,box-shadow] cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-semibold font-sans px-2.5 py-0.5 rounded-md border ${style.bg} ${style.color} ${style.border}`}>
                        {ex.categoryName}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-sans flex items-center gap-1">
                        <Clock className="size-3 stroke-[1.75]" /> {ex.estimatedMinutes}m
                      </span>
                    </div>

                    <h4 className="text-sm font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {ex.title}
                    </h4>

                    <p className="text-xs text-muted-foreground font-sans line-clamp-2 leading-relaxed">
                      "{ex.scenario}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border mt-3.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {ex.difficulty}
                    </span>

                    {isDone ? (
                      <span className="text-xs font-semibold text-mint flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 stroke-[1.75]" /> Review
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Start Exercise
                        <ArrowRight className="size-3 stroke-[1.75]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. UNIFIED SEARCH & FILTER TOOLBAR */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 stroke-[1.75] text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search exercises by title, symptom, or distortion..."
              className="pl-9 pr-8 text-xs font-sans h-9.5 rounded-lg border-border"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="size-3.5 stroke-[1.75]" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Duration select */}
            <select
              value={selectedDuration}
              onChange={(e) => {
                setSelectedDuration(e.target.value as any);
                setPage(1);
              }}
              className="text-xs font-medium bg-muted border border-border text-foreground rounded-lg px-2.5 h-9.5 focus:outline-none cursor-pointer"
            >
              <option value="all">Any Duration</option>
              <option value="quick">Quick (≤5 mins)</option>
              <option value="deep">In-depth (6+ mins)</option>
            </select>

            {/* Difficulty select */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value as any);
                setPage(1);
              }}
              className="text-xs font-medium bg-muted border border-border text-foreground rounded-lg px-2.5 h-9.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs font-semibold h-9.5 px-3 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
              >
                <RotateCcw className="size-3 stroke-[1.75] mr-1.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Distortion Categories Pill Bar */}
        <div className="pt-2 border-t border-border flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedDistortion("all");
              setPage(1);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-sans whitespace-nowrap transition-colors shrink-0 ${
              selectedDistortion === "all"
                ? "bg-primary text-white font-semibold shadow-2xs"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            All Exercises ({ALL_PRACTICE_EXERCISES.length})
          </button>
          {CBT_DISTORTION_CATEGORIES.map((cat) => {
            const count = cat.exercises.length;
            const isSelected = selectedDistortion === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedDistortion(cat.id);
                  setPage(1);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-sans whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-2xs"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CLEAN EXERCISE CARDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{Math.min(filteredExercises.length, (page - 1) * pageSize + 1)} - {Math.min(filteredExercises.length, page * pageSize)}</strong> of <strong className="text-foreground">{filteredExercises.length}</strong> exercises
          </span>
          {totalPages > 1 && (
            <span className="font-medium">
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {filteredExercises.length === 0 ? (
          <div className="text-center py-12 px-4 bg-card border border-border border-dashed rounded-xl space-y-3">
            <BookOpen className="size-8 stroke-[1.75] text-muted-foreground mx-auto" />
            <h4 className="text-sm font-heading font-semibold text-foreground">
              No matching exercises found
            </h4>
            <p className="text-xs text-muted-foreground font-sans max-w-sm mx-auto">
              Try adjusting your search keywords, distortion filter, or duration requirements.
            </p>
            <Button size="sm" variant="outline" onClick={resetFilters} className="text-xs font-semibold rounded-lg">
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedExercises.map((ex) => {
              const isCompleted = completedIds.has(ex.id);
              const style = CATEGORY_STYLES[ex.categoryName] || {
                color: "text-primary",
                bg: "bg-primary/10",
                border: "border-primary/20",
              };

              return (
                <div
                  key={ex.id}
                  onClick={() => handleOpenExercise(ex)}
                  className={`bg-card border rounded-xl p-5 shadow-xs hover:shadow-sm transition-[border-color,box-shadow] cursor-pointer flex flex-col justify-between group ${
                    isCompleted
                      ? "border-mint/50 hover:border-mint"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-semibold font-sans px-2.5 py-0.5 rounded-md border ${style.bg} ${style.color} ${style.border}`}>
                        {ex.categoryName}
                      </span>
                      <span className="text-[11px] font-sans text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {ex.difficulty}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {ex.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-sans mt-1.5 line-clamp-2 leading-relaxed">
                        "{ex.scenario}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-border mt-3.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-sans flex items-center gap-1 text-[11px]">
                      <Clock className="size-3.5 stroke-[1.75]" /> {ex.estimatedMinutes} mins
                    </span>

                    {isCompleted ? (
                      <span className="text-xs font-semibold text-mint flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 stroke-[1.75]" /> Completed
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Start Practice
                        <ChevronRight className="size-3.5 stroke-[1.75]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="text-xs font-semibold h-8.5 px-3 rounded-lg"
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground font-sans">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="text-xs font-semibold h-8.5 px-3 rounded-lg"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* 5. CENTERED POPUP MODAL FOR FULL STEPS */}
      {drawerOpen && activeExercise && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <div className="bg-card text-card-foreground rounded-2xl w-full max-w-2xl sm:max-w-3xl max-h-[90vh] flex flex-col shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-md border",
                      CATEGORY_STYLES[activeExercise.categoryName]?.bg || "bg-muted",
                      CATEGORY_STYLES[activeExercise.categoryName]?.color || "text-primary",
                      CATEGORY_STYLES[activeExercise.categoryName]?.border || "border-border"
                    )}
                  >
                    {activeExercise.categoryName}
                  </span>
                  <span className="text-xs text-muted-foreground font-sans">
                    {activeExercise.difficulty} • {activeExercise.estimatedMinutes} mins
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors shrink-0"
                  aria-label="Close exercise modal"
                >
                  <X className="size-4 stroke-[1.75]" />
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mt-2">
                {activeExercise.title}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {/* Scenario & Learning Takeaway */}
              <div className="bg-muted/40 p-4 sm:p-5 rounded-xl border border-border space-y-2.5">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block font-sans">
                  Scenario / Situation
                </span>
                <p className="text-xs sm:text-sm text-foreground font-sans leading-relaxed">
                  {activeExercise.scenario}
                </p>
                <div className="pt-2.5 border-t border-border/60 text-xs text-muted-foreground font-sans">
                  <strong className="text-foreground">CBT Insight:</strong> {activeExercise.learningTakeaway}
                </div>
              </div>

              {isCompletedSuccess ? (
                // Success State
                <div className="bg-mint/15 border border-mint/40 rounded-xl p-5 space-y-4 animate-in fade-in-50">
                  <div className="flex items-center gap-2 text-mint font-semibold text-sm">
                    <CheckCircle2 className="size-5 stroke-[1.75]" />
                    <span>Reflection Recorded Successfully!</span>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground font-sans leading-relaxed">
                    You completed all 5 steps for <strong>{activeExercise.title}</strong>. Your responses are logged in your clinical practice history.
                  </p>

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-foreground block">
                      Your Summary:
                    </span>
                    {activeExercise.questions.map((q, idx) => (
                      <div key={q.id} className="bg-card p-3 rounded-lg border border-border space-y-1 text-xs font-sans">
                        <span className="font-semibold text-primary block">
                          Step {idx + 1}: {q.question}
                        </span>
                        <p className="text-foreground italic">
                          "{answers[`q${idx + 1}`] || ""}"
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => setDrawerOpen(false)}
                      className="text-xs font-semibold rounded-lg h-9 px-4"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                // Interactive 5-Step Questions
                <div className="space-y-4">
                  {/* Step Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="font-semibold text-foreground">
                        Step {currentQuestionIndex + 1} of {activeExercise.questions.length}
                      </span>
                      <span className="text-muted-foreground font-medium">
                        {Math.round(((currentQuestionIndex + 1) / activeExercise.questions.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-[width] duration-300 rounded-full"
                        style={{
                          width: `${((currentQuestionIndex + 1) / activeExercise.questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Box */}
                  {(() => {
                    const currentQ = activeExercise.questions[currentQuestionIndex];
                    const qKey = `q${currentQuestionIndex + 1}`;

                    return (
                      <div className="space-y-3">
                        <h4 className="text-sm sm:text-base font-heading font-semibold text-foreground">
                          {currentQ.question}
                        </h4>

                        <div className="bg-primary-lighter/10 border border-primary/20 rounded-lg p-3 flex items-start gap-2 text-xs font-sans text-muted-foreground">
                          <Info className="size-4 stroke-[1.75] text-primary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{currentQ.guidance}</span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-semibold text-muted-foreground block font-sans">
                            Your Reflection:
                          </label>
                          <textarea
                            rows={4}
                            value={answers[qKey] || ""}
                            onChange={(e) =>
                              setAnswers((prev) => ({ ...prev, [qKey]: e.target.value }))
                            }
                            placeholder={currentQ.placeholder}
                            className="w-full rounded-xl border border-border bg-card p-3 text-xs sm:text-sm font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y"
                            autoFocus
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            {!isCompletedSuccess && (
              <div className="p-4 sm:p-5 border-t border-border bg-muted/30 flex items-center justify-between gap-3 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={currentQuestionIndex === 0 || isSubmitting}
                  onClick={handlePrevStep}
                  className="text-xs font-semibold rounded-lg h-9"
                >
                  <ArrowLeft className="size-3.5 stroke-[1.75] mr-1.5" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDrawerOpen(false)}
                    className="text-xs font-semibold rounded-lg h-9 px-3.5"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={handleNextStep}
                    className="text-xs font-semibold rounded-lg h-9 px-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3.5 stroke-[1.75] animate-spin mr-1.5" />
                        Saving...
                      </>
                    ) : currentQuestionIndex === activeExercise.questions.length - 1 ? (
                      <>
                        Save Reflection
                        <CheckCircle2 className="size-3.5 stroke-[1.75] ml-1.5" />
                      </>
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="size-3.5 stroke-[1.75] ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. HISTORY REVIEW MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-card text-card-foreground rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-md border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-semibold text-foreground">
                  Your Practice History
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  {userSubmissions.length} exercises completed
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowHistoryModal(false);
                  setReviewRecord(null);
                }}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="size-4 stroke-[1.75]" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs font-sans">
              {reviewRecord ? (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReviewRecord(null)}
                    className="text-xs font-semibold -ml-2 text-primary"
                  >
                    <ArrowLeft className="size-3.5 stroke-[1.75] mr-1" /> Back to History List
                  </Button>

                  <div className="bg-muted/40 p-3.5 rounded-xl border border-border space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {reviewRecord.distortion_category}
                    </span>
                    <h4 className="text-sm font-heading font-semibold text-foreground">
                      {reviewRecord.exercise_title}
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      Completed on {new Date(reviewRecord.completed_at || reviewRecord.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(reviewRecord.answers || {}).map(([question, answer], idx) => (
                      <div key={idx} className="bg-muted/20 p-3 rounded-lg border border-border space-y-1">
                        <span className="font-semibold text-primary block">
                          Step {idx + 1}: {question}
                        </span>
                        <p className="text-foreground italic">"{String(answer)}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : userSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground space-y-2">
                  <BookOpen className="size-8 stroke-[1.75] mx-auto text-muted-foreground" />
                  <p>You have not logged any CBT exercise reflections yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {userSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setReviewRecord(sub)}
                      className="py-3 px-2 hover:bg-muted/40 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-primary uppercase block">
                          {sub.distortion_category}
                        </span>
                        <h5 className="font-semibold text-foreground text-xs">{sub.exercise_title}</h5>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="size-3 stroke-[1.75]" />
                          {new Date(sub.completed_at || sub.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <ChevronRight className="size-4 stroke-[1.75] text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-muted/40 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowHistoryModal(false);
                  setReviewRecord(null);
                }}
                className="text-xs font-semibold rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CbtExercisesTab;
