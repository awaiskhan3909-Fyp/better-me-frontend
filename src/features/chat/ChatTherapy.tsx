import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import {
  Send,
  Search,
  Plus,
  MessageSquare,
  Home,
  ArrowLeft,
  CheckCheck,
  RotateCcw,
  Scale,
  MoreVertical,
  Smile,
  ShieldCheck,
  Check,
  X,
  Pencil,
  Trash2,
  Download,
  FileText,
  Loader2,
  Menu,
  CheckCircle,
  Target,
  Award,
  BookOpen,
  Heart,
  ChevronRight,
  Layers,
  Tag,
  AlertTriangle,
  Activity,
  Briefcase,
  Users,
  GraduationCap,
  DollarSign
} from "lucide-react";
import BetterMeLogo from "../../imports/Better_me_Logo.png";
import AppShell from "../../app/layouts/AppShell";
import SafetyAlertModal from "./components/SafetyAlertModal";
import ThoughtRecordModal from "../thought-records/components/ThoughtRecordModal";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "../../components/ui/sheet";
import { CBT_DISTORTION_CATEGORIES } from "../practice/data/cbtExercisesData";
import {
  analyzeUserMessage,
  createConversationSession,
  sendMessageInConversation,
  getUserConversations,
  getConversationMessages,
  getCurrentUser,
  CBTGuidance,
  EntityItem,
  ConversationMessageResponse,
  ConversationResponse,
  AnalyzeResponse,
  SafetyPrediction,
  downloadSessionReport,
  updateConversationTitle,
  deleteConversationSession,
  completeConversationSession,
  SessionReportSummary
} from "../../lib/apiClient";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  distortions?: string[];
  riskLevel?: "low" | "medium" | "high";
  timestamp: Date | string;
  cbtGuidance?: CBTGuidance;
  distortionTopClass?: string;
  safetyRisk?: string;
}

const formatMessageTime = (ts: any): string => {
  if (!ts) return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  try {
    const d = typeof ts === "string" || typeof ts === "number" ? new Date(ts) : ts;
    if (d && typeof d.toLocaleTimeString === "function" && !isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
};

export interface CBTStageItem {
  id: string;
  stageNumber: number;
  label: string;
  focus: string;
}

export const CBT_8_STAGES: CBTStageItem[] = [
  {
    id: "check_in",
    stageNumber: 1,
    label: "Check-In",
    focus: "Rapport building, emotional baseline & session agenda",
  },
  {
    id: "exploration",
    stageNumber: 2,
    label: "Agenda & Context",
    focus: "Concrete situation details, involved people & triggers",
  },
  {
    id: "emotion_and_body",
    stageNumber: 3,
    label: "Situation & Emotion",
    focus: "Emotional intensity (0–100) & somatic sensations",
  },
  {
    id: "thought_identification",
    stageNumber: 4,
    label: "Thought Capture",
    focus: "Automatic negative thoughts & catastrophic predictions",
  },
  {
    id: "distortion_analysis",
    stageNumber: 5,
    label: "Distortion Analysis",
    focus: "Examining factual evidence for and against the thought",
  },
  {
    id: "intervention",
    stageNumber: 6,
    label: "Socratic Reframe",
    focus: "Guided discovery to co-create a balanced perspective",
  },
  {
    id: "action_plan",
    stageNumber: 7,
    label: "Action Plan",
    focus: "Behavioral activation micro-step or coping experiment",
  },
  {
    id: "closure",
    stageNumber: 8,
    label: "Wrap-Up & Summary",
    focus: "Session synthesis, reflection & key homework takeaway",
  },
];

const getStageIndex = (stageId?: string): number => {
  if (!stageId) return 0;
  const s = stageId.toLowerCase().trim();
  if (s.includes("check")) return 0;
  if (s.includes("explor") || s.includes("agenda")) return 1;
  if (s.includes("emotion") || s.includes("body") || s.includes("somatic")) return 2;
  if (s.includes("thought") || s.includes("assess")) return 3;
  if (s.includes("distort")) return 4;
  if (s.includes("interven") || s.includes("socratic") || s.includes("reframe")) return 5;
  if (s.includes("action") || s.includes("plan") || s.includes("homework")) return 6;
  if (s.includes("clos") || s.includes("wrap") || s.includes("summary")) return 7;
  return 0;
};

const getDistortionExplanation = (distortionName: string): string => {
  const normalized = distortionName.toLowerCase().replace(/_/g, " ").trim();
  const found = CBT_DISTORTION_CATEGORIES.find(
    (c) =>
      c.name.toLowerCase() === normalized ||
      c.id.toLowerCase() === normalized.replace(/\s+/g, "-") ||
      normalized.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(normalized)
  );
  if (found) {
    return found.description;
  }
  if (normalized.includes("all or nothing") || normalized.includes("split")) {
    return "Break free from black-and-white perfectionist thoughts.";
  }
  if (normalized.includes("fortune")) {
    return "Stop predicting negative outcomes before they happen.";
  }
  if (normalized.includes("reasoning")) {
    return "Recognize that feelings are not definitive facts.";
  }
  if (normalized.includes("mind")) {
    return "Stop assuming what others think without real evidence.";
  }
  if (normalized.includes("catastroph")) {
    return "Learn to challenge worst-case scenarios and exaggerated fears.";
  }
  if (normalized.includes("generaliz")) {
    return "Challenge believing that one event defines your entire life.";
  }
  return "Examine automatic thought assumptions with evidence-based cognitive reframing.";
};

const getEntityCategoryDetails = (label: string) => {
  const upper = (label || "").toUpperCase().trim();
  if (upper.includes("RELATION") || upper.includes("PARTNER") || upper.includes("SPOUSE")) {
    return {
      category: "Relationship",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
      dotClass: "bg-purple-500",
    };
  }
  if (upper.includes("WORK") || upper.includes("JOB") || upper.includes("CAREER") || upper.includes("OFFICE")) {
    return {
      category: "Work",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      dotClass: "bg-blue-500",
    };
  }
  if (upper.includes("FAMIL") || upper.includes("PARENT") || upper.includes("SIBLING") || upper.includes("BROTHER") || upper.includes("SISTER")) {
    return {
      category: "Family",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotClass: "bg-emerald-500",
    };
  }
  if (upper.includes("HEALTH") || upper.includes("MEDIC") || upper.includes("PHYSICAL") || upper.includes("SOMATIC")) {
    return {
      category: "Health",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      dotClass: "bg-rose-500",
    };
  }
  if (upper.includes("ACADEMIC") || upper.includes("STUDY") || upper.includes("EXAM") || upper.includes("SCHOOL") || upper.includes("COLLEGE") || upper.includes("UNI")) {
    return {
      category: "Academic",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      dotClass: "bg-amber-500",
    };
  }
  if (upper.includes("FINANC") || upper.includes("MONEY") || upper.includes("SALARY") || upper.includes("DEBT")) {
    return {
      category: "Financial",
      badgeClass: "bg-teal-50 text-teal-800 border-teal-200",
      dotClass: "bg-teal-500",
    };
  }
  if (upper.includes("SOCIAL") || upper.includes("FRIEND") || upper.includes("PEER")) {
    return {
      category: "Social",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
      dotClass: "bg-indigo-500",
    };
  }
  return {
    category: label || "Context",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  };
};

export default function ChatTherapy() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your Better Me therapist companion. This is a private, confidential space where you can share anything on your mind. How are you feeling today?",
      timestamp: new Date(),
      riskLevel: "low",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [showThoughtRecordModal, setShowThoughtRecordModal] = useState(false);
  const [activeThoughtContext, setActiveThoughtContext] = useState<any>(null);

  const [conversationId, setConversationId] = useState<string | null>(() => {
    return localStorage.getItem("better_me_active_conversation_id") || null;
  });
  const [pastConversations, setPastConversations] = useState<ConversationResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedReportSummary, setCompletedReportSummary] = useState<SessionReportSummary | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSessionId = searchParams.get("session");
  const urlIsNew = searchParams.get("new");
  const [isDesktopInsightsOpen, setIsDesktopInsightsOpen] = useState(false);
  const [isMobileInsightsOpen, setIsMobileInsightsOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sessionInsights, setSessionInsights] = useState<{
    therapyStage: string;
    detectedDistortions: string[];
    entities: EntityItem[];
  }>(() => {
    const savedConvId = localStorage.getItem("better_me_active_conversation_id");
    if (savedConvId) {
      try {
        const saved = localStorage.getItem(`better_me_session_insights_${savedConvId}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      therapyStage: "check_in",
      detectedDistortions: [],
      entities: [],
    };
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleStartRename = (sessionId: string, currentTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (sessionId: string, e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    const previousTitle = pastConversations.find((s) => s.id === sessionId)?.title || "New Session";
    const trimmedTitle = editingTitle.trim();

    // Saving an empty title restores previous title silently without error toast
    if (!trimmedTitle) {
      setEditingSessionId(null);
      setEditingTitle("");
      return;
    }

    // If title is unchanged, close edit mode silently without an unnecessary API call
    if (trimmedTitle === previousTitle) {
      setEditingSessionId(null);
      setEditingTitle("");
      return;
    }

    try {
      setIsSavingTitle(true);
      try {
        await updateConversationTitle(sessionId, trimmedTitle);
      } catch (apiErr: any) {
        console.warn("Backend update title notice:", apiErr);
      }
      setPastConversations((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title: trimmedTitle } : s))
      );
      toast.success("Session renamed successfully");
      window.dispatchEvent(new Event("better_me_sessions_updated"));
      setEditingSessionId(null);
      setEditingTitle("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to rename session");
    } finally {
      setIsSavingTitle(false);
    }
  };

  const handleCancelRename = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleDeleteSession = async (sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat session? This action cannot be undone.")) {
      return;
    }
    try {
      setDeletingSessionId(sessionId);
      try {
        await deleteConversationSession(sessionId);
      } catch (apiErr: any) {
        console.warn("Backend delete notice:", apiErr);
      }
      const remaining = pastConversations.filter((s) => s.id !== sessionId);
      setPastConversations(remaining);
      toast.success("Chat deleted successfully");
      window.dispatchEvent(new Event("better_me_sessions_updated"));

      if (sessionId === conversationId) {
        if (remaining.length > 0) {
          handleSelectSession(remaining[0]);
        } else {
          handleStartNewSession();
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete session");
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleDownloadReport = async (targetConvId?: string) => {
    const cid = targetConvId || conversationId;
    if (!cid) {
      toast.error("No active session to generate report for.");
      return;
    }
    try {
      setIsDownloadingReport(cid);
      toast.info("Generating professional PDF Session Report...");
      await downloadSessionReport(cid);
      toast.success("Session Report downloaded successfully!");
    } catch (err: any) {
      console.error("PDF download error:", err);
      toast.error(err?.message || "Could not download session report.");
    } finally {
      setIsDownloadingReport(null);
    }
  };

  const handleCompleteSession = async () => {
    if (!conversationId) {
      toast.error("No active session to complete.");
      return;
    }
    try {
      setIsEndingSession(true);
      const summary = await completeConversationSession(conversationId);
      setCompletedReportSummary(summary);
      setPastConversations((prev) =>
        prev.map((s) => (s.id === conversationId ? { ...s, status: "completed" } : s))
      );
      window.dispatchEvent(new Event("better_me_sessions_updated"));
      setSessionInsights((prev) => {
        const updated = { ...prev, therapyStage: "closure" };
        if (conversationId) {
          try {
            localStorage.setItem(`better_me_session_insights_${conversationId}`, JSON.stringify(updated));
          } catch {}
        }
        return updated;
      });
      setShowEndSessionConfirm(false);
      setShowCompletionModal(true);
      toast.success("Session completed! Your CBT report summary is ready.");
    } catch (err: any) {
      console.error("Failed to complete session:", err);
      toast.error(err?.message || "Could not complete session.");
    } finally {
      setIsEndingSession(false);
    }
  };

  const loadPastSessions = async () => {
    try {
      setLoadingConversations(true);
      const user = getCurrentUser();
      const list = await getUserConversations(user?.id);
      setPastConversations(list || []);
    } catch (e) {
      console.warn("Could not load user conversations list:", e);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadPastSessions();

    const savedHistory = localStorage.getItem("better_me_chat_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hydrated = parsed.map((m: any) => ({
            ...m,
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
          }));
          setMessages(hydrated);
        }
      } catch (e) {
        console.warn("Could not load saved chat history:", e);
      }
    }

    const savedConvId = localStorage.getItem("better_me_active_conversation_id");
    const user = getCurrentUser();
    if (!savedConvId) {
      createConversationSession("New Session", user?.id)
        .then((res) => {
          setConversationId(res.id);
          localStorage.setItem("better_me_active_conversation_id", res.id);
          setPastConversations((prev) => [res as any, ...prev.filter((p) => p.id !== res.id)]);
          loadPastSessions();
        })
        .catch((err) => console.warn("Could not initialize session:", err));
    } else {
      // Verify that the stored conversation exists on the current active backend
      getConversationMessages(savedConvId)
        .then((msgs) => {
          if (msgs && msgs.length > 0) {
            const mapped: Message[] = msgs.map((m) => ({
              id: m.id,
              type: m.sender_type === "user" ? "user" : "ai",
              content: m.content,
              timestamp: new Date(m.created_at),
              riskLevel: "low",
            }));
            setMessages(mapped);
          }
        })
        .catch((err) => {
          console.warn("Stored conversation not found on active backend, creating new session:", err);
          createConversationSession("New Session", user?.id)
            .then((res) => {
              setConversationId(res.id);
              localStorage.setItem("better_me_active_conversation_id", res.id);
              setPastConversations((prev) => [res as any, ...prev.filter((p) => p.id !== res.id)]);
              loadPastSessions();
            })
            .catch((e) => console.warn("Could not auto-create session:", e));
        });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("better_me_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (urlIsNew === "true") {
      handleStartNewSession();
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
      return;
    }

    if (urlSessionId && urlSessionId !== conversationId) {
      const match = pastConversations.find((s) => s.id === urlSessionId);
      if (match) {
        handleSelectSession(match);
      } else {
        setConversationId(urlSessionId);
        localStorage.setItem("better_me_active_conversation_id", urlSessionId);
        getConversationMessages(urlSessionId)
          .then((msgs) => {
            if (msgs && msgs.length > 0) {
              const mapped: Message[] = msgs.map((m) => ({
                id: m.id,
                type: m.sender_type === "user" ? "user" : "ai",
                content: m.content,
                timestamp: new Date(m.created_at),
                riskLevel: "low",
              }));
              setMessages(mapped);
              localStorage.setItem("better_me_chat_history", JSON.stringify(mapped));
            }
          })
          .catch((e) => console.warn("Could not load session by URL:", e));
      }
    }
  }, [urlSessionId, urlIsNew, pastConversations]);

  const handleSelectSession = async (session: ConversationResponse) => {
    try {
      setIsMobileListOpen(false);
      setConversationId(session.id);
      localStorage.setItem("better_me_active_conversation_id", session.id);

      // Restore session insights if cached
      try {
        const savedInsights = localStorage.getItem(`better_me_session_insights_${session.id}`);
        if (savedInsights) {
          setSessionInsights(JSON.parse(savedInsights));
        } else {
          setSessionInsights({
            therapyStage: session.status === "completed" ? "closure" : "check_in",
            detectedDistortions: [],
            entities: [],
          });
        }
      } catch {
        setSessionInsights({
          therapyStage: session.status === "completed" ? "closure" : "check_in",
          detectedDistortions: [],
          entities: [],
        });
      }

      const dbMessages = await getConversationMessages(session.id);
      if (dbMessages && dbMessages.length > 0) {
        const mapped: Message[] = dbMessages.map((m) => {
          const isUser = m.sender_type === "user";
          return {
            id: m.id,
            type: isUser ? "user" : "ai",
            content: m.content,
            timestamp: new Date(m.created_at),
            riskLevel: "low",
          };
        });
        setMessages(mapped);
        localStorage.setItem("better_me_chat_history", JSON.stringify(mapped));
        toast.success(`Loaded: ${session.title || "Therapy Session"}`);
      } else {
        const freshGreeting: Message = {
          id: "1",
          type: "ai",
          content: "Hello! I'm here to support you in this session. What's on your mind today?",
          timestamp: new Date(),
          riskLevel: "low",
        };
        setMessages([freshGreeting]);
        localStorage.setItem("better_me_chat_history", JSON.stringify([freshGreeting]));
      }
    } catch (err: any) {
      console.error("Could not load session messages:", err);
      toast.error("Could not load selected session messages.");
    }
  };

  const handleStartNewSession = async () => {
    try {
      const user = getCurrentUser();
      const res = await createConversationSession("New Session", user?.id);
      setConversationId(res.id);
      localStorage.setItem("better_me_active_conversation_id", res.id);
      setPastConversations((prev) => [res as any, ...prev.filter((p) => p.id !== res.id)]);
      setEditingSessionId(null);
      setEditingTitle("");
      setSessionInsights({
        therapyStage: "check_in",
        detectedDistortions: [],
        entities: [],
      });
      try {
        localStorage.setItem(
          `better_me_session_insights_${res.id}`,
          JSON.stringify({
            therapyStage: "check_in",
            detectedDistortions: [],
            entities: [],
          })
        );
      } catch {}
      const initialGreeting: Message = {
        id: "1",
        type: "ai",
        content: "New session started! Share whatever you are feeling or experiencing right now.",
        timestamp: new Date(),
        riskLevel: "low",
      };
      setMessages([initialGreeting]);
      localStorage.setItem("better_me_chat_history", JSON.stringify([initialGreeting]));
      loadPastSessions();
      setIsMobileListOpen(false);
      window.dispatchEvent(new Event("better_me_sessions_updated"));
      toast.success("New session started");
    } catch (err: any) {
      console.error("Could not start new session:", err);
      toast.error("Could not initialize new session.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      let activeConvId = conversationId;
      if (!activeConvId) {
        try {
          const user = getCurrentUser();
          const session = await createConversationSession("New Session", user?.id);
          activeConvId = session.id;
          setConversationId(activeConvId);
          setPastConversations((prev) => [session as any, ...prev.filter((p) => p.id !== session.id)]);
        } catch (e) {
          console.warn("Session fallback:", e);
        }
      }

      let aiContent = "";
      let safetyObj: SafetyPrediction = {
        needs_safety_alert: false,
        risk_level: "Safe",
        probabilities: { Safe: 0.985, Moderate: 0.01, "High Risk": 0.005 },
      };
      let distortionClass = "None";
      let cbtGuidanceData: CBTGuidance | undefined = undefined;
      let convRes: ConversationMessageResponse | null = null;
      let analyzeData: AnalyzeResponse | null = null;

      if (activeConvId) {
        try {
          convRes = await sendMessageInConversation(activeConvId, userText);
        } catch (msgErr: any) {
          if (msgErr?.message?.includes("not found") || msgErr?.message?.includes("404")) {
            console.warn("Session not found on backend. Recreating session on active backend...");
            const user = getCurrentUser();
            const freshSession = await createConversationSession("New Session", user?.id);
            activeConvId = freshSession.id;
            setConversationId(activeConvId);
            setPastConversations((prev) => [freshSession as any, ...prev.filter((p) => p.id !== freshSession.id)]);
            localStorage.setItem("better_me_active_conversation_id", activeConvId);
            loadPastSessions();
            convRes = await sendMessageInConversation(activeConvId, userText);
          } else {
            throw msgErr;
          }
        }
        aiContent = convRes.ai_message.content;
        safetyObj = convRes.analysis.safety;
        distortionClass = convRes.analysis.distortion.predicted_class;
        cbtGuidanceData = convRes.analysis.cbt_guidance;
      } else {
        analyzeData = await analyzeUserMessage(userText);
        aiContent = analyzeData.cbt_guidance.balanced_thought_guidance;
        safetyObj = analyzeData.safety;
        distortionClass = analyzeData.distortion.predicted_class;
        cbtGuidanceData = analyzeData.cbt_guidance;
      }

      // Greetings filter
      const isGreetingOrIdentity = /^(?:hi|hello|hey|salam|assalam|sup|yo|kon\s+ho|kaun\s+ho|who\s+(?:are|r)\s+you|kya\s+ho\s+tum|ap\s+kon\s+ho|tum\s+kon\s+ho|who\s+is\s+this|bhai\s+kon\s+ho|kon\s+ho\s+ap\s+bhai)\b/i.test(userText.trim().toLowerCase());
      if (isGreetingOrIdentity) {
        distortionClass = "None";
      }

      // Crisis detection
      const CRISIS_REGEX = /\b(?:suicid|kill\s+(?:my\s*self|myself)|want\s+to\s+die|wish\s+i\s+was\s+dead|end\s+my\s+life|hang\s+myself|khudkushi|marna\s+hai|marna\s+chahta|zeher|jaan\s+de)\b/i;
      const hasActualCrisisWords = CRISIS_REGEX.test(userText);

      if ((safetyObj.needs_safety_alert || safetyObj.risk_level === "High Risk") && hasActualCrisisWords) {
        setShowSafetyAlert(true);
      }

      const isCasualGreeting = isGreetingOrIdentity || userText.trim().length <= 3;
      const detectedDistortions =
        !isCasualGreeting && distortionClass && distortionClass !== "None" && distortionClass !== "Unknown" && distortionClass !== "Normal"
          ? [distortionClass]
          : [];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiContent || "I hear you. Tell me a bit more about what led up to this thought.",
        distortions: detectedDistortions,
        riskLevel: safetyObj.risk_level === "High Risk" && hasActualCrisisWords ? "high" : "low",
        timestamp: new Date(),
        cbtGuidance: cbtGuidanceData,
        distortionTopClass: distortionClass !== "None" ? distortionClass : undefined,
        safetyRisk: safetyObj.risk_level,
      };

      // Live session insights extraction
      const newStage = convRes?.decision?.therapy_stage;
      const newDistortion = convRes?.analysis?.distortion?.predicted_class || analyzeData?.distortion?.predicted_class;
      const newEntities = convRes?.analysis?.entities || analyzeData?.entities || [];

      setSessionInsights((prev) => {
        const updatedStage = newStage || prev.therapyStage;
        const updatedDistortions = [...prev.detectedDistortions];
        if (
          newDistortion &&
          newDistortion !== "None" &&
          newDistortion !== "Normal" &&
          newDistortion !== "Unknown" &&
          !newDistortion.startsWith("LABEL_") &&
          !updatedDistortions.some((d) => d.toLowerCase() === newDistortion.toLowerCase())
        ) {
          updatedDistortions.push(newDistortion);
        }

        const updatedEntities = [...prev.entities];
        for (const ent of newEntities) {
          if (!ent.text) continue;
          const exists = updatedEntities.some(
            (e) => e.text.toLowerCase() === ent.text.toLowerCase() && e.label === ent.label
          );
          if (!exists) {
            updatedEntities.push(ent);
          }
        }

        const updated = {
          therapyStage: updatedStage,
          detectedDistortions: updatedDistortions,
          entities: updatedEntities,
        };

        if (activeConvId) {
          try {
            localStorage.setItem(`better_me_session_insights_${activeConvId}`, JSON.stringify(updated));
          } catch {}
        }
        return updated;
      });

      setMessages((prev: Message[]) => [...prev, aiMessage]);
      loadPastSessions();
    } catch (error: any) {
      console.error("Chat API Error:", error);
      toast.error(
        error?.message || "Could not connect to Better Me AI. Please ensure the backend is active.",
        {
          description: "Please check your network connection or ensure the backend server is running.",
          duration: 6000,
        }
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentStageIdx = getStageIndex(sessionInsights.therapyStage);
  const currentStageItem = CBT_8_STAGES[currentStageIdx] || CBT_8_STAGES[0];

  const renderInsightsPanelContent = (isMobile = false) => {
    return (
      <div className="flex-1 min-h-0 flex flex-col bg-white text-slate-800 overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 pr-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Session Guide</span>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Step {currentStageIdx + 1}/8
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-['Inter']">
              Live CBT stages, distortions & context
            </p>
          </div>
          {!isMobile && (
            <button
              type="button"
              onClick={() => setIsDesktopInsightsOpen(false)}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Collapse side panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-6 overscroll-contain touch-pan-y [webkit-overflow-scrolling:touch]">
          {/* SECTION 1: 8-STAGE CBT PROGRESSION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  CBT Therapy Stages
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-primary">
                {currentStageItem.label}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.round(((currentStageIdx + 1) / 8) * 100)}%` }}
              />
            </div>

            {/* Step Indicator (8 Stages) */}
            <div className="space-y-1 pt-1">
              {CBT_8_STAGES.map((stg, idx) => {
                const isCurrent = idx === currentStageIdx;
                const isPast = idx < currentStageIdx;
                return (
                  <div
                    key={stg.id}
                    className={`flex items-start gap-3 relative transition-opacity ${
                      isCurrent ? "opacity-100" : isPast ? "opacity-90" : "opacity-45"
                    }`}
                  >
                    {/* Connecting line */}
                    {idx < CBT_8_STAGES.length - 1 && (
                      <span
                        className={`absolute left-3 top-6 w-0.5 h-[calc(100%-4px)] ${
                          isPast ? "bg-emerald-400" : "bg-slate-200"
                        }`}
                      />
                    )}

                    {/* Step Icon / Circle */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 z-10 transition-colors ${
                        isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20 shadow-xs"
                          : isPast
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {isPast ? <Check className="size-3.5 stroke-[1.75]" /> : stg.stageNumber}
                    </div>

                    {/* Step Content */}
                    <div
                      className={`flex-1 min-w-0 pb-3 ${
                        isCurrent
                          ? "bg-primary/5 p-2.5 rounded-xl border border-primary/25 -mt-1 shadow-2xs"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent ? "text-primary" : isPast ? "text-slate-800" : "text-slate-500"
                          }`}
                        >
                          {stg.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 bg-primary/10 px-1.5 py-0.2 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-['Inter'] mt-0.5 leading-relaxed">
                        {stg.focus}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: DETECTED COGNITIVE DISTORTIONS */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Distortion Tags
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                {sessionInsights.detectedDistortions.length > 0
                  ? `${sessionInsights.detectedDistortions.length} identified`
                  : "None flagged"}
              </span>
            </div>

            {sessionInsights.detectedDistortions.length === 0 ? (
              <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-700">No Distortions Tagged</p>
                <p className="text-[11px] text-slate-400 font-['Inter'] leading-relaxed">
                  Automatic negative thought patterns will be classified as you describe your experience.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessionInsights.detectedDistortions.map((distortion) => {
                  const explanation = getDistortionExplanation(distortion);
                  return (
                    <div
                      key={distortion}
                      className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200/80 space-y-1"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-purple-900">{distortion}</span>
                      </div>
                      <p className="text-[11px] text-purple-950 font-['Inter'] leading-relaxed">
                        {explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 3: DETECTED CONTEXT ENTITIES */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Context Entities
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                {sessionInsights.entities.length} terms
              </span>
            </div>

            {sessionInsights.entities.length === 0 ? (
              <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 text-center space-y-1">
                <Tag className="w-5 h-5 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No Context Entities Yet</p>
                <p className="text-[11px] text-slate-400 font-['Inter'] leading-relaxed">
                  Contextual triggers across relationship, work, family, health, academic, financial, or social domains will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {sessionInsights.entities.map((entity, idx) => {
                  const conf = getEntityCategoryDetails(entity.label);
                  return (
                    <span
                      key={`${entity.label}-${entity.text}-${idx}`}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border ${conf.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${conf.dotClass}`} />
                      <span className="text-[10px] uppercase font-bold opacity-75">{conf.category}:</span>
                      <span className="font-semibold text-slate-900">"{entity.text}"</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredSessions = pastConversations.filter((sess) =>
    (sess.title || "New Session").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      title="AI Chat Therapy"
      subtitle="Confidential Socratic reflection & guided CBT reframing"
      fixedHeight
      hideBottomNav
      contentClassName="p-2 sm:p-3 md:p-4 flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden min-w-0"
    >
      <div
        className={cn(
          "w-full mx-auto flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-[max-width] duration-200",
          isDesktopInsightsOpen ? "max-w-6xl" : "max-w-4xl"
        )}
      >
        
        {/* WhatsApp/Instagram Top Navbar */}
        <header className="h-14 sm:h-16 px-3 sm:px-6 bg-light-gray border-b border-slate-200/90 flex items-center justify-between flex-shrink-0 z-10 shadow-2xs gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* AI Avatar with Online Status */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
            </div>

            <div className="min-w-0">
              {Boolean(editingSessionId) && editingSessionId === conversationId ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveRename(conversationId!, e);
                      if (e.key === "Escape") handleCancelRename(e);
                    }}
                    autoFocus
                    className="text-xs font-semibold px-2 py-0.5 rounded border border-blue-400 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[110px] xs:max-w-[150px] sm:max-w-[200px]"
                  />
                  <button
                    onClick={(e) => handleSaveRename(conversationId!, e)}
                    disabled={isSavingTitle}
                    className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                    title="Save title"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCancelRename}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5 group/headerTitle min-w-0">
                  <h2
                    onClick={(e) => {
                      const cur = pastConversations.find((s) => s.id === conversationId);
                      if (conversationId) handleStartRename(conversationId, cur?.title || "New Session", e);
                    }}
                    className="font-bold text-slate-900 text-xs sm:text-sm leading-snug cursor-pointer hover:text-primary transition-colors truncate max-w-[105px] xs:max-w-[150px] sm:max-w-[280px]"
                    title="Click to rename session"
                  >
                    {pastConversations.find((s) => s.id === conversationId)?.title || "New Session"}
                  </h2>
                  {conversationId && (
                    <button
                      onClick={(e) => {
                        const cur = pastConversations.find((s) => s.id === conversationId);
                        handleStartRename(conversationId, cur?.title || "New Session", e);
                      }}
                      className="opacity-0 group-hover/headerTitle:opacity-100 hover:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 rounded transition-opacity flex-shrink-0"
                      title="Rename this session"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
              <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium leading-none flex items-center gap-1 mt-0.5">
                <span>online</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">CBT Companion</span>
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* End Session Button or Completed Badge */}
            {conversationId && (
              pastConversations.find((s) => s.id === conversationId)?.status === "completed" ? (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden xs:inline">Completed</span>
                </span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEndSessionConfirm(true)}
                  disabled={isEndingSession}
                  className="bg-white text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 text-xs font-semibold h-8 sm:h-8.5 px-2 sm:px-3 rounded-xl border-emerald-200 shadow-2xs flex items-center gap-1"
                  title="Complete this CBT session and finalize your report"
                >
                  {isEndingSession ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span className="hidden sm:inline">End Session</span>
                  <span className="sm:hidden text-[11px]">End</span>
                </Button>
              )
            )}

            {/* Session Guide Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setIsMobileInsightsOpen((prev) => !prev);
                } else {
                  setIsDesktopInsightsOpen((prev) => !prev);
                }
              }}
              className={`text-xs font-semibold h-8 sm:h-8.5 px-2 sm:px-3 rounded-xl border shadow-2xs flex items-center gap-1 sm:gap-1.5 transition-colors ${
                isDesktopInsightsOpen || isMobileInsightsOpen
                  ? "bg-primary text-white border-primary hover:bg-primary-dark hover:text-white"
                  : "bg-white text-primary-dark hover:bg-blue-50 border-blue-200"
              }`}
              title="Toggle CBT Session Guide & Insights Panel"
            >
              <BookOpen className="size-4 stroke-[1.75]" />
              <span className="hidden sm:inline">Session Guide</span>
              <span className="sm:hidden text-[11px]">Guide</span>
            </Button>

            {/* Desktop Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport()}
              disabled={isDownloadingReport === conversationId}
              className="hidden sm:flex bg-white text-primary-dark hover:bg-blue-50 text-xs font-semibold h-8 sm:h-8.5 px-2.5 sm:px-3 rounded-xl border-blue-200 shadow-2xs items-center gap-1"
              title="Download Professional Psychological Session Report"
            >
              {isDownloadingReport === conversationId ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-primary" />
              )}
              <span>Session Report</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartNewSession}
              className="text-xs text-slate-600 hover:text-slate-900 rounded-xl hidden md:flex items-center gap-1 h-8 sm:h-8.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Chat
            </Button>
            {conversationId && (
              <button
                onClick={() => handleDeleteSession(conversationId)}
                disabled={deletingSessionId === conversationId}
                className="hidden sm:flex w-8 h-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 items-center justify-center transition-colors"
                title="Delete this chat"
              >
                {deletingSessionId === conversationId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            <Link to="/dashboard" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold h-8 sm:h-8.5 px-2 sm:px-3 rounded-xl border-slate-200 shadow-2xs flex items-center"
              >
                <Home className="w-3.5 h-3.5 text-primary sm:mr-1" />
                <span>Dashboard</span>
              </Button>
            </Link>

            {/* Mobile Overflow Menu */}
            <div className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setShowMobileMenu((prev) => !prev)}
                className="w-8 h-8 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center transition-colors border border-slate-200/80 bg-white shadow-2xs"
                title="More options"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4 stroke-[1.75]" />
              </button>

              {showMobileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMobileMenu(false)}
                  />
                  <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleDownloadReport();
                      }}
                      disabled={isDownloadingReport === conversationId}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4 text-primary shrink-0 stroke-[1.75]" />
                      <span>Download Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleStartNewSession();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-500 shrink-0 stroke-[1.75]" />
                      <span>New Chat</span>
                    </button>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowMobileMenu(false)}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Home className="w-4 h-4 text-primary shrink-0 stroke-[1.75]" />
                      <span>Dashboard</span>
                    </Link>
                    {conversationId && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowMobileMenu(false);
                          handleDeleteSession(conversationId);
                        }}
                        disabled={deletingSessionId === conversationId}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors border-t border-slate-100 mt-1 pt-2 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 shrink-0 stroke-[1.75]" />
                        <span>Delete Chat</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Workspace Body: Chat Stream Column + Desktop Collapsible Side Panel */}
        <div className="flex-1 flex flex-row min-h-0 overflow-hidden relative">
          
          {/* Main Chat Stream & Input Column */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            {/* Chat Messages Stream */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">
          
          {/* Centered Date Badge */}
          <div className="flex justify-center my-3">
            <span className="bg-white/95 text-slate-500 text-[11px] font-medium px-3 py-1 rounded-full shadow-2xs border border-slate-200/50">
              Today
            </span>
          </div>

          {messages.map((message) => {
            const isUser = message.type === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in-50 duration-150`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:px-4 sm:py-3 shadow-2xs relative ${
                    isUser
                      ? "bg-primary text-white rounded-tr-xs"
                      : "bg-white text-slate-800 rounded-tl-xs border border-slate-200/70"
                  }`}
                >
                  {/* Message Content */}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>

                  {/* Clean, Non-Intrusive Distortion Pill */}
                  {!isUser && message.distortions && message.distortions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold text-slate-400">Noticed pattern:</span>
                      {message.distortions.map((d) => (
                        <span
                          key={d}
                          className="inline-flex items-center text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 px-2 py-0.5 rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CBT Session Closure Summary Report Download Banner */}
                  {!isUser && (message.content.includes("Session Summary") || message.content.includes("Session Ka Khulasa") || message.content.includes("--- Session")) && (
                    <div className="mt-3 pt-3 border-t border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-3 rounded-xl border border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-primary-dark flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>CBT Session Report Ready</span>
                        </p>
                        <p className="text-[11px] text-slate-600 font-['Inter'] mt-0.5">
                          Your verified clinical CBT synthesis, cognitive reframes, and personalized homework plan are available.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadReport()}
                        disabled={isDownloadingReport === conversationId}
                        className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl h-8 px-3 shadow-xs flex items-center justify-center gap-1.5 flex-shrink-0"
                      >
                        {isDownloadingReport === conversationId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>Download Session Report (PDF)</span>
                      </Button>
                    </div>
                  )}

                  {/* Timestamp & Read Indicator */}
                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                      isUser ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    <span>{formatMessageTime(message.timestamp)}</span>
                    {isUser && <CheckCheck className="size-4 stroke-[1.75]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator (WhatsApp Style 3-Dots) */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200/70 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1">typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp / Instagram Bottom Chat Input Bar */}
        <footer className="p-2 sm:p-3 bg-white border-t border-slate-200/80 flex items-center gap-1.5 sm:gap-2 flex-shrink-0 z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-1 text-slate-400 pl-0.5 sm:pl-1">
            <button
              type="button"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Comfortable CBT Chat"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              placeholder="Message Better Me..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-light-gray border-0 rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-[background-color,transform] flex-shrink-0 ${
              inputValue.trim() && !isTyping
                ? "bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 scale-100"
                : "bg-slate-200 text-slate-400 cursor-not-allowed scale-95"
            }`}
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </footer>
      </div>

      {/* Desktop Collapsible Side Panel (Side-by-side) */}
      {isDesktopInsightsOpen && (
        <aside className="hidden lg:flex w-80 xl:w-96 flex-col border-l border-slate-200/80 bg-white h-full shrink-0 shadow-xs animate-in slide-in-from-right-4 duration-200 overflow-hidden">
          {renderInsightsPanelContent(false)}
        </aside>
      )}
    </div>
  </div>

    {/* Mobile Bottom Sheet */}
    <Sheet open={isMobileInsightsOpen} onOpenChange={setIsMobileInsightsOpen}>
      <SheetContent
        side="bottom"
        className="p-0 gap-0 rounded-t-2xl h-[85dvh] max-h-[85dvh] flex flex-col border-t border-slate-200 bg-white shadow-2xl focus:outline-none overflow-hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Session Guide & Clinical Insights</SheetTitle>
          <SheetDescription>Live CBT stages, distortions & context</SheetDescription>
        </SheetHeader>
        {renderInsightsPanelContent(true)}
      </SheetContent>
    </Sheet>

        {/* Safety Alert Modal */}
        <SafetyAlertModal
          open={showSafetyAlert}
          onOpenChange={setShowSafetyAlert}
        />

        {/* End Session Confirmation Dialog */}
        {showEndSessionConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-['Poppins']">
                Complete This CBT Session?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-5 font-['Inter']">
                Ending the session will synthesize your cognitive reflections, log your breakthroughs, and generate your finalized session summary and PDF report.
              </p>
              <div className="flex items-center justify-end gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEndSessionConfirm(false)}
                  className="rounded-xl text-xs h-9 px-3.5"
                  disabled={isEndingSession}
                >
                  Continue Chatting
                </Button>
                <Button
                  size="sm"
                  onClick={handleCompleteSession}
                  disabled={isEndingSession}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-9 px-4 flex items-center gap-1.5 shadow-sm"
                >
                  {isEndingSession ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  <span>Complete Session</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Session Completed Report Summary Modal */}
        {showCompletionModal && completedReportSummary && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1 border border-emerald-200">
                    Session Completed • {completedReportSummary.session_number}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                    CBT Session Summary & Synthesis
                  </h3>
                  <p className="text-xs text-slate-500 font-['Inter'] mt-0.5">
                    {completedReportSummary.session_date} • {completedReportSummary.duration_str} duration
                  </p>
                </div>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-['Inter']">
                {/* Topic / Trigger */}
                <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                  <p className="text-[11px] font-bold text-primary-dark uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-primary" /> Focus Topic & Situation
                  </p>
                  <p className="text-slate-800 leading-relaxed">
                    {completedReportSummary.presenting_concern || completedReportSummary.presenting_trigger}
                  </p>
                </div>

                {/* Distortion & User's Own Words */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Detected Cognitive Pattern
                    </p>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      {completedReportSummary.distortion_name || completedReportSummary.identified_distortion}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 italic">
                    "{completedReportSummary.distortion_evidence || completedReportSummary.automatic_thought}"
                  </div>
                </div>

                {/* Mood & Intensity */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" /> Emotional State
                    </p>
                    <p className="font-semibold text-slate-800 text-xs">
                      {completedReportSummary.mood || "Reflective"}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-primary" /> Intensity Rating
                    </p>
                    <p className="font-semibold text-slate-800 text-xs truncate">
                      {completedReportSummary.distress_display || "Observed in dialogue"}
                    </p>
                  </div>
                </div>

                {/* Balanced Reframe */}
                {completedReportSummary.balanced_thought && (
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                      Balanced Perspective Co-Created
                    </p>
                    <p className="text-slate-800 leading-relaxed">
                      {completedReportSummary.balanced_thought}
                    </p>
                  </div>
                )}

                {/* Personalized Homework */}
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
                  <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Takeaway Behavioral Experiment
                  </p>
                  <p className="text-slate-800 leading-relaxed">
                    {completedReportSummary.homework}
                  </p>
                </div>

                {/* Next Session Focus */}
                <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
                  <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-600" /> Next Session Focus
                  </p>
                  <p className="text-slate-800 leading-relaxed">
                    {completedReportSummary.next_session_goal}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-2.5 mt-5 pt-3.5 border-t border-slate-100 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCompletionModal(false);
                    handleStartNewSession();
                  }}
                  className="rounded-xl text-xs h-9 px-3 text-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Start New Session
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleDownloadReport(completedReportSummary.conversation_id)}
                    disabled={isDownloadingReport === completedReportSummary.conversation_id}
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold h-9 px-4 flex items-center gap-1.5 shadow-sm"
                  >
                    {isDownloadingReport === completedReportSummary.conversation_id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download PDF Report</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
    </AppShell>
  );
}