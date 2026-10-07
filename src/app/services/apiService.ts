export interface EntityItem {
  text: string;
  label: string;
  start?: number;
  end?: number;
}

export interface DistortionPrediction {
  predicted_class: string;
  confidence: number;
  all_probabilities: Record<string, number>;
}

export interface SafetyPrediction {
  risk_level: "Safe" | "Moderate" | "High Risk";
  needs_safety_alert: boolean;
  probabilities: Record<string, number>;
}

export interface CBTGuidance {
  detected_distortion: string;
  template_id?: number;
  title?: string;
  explanation?: string;
  reframing_question?: string;
  balanced_thought_guidance: string;
  small_action?: string;
}

export interface AnalyzeResponse {
  text: string;
  safety: SafetyPrediction;
  distortion: DistortionPrediction;
  entities: EntityItem[];
  cbt_guidance: CBTGuidance;
}

export interface ResponseDecisionDetail {
  strategy: string;
  priority: string;
  reason: string;
  distortion_detected?: string;
  safety_risk_level: string;
  decision_version: string;
}

export interface ConversationMessageResponse {
  conversation_id: string;
  user_message: {
    id: string;
    conversation_id: string;
    sender_type: string;
    content: string;
    sequence_number: number;
    created_at: string;
  };
  ai_message: {
    id: string;
    conversation_id: string;
    sender_type: string;
    content: string;
    sequence_number: number;
    created_at: string;
  };
  analysis: AnalyzeResponse;
  decision: ResponseDecisionDetail;
  ai_response_log: any;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function createConversationSession(title: string = "New Session"): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create conversation session (${response.status})`);
  }

  return response.json();
}

export async function sendMessageInConversation(
  conversationId: string,
  text: string
): Promise<ConversationMessageResponse> {
  const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "API Error" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function analyzeUserMessage(text: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "API Error" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  return response.json();
}
