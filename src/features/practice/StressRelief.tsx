import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import AppShell from "../../app/layouts/AppShell";
import { BreathingTimer } from "./components/BreathingTimer";
import { GroundingTimer } from "./components/GroundingTimer";
import { PmrTimer } from "./components/PmrTimer";
import { MindfulTimer } from "./components/MindfulTimer";
import { toast } from "sonner";
import {
  BookOpen,
  Wind,
  ArrowRight,
  Compass,
  HeartPulse,
  Clock,
  Shield,
  CheckCircle,
  CheckCircle2,
  Loader2,
  History
} from "lucide-react";
import {
  getCurrentUser,
  recordStressReliefActivity,
  getStressReliefHistory,
  StressReliefRecord
} from "../../lib/apiClient";

export default function StressRelief() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeModal, setActiveModal] = useState<"breathing" | "grounding" | "pmr" | "mindful_pause" | null>(null);
  const [history, setHistory] = useState<StressReliefRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [completionData, setCompletionData] = useState<{ title: string; duration: number } | null>(null);

  // Load history from backend
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
  }, [currentUser]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSaveActivity = async (activityName: string, activityType: string, durationSeconds: number, notes?: string) => {
    if (!currentUser?.id) return;
    try {
      const saved = await recordStressReliefActivity({
        user_id: currentUser.id,
        activity_name: activityName,
        activity_type: activityType,
        duration_seconds: Math.max(10, durationSeconds),
        notes: notes || null
      });
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      console.warn("Could not record stress relief activity:", err);
    }
  };

  const userName = currentUser?.full_name || currentUser?.email?.split("@")[0] || "Friend";
  const firstName = userName.split(" ")[0];

  return (
    <AppShell
      title="Instant Stress Relief"
      subtitle="Take a moment for yourself. Explore simple guided exercises to help manage stress, tension, and overwhelming emotions."
      actions={
        <Link to="/practice">
          <Button size="sm" variant="outline" className="text-xs h-8.5 sm:h-9 px-3 rounded-xl border-border">
            <BookOpen className="size-3.5 stroke-[1.75] mr-1.5 text-primary" />
            Practice Center
          </Button>
        </Link>
      }
    >
      <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">

          {/* Gentle Informational Disclaimer Banner */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-xs text-blue-900 font-['Inter']">
            <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-blue-950">Self-Help Support Notice: </span>
              These interactive grounding and breathing exercises are educational self-help tools that complement cognitive reframing. They are not clinical treatment or emergency crisis intervention.
            </p>
          </div>

          {/* SECTION: 4 Interactive Stress Relief Activity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Activity 1: Guided Breathing */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-primary flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Wind className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 font-['Inter']">
                    2–4 mins · Calming
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    Guided Breathing
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-['Inter'] mt-1 leading-relaxed">
                    Slow down your breathing and take a calming pause with evidence-based 4-7-8 rhythmic breathing.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-['Inter'] pt-1">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Inhale 4s
                  </span>
                  <span>•</span>
                  <span>Hold 7s</span>
                  <span>•</span>
                  <span>Exhale 8s</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-4">
                <Button
                  onClick={() => {
                    setActiveModal("breathing");
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Start Breathing Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Activity 2: 5-4-3-2-1 Grounding */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-lavender-dark flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 font-['Inter']">
                    3–5 mins · Sensory
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-lavender-dark transition-colors">
                    5-4-3-2-1 Grounding
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-['Inter'] mt-1 leading-relaxed">
                    Reconnect with the present moment using your five senses to ground racing thoughts and anchor your mind.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-['Inter'] pt-1">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-500" /> See • Feel • Hear • Smell • Taste
                  </span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-4">
                <Button
                  onClick={() => {
                    setActiveModal("grounding");
                  }}
                  className="w-full bg-lavender-dark hover:bg-lavender-dark/90 text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Start Grounding Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Activity 3: Progressive Muscle Relaxation */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 font-['Inter']">
                    3 mins · Somatic
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Progressive Muscle Relaxation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-['Inter'] mt-1 leading-relaxed">
                    Release physical tension and somatic stress through gentle, guided tensing and relaxing of muscle groups.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-['Inter'] pt-1">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 5 Muscle Groups • Gentle Guidance
                  </span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-4">
                <Button
                  onClick={() => {
                    setActiveModal("pmr");
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Start Relaxation Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Activity 4: Mindful Pause */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-[box-shadow,border-color] flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Clock className="size-5 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 font-['Inter']">
                    2 mins · Mindfulness
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Mindful Pause
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-['Inter'] mt-1 leading-relaxed">
                    Take a short 2-minute break to step back, notice your breath, and gently return your attention to the present.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-['Inter'] pt-1">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500" /> 2-Min Guided Timer • Non-Judgment
                  </span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-4">
                <Button
                  onClick={() => {
                    setActiveModal("mindful_pause");
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Start Mindful Pause</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

          </div>

          {/* SECTION: Recent Stress Relief Activities */}
          <div className="bg-white rounded-2xl sm:rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Activities</h3>
              </div>
              <span className="text-xs text-slate-400 font-['Inter']">
                {history.length} completed
              </span>
            </div>

            {loadingHistory ? (
              <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Loading activity history...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                <Wind className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-['Inter']">
                  No stress relief exercises recorded yet. Whenever you feel tension or worry, try one of the guided exercises above!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.slice(0, 5).map((act) => {
                  const dateStr = new Date(act.completed_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
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
                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{act.activity_name}</span>
                        <span className="text-slate-400 text-[11px] font-['Inter'] hidden sm:inline">
                          ({durationStr})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-slate-400 font-['Inter']">{dateStr}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      {/* ===================================================================== */}
      {/* MODAL 1: GUIDED BREATHING (4-7-8) */}
      {/* ===================================================================== */}
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

      {/* ===================================================================== */}
      {/* MODAL 2: 5-4-3-2-1 GROUNDING */}
      {/* ===================================================================== */}
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

      {/* ===================================================================== */}
      {/* MODAL 3: PROGRESSIVE MUSCLE RELAXATION (PMR) */}
      {/* ===================================================================== */}
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

      {/* ===================================================================== */}
      {/* MODAL 4: MINDFUL PAUSE (2-MINUTE MINDFULNESS) */}
      {/* ===================================================================== */}
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

      {/* ===================================================================== */}
      {/* COMPLETION CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {completionData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-2xl w-full max-w-md p-6 text-center shadow-2xl border border-slate-100 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-700">
                Exercise Completed
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">{completionData.title}</h3>
              <p className="text-xs text-slate-500 font-['Inter'] mt-1 leading-relaxed">
                Great job taking time for yourself. You spent {Math.max(10, completionData.duration)} seconds calming your mind and reconnecting with the present.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                onClick={() => setCompletionData(null)}
                className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold h-10 rounded-xl shadow-xs"
              >
                Back to Stress Relief
              </Button>
              <Link to="/practice">
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold h-10 rounded-xl border-slate-200"
                >
                  Go to CBT Practice Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

