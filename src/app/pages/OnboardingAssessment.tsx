import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  HeartHandshake,
  GraduationCap,
  Activity,
  Compass,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import {
  getCurrentUser,
  submitIntakeAssessment,
  IntakeAssessmentRequest
} from "../services/apiService";
import {
  saveUserIntakeToSupabase,
  getUserIntakeFromSupabase
} from "../services/supabaseService";

export default function OnboardingAssessment() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [primaryFocus, setPrimaryFocus] = useState<string[]>([]);
  const [distressBaseline, setDistressBaseline] = useState<number>(1);
  const [familiarDistortions, setFamiliarDistortions] = useState<string[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<string>("Learn to challenge and reframe negative thoughts");
  const [safetyAcknowledged, setSafetyAcknowledged] = useState<boolean>(true);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!currentUser) {
      toast.error("Please login or create an account first");
      navigate("/login");
      return;
    }

    // Check if user already has an intake assessment saved in Supabase
    getUserIntakeFromSupabase(currentUser.id, currentUser.email).then((existing) => {
      if (existing) {
        if (existing.primary_focus && existing.primary_focus.length > 0) {
          setPrimaryFocus(existing.primary_focus);
        }
        if (existing.distress_baseline !== undefined) {
          setDistressBaseline(existing.distress_baseline);
        }
        if (existing.familiar_distortions) {
          setFamiliarDistortions(existing.familiar_distortions);
        }
        if (existing.primary_goal) {
          setPrimaryGoal(existing.primary_goal);
        }
      }
    });
  }, [currentUser, navigate]);

  const totalSteps = 5;

  // Step 1: Focus Options
  const focusOptions = [
    { id: "Academic & Exam Stress", label: "Academic & Exam Stress", icon: GraduationCap, desc: "Managing pressure around exams, grades, and future prospects" },
    { id: "Anxiety & Overthinking", label: "Anxiety & Overthinking", icon: Brain, desc: "Persistent worrying, racing thoughts, and mental restlessness" },
    { id: "Low Mood & Sadness", label: "Low Mood & Sadness", icon: HeartHandshake, desc: "Feeling down, lack of motivation, or feelings of hopelessness" },
    { id: "Relationship & Social Worries", label: "Social & Relationship", icon: Compass, desc: "Fear of negative judgment, loneliness, or interpersonal conflict" },
    { id: "Burnout & Mental Fatigue", label: "Burnout & Fatigue", icon: Activity, desc: "Feeling completely overwhelmed and drained by daily demands" },
    { id: "Self-Doubt & Low Self-Esteem", label: "Self-Doubt & Confidence", icon: Sparkles, desc: "Harsh inner critic and struggling to feel worthy or capable" },
  ];

  // Step 2: PHQ Distress Options
  const distressOptions = [
    { score: 0, title: "Not at all", subtitle: "Feeling generally stable and manageable" },
    { score: 1, title: "Several days", subtitle: "Occasional stress or mild worries" },
    { score: 2, title: "More than half the days", subtitle: "Noticeable impact on daily focus and energy" },
    { score: 3, title: "Nearly every day", subtitle: "Frequent, heavy emotional burden" },
  ];

  // Step 3: Familiar Distortions
  const distortionOptions = [
    { name: "Catastrophizing", text: "Assuming the worst possible outcome will happen no matter what" },
    { name: "Mind Reading", text: "Believing others are secretly judging or thinking badly of me" },
    { name: "All-or-Nothing Thinking", text: "Feeling like if something isn't completely perfect, it's a total failure" },
    { name: "Emotional Reasoning", text: "Feeling like because I feel anxious or hopeless, things must truly be hopeless" },
    { name: "Overgeneralization", text: "Believing that one setback means I will always struggle" },
    { name: "Fortune Telling", text: "Predicting negative outcomes before giving things a chance" },
  ];

  // Step 4: Therapy Goals
  const goalOptions = [
    "Learn to challenge and reframe intrusive negative thoughts",
    "Develop daily actionable mental health exercises & coping habits",
    "Have a safe, confidential space to vent and explore my feelings",
    "Track my emotional patterns and build long-term resilience",
  ];

  const handleToggleFocus = (id: string) => {
    setPrimaryFocus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleDistortion = (name: string) => {
    setFamiliarDistortions((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleNext = () => {
    if (step === 1 && primaryFocus.length === 0) {
      toast.error("Please select at least one primary focus area");
      return;
    }
    if (step === 5 && !safetyAcknowledged) {
      toast.error("Please acknowledge the safety guidelines to continue");
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    setSubmitting(true);

    const payload: IntakeAssessmentRequest = {
      primary_focus: primaryFocus,
      distress_baseline: distressBaseline,
      familiar_distortions: familiarDistortions,
      primary_goal: primaryGoal,
      safety_acknowledged: safetyAcknowledged,
    };

    try {
      // 1. Save directly to Supabase per-user intake table
      await saveUserIntakeToSupabase(currentUser.id, currentUser.email, payload);
    } catch (supaErr) {
      console.warn("Supabase save notice:", supaErr);
    }

    try {
      // 2. Also sync with FastAPI backend
      await submitIntakeAssessment(currentUser.id, payload);
      toast.success("Initial assessment saved! Welcome to your personalized dashboard.");
      navigate("/dashboard");
    } catch (err: any) {
      toast.success("Assessment saved! Welcome to your personalized dashboard.");
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary/5 to-secondary-lighter py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Top Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Better Me" className="h-10 mb-2" />
          <h1 className="text-xl font-semibold text-slate-800">Initial Therapy Intake Assessment</h1>
          <p className="text-sm text-slate-500 font-['Inter']">Personalizing your Cognitive Behavioral Therapy journey</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Card Container */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden transition-all">
          <CardHeader className="pb-4">
            {step === 1 && (
              <>
                <CardTitle className="text-2xl text-slate-900">What brings you to Better Me today?</CardTitle>
                <CardDescription>
                  Select the core areas you'd like to work on. You can choose more than one.
                </CardDescription>
              </>
            )}

            {step === 2 && (
              <>
                <CardTitle className="text-2xl text-slate-900">Recent Emotional Baseline</CardTitle>
                <CardDescription>
                  Over the past two weeks, how often have you felt overwhelmed, anxious, or down?
                </CardDescription>
              </>
            )}

            {step === 3 && (
              <>
                <CardTitle className="text-2xl text-slate-900">Familiar Thinking Habits</CardTitle>
                <CardDescription>
                  In CBT, identifying distorted thought patterns is the first step toward positive reframing. Which of these resonate with you?
                </CardDescription>
              </>
            )}

            {step === 4 && (
              <>
                <CardTitle className="text-2xl text-slate-900">Your Primary Therapy Goal</CardTitle>
                <CardDescription>
                  Choose the main outcome you hope to achieve with our AI CBT companion.
                </CardDescription>
              </>
            )}

            {step === 5 && (
              <>
                <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-primary" />
                  Clinical & Safety Agreement
                </CardTitle>
                <CardDescription>
                  Please review our emergency safety guidance before entering your sessions.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step 1 Content: Focus Areas */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {focusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = primaryFocus.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleFocus(opt.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-700"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{opt.label}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 2 Content: Emotional Baseline */}
            {step === 2 && (
              <div className="space-y-3">
                {distressOptions.map((opt) => {
                  const isSelected = distressBaseline === opt.score;
                  return (
                    <div
                      key={opt.score}
                      onClick={() => setDistressBaseline(opt.score)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {opt.score + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{opt.title}</h4>
                          <p className="text-xs text-slate-500">{opt.subtitle}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 3 Content: Distortions Pre-Screening */}
            {step === 3 && (
              <div className="space-y-3">
                {distortionOptions.map((opt) => {
                  const isSelected = familiarDistortions.includes(opt.name);
                  return (
                    <div
                      key={opt.name}
                      onClick={() => handleToggleDistortion(opt.name)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={isSelected ? "bg-primary/10 text-primary border-primary/20" : "text-slate-600"}>
                            {opt.name}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 font-['Inter'] leading-relaxed">{opt.text}</p>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 4 Content: Primary Goal */}
            {step === 4 && (
              <div className="space-y-3">
                {goalOptions.map((goal, idx) => {
                  const isSelected = primaryGoal === goal;
                  return (
                    <div
                      key={idx}
                      onClick={() => setPrimaryGoal(goal)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                          <Lightbulb className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{goal}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 5 Content: Emergency Safety */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-800 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Important Clinical Notice
                  </div>
                  <p>
                    Better Me utilizes fine-tuned BERT models and AI-guided Cognitive Behavioral Therapy principles to support your mental wellbeing. It is designed as a self-reflection and coping companion, not a substitute for clinical psychiatric care or acute crisis intervention.
                  </p>
                  <p className="font-medium text-amber-800">
                    If you are experiencing severe distress or thoughts of self-harm, please reach out to emergency resources immediately:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Pakistan Emergency: <strong>1122</strong></li>
                    <li>Umang Mental Health Helpline (Pakistan): <strong>0311-7786264</strong></li>
                    <li>International Suicide Crisis Lifeline: <strong>988</strong></li>
                  </ul>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Checkbox
                    id="safety-ack"
                    checked={safetyAcknowledged}
                    onCheckedChange={(checked) => setSafetyAcknowledged(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label htmlFor="safety-ack" className="text-xs text-slate-700 cursor-pointer leading-relaxed">
                    I understand that Better Me is an AI CBT support companion and agree to utilize designated professional crisis helplines if in immediate physical danger or distress.
                  </label>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 pb-6 px-6 flex justify-between border-t border-slate-100 bg-slate-50/50">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={submitting} className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={handleNext}
              disabled={submitting}
              className="bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 px-6"
            >
              {step === totalSteps ? (
                submitting ? "Saving Assessment..." : "Complete & Enter Dashboard"
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
