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

export interface ModelBenchmarkStats {
  safety_model_accuracy: string;
  distortion_model_accuracy: string;
  cbt_model_accuracy: string;
  safety_samples_trained?: number;
  distortion_samples_trained?: number;
  safety_model_name?: string;
  distortion_model_name?: string;
  cbt_model_name?: string;
}

export interface AnalyzeResponse {
  text: string;
  safety: SafetyPrediction;
  distortion: DistortionPrediction;
  entities: EntityItem[];
  cbt_guidance: CBTGuidance;
  benchmark_stats?: ModelBenchmarkStats;
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

// --- Auth & User Profile Interfaces ---

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  has_completed_intake: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

// --- Clinical Intake Assessment Interfaces ---

export interface IntakeAssessmentRequest {
  primary_focus: string[];
  distress_baseline: number;
  familiar_distortions: string[];
  primary_goal: string;
  safety_acknowledged: boolean;
}

export interface IntakeAssessmentResponse {
  id: string;
  user_id: string;
  primary_focus: string[];
  distress_baseline: number;
  familiar_distortions: string[];
  primary_goal: string;
  safety_acknowledged: boolean;
  created_at: string;
}

// --- Real Dashboard & Analytics Interfaces ---

export interface SessionSummaryItem {
  id: string;
  date: string;
  title: string;
  duration: number; // in minutes
  distortions_detected: string[];
  risk_level: string;
  message_count: number;
}

export interface EmotionalTrendItem {
  date: string;
  distortion_counts: Record<string, number>;
  total_messages: number;
  risk_level: string;
}

export interface DashboardStatsResponse {
  user_name: string;
  total_sessions: number;
  avg_duration_minutes: number;
  total_messages: number;
  current_risk_level: string;
  primary_focus: string[];
  primary_goal?: string | null;
  distortions_breakdown: Record<string, number>;
  recent_sessions: SessionSummaryItem[];
  emotional_trends: EmotionalTrendItem[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://memorabilia-confirmed-certainly-ticket.trycloudflare.com/api";

// --- Session Persistence Helpers ---

const USER_STORAGE_KEY = "better_me_active_user";

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to persist user session", err);
  }
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to remove user session", err);
  }
}

// --- API Service Methods ---

export async function registerUser(email: string, password: string, fullName?: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name: fullName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(errorData.detail || `Registration failed with status ${response.status}`);
  }

  const result: AuthResponse = await response.json();
  setCurrentUser(result.user);
  return result;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Invalid email or password" }));
    throw new Error(errorData.detail || `Login failed with status ${response.status}`);
  }

  const result: AuthResponse = await response.json();
  setCurrentUser(result.user);
  return result;
}

export async function submitIntakeAssessment(
  userId: string,
  payload: IntakeAssessmentRequest
): Promise<IntakeAssessmentResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to submit assessment" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  // Update cached user flag
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.has_completed_intake = true;
    setCurrentUser(currentUser);
  }

  return response.json();
}

export async function getDashboardStats(userId?: string): Promise<DashboardStatsResponse> {
  const queryParam = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const response = await fetch(`${API_BASE_URL}/dashboard/stats${queryParam}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to load dashboard stats" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function createConversationSession(title: string = "New Session", userId?: string): Promise<{ id: string }> {
  const bodyPayload: Record<string, any> = { title };
  if (userId) {
    bodyPayload.user_id = userId;
  }

  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyPayload),
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

// --- Phase 1: Longitudinal Clinical Memory Engine Client Interfaces & Methods ---

export interface PatientClinicalProfile {
  id: string;
  user_id: string;
  primary_triggers: string[];
  dominant_distortions: Record<string, number>;
  core_beliefs: string[];
  effective_reframes: string[];
  active_homework?: string | null;
  last_session_summary?: string | null;
  total_sessions_completed: number;
  created_at: string;
  updated_at: string;
}

export interface EpisodicTherapyMemory {
  id: string;
  user_id: string;
  conversation_id?: string | null;
  situation_context: string;
  distorted_thought: string;
  distortion_type: string;
  rational_reframe: string;
  breakthrough_notes?: string | null;
  created_at: string;
}

export async function getPatientClinicalProfile(userId: string): Promise<PatientClinicalProfile> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/clinical-profile`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch clinical profile" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function getPatientEpisodicMemories(userId: string): Promise<EpisodicTherapyMemory[]> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/memories`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch episodic memories" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

// --- Phase 2: Beck's 5-Column Thought Record Interfaces & Methods ---

export interface CreateThoughtRecordRequest {
  user_id: string;
  conversation_id?: string | null;
  situation: string;
  automatic_thought: string;
  initial_belief_rating: number;
  emotions: Record<string, number>;
  distortion_type: string;
  evidence_for: string;
  evidence_against: string;
  balanced_thought: string;
  outcome_belief_rating: number;
  outcome_emotions: Record<string, number>;
  behavioral_action?: string | null;
}

export interface CBTThoughtRecord {
  id: string;
  user_id: string;
  conversation_id?: string | null;
  situation: string;
  automatic_thought: string;
  initial_belief_rating: number;
  emotions: Record<string, number>;
  distortion_type: string;
  evidence_for: string;
  evidence_against: string;
  balanced_thought: string;
  outcome_belief_rating: number;
  outcome_emotions: Record<string, number>;
  behavioral_action?: string | null;
  created_at: string;
  updated_at: string;
}

export async function createThoughtRecord(payload: CreateThoughtRecordRequest): Promise<CBTThoughtRecord> {
  const response = await fetch(`${API_BASE_URL}/thought-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to save thought record" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function getThoughtRecords(userId: string): Promise<CBTThoughtRecord[]> {
  const response = await fetch(`${API_BASE_URL}/thought-records?user_id=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch thought records" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function deleteThoughtRecord(recordId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/thought-records/${recordId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to delete thought record" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
}
