import React, { useState, useEffect } from "react";
import { X, Play, Pause, RotateCcw, Check, Heart } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

interface MindfulTimerProps {
  onClose: () => void;
  onFinish: (durationSeconds: number) => void;
}

const mindfulPrompts = [
  {
    at: 120,
    title: "1. Notice Your Natural Breath",
    text: "Allow your breathing to find its own natural rhythm. Do not force or change it. Just observe air flowing in and out.",
  },
  {
    at: 90,
    title: "2. Observe Thoughts Without Judging",
    text: "Notice whatever thoughts are crossing your mind right now. Picture them as clouds drifting across a wide blue sky.",
  },
  {
    at: 60,
    title: "3. Scan Body Sensations",
    text: "Bring gentle awareness to where your body meets the chair or floor. Soften any area holding subtle tightness.",
  },
  {
    at: 30,
    title: "4. Return to the Present Moment",
    text: "Gently expand your awareness back to the room. Carry this sense of grounded calm into your next activity.",
  },
];

export const MindfulTimer = React.memo(function MindfulTimer({
  onClose,
  onFinish,
}: MindfulTimerProps) {
  const [mindfulActive, setMindfulActive] = useState(false);
  const [mindfulSecondsLeft, setMindfulSecondsLeft] = useState(120);
  const [mindfulTotalSeconds, setMindfulTotalSeconds] = useState(0);

  const currentMindfulPrompt = mindfulPrompts.find((p) => mindfulSecondsLeft <= p.at) || mindfulPrompts[0];

  useEffect(() => {
    let interval: any;
    if (mindfulActive) {
      interval = setInterval(() => {
        setMindfulTotalSeconds((s) => s + 1);
        setMindfulSecondsLeft((left) => {
          if (left <= 1) {
            setMindfulActive(false);
            toast.success("Mindful Pause completed! Re-centered and refreshed.");
            return 0;
          }
          return left - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mindfulActive]);

  const handleReset = () => {
    setMindfulActive(false);
    setMindfulSecondsLeft(120);
    setMindfulTotalSeconds(0);
  };

  const handleComplete = () => {
    onFinish(mindfulTotalSeconds);
    handleReset();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
      <div className="bg-card text-card-foreground rounded-2xl w-full max-w-lg shadow-md border border-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-light-gray/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-light-blue/20 text-primary flex items-center justify-center">
              <Heart className="size-4 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-foreground">Mindful Pause</h3>
              <p className="text-xs text-muted-foreground">2-Minute Gentle Awareness</p>
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
          {/* Circular Timer Visual */}
          <div
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-transform duration-700 ${
              mindfulActive
                ? "bg-light-blue/20 border-4 border-primary text-primary scale-105"
                : "bg-light-gray border-2 border-border text-muted-foreground"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {mindfulActive ? "Centering" : "Ready"}
            </span>
            <span className="font-heading text-4xl font-semibold tracking-tight mt-1">
              {Math.floor(mindfulSecondsLeft / 60)}:
              {String(mindfulSecondsLeft % 60).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Remaining</span>
          </div>

          {/* Dynamic Guidance Prompt */}
          <div className="bg-light-blue/15 border border-light-blue/30 p-4 rounded-xl max-w-md text-left">
            <h4 className="text-xs font-semibold text-foreground">{currentMindfulPrompt.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {currentMindfulPrompt.text}
            </p>
          </div>

          {/* 4 Prompt Indicators */}
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {mindfulPrompts.map((p, idx) => {
              const isActive =
                mindfulSecondsLeft <= p.at &&
                (idx === mindfulPrompts.length - 1 || mindfulSecondsLeft > mindfulPrompts[idx + 1].at);
              const isDone = mindfulSecondsLeft < p.at;

              return (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-colors ${
                    isDone || isActive ? "bg-primary" : "bg-border"
                  }`}
                />
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full pt-1">
            <Button
              onClick={() => setMindfulActive(!mindfulActive)}
              variant={mindfulActive ? "destructive" : "default"}
              className="flex-1 text-xs font-medium h-10 rounded-xl flex items-center justify-center gap-1.5"
            >
              {mindfulActive ? (
                <>
                  <Pause className="size-4 stroke-[1.75]" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4 stroke-[1.75]" /> {mindfulSecondsLeft < 120 ? "Resume" : "Start Timer"}
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
              disabled={mindfulTotalSeconds < 5}
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
