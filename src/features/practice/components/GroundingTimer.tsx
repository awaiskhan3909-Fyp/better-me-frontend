import React, { useState, useEffect } from "react";
import { Compass, X, ArrowLeft, ArrowRight, Check, Eye, Volume2, Wind, Smile } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface GroundingTimerProps {
  onClose: () => void;
  onFinish: (durationSeconds: number) => void;
}

const groundingStepsConfig = [
  {
    key: "see",
    count: 5,
    title: "5 Things You Can See",
    instruction: "Look around your space right now. Notice 5 distinct objects, colors, or shadows.",
    icon: Eye,
    placeholders: ["A window frame", "A plant leaf", "Pen on table", "Door handle", "My shoes"],
  },
  {
    key: "feel",
    count: 4,
    title: "4 Things You Can Feel",
    instruction: "Bring gentle attention to physical contact. Notice 4 tactile sensations.",
    icon: Compass,
    placeholders: ["Feet resting on the floor", "Texture of my clothes", "Air against my skin", "Hands on my lap"],
  },
  {
    key: "hear",
    count: 3,
    title: "3 Things You Can Hear",
    instruction: "Close your eyes or look down. Listen for 3 subtle sounds around you.",
    icon: Volume2,
    placeholders: ["Traffic outside", "Fan or AC hum", "My own steady breath"],
  },
  {
    key: "smell",
    count: 2,
    title: "2 Things You Can Smell",
    instruction: "Notice 2 scents in the room, or recall 2 comforting scents that bring calm.",
    icon: Wind,
    placeholders: ["Fresh coffee or tea", "Clean laundry scent"],
  },
  {
    key: "taste",
    count: 1,
    title: "1 Thing You Can Taste",
    instruction: "Notice the current taste in your mouth, or take a sip of cool water.",
    icon: Smile,
    placeholders: ["Minty toothpaste", "Sip of fresh water"],
  },
];

export const GroundingTimer = React.memo(function GroundingTimer({
  onClose,
  onFinish,
}: GroundingTimerProps) {
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingSeconds, setGroundingSeconds] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState<{ [key: string]: string[] }>({
    see: ["", "", "", "", ""],
    feel: ["", "", "", ""],
    hear: ["", "", ""],
    smell: ["", ""],
    taste: [""],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGroundingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (category: string, index: number, value: string) => {
    setGroundingInputs((prev) => {
      const arr = [...(prev[category] || [])];
      arr[index] = value;
      return { ...prev, [category]: arr };
    });
  };

  const handleComplete = () => {
    onFinish(groundingSeconds);
    setGroundingStep(0);
    setGroundingSeconds(0);
  };

  const currentConfig = groundingStepsConfig[groundingStep];
  const StepIcon = currentConfig.icon;
  const currentVals = groundingInputs[currentConfig.key] || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
      <div className="bg-card text-card-foreground rounded-2xl w-full max-w-xl max-h-[90vh] shadow-md border border-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-light-gray/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lavender/30 text-secondary-dark flex items-center justify-center">
              <Compass className="size-4 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-foreground">5-4-3-2-1 Sensory Grounding</h3>
              <p className="text-xs text-muted-foreground">Step {groundingStep + 1} of 5</p>
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
            className="bg-secondary h-full transition-[width] duration-300"
            style={{ width: `${((groundingStep + 1) / 5) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-start gap-3 bg-secondary/10 border border-secondary/20 p-4 rounded-xl">
            <div className="w-9 h-9 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
              <StepIcon className="size-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{currentConfig.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {currentConfig.instruction}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {Array.from({ length: currentConfig.count }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-light-gray text-muted-foreground font-semibold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder={currentConfig.placeholders[idx] || `Item ${idx + 1}`}
                  value={currentVals[idx] || ""}
                  onChange={(e) => handleInputChange(currentConfig.key, idx, e.target.value)}
                  className="flex-1 bg-background border border-border focus:border-secondary rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-border/60 bg-light-gray/60 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
            disabled={groundingStep === 0}
            className="text-xs rounded-xl"
          >
            <ArrowLeft className="size-3.5 stroke-[1.75] mr-1" /> Previous
          </Button>

          {groundingStep < 4 ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setGroundingStep((s) => s + 1)}
              className="text-xs rounded-xl"
            >
              Next Step <ArrowRight className="size-3.5 stroke-[1.75] ml-1" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="mint"
              onClick={handleComplete}
              className="text-xs font-semibold rounded-xl"
            >
              <Check className="size-4 stroke-[1.75] mr-1" /> Complete Grounding
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
