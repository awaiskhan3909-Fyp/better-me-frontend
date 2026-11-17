export interface AdminOverviewResponse {
  period_days: number;
  cutoff_date: string;
  total_registered_users: number;
  new_users_in_period: number;
  active_users_in_period: number;
  total_sessions: number;
  total_messages: number;
  message_breakdown: {
    user_messages: number;
    ai_messages: number;
  };
  total_practices_completed: number;
  practice_breakdown: {
    exercises_completed: number;
    thought_records_logged: number;
    stress_relief_completed: number;
  };
  safety_alerts_triggered: number;
  activity_trend: Array<{
    date: string;
    messages: number;
  }>;
}

export interface AdminUserItem {
  pseudonym_id: string;
  created_at: string;
  role: string;
  is_active: boolean;
  has_completed_intake: boolean;
  distress_baseline: number | null;
  total_sessions: number;
  total_user_messages: number;
  practices_completed: number;
  current_risk_level: string;
  last_active: string | null;
}

export interface SafetyFlaggedItem {
  event_id: string;
  pseudonym_id: string;
  session_id: string;
  session_title: string;
  safety_risk_level: string;
  needs_safety_alert: boolean;
  status: string;
  created_at: string;
}

export interface AdminSafetyResponse {
  period_days: number;
  risk_level_distribution: Record<string, number>;
  safety_alerts_triggered: number;
  crisis_interventions_count: number;
  elevated_risk_conversations: number;
  daily_trend: Array<{
    date: string;
    Safe?: number;
    Low?: number;
    Medium?: number;
    High?: number;
    [key: string]: any;
  }>;
  flagged_queue: SafetyFlaggedItem[];
}

export interface AdminDistortionsResponse {
  period_days: number;
  detected_distortions_frequency: Record<string, number>;
  average_confidence: number;
  confidence_distribution: {
    low_under_0_6: number;
    medium_0_6_to_0_8: number;
    high_above_0_8: number;
  };
  socratic_gating: {
    total_evaluated_sessions: number;
    evidence_gated_sessions: number;
    gating_rate_percentage: number;
  };
  practices_by_distortion: Record<string, number>;
  thought_records_by_distortion: Record<string, number>;
  daily_trends?: Array<{
    date: string;
    [distortion: string]: any;
  }>;
  context_heatmap?: Array<{
    context: string;
    distortions: Record<string, number>;
    total: number;
  }>;
}

export interface FunnelStageItem {
  stage: string;
  active_at_stage_count: number;
  avg_turns_at_stage: number;
}

export interface AdminSessionsFunnelResponse {
  period_days: number;
  total_tracked_sessions: number;
  average_session_turns: number;
  session_completion_rate_percentage: number;
  cbt_funnel_stages: FunnelStageItem[];
}

export interface AdminAIOpsResponse {
  period_days: number;
  total_ai_responses: number;
  response_sources_breakdown: Record<string, number>;
  response_types_breakdown: Record<string, number>;
  active_models_breakdown: Record<string, number>;
  source_shares_percentage?: {
    gemini_conversational: number;
    fallback_template: number;
    safety_override: number;
  };
  offline_template_fallback_rate_percentage: number;
  avg_latency_ms?: number;
  validation_failures?: number;
}

export interface AdminEngagementResponse {
  period_days: number;
  intake: {
    total_completed: number;
    average_distress_baseline: number;
    distress_distribution: {
      mild_0_to_3: number;
      moderate_4_to_6: number;
      severe_7_plus: number;
    };
    primary_goals: Record<string, number>;
  };
  thought_records_efficacy: {
    average_initial_belief_rating: number;
    average_outcome_belief_rating: number;
    average_belief_reduction: number;
  };
  stress_relief_adoption: Record<string, { count: number; total_seconds: number }>;
  retention: {
    single_session_users: number;
    multi_session_users: number;
    repeat_rate_percentage: number;
  };
}

export interface AdminSystemResponse {
  system_health: "healthy" | "degraded";
  database_connected: boolean;
  table_row_counts: Record<string, number>;
  ai_models_status: {
    distortion_classifier_loaded: boolean;
    safety_classifier_loaded: boolean;
  };
  gemini_key_configured: boolean;
  data_timeline: {
    earliest_user_created: string | null;
    latest_message_recorded: string | null;
  };
}
