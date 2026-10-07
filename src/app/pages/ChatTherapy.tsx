import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Brain, Send, Home, AlertCircle, Shield, TrendingUp, Sparkles, HelpCircle, CheckCircle2, Tag } from "lucide-react";
import SafetyAlertModal from "../components/SafetyAlertModal";
import { toast } from "sonner";
import logo from "../../imports/Better_me_Logo.png";
import { analyzeUserMessage, createConversationSession, sendMessageInConversation, CBTGuidance, EntityItem } from "../services/apiService";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  distortions?: string[];
  riskLevel?: "low" | "medium" | "high";
  timestamp: Date;
  cbtGuidance?: CBTGuidance;
  entities?: EntityItem[];
}

export default function ChatTherapy() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello, I'm here to support you today. This is a safe, confidential space where you can share what's on your mind. How are you feeling right now?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize a conversation session on component mount
    createConversationSession("Chat Therapy Session")
      .then((res) => setConversationId(res.id))
      .catch((err) => console.warn("Could not initialize conversation session, fallback ready:", err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      let activeConvId = conversationId;
      if (!activeConvId) {
        try {
          const session = await createConversationSession();
          activeConvId = session.id;
          setConversationId(activeConvId);
        } catch (e) {
          console.warn("Failed to create session, falling back:", e);
        }
      }

      let aiContent = "";
      let safetyObj = { needs_safety_alert: false, risk_level: "Safe" as const };
      let distortionClass = "None";
      let cbtGuidanceData: CBTGuidance | undefined = undefined;
      let entitiesData: EntityItem[] = [];
      let strategy = "normal_conversation";

      if (activeConvId) {
        const convRes = await sendMessageInConversation(activeConvId, userText);
        aiContent = convRes.ai_message.content;
        safetyObj = convRes.analysis.safety;
        distortionClass = convRes.analysis.distortion.predicted_class;
        cbtGuidanceData = convRes.analysis.cbt_guidance;
        entitiesData = convRes.analysis.entities;
        strategy = convRes.decision?.strategy || "normal_conversation";
      } else {
        const data = await analyzeUserMessage(userText);
        aiContent = data.cbt_guidance.balanced_thought_guidance;
        safetyObj = data.safety;
        distortionClass = data.distortion.predicted_class;
        cbtGuidanceData = data.cbt_guidance;
        entitiesData = data.entities;
      }

      // Check for safety alert requirement
      if (safetyObj.needs_safety_alert || safetyObj.risk_level === "High Risk") {
        setShowSafetyAlert(true);
      }

      // Map risk level from backend ("Safe", "Moderate", "High Risk") -> ("low", "medium", "high")
      const mappedRisk: "low" | "medium" | "high" =
        safetyObj.risk_level === "High Risk"
          ? "high"
          : safetyObj.risk_level === "Moderate"
          ? "medium"
          : "low";

      // Distortions list (only display if strategy is cbt_support and a real distortion was found)
      const detectedDistortions =
        strategy === "cbt_support" && distortionClass && distortionClass !== "None"
          ? [distortionClass]
          : [];

      // Only pass cbtGuidance cards to UI if strategy is cbt_support
      const cleanedGuidance =
        strategy === "cbt_support"
          ? cbtGuidanceData
          : undefined;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiContent,
        distortions: detectedDistortions,
        riskLevel: mappedRisk,
        timestamp: new Date(),
        cbtGuidance: cleanedGuidance,
        entities: entitiesData,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error("Could not connect to Better Me AI backend server. Please make sure the backend is running.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const distortionColors: Record<string, string> = {
    Catastrophizing: "bg-red-50 text-red-700 border-red-300",
    "Mind Reading": "bg-amber-50 text-amber-700 border-amber-300",
    Overgeneralization: "bg-blue-50 text-blue-700 border-blue-300",
    "All-or-Nothing Thinking": "bg-purple-50 text-purple-700 border-purple-300",
    "Emotional Reasoning": "bg-pink-50 text-pink-700 border-pink-300",
    "Fortune Telling": "bg-indigo-50 text-indigo-700 border-indigo-300",
  };

  const riskLevelConfig = {
    low: { color: "bg-green-100 text-green-700 border-green-300", icon: Shield, label: "Low Risk" },
    medium: { color: "bg-amber-100 text-amber-700 border-amber-300", icon: AlertCircle, label: "Medium Risk" },
    high: { color: "bg-red-100 text-red-700 border-red-300", icon: AlertCircle, label: "High Risk" },
  };

  const currentSessionRisk = messages
    .filter((m) => m.type === "ai" && m.riskLevel)
    .slice(-1)[0]?.riskLevel || "low";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b flex-shrink-0 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <img src={logo} alt="Better Me" className="h-8" />
            </div>
            <Badge className={riskLevelConfig[currentSessionRisk].color}>
              {(() => {
                const Icon = riskLevelConfig[currentSessionRisk].icon;
                return <Icon className="w-3 h-3 mr-1" />;
              })()}
              {riskLevelConfig[currentSessionRisk].label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/progress">
              <Button variant="ghost" size="sm" className="text-slate-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-700">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "user" ? (
                  <div className="max-w-[80%]">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[85%]">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-5 shadow-sm space-y-4">
                      {/* AI Main Response / Balanced Thought */}
                      <p className="text-slate-800 whitespace-pre-wrap text-base leading-relaxed">
                        {message.content}
                      </p>

                      {/* Reframing Question */}
                      {message.cbtGuidance?.reframing_question && (
                        <div className="bg-indigo-50/70 border-l-4 border-indigo-500 rounded-r-xl p-4 my-3">
                          <div className="flex items-center gap-2 mb-1 text-indigo-900 font-medium text-xs uppercase tracking-wider">
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Reframing Reflection</span>
                          </div>
                          <p className="text-slate-800 italic text-sm">
                            "{message.cbtGuidance.reframing_question}"
                          </p>
                        </div>
                      )}

                      {/* Suggested Small Action */}
                      {message.cbtGuidance?.small_action && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 my-2">
                          <div className="flex items-center gap-2 mb-1 text-emerald-800 font-medium text-xs uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Behavioral Action</span>
                          </div>
                          <p className="text-slate-700 text-sm">
                            {message.cbtGuidance.small_action}
                          </p>
                        </div>
                      )}

                      {/* Context Entities Section */}
                      {message.entities && message.entities.length > 0 && (
                        <div className="pt-2 flex items-center gap-2 flex-wrap">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500 font-medium">Context Tags:</span>
                          {message.entities.map((entity, i) => (
                            <Badge key={i} variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-[11px]">
                              {entity.label}: {entity.text}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Distortion Detection Section */}
                      {message.distortions && message.distortions.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <p className="text-sm font-medium text-slate-700">
                              Detected Cognitive Pattern:
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.distortions.map((distortion) => (
                              <Badge
                                key={distortion}
                                variant="outline"
                                className={`${distortionColors[distortion] || "bg-slate-100 text-slate-700"} text-xs px-2.5 py-0.5 font-medium`}
                              >
                                {distortion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Risk Level Indicator */}
                      {message.riskLevel && (
                        <div className="mt-3 flex items-center gap-2 pt-1 border-t border-slate-100">
                          {(() => {
                            const Icon = riskLevelConfig[message.riskLevel].icon;
                            return <Icon className="w-3.5 h-3.5 text-slate-500" />;
                          })()}
                          <span className="text-xs text-slate-600">
                            Emotional Risk Level: <strong className="capitalize">{message.riskLevel}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-slate-500 ml-2 font-medium">Analyzing with AI models...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t flex-shrink-0">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-3 focus-within:border-primary/50 focus-within:bg-white transition-all">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Share what's on your mind... (Press Enter to send, Shift+Enter for new line)"
                className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-primary hover:bg-primary/90 h-[60px] px-6 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            This is a supportive AI tool, not a replacement for professional mental health care. In crisis, call 988.
          </p>
        </div>
      </div>

      {/* Safety Alert Modal */}
      <SafetyAlertModal open={showSafetyAlert} onOpenChange={setShowSafetyAlert} />
    </div>
  );
}