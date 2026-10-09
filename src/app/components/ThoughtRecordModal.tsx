import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Smile,
  ShieldCheck,
  TrendingDown,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  createThoughtRecord,
  getCurrentUser,
  CBTThoughtRecord,
} from "../services/apiService";

interface ThoughtRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSituation?: string;
  initialThought?: string;
  initialDistortion?: string;
  suggestedReframe?: string;
  suggestedAction?: string;
  conversationId?: string | null;
  onRecordSaved?: (record: CBTThoughtRecord) => void;
}

const DISTORTION_INFO: Record<
  string,
  { label: string; description: string; socraticPrompt: string }
> = {
  Catastrophizing: {
    label: "Catastrophizing",
    description: "Assuming the worst possible catastrophe will happen without looking at real odds.",
    socraticPrompt: "What is the worst, best, and most likely realistic outcome?",
  },
  "Mind Reading": {
    label: "Mind Reading",
    description: "Assuming you know others think negatively of you without actual factual evidence.",
    socraticPrompt: "Did they explicitly state this, or am I interpreting their silence/expression?",
  },
  Overgeneralization: {
    label: "Overgeneralization",
    description: "Viewing one negative outcome as an endless, permanent cycle of failure ('always', 'never').",
    socraticPrompt: "Can one single experience dictate all my future outcomes?",
  },
  "All-or-Nothing Thinking": {
    label: "All-or-Nothing (Black & White)",
    description: "Thinking in complete extremes. If something is less than 100% perfect, it feels like total failure.",
    socraticPrompt: "Is there a healthy middle ground between total perfection and complete disaster?",
  },
  "Emotional Reasoning": {
    label: "Emotional Reasoning",
    description: "Believing that because you feel insecure or anxious, the objective reality must be terrible.",
    socraticPrompt: "Just because I feel anxious right now, does that make it an objective fact?",
  },
  "Fortune Telling": {
    label: "Fortune Telling",
    description: "Predicting a negative future as an already established, unavoidable certainty.",
    socraticPrompt: "What evidence exists that this future cannot change or turn out okay?",
  },
};

const EMOTION_OPTIONS = ["Anxiety", "Sadness", "Shame", "Guilt", "Frustration", "Hopelessness", "Fear"];

export default function ThoughtRecordModal({
  open,
  onOpenChange,
  initialSituation = "",
  initialThought = "",
  initialDistortion = "Catastrophizing",
  suggestedReframe = "",
  suggestedAction = "",
  conversationId = null,
  onRecordSaved,
}: ThoughtRecordModalProps) {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedRecord, setSavedRecord] = useState<CBTThoughtRecord | null>(null);

  // Form State
  const [situation, setSituation] = useState(initialSituation);
  const [automaticThought, setAutomaticThought] = useState(initialThought);
  const [initialBelief, setInitialBelief] = useState<number>(85);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("Anxiety");
  const [initialEmotionRating, setInitialEmotionRating] = useState<number>(80);

  const [distortionType, setDistortionType] = useState(initialDistortion || "Catastrophizing");

  const [evidenceFor, setEvidenceFor] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState("");

  const [balancedThought, setBalancedThought] = useState(suggestedReframe);
  const [outcomeBelief, setOutcomeBelief] = useState<number>(25);
  const [outcomeEmotionRating, setOutcomeEmotionRating] = useState<number>(30);
  const [behavioralAction, setBehavioralAction] = useState(suggestedAction);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSavedRecord(null);
      setSituation(initialSituation || "");
      setAutomaticThought(initialThought || "");
      if (initialDistortion && DISTORTION_INFO[initialDistortion]) {
        setDistortionType(initialDistortion);
      }
      if (suggestedReframe) {
        setBalancedThought(suggestedReframe);
      }
      if (suggestedAction) {
        setBehavioralAction(suggestedAction);
      }
    }
  }, [open, initialSituation, initialThought, initialDistortion, suggestedReframe, suggestedAction]);

  const distortionDetails = DISTORTION_INFO[distortionType] || DISTORTION_INFO["Catastrophizing"];

  const handleUseSuggestedReframe = () => {
    if (suggestedReframe) {
      setBalancedThought(suggestedReframe);
      toast.info("AI therapeutic reframe applied.");
    }
  };

  const handleSaveThoughtRecord = async () => {
    const user = getCurrentUser();
    if (!user) {
      toast.error("Please login to save your Thought Record.");
      return;
    }

    if (!situation.trim() || !automaticThought.trim() || !balancedThought.trim()) {
      toast.error("Please fill in the situation, thought, and balanced reframe.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        conversation_id: conversationId,
        situation: situation.trim(),
        automatic_thought: automaticThought.trim(),
        initial_belief_rating: initialBelief,
        emotions: { [selectedEmotion]: initialEmotionRating },
        distortion_type: distortionType,
        evidence_for: evidenceFor.trim() || "Perceived feelings and stress",
        evidence_against: evidenceAgainst.trim() || "Past successful experiences and objective reality",
        balanced_thought: balancedThought.trim(),
        outcome_belief_rating: outcomeBelief,
        outcome_emotions: { [selectedEmotion]: outcomeEmotionRating },
        behavioral_action: behavioralAction.trim() || null,
      };

      const record = await createThoughtRecord(payload);
      setSavedRecord(record);
      setStep(5); // Show Celebration & Summary Screen
      toast.success("Thought Record successfully recorded to your clinical memory!");
      if (onRecordSaved) {
        onRecordSaved(record);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Could not save Thought Record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-primary p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Beckian Cognitive Restructuring Studio
              </span>
            </div>
            {step < 5 && (
              <Badge variant="outline" className="text-white border-white/30 bg-white/10 text-xs">
                Step {step} of 4
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Beck's 5-Column Thought Record
          </DialogTitle>
          <DialogDescription className="text-blue-100 text-sm mt-1">
            Systematic CBT exercise to put distorted automatic thoughts on trial and discover balanced clarity.
          </DialogDescription>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6">
          {/* STEP 1: SITUATION & AUTOMATIC THOUGHT */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex gap-3 items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  Identify the specific trigger event and the exact automatic thought that popped into your head. Rate how strongly you believed it in that moment.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  1. The Situation (What happened? Who were you with?)
                </label>
                <Textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="e.g. My boss sent a message saying 'we need to talk tomorrow', or I received my exam grades..."
                  rows={2}
                  className="rounded-xl border-slate-300 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  2. Automatic Negative Thought (What flashed in your mind?)
                </label>
                <Textarea
                  value={automaticThought}
                  onChange={(e) => setAutomaticThought(e.target.value)}
                  placeholder="e.g. I am definitely getting fired and my career is ruined."
                  rows={3}
                  className="rounded-xl border-slate-300 focus-visible:ring-primary"
                />
              </div>

              {/* Belief Conviction Slider */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Initial Belief Conviction:</span>
                  <Badge className="bg-primary text-white font-bold text-sm px-2.5 py-0.5">
                    {initialBelief}%
                  </Badge>
                </div>
                <Slider
                  value={[initialBelief]}
                  onValueChange={(val) => setInitialBelief(val[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0% (Not convinced)</span>
                  <span>50% (Somewhat)</span>
                  <span>100% (Absolute certainty)</span>
                </div>
              </div>

              {/* Emotion Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-800">
                  3. Primary Emotion & Intensity
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_OPTIONS.map((emo) => (
                    <button
                      type="button"
                      key={emo}
                      onClick={() => setSelectedEmotion(emo)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedEmotion === emo
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <span className="text-xs text-slate-600 font-medium">Emotion Intensity:</span>
                  <div className="flex-1">
                    <Slider
                      value={[initialEmotionRating]}
                      onValueChange={(val) => setInitialEmotionRating(val[0])}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 w-10 text-right">
                    {initialEmotionRating}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DISTORTION IDENTIFICATION (BERT CLASSIFIER) */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-purple-900">
                    BERT Model Distortion Diagnosis
                  </h4>
                  <p className="text-xs text-purple-800 mt-1">
                    Cognitive distortions are internal mental filters that skew our perception of reality. Identifying the distortion takes away its emotional power.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Identified Distortion Pattern:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.entries(DISTORTION_INFO).map(([key, info]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setDistortionType(key)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        distortionType === key
                          ? "bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300"
                          : "bg-white text-slate-800 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40"
                      }`}
                    >
                      <p className="font-semibold text-xs leading-tight">{info.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Distortion Highlight Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300 font-semibold text-xs">
                    {distortionDetails.label}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">Clinical Definition</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {distortionDetails.description}
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-semibold text-indigo-700">
                    💡 Socratic Key: {distortionDetails.socraticPrompt}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EVIDENCE EXAMINATION (THE TRIAL) */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
                <Scale className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900">
                    Socratic Trial: Evidence For vs. Evidence Against
                  </h4>
                  <p className="text-xs text-amber-800 mt-1">
                    Act like a fair judge. Distinguish between <strong>factual hard evidence</strong> and feelings or assumptions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Evidence Supporting */}
                <div className="bg-red-50/40 border border-red-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                      Evidence Supporting
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-red-100 text-red-700 border-red-300">
                      Hard Facts Only
                    </Badge>
                  </div>
                  <Textarea
                    value={evidenceFor}
                    onChange={(e) => setEvidenceFor(e.target.value)}
                    placeholder="What hard facts support this thought? (e.g. My boss did schedule an unexpected meeting...)"
                    rows={5}
                    className="rounded-lg border-red-200 bg-white text-xs"
                  />
                  <p className="text-[11px] text-slate-500 italic">
                    Note: "I feel terrible" is a feeling, not hard proof.
                  </p>
                </div>

                {/* Evidence Contradicting */}
                <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Evidence Contradicting
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-300">
                      Alternative Realities
                    </Badge>
                  </div>
                  <Textarea
                    value={evidenceAgainst}
                    onChange={(e) => setEvidenceAgainst(e.target.value)}
                    placeholder="What facts contradict the thought? (e.g. My recent performance review was positive; meetings happen for routine updates; I have handled surprises before...)"
                    rows={5}
                    className="rounded-lg border-emerald-200 bg-white text-xs"
                  />
                  <p className="text-[11px] text-slate-500 italic">
                    Include past resilience and alternative explanations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BALANCED REFRAME & MEASURABLE OUTCOME */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Balanced Perspective & Behavioral Action
                  </h4>
                  <p className="text-xs text-indigo-800 mt-1">
                    Based on all the evidence, write a realistic, balanced thought. Then re-rate your belief in the original negative thought.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    Balanced Alternative Thought (The Reframe)
                  </label>
                  {suggestedReframe && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleUseSuggestedReframe}
                      className="text-xs text-primary h-7 px-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Use AI Reframe Suggestion
                    </Button>
                  )}
                </div>
                <Textarea
                  value={balancedThought}
                  onChange={(e) => setBalancedThought(e.target.value)}
                  placeholder="e.g. While I don't know the agenda yet, unexpected meetings are normal. Even if there is critical feedback, it's an opportunity to improve, not the end of my career."
                  rows={3}
                  className="rounded-xl border-slate-300 focus-visible:ring-primary"
                />
              </div>

              {/* Re-Rating Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">
                      Re-Rate Original Belief:
                    </span>
                    <Badge className="bg-emerald-600 text-white font-bold text-xs">
                      {outcomeBelief}%
                    </Badge>
                  </div>
                  <Slider
                    value={[outcomeBelief]}
                    onValueChange={(val) => setOutcomeBelief(val[0])}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <p className="text-[11px] text-slate-500">
                    Initially: <span className="font-bold text-slate-700">{initialBelief}%</span> → Now: <span className="font-bold text-emerald-700">{outcomeBelief}%</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">
                      Re-Rate {selectedEmotion}:
                    </span>
                    <Badge className="bg-blue-600 text-white font-bold text-xs">
                      {outcomeEmotionRating}%
                    </Badge>
                  </div>
                  <Slider
                    value={[outcomeEmotionRating]}
                    onValueChange={(val) => setOutcomeEmotionRating(val[0])}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <p className="text-[11px] text-slate-500">
                    Initially: <span className="font-bold text-slate-700">{initialEmotionRating}%</span> → Now: <span className="font-bold text-blue-700">{outcomeEmotionRating}%</span>
                  </p>
                </div>
              </div>

              {/* Behavioral Action / Homework */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Small Behavioral Action (Next Concrete Step)
                </label>
                <Textarea
                  value={behavioralAction}
                  onChange={(e) => setBehavioralAction(e.target.value)}
                  placeholder="e.g. Prepare a quick list of my recent project milestones, take a 10-minute walk, and sleep on time."
                  rows={2}
                  className="rounded-xl border-slate-300"
                />
              </div>
            </div>
          )}

          {/* STEP 5: CELEBRATION & CLINICAL SUMMARY */}
          {step === 5 && savedRecord && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">
                  Cognitive Restructuring Completed!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  You successfully questioned and reframed an automatic cognitive trap. This breakthrough has been committed to your permanent therapy profile.
                </p>
              </div>

              {/* Quantified Metrics Box */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-2xl">
                    <TrendingDown className="w-5 h-5" />
                    <span>-{Math.max(0, initialBelief - outcomeBelief)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    Belief In Distortion
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-center gap-1 text-blue-600 font-bold text-2xl">
                    <TrendingDown className="w-5 h-5" />
                    <span>-{Math.max(0, initialEmotionRating - outcomeEmotionRating)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    {selectedEmotion} Intensity
                  </p>
                </div>
              </div>

              {/* Breakthrough Snapshot */}
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 text-left space-y-2 max-w-lg mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Your New Balanced Mindset
                </span>
                <p className="text-xs text-slate-800 italic leading-relaxed">
                  "{savedRecord.balanced_thought}"
                </p>
                {savedRecord.behavioral_action && (
                  <p className="text-[11px] text-emerald-800 font-medium pt-1 border-t border-indigo-200">
                    🎯 Active Next Step: {savedRecord.behavioral_action}
                  </p>
                )}
              </div>

              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-md"
              >
                Return to Therapy Session
              </Button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 5 && (
          <div className="bg-slate-50 px-6 py-4 border-t flex justify-between items-center rounded-b-2xl">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-xl border-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 shadow-sm"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSaveThoughtRecord}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {isSubmitting ? "Committing to Memory..." : "Save Thought Record"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
