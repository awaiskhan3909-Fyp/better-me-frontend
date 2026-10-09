import { supabase } from "./supabaseClient";
import { IntakeAssessmentRequest } from "./apiService";

export interface SupabaseIntakeRecord {
  id?: string;
  user_id: string;
  user_email?: string | null;
  primary_focus: string[];
  distress_baseline: number;
  familiar_distortions: string[];
  primary_goal: string;
  safety_acknowledged: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Saves or updates patient's initial therapy intake assessment in Supabase
 */
export async function saveUserIntakeToSupabase(
  userId: string,
  userEmail: string | undefined | null,
  intakeData: IntakeAssessmentRequest
): Promise<SupabaseIntakeRecord | null> {
  try {
    const payload = {
      user_id: userId,
      user_email: userEmail || null,
      primary_focus: intakeData.primary_focus,
      distress_baseline: intakeData.distress_baseline,
      familiar_distortions: intakeData.familiar_distortions,
      primary_goal: intakeData.primary_goal,
      safety_acknowledged: intakeData.safety_acknowledged,
      updated_at: new Date().toISOString(),
    };

    // 1. Try Upsert based on unique user_id
    const { data, error } = await supabase
      .from("user_intake_assessments")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Supabase upsert warning, attempting insert fallback:", error.message);
      // 2. Fallback: direct insert if table doesn't have unique constraint configured yet
      const { data: insertData, error: insertError } = await supabase
        .from("user_intake_assessments")
        .insert([payload])
        .select()
        .maybeSingle();

      if (insertError) {
        console.error("Failed to insert intake assessment to Supabase:", insertError);
        return null;
      }
      return insertData as SupabaseIntakeRecord;
    }

    return data as SupabaseIntakeRecord;
  } catch (err) {
    console.error("Unexpected error saving intake to Supabase:", err);
    return null;
  }
}

/**
 * Retrieves the saved initial therapy assessment for a specific user from Supabase
 */
export async function getUserIntakeFromSupabase(
  userId: string,
  userEmail?: string | null
): Promise<SupabaseIntakeRecord | null> {
  try {
    // Query by user_id
    if (userId) {
      const { data, error } = await supabase
        .from("user_intake_assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data as SupabaseIntakeRecord;
      }
    }

    // Query by user_email as fallback
    if (userEmail) {
      const { data, error } = await supabase
        .from("user_intake_assessments")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data as SupabaseIntakeRecord;
      }
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch user intake from Supabase:", err);
    return null;
  }
}

/**
 * Helper to fetch current logged-in Supabase Auth session user
 */
export async function getCurrentSupabaseUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    return null;
  }
}
