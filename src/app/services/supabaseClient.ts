import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://csceryxjmluvegbdekxe.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_AYe6TZ6-WP5UZObfdIcl5g_vGMF8Thj";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
