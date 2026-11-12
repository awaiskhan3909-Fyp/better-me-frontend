import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import BetterMeLogo from "../../imports/Better_me_Logo.png";
import MobileBottomNav from "../components/MobileBottomNav";
import { toast } from "sonner";
import {
  LayoutDashboard,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Wind,
  LogOut,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Check,
  X,
  Compass,
  HeartPulse,
  Eye,
  Volume2,
  Smile,
  Shield,
  Layers,
  CheckCircle,
  SkipForward,
  Loader2,
  History
} from "lucide-react";
import {
  getCurrentUser,
  recordStressReliefActivity,
  getStressReliefHistory,
  StressReliefRecord
} from "../services/apiService";

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

  // =========================================================================
  // ACTIVITY 1: GUIDED 4-7-8 BREATHING STATE
  // =========================================================================
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathTimer, setBreathTimer] = useState(4);
  const [targetCycles, setTargetCycles] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [breathingSecondsElapsed, setBreathingSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeModal === "breathing" && breathingActive) {
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
  }, [activeModal, breathingActive, breathPhase, targetCycles]);

  const handleResetBreathing = () => {
    setBreathingActive(false);
    setBreathPhase("Inhale");
    setBreathTimer(4);
    setCurrentCycle(1);
    setBreathingSecondsElapsed(0);
  };

  const handleFinishBreathing = () => {
    handleSaveActivity("4-7-8 Guided Breathing", "breathing", breathingSecondsElapsed);
    setCompletionData({ title: "4-7-8 Guided Breathing", duration: breathingSecondsElapsed });
    setActiveModal(null);
    handleResetBreathing();
  };

  // =========================================================================
  // ACTIVITY 2: 5-4-3-2-1 GROUNDING STATE
  // =========================================================================
  const [groundingStep, setGroundingStep] = useState(0); // 0 to 4
  const [groundingSeconds, setGroundingSeconds] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState<{ [key: string]: string[] }>({
    see: ["", "", "", "", ""],
    feel: ["", "", "", ""],
    hear: ["", "", ""],
    smell: ["", ""],
    taste: [""]
  });

  const groundingStepsConfig = [
    {
      key: "see",
      count: 5,
      title: "5 Things You Can See",
      icon: Eye,
      color: "#2a5fb7",
      instruction: "Look around your space. Notice small details: colors, patterns, shadows, or objects you usually overlook.",
      placeholders: [
        "A photo or picture frame",
        "A pen or notebook",
        "Light reflecting on a surface",
        "A plant or tree outside",
        "The texture of the wall"
      ]
    },
    {
      key: "feel",
      count: 4,
      title: "4 Things You Can Feel",
      icon: HeartPulse,
      color: "#8b5cf6",
      instruction: "Focus on your physical contact with your environment. Notice textures, temperature, or gravity.",
      placeholders: [
        "Feet firmly planted on the floor",
        "The smooth fabric of your clothes",
        "Cool air on your skin",
        "The support of your chair"
      ]
    },
    {
      key: "hear",
      count: 3,
      title: "3 Things You Can Hear",
      icon: Volume2,
      color: "#059669",
      instruction: "Close your eyes or look down. Listen for both near and distant sounds.",
      placeholders: [
        "The gentle hum of electronics",
        "Distant street or ambient sounds",
        "The sound of your own quiet breath"
      ]
    },
    {
      key: "smell",
      count: 2,
      title: "2 Things You Can Smell",
      icon: Wind,
      color: "#d97706",
      instruction: "Notice any scents around you, or recall two comforting scents you cherish.",
      placeholders: [
        "Fresh clean air or a room fragrance",
        "Warm coffee, tea, or a calming scent"
      ]
    },
    {
      key: "taste",
      count: 1,
      title: "1 Thing You Can Taste",
      icon: Smile,
      color: "#e11d48",
      instruction: "Notice the current taste in your mouth, take a sip of water, or recall a fresh minty flavor.",
      placeholders: [
        "A sip of cool water or clean taste of breath"
      ]
    }
  ];

  useEffect(() => {
    let interval: any;
    if (activeModal === "grounding") {
      interval = setInterval(() => setGroundingSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeModal]);

  const handleGroundingInputChange = (key: string, idx: number, value: string) => {
    setGroundingInputs((prev) => {
      const list = [...(prev[key] || [])];
      list[idx] = value;
      return { ...prev, [key]: list };
    });
  };

  const handleFinishGrounding = () => {
    handleSaveActivity("5-4-3-2-1 Grounding", "grounding", groundingSeconds, "Grounding sensory exercise completed");
    setCompletionData({ title: "5-4-3-2-1 Sensory Grounding", duration: groundingSeconds });
    setActiveModal(null);
    setGroundingStep(0);
    setGroundingSeconds(0);
  };

  // =========================================================================
  // ACTIVITY 3: PROGRESSIVE MUSCLE RELAXATION (PMR) STATE
  // =========================================================================
  const pmrGroups = [
    {
      id: "hands",
      name: "Hands & Arms",
      action: "Make gentle fists and tighten your forearms for 5 seconds.",
      release: "Now release slowly. Let your hands open, fingers relax, and feel the warm soothing sensations of release."
    },
    {
      id: "shoulders",
      name: "Shoulders & Neck",
      action: "Gently shrug both shoulders upwards towards your ears.",
      release: "Drop your shoulders completely. Feel the weight and tension rolling off your neck and upper back."
    },
    {
      id: "face",
      name: "Face & Jaw",
      action: "Gently scrunch your facial muscles and soften your jaw, without clenching teeth hard.",
      release: "Smooth out your brow, unclamp your jaw, and let your tongue rest comfortably behind your teeth."
    },
    {
      id: "abdomen",
      name: "Abdomen & Core",
      action: "Gently tighten your stomach muscles as if preparing for a light push.",
      release: "Exhale fully and let your belly soften completely. Breathe naturally and gently into your stomach."
    },
    {
      id: "legs",
      name: "Legs & Feet",
      action: "Gently curl your toes downward and lightly engage your calf and thigh muscles.",
      release: "Release all tension in your legs. Feel your feet resting peacefully and grounded on the floor."
    }
  ];

  const [pmrStep, setPmrStep] = useState(0);
  const [pmrSeconds, setPmrSeconds] = useState(0);
  const [pmrPhase, setPmrPhase] = useState<"tense" | "release">("tense");
  const [pmrPhaseTimer, setPmrPhaseTimer] = useState(5);
  const [pmrActive, setPmrActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (activeModal === "pmr" && pmrActive) {
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
  }, [activeModal, pmrActive, pmrPhase, pmrStep]);

  const handleSkipPmr = () => {
    if (pmrStep < pmrGroups.length - 1) {
      setPmrStep((s) => s + 1);
      setPmrPhase("tense");
      setPmrPhaseTimer(5);
    } else {
      handleFinishPmr();
    }
  };

  const handleFinishPmr = () => {
    handleSaveActivity("Progressive Muscle Relaxation", "pmr", pmrSeconds);
    setCompletionData({ title: "Progressive Muscle Relaxation", duration: pmrSeconds });
    setActiveModal(null);
    setPmrStep(0);
    setPmrSeconds(0);
    setPmrActive(false);
    setPmrPhase("tense");
    setPmrPhaseTimer(5);
  };

  // =========================================================================
  // ACTIVITY 4: MINDFUL PAUSE (2-MINUTE MINDFULNESS)
  // =========================================================================
  const [mindfulActive, setMindfulActive] = useState(false);
  const [mindfulSecondsLeft, setMindfulSecondsLeft] = useState(120); // 2 minutes
  const [mindfulTotalSeconds, setMindfulTotalSeconds] = useState(0);

  const mindfulPrompts = [
    {
      at: 120,
      title: "1. Notice Your Natural Breath",
      text: "Allow your breathing to find its own natural rhythm. Do not force or change it. Just observe air flowing in and out."
    },
    {
      at: 90,
      title: "2. Observe Thoughts Without Judging",
      text: "Notice whatever thoughts are crossing your mind right now. Picture them as clouds drifting across a wide blue sky."
    },
    {
      at: 60,
      title: "3. Scan Body Sensations",
      text: "Bring gentle awareness to where your body meets the chair or floor. Soften any area holding subtle tightness."
    },
    {
      at: 30,
      title: "4. Return to the Present Moment",
      text: "Gently expand your awareness back to the room. Carry this sense of grounded calm into your next activity."
    }
  ];

  const currentMindfulPrompt = mindfulPrompts.find((p) => mindfulSecondsLeft <= p.at) || mindfulPrompts[0];

  useEffect(() => {
    let interval: any;
    if (activeModal === "mindful_pause" && mindfulActive) {
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
  }, [activeModal, mindfulActive]);

  const handleResetMindful = () => {
    setMindfulActive(false);
    setMindfulSecondsLeft(120);
    setMindfulTotalSeconds(0);
  };

  const handleFinishMindful = () => {
    handleSaveActivity("Mindful Pause", "mindful_pause", mindfulTotalSeconds);
    setCompletionData({ title: "Mindful Pause", duration: mindfulTotalSeconds });
    setActiveModal(null);
    handleResetMindful();
  };

  const userName = currentUser?.full_name || currentUser?.email?.split("@")[0] || "Friend";
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#e8f1fc] p-2 sm:p-6 lg:p-8 flex items-center justify-center font-sans selection:bg-[#2a5fb7]/20 pb-20 lg:pb-8">
      {/* Unified Glassmorphic Workspace Shell */}
      <div className="w-full max-w-[1480px] bg-[#f4f8fe]/95 backdrop-blur-2xl rounded-2xl sm:rounded-[36px] shadow-2xl shadow-blue-900/10 border border-white/80 p-3.5 sm:p-7 flex flex-col lg:flex-row gap-4 sm:gap-6 overflow-hidden">
        
        {/* Left Slim Icon Navigation Rail (Desktop Only) */}
        <aside className="hidden lg:flex lg:w-20 lg:flex-col items-center justify-between py-4 px-0 bg-white/70 backdrop-blur-md rounded-[28px] border border-white shadow-xs flex-shrink-0">
          <Link
            to="/dashboard"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-blue-900/10 flex items-center justify-center p-1.5 transition-transform hover:scale-105 overflow-hidden"
            title="Better Me"
          >
            <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
          </Link>

          <nav className="flex lg:flex-col items-center gap-3 sm:gap-4 my-auto">
            <Link
              to="/dashboard"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>

            <Link
              to="/chat"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="CBT Chat Session"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>

            <Link
              to="/progress"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="My Learning Progress"
            >
              <TrendingUp className="w-5 h-5" />
            </Link>

            <Link
              to="/thought-records"
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"
              title="CBT Practice Center"
            >
              <BookOpen className="w-5 h-5" />
            </Link>

            <button
              className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#182a4d] text-white shadow-md shadow-slate-900/20"
              title="Instant Stress Relief"
            >
              <Wind className="w-5 h-5" />
            </button>
          </nav>

          <div className="flex lg:flex-col items-center gap-3">
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
          
          {/* Top Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="lg:hidden w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1.5 flex-shrink-0">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Instant Stress Relief</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-['Inter'] line-clamp-1 sm:line-clamp-none">
                  Take a moment for yourself. Explore simple guided exercises to help manage stress, tension, and overwhelming emotions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
              <Link to="/thought-records">
                <Button size="sm" variant="outline" className="text-xs h-8.5 sm:h-9 px-3 rounded-xl border-slate-200">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#2a5fb7]" />
                  Practice Center
                </Button>
              </Link>

              <div className="flex items-center gap-2 bg-white pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-full shadow-xs border border-slate-100">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#2a5fb7] to-[#b8a1ff] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {firstName[0] || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                  {userName}
                </span>
              </div>
            </div>
          </header>

          {/* Gentle Informational Disclaimer Banner */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-xs text-blue-900 font-['Inter']">
            <Shield className="w-4 h-4 text-[#2a5fb7] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-blue-950">Self-Help Support Notice: </span>
              These interactive grounding and breathing exercises are educational self-help tools that complement cognitive reframing. They are not clinical treatment or emergency crisis intervention.
            </p>
          </div>

          {/* SECTION: 4 Interactive Stress Relief Activity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Activity 1: Guided Breathing */}
            <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#2a5fb7] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Wind className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 font-['Inter']">
                    2–4 mins · Calming
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#2a5fb7] transition-colors">
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
                    handleResetBreathing();
                    setActiveModal("breathing");
                  }}
                  className="w-full bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Start Breathing Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Activity 2: 5-4-3-2-1 Grounding */}
            <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#8b5cf6] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 font-['Inter']">
                    3–5 mins · Sensory
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#8b5cf6] transition-colors">
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
                    setGroundingStep(0);
                    setActiveModal("grounding");
                  }}
                  className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-semibold h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Start Grounding Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Activity 3: Progressive Muscle Relaxation */}
            <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
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
                    setPmrStep(0);
                    setPmrActive(false);
                    setPmrPhase("tense");
                    setPmrPhaseTimer(5);
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
            <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
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
                    handleResetMindful();
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
          <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-xs border border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#2a5fb7]" />
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
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: GUIDED BREATHING (4-7-8) */}
      {/* ===================================================================== */}
      {activeModal === "breathing" && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#2a5fb7] flex items-center justify-center">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">4-7-8 Guided Breathing</h3>
                  <p className="text-xs text-slate-400 font-['Inter']">Rhythmic calming breath</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleResetBreathing();
                  setActiveModal(null);
                }}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
              
              {/* Cycle config & Tracker */}
              <div className="flex items-center justify-between w-full text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium font-['Inter']">Cycles:</span>
                  <select
                    value={targetCycles}
                    onChange={(e) => {
                      setTargetCycles(Number(e.target.value));
                      setCurrentCycle(1);
                    }}
                    disabled={breathingActive}
                    className="bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg px-2 py-0.5 text-xs focus:outline-none"
                  >
                    <option value={2}>2 Cycles</option>
                    <option value={4}>4 Cycles</option>
                    <option value={6}>6 Cycles</option>
                    <option value={8}>8 Cycles</option>
                  </select>
                </div>

                <span className="text-xs font-semibold text-[#2a5fb7]">
                  Cycle {Math.min(currentCycle, targetCycles)} of {targetCycles}
                </span>
              </div>

              {/* Animated Breathing Circle */}
              <div className="relative flex items-center justify-center py-4">
                <div
                  className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                    breathingActive
                      ? breathPhase === "Inhale"
                        ? "scale-110 bg-gradient-to-tr from-sky-100 to-blue-200 border-4 border-[#2a5fb7] text-[#1a4f97] shadow-xl shadow-blue-500/25"
                        : breathPhase === "Hold"
                        ? "scale-110 bg-gradient-to-tr from-purple-100 to-indigo-200 border-4 border-indigo-500 text-indigo-900 shadow-xl shadow-indigo-500/25"
                        : "scale-90 bg-gradient-to-tr from-teal-100 to-emerald-200 border-4 border-emerald-500 text-emerald-900 shadow-md"
                      : "bg-slate-50 border-2 border-slate-200 text-slate-600"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {breathingActive ? breathPhase : "Ready"}
                  </span>
                  <span className="text-4xl font-extrabold tracking-tight mt-1">
                    {breathingActive ? `${breathTimer}s` : "4-7-8"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {breathingActive ? (breathPhase === "Inhale" ? "Breathe in" : breathPhase === "Hold" ? "Gently hold" : "Slow exhale") : "Tap Start"}
                  </span>
                </div>
              </div>

              {/* Step Pill Indicators */}
              <div className="flex items-center gap-2 justify-center w-full">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                    breathingActive && breathPhase === "Inhale"
                      ? "bg-[#2a5fb7] text-white shadow-xs"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Inhale 4s
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                    breathingActive && breathPhase === "Hold"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Hold 7s
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                    breathingActive && breathPhase === "Exhale"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Exhale 8s
                </span>
              </div>

              {/* Comfort Notice */}
              <p className="text-[11px] text-slate-400 font-['Inter'] leading-relaxed max-w-sm">
                💡 <span className="font-semibold text-slate-600">Comfort note: </span>
                If you feel dizzy or breathless at any time, stop or return to your natural comfortable breathing rhythm.
              </p>

              {/* Control Buttons */}
              <div className="flex items-center gap-3 w-full pt-2">
                <Button
                  onClick={() => setBreathingActive(!breathingActive)}
                  className={`flex-1 text-xs font-bold h-10 rounded-xl shadow-xs flex items-center justify-center gap-1.5 ${
                    breathingActive
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-[#2a5fb7] hover:bg-[#1a4f97] text-white"
                  }`}
                >
                  {breathingActive ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> {breathingSecondsElapsed > 0 ? "Resume" : "Start"}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResetBreathing}
                  className="text-xs font-semibold h-10 px-3.5 rounded-xl border-slate-200 hover:bg-slate-50"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleFinishBreathing}
                  disabled={breathingSecondsElapsed < 5}
                  className="text-xs font-bold h-10 px-4 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Check className="w-4 h-4 mr-1" /> Finish
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: 5-4-3-2-1 GROUNDING */}
      {/* ===================================================================== */}
      {activeModal === "grounding" && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-xl max-h-[90vh] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#8b5cf6] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">5-4-3-2-1 Sensory Grounding</h3>
                  <p className="text-xs text-slate-400 font-['Inter']">Step {groundingStep + 1} of 5</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5">
              <div
                className="bg-purple-600 h-full transition-all duration-300"
                style={{ width: `${((groundingStep + 1) / 5) * 100}%` }}
              />
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {(() => {
                const currentConfig = groundingStepsConfig[groundingStep];
                const StepIcon = currentConfig.icon;
                const currentVals = groundingInputs[currentConfig.key] || [];

                return (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-purple-50/60 border border-purple-100 p-4 rounded-2xl">
                      <div className="w-9 h-9 rounded-xl bg-[#8b5cf6] text-white flex items-center justify-center flex-shrink-0">
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-purple-950">{currentConfig.title}</h4>
                        <p className="text-xs text-purple-900 font-['Inter'] mt-1 leading-relaxed">
                          {currentConfig.instruction}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {Array.from({ length: currentConfig.count }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            placeholder={currentConfig.placeholders[idx] || `Item ${idx + 1}`}
                            value={currentVals[idx] || ""}
                            onChange={(e) => handleGroundingInputChange(currentConfig.key, idx, e.target.value)}
                            className="flex-1 bg-white border border-slate-200 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer Navigation */}
            <div className="p-4 border-t border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
                disabled={groundingStep === 0}
                className="text-xs rounded-xl"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
              </Button>

              {groundingStep < 4 ? (
                <Button
                  size="sm"
                  onClick={() => setGroundingStep((s) => s + 1)}
                  className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs rounded-xl"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleFinishGrounding}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  <Check className="w-4 h-4 mr-1" /> Complete Grounding
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: PROGRESSIVE MUSCLE RELAXATION (PMR) */}
      {/* ===================================================================== */}
      {activeModal === "pmr" && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Progressive Muscle Relaxation</h3>
                  <p className="text-xs text-slate-400 font-['Inter']">
                    Group {pmrStep + 1} of {pmrGroups.length}: {pmrGroups[pmrStep].name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${((pmrStep + 1) / pmrGroups.length) * 100}%` }}
              />
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
              
              {/* Muscle Group Visual */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-700 ${
                  pmrActive
                    ? pmrPhase === "tense"
                      ? "scale-105 bg-amber-50 border-4 border-amber-500 text-amber-900 shadow-lg shadow-amber-500/20"
                      : "scale-100 bg-emerald-50 border-4 border-emerald-500 text-emerald-900 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-50 border-2 border-slate-200 text-slate-600"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  {pmrActive ? (pmrPhase === "tense" ? "Gentle Tension" : "Full Release") : "Ready"}
                </span>
                <span className="text-3xl font-extrabold tracking-tight mt-1">
                  {pmrActive ? `${pmrPhaseTimer}s` : pmrGroups[pmrStep].name.split(" ")[0]}
                </span>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 max-w-md text-left space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                    1. Gentle Tense:
                  </span>
                  <p className="text-xs text-slate-700 font-['Inter'] leading-relaxed mt-0.5">
                    {pmrGroups[pmrStep].action}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    2. Deep Release:
                  </span>
                  <p className="text-xs text-slate-700 font-['Inter'] leading-relaxed mt-0.5">
                    {pmrGroups[pmrStep].release}
                  </p>
                </div>
              </div>

              {/* Skip option notice */}
              <p className="text-[11px] text-slate-400 font-['Inter'] leading-relaxed max-w-sm">
                💡 <span className="font-semibold text-slate-600">Comfort notice: </span>
                Never strain or cause pain. Feel free to skip any muscle group if you feel soreness or injury.
              </p>

              {/* Controls */}
              <div className="flex items-center gap-3 w-full pt-1">
                <Button
                  onClick={() => setPmrActive(!pmrActive)}
                  className={`flex-1 text-xs font-bold h-10 rounded-xl shadow-xs flex items-center justify-center gap-1.5 ${
                    pmrActive
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {pmrActive ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> {pmrSeconds > 0 ? "Resume" : "Start Muscle Group"}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSkipPmr}
                  className="text-xs font-semibold h-10 px-3.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                >
                  <span>Skip</span> <SkipForward className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleFinishPmr}
                  className="text-xs font-bold h-10 px-4 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Check className="w-4 h-4 mr-1" /> Finish
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: MINDFUL PAUSE (2-MINUTE MINDFULNESS) */}
      {/* ===================================================================== */}
      {activeModal === "mindful_pause" && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Mindful Pause</h3>
                  <p className="text-xs text-slate-400 font-['Inter']">2-Minute Gentle Awareness</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleResetMindful();
                  setActiveModal(null);
                }}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
              
              {/* Circular Timer Visual */}
              <div
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-700 ${
                  mindfulActive
                    ? "bg-amber-50 border-4 border-amber-500 text-amber-900 shadow-xl shadow-amber-500/20 scale-105"
                    : "bg-slate-50 border-2 border-slate-200 text-slate-600"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {mindfulActive ? "Centering" : "Ready"}
                </span>
                <span className="text-4xl font-extrabold tracking-tight mt-1">
                  {Math.floor(mindfulSecondsLeft / 60)}:
                  {String(mindfulSecondsLeft % 60).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Remaining</span>
              </div>

              {/* Dynamic Guidance Prompt */}
              <div className="bg-[#fef9ee] border border-amber-200/80 p-4 rounded-2xl max-w-md text-left">
                <h4 className="text-xs font-bold text-amber-950">{currentMindfulPrompt.title}</h4>
                <p className="text-xs text-amber-900 font-['Inter'] mt-1 leading-relaxed">
                  {currentMindfulPrompt.text}
                </p>
              </div>

              {/* 4 Prompt Indicators */}
              <div className="grid grid-cols-4 gap-1.5 w-full">
                {mindfulPrompts.map((p, idx) => {
                  const isActive = mindfulSecondsLeft <= p.at && (idx === mindfulPrompts.length - 1 || mindfulSecondsLeft > mindfulPrompts[idx + 1].at);
                  const isDone = mindfulSecondsLeft < p.at;

                  return (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        isDone || isActive ? "bg-amber-500" : "bg-slate-200"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 w-full pt-1">
                <Button
                  onClick={() => setMindfulActive(!mindfulActive)}
                  className={`flex-1 text-xs font-bold h-10 rounded-xl shadow-xs flex items-center justify-center gap-1.5 ${
                    mindfulActive
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-[#2a5fb7] hover:bg-[#1a4f97] text-white"
                  }`}
                >
                  {mindfulActive ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> {mindfulSecondsLeft < 120 ? "Resume" : "Start Timer"}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResetMindful}
                  className="text-xs font-semibold h-10 px-3.5 rounded-xl border-slate-200 hover:bg-slate-50"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleFinishMindful}
                  disabled={mindfulTotalSeconds < 5}
                  className="text-xs font-bold h-10 px-4 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Check className="w-4 h-4 mr-1" /> Finish
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* COMPLETION CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {completionData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-md p-6 text-center shadow-2xl border border-slate-100 space-y-4">
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
                className="w-full bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs font-bold h-10 rounded-xl shadow-xs"
              >
                Back to Stress Relief
              </Button>
              <Link to="/thought-records">
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

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomNav active="stress-relief" />
    </div>
  );
}

