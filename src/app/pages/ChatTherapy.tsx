import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Send,
  Sparkles,
  Search,
  Plus,
  MessageSquare,
  Home,
  ArrowLeft,
  CheckCheck,
  RotateCcw,
  Scale,
  Brain,
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
  Menu
} from "lucide-react";
import BetterMeLogo from "../../imports/Better_me_Logo.png";
import SafetyAlertModal from "../components/SafetyAlertModal";
import ThoughtRecordModal from "../components/ThoughtRecordModal";
import { toast } from "sonner";
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
  deleteConversationSession
} from "../services/apiService";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleStartRename = (sessionId: string, currentTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (sessionId: string, e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!editingTitle.trim()) {
      toast.error("Session title cannot be empty");
      return;
    }
    try {
      setIsSavingTitle(true);
      try {
        await updateConversationTitle(sessionId, editingTitle.trim());
      } catch (apiErr: any) {
        console.warn("Backend update title notice:", apiErr);
      }
      setPastConversations((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title: editingTitle.trim() } : s))
      );
      toast.success("Session renamed successfully");
      setEditingSessionId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to rename session");
    } finally {
      setIsSavingTitle(false);
    }
  };

  const handleCancelRename = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
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
      const initTitle = `Session ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      createConversationSession(initTitle, user?.id)
        .then((res) => {
          setConversationId(res.id);
          localStorage.setItem("better_me_active_conversation_id", res.id);
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
          const initTitle = `Session ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
          createConversationSession(initTitle, user?.id)
            .then((res) => {
              setConversationId(res.id);
              localStorage.setItem("better_me_active_conversation_id", res.id);
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

  const handleSelectSession = async (session: ConversationResponse) => {
    try {
      setIsMobileListOpen(false);
      setConversationId(session.id);
      localStorage.setItem("better_me_active_conversation_id", session.id);

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
      const sessionTitle = `Session ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
      const res = await createConversationSession(sessionTitle, user?.id);
      setConversationId(res.id);
      localStorage.setItem("better_me_active_conversation_id", res.id);
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
          const session = await createConversationSession("Therapy Session", user?.id);
          activeConvId = session.id;
          setConversationId(activeConvId);
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
            const freshSession = await createConversationSession("Therapy Session", user?.id);
            activeConvId = freshSession.id;
            setConversationId(activeConvId);
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

      setMessages((prev: Message[]) => [...prev, aiMessage]);
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

  const filteredSessions = pastConversations.filter((sess) =>
    (sess.title || "Therapy Session").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[100dvh] w-full max-w-full overflow-hidden flex bg-[#f0f2f5] font-sans antialiased relative">
      {/* Mobile Drawer Backdrop */}
      {isMobileListOpen && (
        <div
          onClick={() => setIsMobileListOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 transition-opacity"
        />
      )}

      {/* Left Sidebar: Conversations List (WhatsApp Web / Instagram Style) */}
      <aside
        className={`w-[85vw] max-w-[340px] md:w-[350px] lg:w-[380px] bg-white border-r border-slate-200/90 flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out z-40 fixed md:relative shadow-2xl md:shadow-none ${
          isMobileListOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 bg-[#f0f2f5] border-b border-slate-200/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="w-9 h-9 rounded-full bg-white text-slate-700 hover:text-primary flex items-center justify-center shadow-xs border border-slate-200/60"
              title="Return to Dashboard"
            >
              <Home className="w-4 h-4" />
            </Link>
            <span className="font-bold text-slate-900 text-base">Chats</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleStartNewSession}
              className="w-9 h-9 p-0 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              title="New Conversation"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <button
              onClick={() => setIsMobileListOpen(false)}
              className="md:hidden w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f0f2f5] pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border-0"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loadingConversations ? (
            <div className="text-center py-8 text-xs text-slate-400">Loading your chats...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No Past Chats Found</p>
              <p className="text-[11px] text-slate-400">Start your first conversation with Better Me</p>
            </div>
          ) : (
            filteredSessions.map((sess) => {
              const isActive = sess.id === conversationId;
              const dateStr = new Date(sess.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={sess.id}
                  onClick={() => handleSelectSession(sess)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isActive ? "bg-[#eef2f7] border-l-4 border-primary" : "hover:bg-[#f5f6f8]"
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-white border border-slate-200/80 p-1 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden">
                    <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingSessionId === sess.id ? (
                      <div className="flex items-center gap-1 my-0.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(sess.id, e);
                            if (e.key === "Escape") handleCancelRename(e);
                          }}
                          autoFocus
                          className="w-full text-xs font-semibold px-1.5 py-0.5 rounded border border-blue-400 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={(e) => handleSaveRename(sess.id, e)}
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
                      <div className="flex items-center justify-between mb-0.5 group/sessTitle">
                        <p
                          onClick={(e) => handleStartRename(sess.id, sess.title || "Therapy Session", e)}
                          className="font-semibold text-slate-900 text-xs truncate cursor-pointer hover:text-[#2a5fb7]"
                          title="Click to rename"
                        >
                          {sess.title || "Therapy Session"}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleStartRename(sess.id, sess.title || "Therapy Session", e)}
                            className="opacity-0 group-hover/sessTitle:opacity-100 hover:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 rounded transition-opacity"
                            title="Rename chat"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">{dateStr}</span>
                        </div>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 truncate">
                      CBT dialogue & reflection
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadReport(sess.id);
                      }}
                      disabled={isDownloadingReport === sess.id}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#2a5fb7] hover:bg-blue-50 flex items-center justify-center transition-all"
                      title="Download PDF Session Report"
                    >
                      {isDownloadingReport === sess.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                      disabled={deletingSessionId === sess.id}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all"
                      title="Delete chat"
                    >
                      {deletingSessionId === sess.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Right Area: Minimal WhatsApp / Instagram Chat Screen */}
      <main className="flex-1 flex flex-col h-full bg-[#efeae2]/30 relative min-w-0">
        
        {/* WhatsApp/Instagram Top Navbar */}
        <header className="h-16 px-3 sm:px-6 bg-[#f0f2f5] border-b border-slate-200/90 flex items-center justify-between flex-shrink-0 z-10 shadow-2xs gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Back Button to Show Sidebar */}
            <button
              onClick={() => setIsMobileListOpen(!isMobileListOpen)}
              className="md:hidden text-slate-700 hover:text-slate-950 p-1.5 -ml-1 rounded-lg hover:bg-slate-200/60 flex-shrink-0 transition-colors"
              title="All chats"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* AI Avatar with Online Status */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                <img src={BetterMeLogo} alt="Better Me" className="w-full h-full object-contain" />
              </div>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
            </div>

            <div className="min-w-0">
              {editingSessionId === conversationId ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveRename(conversationId!);
                      if (e.key === "Escape") handleCancelRename();
                    }}
                    autoFocus
                    className="text-xs font-semibold px-2 py-0.5 rounded border border-blue-400 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[130px] sm:max-w-[200px]"
                  />
                  <button
                    onClick={() => handleSaveRename(conversationId!)}
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
                    onClick={() => {
                      const cur = pastConversations.find((s) => s.id === conversationId);
                      if (conversationId) handleStartRename(conversationId, cur?.title || "Therapy Session");
                    }}
                    className="font-bold text-slate-900 text-xs sm:text-sm leading-snug cursor-pointer hover:text-[#2a5fb7] transition-colors truncate max-w-[110px] sm:max-w-[280px]"
                    title="Click to rename session"
                  >
                    {pastConversations.find((s) => s.id === conversationId)?.title || "Better Me Therapist"}
                  </h2>
                  {conversationId && (
                    <button
                      onClick={() => {
                        const cur = pastConversations.find((s) => s.id === conversationId);
                        handleStartRename(conversationId, cur?.title || "Therapy Session");
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
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport()}
              disabled={isDownloadingReport === conversationId}
              className="bg-white text-[#1a4f97] hover:bg-blue-50 text-xs font-semibold h-8 sm:h-8.5 px-2 sm:px-3 rounded-xl border-blue-200 shadow-2xs flex items-center gap-1"
              title="Download Professional Psychological Session Report"
            >
              {isDownloadingReport === conversationId ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-[#2a5fb7]" />
              )}
              <span className="hidden sm:inline">Session Report</span>
              <span className="sm:hidden text-[11px]">Report</span>
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
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                title="Delete this chat"
              >
                {deletingSessionId === conversationId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            <Link to="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold h-8 sm:h-8.5 px-2 sm:px-3 rounded-xl border-slate-200 shadow-2xs flex items-center"
              >
                <Home className="w-3.5 h-3.5 text-primary sm:mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-8 py-4 sm:py-6 space-y-3">
          
          {/* Centered Date Badge */}
          <div className="flex justify-center my-3">
            <span className="bg-white/80 backdrop-blur-xs text-slate-500 text-[11px] font-medium px-3 py-1 rounded-full shadow-2xs border border-slate-200/50">
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
                      ? "bg-[#0084ff] text-white rounded-tr-xs"
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
                          className="inline-flex items-center gap-1 text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 px-2 py-0.5 rounded-full"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CBT Session Closure Summary Report Download Banner */}
                  {!isUser && (message.content.includes("Session Summary") || message.content.includes("Session Ka Khulasa") || message.content.includes("--- Session")) && (
                    <div className="mt-3 pt-3 border-t border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-3 rounded-xl border border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1a4f97] flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-[#2a5fb7] flex-shrink-0" />
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
                        className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs font-semibold rounded-xl h-8 px-3 shadow-xs flex items-center gap-1.5 flex-shrink-0"
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
                    {isUser && <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />}
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
              className="w-full bg-[#f0f2f5] border-0 rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              inputValue.trim() && !isTyping
                ? "bg-[#0084ff] text-white hover:bg-blue-600 shadow-md shadow-blue-500/20 scale-100"
                : "bg-slate-200 text-slate-400 cursor-not-allowed scale-95"
            }`}
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </footer>

        {/* Safety Alert Modal */}
        <SafetyAlertModal
          open={showSafetyAlert}
          onOpenChange={setShowSafetyAlert}
        />
      </main>
    </div>
  );
}