import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  GraduationCap,
  HeartHandshake,
  Users,
  Activity,
  Compass,
  Target,
  Loader2
} from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import {
  getCurrentUser,
  setCurrentUser,
  submitIntakeAssessment,
  IntakeAssessmentRequest
} from "../../lib/apiClient";
import {
  saveUserIntakeToSupabase,
  getUserIntakeFromSupabase
} from "../../lib/supabaseService";

export default function OnboardingAssessment() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [submitting, setSubmitting] = useState(false);
  const [primaryFocus, setPrimaryFocus] = useState<string[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    "Learn to challenge and reframe intrusive negative thoughts"
  );

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
        if (existing.primary_goal) {
          setPrimaryGoal(existing.primary_goal);
        }
      }
    });
  }, [currentUser, navigate]);

  // Focus options for multi-select chips
  const focusOptions = [
    { id: "Academic & Exam Stress", label: "Academic & Exam Stress", icon: GraduationCap },
    { id: "Anxiety & Overthinking", label: "Anxiety & Overthinking", icon: Compass },
    { id: "Low Mood & Sadness", label: "Low Mood & Sadness", icon: HeartHandshake },
    { id: "Relationship & Social Worries", label: "Social & Relationship", icon: Users },
    { id: "Burnout & Mental Fatigue", label: "Burnout & Fatigue", icon: Activity },
    { id: "Self-Doubt & Low Self-Esteem", label: "Self-Doubt & Confidence", icon: Target },
  ];

  // Goal options for single-select
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

  const handleSelectGoal = (goal: string) => {
    setPrimaryGoal(goal);
  };

  const completeOnboardingAndNavigate = async (payload: IntakeAssessmentRequest) => {
    if (!currentUser) return;
    setSubmitting(true);

    try {
      // 1. Sync to Supabase
      await saveUserIntakeToSupabase(currentUser.id, currentUser.email, payload);
    } catch (supaErr) {
      console.warn("Supabase intake save notice:", supaErr);
    }

    try {
      // 2. Sync to FastAPI backend (sets has_completed_intake on backend)
      await submitIntakeAssessment(currentUser.id, payload);
    } catch (apiErr) {
      console.warn("Backend intake submit notice:", apiErr);
    }

    // 3. Mark has_completed_intake in local state so user is never routed back
    const updatedUser = { ...currentUser, has_completed_intake: true };
    setCurrentUser(updatedUser);

    toast.success("Welcome! Your therapy companion is ready.");
    navigate("/dashboard");
  };

  const handleStart = async () => {
    const payload: IntakeAssessmentRequest = {
      primary_focus: primaryFocus,
      primary_goal: primaryGoal,
    };
    await completeOnboardingAndNavigate(payload);
  };

  const handleSkip = async () => {
    const defaultPayload: IntakeAssessmentRequest = {
      primary_focus: primaryFocus.length > 0 ? primaryFocus : [],
      primary_goal: primaryGoal || "Learn to challenge and reframe intrusive negative thoughts",
    };
    await completeOnboardingAndNavigate(defaultPayload);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-primary/5 to-slate-100 py-8 px-4 sm:px-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-2xl">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <img src={logo} alt="Better Me" className="h-10 mb-3 object-contain" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Poppins']">
            Welcome to Better Me
          </h1>
          <p className="text-sm text-slate-500 font-['Inter'] mt-1 max-w-md">
            Personalize your CBT journey in a few seconds so your companion can best support you.
          </p>
        </div>

        {/* Single-Screen Intake Card */}
        <Card className="border border-slate-200/80 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900 font-['Poppins']">
              Quick Setup
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-['Inter']">
              Choose the topics and primary goal you would like to explore.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-6">
            {/* SECTION 1: What would you like support with? (Multi-select chips) */}
            <div className="space-y-2.5">
              <label className="block text-sm font-bold text-slate-900 font-['Poppins']">
                What would you like support with?
              </label>
              <p className="text-xs text-slate-500 font-['Inter']">
                Select any areas that feel relevant right now (choose as many as you like):
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {focusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = primaryFocus.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleFocus(opt.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer select-none ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                      <span>{opt.label}</span>
                      {isSelected && <Check className="size-3.5 stroke-[1.75]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: What is your main goal? (Single select) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-900 font-['Poppins']">
                What is your main goal?
              </label>
              <p className="text-xs text-slate-500 font-['Inter']">
                Pick the primary outcome you hope to achieve with your companion:
              </p>

              <div className="space-y-2 pt-1">
                {goalOptions.map((goal, idx) => {
                  const isSelected = primaryGoal === goal;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectGoal(goal)}
                      className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 text-slate-900 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="text-xs font-medium font-['Inter'] leading-relaxed pr-3">
                        {goal}
                      </span>
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="size-3.5 stroke-[1.75]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-5 sm:p-6 pt-2 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSkip}
              disabled={submitting}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors order-2 sm:order-1 cursor-pointer"
            >
              Skip for now
            </button>

            <Button
              type="button"
              onClick={handleStart}
              disabled={submitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md shadow-primary/20 px-6 h-10 font-semibold text-xs transition-[background-color,box-shadow] order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing your dashboard...</span>
                </>
              ) : (
                <>
                  <span>Start</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
