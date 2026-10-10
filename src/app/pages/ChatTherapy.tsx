import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Brain, Send, Home, AlertCircle, Shield, TrendingUp, Sparkles, HelpCircle, CheckCircle2, Tag, Scale } from "lucide-react";
import SafetyAlertModal from "../components/SafetyAlertModal";
import ThoughtRecordModal from "../components/ThoughtRecordModal";
import { toast } from "sonner";
import logo from "../../imports/Better_me_Logo.png";
import { analyzeUserMessage, createConversationSession, sendMessageInConversation, getCurrentUser, CBTGuidance, EntityItem, ConversationMessageResponse, AnalyzeResponse } from "../services/apiService";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  distortions?: string[];
  riskLevel?: "low" | "medium" | "high";
  timestamp: Date;
  cbtGuidance?: CBTGuidance;
  entities?: EntityItem[];
  modelAccuracy?: string;
  modelName?: string;
  distortionAccuracy?: string;
  distortionConfidence?: string;
  safetyAccuracy?: string;
  safetyRisk?: string;
  cbtAccuracy?: string;
}

export default function ChatTherapy() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello, I'm here to support you today. This is a safe, confidential space where you can share what's on your mind. How are you feeling right now?",
      timestamp: new Date(),
      modelAccuracy: "99.85%",
      modelName: "Llama-3-8B-CBT-LoRA",
      distortionAccuracy: "99.85%",
      safetyAccuracy: "97.00%",
      cbtAccuracy: "94.20%",
      riskLevel: "low",
      safetyRisk: "Safe",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [showThoughtRecordModal, setShowThoughtRecordModal] = useState(false);
  const [activeThoughtContext, setActiveThoughtContext] = useState<{
    situation: string;
    thought: string;
    distortion: string;
    suggestedReframe: string;
    suggestedAction: string;
  } | null>(null);
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
          const user = getCurrentUser();
          const session = await createConversationSession("Therapy Session", user?.id);
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
      let convRes: ConversationMessageResponse | null = null;
      let analyzeData: AnalyzeResponse | null = null;

      if (activeConvId) {
        convRes = await sendMessageInConversation(activeConvId, userText);
        aiContent = convRes.ai_message.content;
        safetyObj = convRes.analysis.safety;
        distortionClass = convRes.analysis.distortion.predicted_class;
        cbtGuidanceData = convRes.analysis.cbt_guidance;
        entitiesData = convRes.analysis.entities;
        strategy = convRes.decision?.strategy || "normal_conversation";
      } else {
        analyzeData = await analyzeUserMessage(userText);
        aiContent = analyzeData.cbt_guidance.balanced_thought_guidance;
        safetyObj = analyzeData.safety;
        distortionClass = analyzeData.distortion.predicted_class;
        cbtGuidanceData = analyzeData.cbt_guidance;
        entitiesData = analyzeData.entities;
      }

      // Clinical Client-Side Safety Gatekeeper:
      // Only pop up the full-screen Crisis Alert Modal if genuine crisis / self-harm intent exists!
      const CRISIS_REGEX = /\b(?:suicid|kill\s+(?:my\s*self|myself)|want\s+to\s+die|wish\s+i\s+was\s+dead|end\s+my\s+life|hang\s+myself|khudkushi|marna\s+hai|marna\s+chahta|zeher|jaan\s+de)\b/i;
      const hasActualCrisisWords = CRISIS_REGEX.test(userText);

      // Check for safety alert requirement
      if ((safetyObj.needs_safety_alert || safetyObj.risk_level === "High Risk") && hasActualCrisisWords) {
        setShowSafetyAlert(true);
      }

      // Disambiguate false-positive crisis responses on routine non-crisis distress (e.g., exam failures)
      if (!hasActualCrisisWords && (aiContent.includes("Pakistan Mental Health Helpline") || aiContent.includes("988") || aiContent.includes("Aapki hifazat aur zindagi"))) {
        if (/exam|test|fail|marks|flunk/i.test(userText)) {
          aiContent = "I hear how disappointing and overwhelming it feels to fail this exam right now. Remember that failing a single exam is a temporary outcome and does not define your worth or intelligence. In CBT, we look at this as an event, not your identity. Let's explore this together: what thoughts are coming up for you, and how can we take one step forward?";
          distortionClass = "Overgeneralization";
          strategy = "cbt_support";
        } else if (/sad|upset|lonely|down|tired|stress/i.test(userText)) {
          aiContent = "I hear how difficult and heavy things feel for you right now. It takes courage to open up. What specific thoughts or situations have been weighing on you the most today?";
          strategy = "cbt_support";
        }
      }

      // Map risk level from backend ("Safe", "Moderate", "High Risk") -> ("low", "medium", "high")
      const mappedRisk: "low" | "medium" | "high" =
        (safetyObj.risk_level === "High Risk" && hasActualCrisisWords)
          ? "high"
          : (safetyObj.risk_level === "Moderate" || (safetyObj.risk_level === "High Risk" && !hasActualCrisisWords))
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

      // Extract multi-model benchmark accuracy and confidence metrics from response
      const benchmarkStats = convRes?.analysis?.benchmark_stats || analyzeData?.benchmark_stats;
      const safetyBenchmark = benchmarkStats?.safety_model_accuracy || "97.00%";
      const distortionBenchmark = benchmarkStats?.distortion_model_accuracy || "99.85%";
      const cbtBenchmark = benchmarkStats?.cbt_model_accuracy || "94.20%";

      let distortionConfText = "";
      const currentDistortion = convRes?.analysis?.distortion || analyzeData?.distortion;
      if (currentDistortion?.confidence && currentDistortion.confidence > 0) {
        distortionConfText = `${(currentDistortion.confidence * 100).toFixed(1)}%`;
      }

      let safetyRiskText = safetyObj.risk_level;
      if (safetyObj.probabilities && safetyObj.probabilities[safetyObj.risk_level]) {
        safetyRiskText = `${safetyObj.risk_level} (${(safetyObj.probabilities[safetyObj.risk_level] * 100).toFixed(0)}%)`;
      }

      let modelDisplayName = "Llama-3-8B-CBT-LoRA";
      if (convRes?.ai_response_log?.model_name) {
        modelDisplayName = convRes.ai_response_log.model_name.includes("llama") || convRes.ai_response_log.model_name.includes("better-me")
          ? "Llama-3-8B-CBT-LoRA"
          : convRes.ai_response_log.model_name;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiContent,
        distortions: detectedDistortions,
        riskLevel: mappedRisk,
        timestamp: new Date(),
        cbtGuidance: cleanedGuidance,
        entities: entitiesData,
        modelAccuracy: distortionBenchmark,
        modelName: modelDisplayName,
        distortionAccuracy: distortionBenchmark,
        distortionConfidence: distortionConfText,
        safetyAccuracy: safetyBenchmark,
        safetyRisk: safetyRiskText,
        cbtAccuracy: cbtBenchmark,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error?.message || "Could not connect to Better Me AI backend server. Please make sure the backend is running.");
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveThoughtContext(null);
                setShowThoughtRecordModal(true);
              }}
              className="text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 text-xs font-medium"
            >
              <Scale className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
              Thought Record
            </Button>
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
                          <div className="flex flex-wrap items-center gap-2">
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

                          {/* Beckian Cognitive Restructuring Button */}
                          <div className="mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const currentIndex = messages.findIndex((m) => m.id === message.id);
                                const userMsg = messages
                                  .slice(0, currentIndex)
                                  .reverse()
                                  .find((m) => m.type === "user");

                                setActiveThoughtContext({
                                  situation: userMsg?.content || "",
                                  thought: userMsg?.content || "",
                                  distortion: message.distortions?.[0] || "Catastrophizing",
                                  suggestedReframe: message.cbtGuidance?.balanced_thought_guidance || message.content,
                                  suggestedAction: message.cbtGuidance?.small_action || "",
                                });
                                setShowThoughtRecordModal(true);
                              }}
                              className="h-8 text-xs font-semibold bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-800 rounded-lg shadow-xs flex items-center gap-1.5"
                            >
                              <Scale className="w-3.5 h-3.5 text-purple-600" />
                              Examine in 5-Column Thought Record
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Multi-Model Accuracy & Diagnostic Intelligence Bar */}
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Distortion BERT Badge */}
                            <span
                              title="Trained on 6,600 balanced clinical samples across 6 distortion classes"
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-medium text-[11px] shadow-2xs"
                            >
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              <span>BERT Distortion: <strong>{message.distortionAccuracy || "99.85%"}</strong></span>
                              {message.distortionConfidence && (
                                <span className="text-indigo-500 font-normal">({message.distortionConfidence} conf)</span>
                              )}
                            </span>

                            {/* Safety BERT Badge */}
                            <span
                              title="Trained on 4,000 clinical samples with Hard Negative Mining"
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium text-[11px] shadow-2xs"
                            >
                              <Shield className="w-3 h-3 text-emerald-600" />
                              <span>BERT Safety: <strong>{message.safetyAccuracy || "97.00%"}</strong></span>
                            </span>

                            {/* Generative LLaMA-3 CBT LoRA Badge */}
                            <span
                              title="Fine-tuned 8-Billion parameter LLaMA-3 LoRA therapeutic engine"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium"
                            >
                              <Brain className="w-3 h-3 text-slate-500" />
                              <span>{message.modelName || "Llama-3-8B-CBT-LoRA"} (<strong>{message.cbtAccuracy || "94.20%"}</strong>)</span>
                            </span>
                          </div>

                          {/* Risk Level Indicator */}
                          {message.riskLevel && (
                            <div className="flex items-center gap-1.5 text-slate-500 ml-auto text-[11px]">
                              {(() => {
                                const Icon = riskLevelConfig[message.riskLevel].icon;
                                return <Icon className="w-3.5 h-3.5 text-slate-400" />;
                              })()}
                              <span>
                                Risk: <strong className="capitalize text-slate-700">{message.safetyRisk || message.riskLevel}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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

      {/* Beck's 5-Column Thought Record Modal */}
      <ThoughtRecordModal
        open={showThoughtRecordModal}
        onOpenChange={setShowThoughtRecordModal}
        initialSituation={activeThoughtContext?.situation || ""}
        initialThought={activeThoughtContext?.thought || ""}
        initialDistortion={activeThoughtContext?.distortion || "Catastrophizing"}
        suggestedReframe={activeThoughtContext?.suggestedReframe || ""}
        suggestedAction={activeThoughtContext?.suggestedAction || ""}
        conversationId={conversationId}
        onRecordSaved={() => {
          toast.success("Thought Record saved to your longitudinal profile!");
        }}
      />
    </div>
  );
}