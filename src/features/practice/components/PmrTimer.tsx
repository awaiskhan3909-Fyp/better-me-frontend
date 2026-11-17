import React, { useState, useEffect } from "react";
import { HeartPulse, X, Play, Pause, SkipForward, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

interface PmrTimerProps {
  onClose: () => void;
  onFinish: (durationSeconds: number) => void;
}

const pmrGroups = [
  {
    id: "hands",
    name: "Hands & Forearms",
    action: "Gently clench both fists. Feel the tension in your fingers and forearms.",
    release: "Open your hands completely and let your fingers relax on your lap. Notice the warm, loose feeling.",
  },
  {
    id: "shoulders",
    name: "Shoulders & Neck",
    action: "Gently raise both shoulders up toward your ears, creating light tension in your upper neck.",
    release: "Let your shoulders drop down smoothly and heavily. Feel the tightness melting away.",
  },
  {
    id: "face",
    name: "Face & Jaw",
    action: "Gently squeeze your eyes shut and scrunch your nose and forehead lightly.",
    release: "Smooth out your forehead, unclamp your jaw, and let your mouth rest softly slightly open.",
  },
  {
    id: "abdomen",
    name: "Abdomen & Core",
    action: "Gently tighten your stomach muscles as if preparing for a light push.",
    release: "Exhale fully and let your belly soften completely. Breathe naturally and gently into your stomach.",
  },
  {
    id: "legs",
    name: "Legs & Feet",
    action: "Gently curl your toes downward and lightly engage your calf and thigh muscles.",
    release: "Release all tension in your legs. Feel your feet resting peacefully and grounded on the floor.",
  },
];

export const PmrTimer = React.memo(function PmrTimer({
  onClose,
  onFinish,
}: PmrTimerProps) {
  const [pmrStep, setPmrStep] = useState(0);
  const [pmrSeconds, setPmrSeconds] = useState(0);
  const [pmrPhase, setPmrPhase] = useState<"tense" | "release">("tense");
  const [pmrPhaseTimer, setPmrPhaseTimer] = useState(5);
  const [pmrActive, setPmrActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (pmrActive) {
      interval = setInterval(() => {
        setPmrSeconds((s) => s + 1);
        setPmrPhaseTimer((t) => {
          if (t <= 1) {
            if (pmrPhase === "tense") {
              setPmrPhase("release");
              return 8;
            } else {
              if (pmrStep < pmrGroups.length - 1) {
                setPmrStep((s) => s + 1);
                setPmrPhase("tense");
                return 5;
              } else {
                setPmrActive(false);
                toast.success("All muscle relaxation groups completed!");
                return 0;
              }
            }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pmrActive, pmrPhase, pmrStep]);

  const handleSkip = () => {
    if (pmrStep < pmrGroups.length - 1) {
      setPmrStep((s) => s + 1);
      setPmrPhase("tense");
      setPmrPhaseTimer(5);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    onFinish(pmrSeconds);
    setPmrStep(0);
    setPmrSeconds(0);
    setPmrActive(false);
    setPmrPhase("tense");
    setPmrPhaseTimer(5);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
      <div className="bg-card text-card-foreground rounded-2xl w-full max-w-lg shadow-md border border-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-light-gray/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-mint/25 text-mint-dark flex items-center justify-center">
              <HeartPulse className="size-4 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-foreground">Progressive Muscle Relaxation</h3>
              <p className="text-xs text-muted-foreground">
                Group {pmrStep + 1} of {pmrGroups.length}: {pmrGroups[pmrStep].name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray flex items-center justify-center transition-colors"
          >
            <X className="size-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-border/40 h-1.5">
          <div
            className="bg-mint h-full transition-[width] duration-300"
            style={{ width: `${((pmrStep + 1) / pmrGroups.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
          {/* Muscle Group Visual */}
          <div
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-transform duration-700 ${
              pmrActive
                ? pmrPhase === "tense"
                  ? "scale-105 bg-coral/15 border-4 border-coral text-coral-dark shadow-sm"
                  : "scale-100 bg-mint/20 border-4 border-mint text-mint-dark shadow-sm"
                : "bg-light-gray border-2 border-border text-muted-foreground"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              {pmrActive ? (pmrPhase === "tense" ? "Gentle Tension" : "Full Release") : "Ready"}
            </span>
            <span className="font-heading text-3xl font-semibold tracking-tight mt-1">
              {pmrActive ? `${pmrPhaseTimer}s` : pmrGroups[pmrStep].name.split(" ")[0]}
            </span>
          </div>

          {/* Instructions */}
          <div className="bg-light-gray/70 p-4 rounded-xl border border-border max-w-md text-left space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-coral-dark block">
                1. Gentle Tense:
              </span>
              <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                {pmrGroups[pmrStep].action}
              </p>
            </div>
            <div className="pt-2 border-t border-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-mint-dark block">
                2. Deep Release:
              </span>
              <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                {pmrGroups[pmrStep].release}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-sm">
            <span className="font-semibold text-foreground">Comfort notice: </span>
            Never strain or cause pain. Feel free to skip any muscle group if you feel soreness or injury.
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full pt-1">
            <Button
              onClick={() => setPmrActive(!pmrActive)}
              variant={pmrActive ? "destructive" : "mint"}
              className="flex-1 text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-1.5"
            >
              {pmrActive ? (
                <>
                  <Pause className="size-4 stroke-[1.75]" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4 stroke-[1.75]" /> {pmrSeconds > 0 ? "Resume" : "Start Muscle Group"}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-xs font-medium h-10 px-3.5 rounded-xl flex items-center gap-1"
            >
              <span>Skip</span> <SkipForward className="size-3.5 stroke-[1.75]" />
            </Button>

            <Button
              variant="mint"
              onClick={handleComplete}
              className="text-xs font-semibold h-10 px-4 rounded-xl"
            >
              <Check className="size-4 stroke-[1.75] mr-1" /> Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
