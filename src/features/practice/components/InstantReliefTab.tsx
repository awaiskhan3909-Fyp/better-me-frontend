import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { BreathingTimer } from "./BreathingTimer";
import { GroundingTimer } from "./GroundingTimer";
import { PmrTimer } from "./PmrTimer";
import { MindfulTimer } from "./MindfulTimer";
import {
  Wind,
  ArrowRight,
  Compass,
  HeartPulse,
  Clock,
  Shield,
  CheckCircle,
  CheckCircle2,
  Loader2,
  History,
} from "lucide-react";
import {
  getCurrentUser,
  recordStressReliefActivity,
  getStressReliefHistory,
  StressReliefRecord,
} from "../../../lib/apiClient";

interface InstantReliefTabProps {
  onNavigateTab?: (tab: "exercises" | "relief" | "records") => void;
  compact?: boolean;
}

export function InstantReliefTab({ onNavigateTab, compact = false }: InstantReliefTabProps) {
  const currentUser = getCurrentUser();

  const [activeModal, setActiveModal] = useState<"breathing" | "grounding" | "pmr" | "mindful_pause" | null>(null);
  const [history, setHistory] = useState<StressReliefRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [completionData, setCompletionData] = useState<{ title: string; duration: number } | null>(null);

  const loadHistory = async () => {
    if (!currentUser?.id) {
      setLoadingHistory(false);
      return;
    }
    try {
      setLoadingHistory(true);
      const data = await getStressReliefHistory(currentUser.id, 10);
      setHistory(data || []);
    } catch (err) {
      console.warn("Could not load stress relief history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [currentUser?.id]);

  const handleSaveActivity = async (
    activityName: string,
    activityType: string,
    durationSeconds: number,
    notes?: string
  ) => {
    if (!currentUser?.id) return;
    try {
      const saved = await recordStressReliefActivity({
        user_id: currentUser.id,
        activity_name: activityName,
        activity_type: activityType,
        duration_seconds: Math.max(10, durationSeconds),
        notes: notes || null,
      });
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      console.warn("Could not record stress relief activity:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
      {/* Self-Help Support Notice */}
      {!compact && (
        <div className="bg-light-blue/15 border border-light-blue/30 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-xs text-foreground font-sans">
          <Shield className="size-4 stroke-[1.75] text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-foreground">Self-Help Support Notice: </span>
            These interactive grounding, breathing, and relaxation exercises are educational self-help tools designed to help center your body and mind during moments of acute tension.
          </p>
        </div>
      )}

      {/* 4 Interactive Stress Relief Activity Cards */}
      <div className={`grid gap-4 sm:gap-5 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {/* Activity 1: Guided Breathing */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-light-blue/20 text-primary flex items-center justify-center shadow-2xs">
                <Wind className="size-5 stroke-[1.75]" />
              </div>
              <span className="text-xs font-medium text-muted-foreground font-sans">
                2–4 mins · Calming
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                4-7-8 Guided Breathing
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-1 leading-relaxed">
                Slow, paced breathing with gentle audio cues designed to activate your body's natural parasympathetic relaxation response.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans pt-1">
              <span>Inhale 4s</span>
              <span>•</span>
              <span>Hold 7s</span>
              <span>•</span>
              <span>Exhale 8s</span>
            </div>
          </div>

          <div className="pt-5 border-t border-border/60 mt-4">
            <Button
              onClick={() => setActiveModal("breathing")}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <span>Start Breathing Exercise</span>
              <ArrowRight className="size-3.5 stroke-[1.75]" />
            </Button>
          </div>
        </div>

        {/* Activity 2: 5-4-3-2-1 Grounding */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-lavender/20 text-lavender-dark flex items-center justify-center shadow-2xs">
                <Compass className="size-5 stroke-[1.75]" />
              </div>
              <span className="text-xs font-medium text-muted-foreground font-sans">
                3–5 mins · Sensory
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground group-hover:text-lavender-dark transition-colors">
                5-4-3-2-1 Grounding
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-1 leading-relaxed">
                Reconnect with the present moment using your five senses to ground racing thoughts and anchor your mind in physical reality.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans pt-1">
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="size-3.5 stroke-[1.75] text-lavender-dark" /> See • Feel • Hear • Smell • Taste
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-border/60 mt-4">
            <Button
              onClick={() => setActiveModal("grounding")}
              className="w-full bg-lavender-dark hover:bg-lavender-dark/90 text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <span>Start Grounding Exercise</span>
              <ArrowRight className="size-3.5 stroke-[1.75]" />
            </Button>
          </div>
        </div>

        {/* Activity 3: Progressive Muscle Relaxation */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-mint/20 text-mint flex items-center justify-center shadow-2xs">
                <HeartPulse className="size-5 stroke-[1.75]" />
              </div>
              <span className="text-xs font-medium text-muted-foreground font-sans">
                3 mins · Somatic
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground group-hover:text-mint transition-colors">
                Progressive Muscle Relaxation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-1 leading-relaxed">
                Release physical tension and somatic stress through gentle, guided tensing and relaxing of 5 key muscle groups.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans pt-1">
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="size-3.5 stroke-[1.75] text-mint" /> 5 Muscle Groups • Gentle Guidance
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-border/60 mt-4">
            <Button
              onClick={() => setActiveModal("pmr")}
              className="w-full bg-mint hover:bg-mint/90 text-slate-900 text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <span>Start Relaxation Exercise</span>
              <ArrowRight className="size-3.5 stroke-[1.75]" />
            </Button>
          </div>
        </div>

        {/* Activity 4: Mindful Pause */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-coral/20 text-coral flex items-center justify-center shadow-2xs">
                <Clock className="size-5 stroke-[1.75]" />
              </div>
              <span className="text-xs font-medium text-muted-foreground font-sans">
                2 mins · Mindfulness
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground group-hover:text-coral transition-colors">
                Mindful Pause
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-1 leading-relaxed">
                Take a short 2-minute break to step back, notice your breath, and gently return your attention to the present without judgment.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans pt-1">
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="size-3.5 stroke-[1.75] text-coral" /> 2-Min Guided Timer • Non-Judgment
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-border/60 mt-4">
            <Button
              onClick={() => setActiveModal("mindful_pause")}
              className="w-full bg-coral hover:bg-coral/90 text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <span>Start Mindful Pause</span>
              <ArrowRight className="size-3.5 stroke-[1.75]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      {!compact && (
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <History className="size-4 stroke-[1.75] text-primary" />
              <h3 className="text-sm sm:text-base font-heading font-semibold text-foreground">Recent Relief Activities</h3>
            </div>
            <span className="text-xs text-muted-foreground font-sans">
              {history.length} completed
            </span>
          </div>

          {loadingHistory ? (
            <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 stroke-[1.75] animate-spin text-primary" />
              <span>Loading activity history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 px-4 bg-light-gray/60 rounded-xl border border-dashed border-border">
              <Wind className="size-8 stroke-[1.75] text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-sans">
                No relief exercises recorded yet. Whenever you feel tension or worry, try one of the guided exercises above!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {history.slice(0, 5).map((act) => {
                const dateStr = new Date(act.completed_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const mins = Math.floor(act.duration_seconds / 60);
                const secs = act.duration_seconds % 60;
                const durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                return (
                  <div
                    key={act.id}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-mint flex-shrink-0" />
                      <span className="font-semibold text-foreground truncate">{act.activity_name}</span>
                      <span className="text-muted-foreground text-[11px] font-sans hidden sm:inline">
                        ({durationStr})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-muted-foreground font-sans">{dateStr}</span>
                      <span className="text-[10px] font-semibold text-mint bg-mint/15 border border-mint/30 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: GUIDED BREATHING */}
      {activeModal === "breathing" && (
        <BreathingTimer
          onClose={() => setActiveModal(null)}
          onFinish={(dur) => {
            handleSaveActivity("4-7-8 Guided Breathing", "breathing", dur);
            setCompletionData({ title: "4-7-8 Guided Breathing", duration: dur });
            setActiveModal(null);
          }}
        />
      )}

      {/* MODAL 2: 5-4-3-2-1 GROUNDING */}
      {activeModal === "grounding" && (
        <GroundingTimer
          onClose={() => setActiveModal(null)}
          onFinish={(dur) => {
            handleSaveActivity("5-4-3-2-1 Grounding", "grounding", dur, "Grounding sensory exercise completed");
            setCompletionData({ title: "5-4-3-2-1 Sensory Grounding", duration: dur });
            setActiveModal(null);
          }}
        />
      )}

      {/* MODAL 3: PROGRESSIVE MUSCLE RELAXATION */}
      {activeModal === "pmr" && (
        <PmrTimer
          onClose={() => setActiveModal(null)}
          onFinish={(dur) => {
            handleSaveActivity("Progressive Muscle Relaxation", "pmr", dur);
            setCompletionData({ title: "Progressive Muscle Relaxation", duration: dur });
            setActiveModal(null);
          }}
        />
      )}

      {/* MODAL 4: MINDFUL PAUSE */}
      {activeModal === "mindful_pause" && (
        <MindfulTimer
          onClose={() => setActiveModal(null)}
          onFinish={(dur) => {
            handleSaveActivity("Mindful Pause", "mindful_pause", dur);
            setCompletionData({ title: "Mindful Pause", duration: dur });
            setActiveModal(null);
          }}
        />
      )}

      {/* COMPLETION MODAL */}
      {completionData && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-card text-card-foreground rounded-2xl w-full max-w-md p-6 text-center shadow-md border border-border space-y-4">
            <div className="w-14 h-14 rounded-full bg-mint/20 text-mint flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="size-7 stroke-[1.75]" />
            </div>

            <div>
              <span className="text-xs font-semibold text-mint">
                Exercise Completed
              </span>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mt-1">
                {completionData.title}
              </h3>
              <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">
                Great job taking time for yourself. You spent {Math.max(10, completionData.duration)} seconds calming your nervous system and reconnecting with the present moment.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                onClick={() => setCompletionData(null)}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-semibold h-10 rounded-xl shadow-xs"
              >
                Back to Instant Relief
              </Button>
              {onNavigateTab && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCompletionData(null);
                    onNavigateTab("exercises");
                  }}
                  className="w-full text-xs font-medium h-10 rounded-xl"
                >
                  Explore CBT Distortion Exercises
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstantReliefTab;
