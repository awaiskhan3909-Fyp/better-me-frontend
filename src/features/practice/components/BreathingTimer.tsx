import React, { useState, useEffect } from "react";
import { Wind, X, Play, Pause, RotateCcw, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

interface BreathingTimerProps {
  onClose: () => void;
  onFinish: (durationSeconds: number) => void;
}

export const BreathingTimer = React.memo(function BreathingTimer({
  onClose,
  onFinish,
}: BreathingTimerProps) {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathTimer, setBreathTimer] = useState(4);
  const [targetCycles, setTargetCycles] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [breathingSecondsElapsed, setBreathingSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingSecondsElapsed((prev) => prev + 1);
        setBreathTimer((prevTimer) => {
          if (prevTimer <= 1) {
            if (breathPhase === "Inhale") {
              setBreathPhase("Hold");
              return 7;
            } else if (breathPhase === "Hold") {
              setBreathPhase("Exhale");
              return 8;
            } else {
              // Completed one 4-7-8 cycle
              setCurrentCycle((c) => {
                const nextC = c + 1;
                if (nextC > targetCycles) {
                  setBreathingActive(false);
                  toast.success("Breathing cycles completed! Excellent work.");
                }
                return nextC;
              });
              setBreathPhase("Inhale");
              return 4;
            }
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase, targetCycles]);

  const handleReset = () => {
    setBreathingActive(false);
    setBreathPhase("Inhale");
    setBreathTimer(4);
    setCurrentCycle(1);
    setBreathingSecondsElapsed(0);
  };

  const handleComplete = () => {
    onFinish(breathingSecondsElapsed);
    handleReset();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
      <div className="bg-card text-card-foreground rounded-2xl w-full max-w-lg shadow-md border border-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-light-gray/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-light-blue/25 text-primary flex items-center justify-center">
              <Wind className="size-4 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-foreground">4-7-8 Guided Breathing</h3>
              <p className="text-xs text-muted-foreground">Rhythmic calming breath</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray flex items-center justify-center transition-colors"
          >
            <X className="size-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
          {/* Cycle config & Tracker */}
          <div className="flex items-center justify-between w-full text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-medium">Cycles:</span>
              <select
                value={targetCycles}
                onChange={(e) => {
                  setTargetCycles(Number(e.target.value));
                  setCurrentCycle(1);
                }}
                disabled={breathingActive}
                className="bg-light-gray border border-border text-foreground font-semibold rounded-lg px-2 py-0.5 text-xs focus:outline-none"
              >
                <option value={2}>2 Cycles</option>
                <option value={4}>4 Cycles</option>
                <option value={6}>6 Cycles</option>
                <option value={8}>8 Cycles</option>
              </select>
            </div>

            <span className="text-xs font-semibold text-primary">
              Cycle {Math.min(currentCycle, targetCycles)} of {targetCycles}
            </span>
          </div>

          {/* Animated Breathing Circle */}
          <div className="relative flex items-center justify-center py-4">
            <div
              className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${
                breathingActive
                  ? breathPhase === "Inhale"
                    ? "scale-110 bg-light-blue/30 border-4 border-primary text-primary"
                    : breathPhase === "Hold"
                    ? "scale-110 bg-lavender/30 border-4 border-secondary text-secondary-foreground"
                    : "scale-90 bg-mint/30 border-4 border-mint text-mint-dark"
                  : "bg-light-gray border-2 border-border text-muted-foreground"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                {breathingActive ? breathPhase : "Ready"}
              </span>
              <span className="font-heading text-4xl font-semibold tracking-tight mt-1">
                {breathingActive ? `${breathTimer}s` : "4-7-8"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">
                {breathingActive
                  ? breathPhase === "Inhale"
                    ? "Breathe in"
                    : breathPhase === "Hold"
                    ? "Gently hold"
                    : "Slow exhale"
                  : "Tap Start"}
              </span>
            </div>
          </div>

          {/* Step Pill Indicators */}
          <div className="flex items-center gap-2 justify-center w-full">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                breathingActive && breathPhase === "Inhale"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-light-gray text-muted-foreground"
              }`}
            >
              Inhale 4s
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                breathingActive && breathPhase === "Hold"
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "bg-light-gray text-muted-foreground"
              }`}
            >
              Hold 7s
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                breathingActive && breathPhase === "Exhale"
                  ? "bg-mint text-mint-foreground shadow-sm"
                  : "bg-light-gray text-muted-foreground"
              }`}
            >
              Exhale 8s
            </span>
          </div>

          {/* Comfort Notice */}
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-sm">
            <span className="font-semibold text-foreground">Comfort note: </span>
            If you feel dizzy or breathless at any time, stop or return to your natural comfortable breathing rhythm.
          </p>

          {/* Control Buttons */}
          <div className="flex items-center gap-3 w-full pt-2">
            <Button
              onClick={() => setBreathingActive(!breathingActive)}
              className="flex-1 text-xs font-medium h-10 rounded-xl flex items-center justify-center gap-1.5"
              variant={breathingActive ? "destructive" : "default"}
            >
              {breathingActive ? (
                <>
                  <Pause className="size-4 stroke-[1.75]" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4 stroke-[1.75]" /> {breathingSecondsElapsed > 0 ? "Resume" : "Start"}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              className="text-xs font-medium h-10 px-3.5 rounded-xl"
              title="Reset"
            >
              <RotateCcw className="size-4 stroke-[1.75]" />
            </Button>

            <Button
              variant="mint"
              onClick={handleComplete}
              disabled={breathingSecondsElapsed < 5}
              className="text-xs font-medium h-10 px-4 rounded-xl"
            >
              <Check className="size-4 stroke-[1.75] mr-1" /> Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
