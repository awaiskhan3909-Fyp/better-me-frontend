export interface EntityItem {
  text: string;
  label: string;
  start?: number;
  end?: number;
  confidence?: number;
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
  ner_model_accuracy?: string;
  cbt_model_accuracy: string;
  safety_samples_trained?: number;
  distortion_samples_trained?: number;
  safety_model_name?: string;
  distortion_model_name?: string;
  ner_model_name?: string;
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

export interface ConversationResponse {
  id: string;
  user_id: string;
  title: string;
  current_risk_level: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageDetailResponse {
  id: string;
  conversation_id: string;
  sender_type: string;
  content: string;
  sequence_number: number;
  created_at: string;
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

export interface TherapyOverviewData {
  recent_distortions: string[];
  latest_session_date: string | null;
  latest_reflection: string | null;
  recommended_next_step: string;
}

export interface DashboardStatsResponse {
  user_name: string;
  total_sessions: number;
  avg_duration_minutes: number;
  total_messages: number;
  thoughts_analyzed?: number;
  categories_practiced?: number;
  current_risk_level: string;
  primary_focus: string[];
  primary_goal?: string | null;
  distortions_breakdown: Record<string, number>;
  recent_sessions: SessionSummaryItem[];
  emotional_trends: EmotionalTrendItem[];
  therapy_overview?: TherapyOverviewData;
}
export const STORAGE_KEY_API_URL = "BETTER_ME_API_URL";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(STORAGE_KEY_API_URL)?.trim();
      if (custom && custom.length > 0) {
        return custom.endsWith("/api") ? custom : `${custom.replace(/\/+$/, "")}/api`;
      }
    } catch {
      // ignore
    }
  }
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (envUrl && envUrl.length > 0) {
    return envUrl.endsWith("/api") ? envUrl : `${envUrl.replace(/\/+$/, "")}/api`;
  }
  return "http://127.0.0.1:8000/api";
}

export function setCustomApiUrl(rawUrl: string): string {
  let clean = rawUrl.trim().replace(/\/+$/, "");
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = `https://${clean}`;
  }
  const apiUrl = clean.endsWith("/api") ? clean : `${clean}/api`;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_API_URL, apiUrl);
  }
  return apiUrl;
}

export function clearCustomApiUrl(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_API_URL);
  }
}

export async function checkBackendHealth(targetUrl?: string): Promise<{
  ok: boolean;
  service?: string;
  cuda?: boolean;
  gpu?: string;
  statusText?: string;
  error?: string;
}> {
  let base = (targetUrl && targetUrl.trim().length > 0) ? targetUrl.trim().replace(/\/+$/, "") : getApiBaseUrl();
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    base = `https://${base}`;
  }
  const apiUrl = base.endsWith("/api") ? base : `${base}/api`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(`${apiUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { ok: false, error: `Backend responded with status ${res.status}` };
    }
    const data = await res.json();

    // Check LLM / GPU status
    let gpuName: string | undefined;
    let cudaAvailable: boolean | undefined;
    try {
      const llmCtrl = new AbortController();
      const llmTimeout = setTimeout(() => llmCtrl.abort(), 4000);
      const llmRes = await fetch(`${apiUrl}/llm-status`, { signal: llmCtrl.signal });
      clearTimeout(llmTimeout);
      if (llmRes.ok) {
        const llmData = await llmRes.json();
        gpuName = llmData.gpu_name || undefined;
        cudaAvailable = llmData.cuda_available;
      }
    } catch {
      // non-blocking
    }

    return {
      ok: true,
      service: data.service || "Better Me AI Backend",
      cuda: cudaAvailable,
      gpu: gpuName,
      statusText: gpuName ? `Connected (${gpuName})` : "Connected to Backend",
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.name === "AbortError" ? "Connection timed out (7s). Please check your backend connection." : (err?.message || "Failed to reach backend"),
    };
  }
}

export const ACTIVE_BACKEND_URL = getApiBaseUrl();

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
  const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
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
  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
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

export async function syncUserPassword(
  email: string,
  password: string,
  userId?: string,
  fullName?: string
): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/sync-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      user_id: userId || null,
      full_name: fullName || null,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to synchronize password" }));
    throw new Error(errorData.detail || `Sync failed with status ${response.status}`);
  }

  const result: AuthResponse = await response.json();
  setCurrentUser(result.user);
  return result;
}

export async function submitIntakeAssessment(
  userId: string,
  payload: IntakeAssessmentRequest
): Promise<IntakeAssessmentResponse> {
  const response = await fetch(`${getApiBaseUrl()}/users/${userId}/intake`, {
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
  const response = await fetch(`${getApiBaseUrl()}/dashboard/stats${queryParam}`);

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

  const response = await fetch(`${getApiBaseUrl()}/conversations`, {
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

export async function getUserConversations(userId?: string): Promise<ConversationResponse[]> {
  const queryParam = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const response = await fetch(`${getApiBaseUrl()}/conversations${queryParam}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch conversations" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<ConversationResponse> {
  const response = await fetch(`${getApiBaseUrl()}/conversations/${encodeURIComponent(conversationId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to update conversation title" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function deleteConversationSession(conversationId: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/conversations/${encodeURIComponent(conversationId)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to delete conversation" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
}

export async function getConversationMessages(conversationId: string): Promise<MessageDetailResponse[]> {
  const response = await fetch(`${getApiBaseUrl()}/conversations/${conversationId}/messages`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch messages" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function sendMessageInConversation(
  conversationId: string,
  text: string
): Promise<ConversationMessageResponse> {
  const response = await fetch(`${getApiBaseUrl()}/conversations/${conversationId}/messages`, {
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
  const response = await fetch(`${getApiBaseUrl()}/analyze`, {
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
  const response = await fetch(`${getApiBaseUrl()}/users/${userId}/clinical-profile`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch clinical profile" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function getPatientEpisodicMemories(userId: string): Promise<EpisodicTherapyMemory[]> {
  const response = await fetch(`${getApiBaseUrl()}/users/${userId}/memories`);
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
  const response = await fetch(`${getApiBaseUrl()}/thought-records`, {
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
  const response = await fetch(`${getApiBaseUrl()}/thought-records?user_id=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch thought records" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function deleteThoughtRecord(recordId: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/thought-records/${recordId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to delete thought record" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
}

export interface SessionReportSummary {
  conversation_id: string;
  report_id: string;
  session_number: string;
  session_date: string;
  session_time: string;
  generated_timestamp: string;
  duration_str: string;
  patient_name: string;
  patient_id: string;
  patient_email: string;
  clinical_risk_level: string;
  presenting_trigger: string;
  automatic_thought: string;
  identified_distortion: string;
  distortion_evidence: string;
  balanced_thought: string;
  homework: string;
  next_session_goal: string;
  emotions: string[];
  somatic_symptoms: string[];
  self_reported_distress?: string | null;
  total_messages: number;
  user_messages_count: number;
  ai_messages_count: number;
}

export async function downloadSessionReport(conversationId: string, customFilename?: string): Promise<void> {
  const user = getCurrentUser();
  const userParam = user?.id ? `?user_id=${encodeURIComponent(user.id)}` : "";
  const response = await fetch(`${getApiBaseUrl()}/conversations/${encodeURIComponent(conversationId)}/report${userParam}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to download PDF report" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }

  let filename = customFilename;
  if (!filename) {
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename=["']?([^"']+)["']?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }
  }
  if (!filename) {
    filename = `BetterMe_Session_Report_${conversationId.slice(0, 8)}.pdf`;
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

export async function getSessionReportSummary(conversationId: string): Promise<SessionReportSummary> {
  const user = getCurrentUser();
  const userParam = user?.id ? `?user_id=${encodeURIComponent(user.id)}` : "";
  const response = await fetch(`${getApiBaseUrl()}/conversations/${encodeURIComponent(conversationId)}/report/summary${userParam}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch report summary" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

// --- Phase 3: Cognitive Distortion Practice Center API Client ---

export interface CBTExerciseSubmitPayload {
  user_id: string;
  distortion_category: string;
  exercise_id: string;
  exercise_title: string;
  scenario: string;
  answers: Record<string, string>;
  is_completed?: boolean;
}

export interface CBTExerciseRecord {
  id: string;
  user_id: string;
  distortion_category: string;
  exercise_id: string;
  exercise_title: string;
  scenario: string;
  answers: Record<string, string>;
  is_completed: boolean;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface CBTExerciseCategoryStat {
  completed: number;
  total: number;
  percentage: number;
}

export interface CBTExerciseProgressSummary {
  total_completed: number;
  total_available: number;
  completion_percentage: number;
  categories_progress: Record<string, { completed: number; total: number; percentage: number }>;
  completed_exercise_ids: string[];
  recent_activity: CBTExerciseRecord[];
}

export async function submitCBTExercise(payload: CBTExerciseSubmitPayload): Promise<CBTExerciseRecord> {
  const response = await fetch(`${getApiBaseUrl()}/cbt-exercises/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to save practice exercise" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function getUserCBTExercises(userId: string, distortionCategory?: string): Promise<CBTExerciseRecord[]> {
  const catParam = distortionCategory ? `&distortion_category=${encodeURIComponent(distortionCategory)}` : "";
  const response = await fetch(`${getApiBaseUrl()}/cbt-exercises?user_id=${encodeURIComponent(userId)}${catParam}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch practice exercises" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function getUserCBTExerciseProgress(userId: string): Promise<CBTExerciseProgressSummary> {
  const response = await fetch(`${getApiBaseUrl()}/cbt-exercises/progress?user_id=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch exercise progress" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function getUserCBTExerciseDetail(userId: string, exerciseId: string): Promise<CBTExerciseRecord> {
  const response = await fetch(`${getApiBaseUrl()}/cbt-exercises/${encodeURIComponent(exerciseId)}?user_id=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch exercise detail" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

// --- Instant Stress Relief Interfaces & Endpoints ---

export interface StressReliefRecord {
  id: string;
  user_id: string;
  activity_name: string;
  activity_type: string;
  duration_seconds: number;
  is_completed: boolean;
  notes?: string | null;
  completed_at: string;
  created_at: string;
}

export interface CreateStressReliefRequest {
  user_id: string;
  activity_name: string;
  activity_type: string;
  duration_seconds: number;
  notes?: string | null;
}

export async function recordStressReliefActivity(
  payload: CreateStressReliefRequest
): Promise<StressReliefRecord> {
  const response = await fetch(`${getApiBaseUrl()}/stress-relief/record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to record stress relief activity" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function getStressReliefHistory(
  userId: string,
  limit: number = 10
): Promise<StressReliefRecord[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/stress-relief/history?user_id=${encodeURIComponent(userId)}&limit=${limit}`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

