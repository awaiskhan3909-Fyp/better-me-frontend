import React, { useState, useEffect } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { StatCard } from "../../../components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Server,
  Database,
  Key,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Calendar,
  RefreshCw,
  HardDrive,
  Lock,
} from "lucide-react";
import { fetchAdminSystem } from "../api";
import { AdminSystemResponse } from "../types";
import { toast } from "sonner";

// Human-friendly labels for database tables
const TABLE_METADATA: Record<string, { label: string; desc: string }> = {
  users: { label: "Users Registry", desc: "User accounts, auth sync, and role assignment" },
  conversations: { label: "Therapy Sessions", desc: "Conversation threads & session headers" },
  messages: { label: "User & Assistant Messages", desc: "Sequential conversational dialogue turns" },
  message_analyses: { label: "Message ML Analyses", desc: "BERT safety, distortion & NER extraction" },
  ai_responses: { label: "AI Response Telemetry", desc: "Gemini / template response audit logs" },
  conversation_session_states: { label: "CBT Session States", desc: "8-stage progress & clinical variables" },
  cbt_exercise_submissions: { label: "Exercise Submissions", desc: "Completed behavioral & cognitive drills" },
  cbt_thought_records: { label: "Thought Records", desc: "Full 7-column cognitive restructuring" },
  stress_relief_activities: { label: "Instant Relief Runs", desc: "Box breathing & somatic grounding" },
  user_intake_assessments: { label: "Intake Assessments", desc: "Clinical baseline distress & goals" },
};

export default function AdminSystemPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [systemData, setSystemData] = useState<AdminSystemResponse | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminSystem();
      setSystemData(data);
    } catch (err: any) {
      console.error("Failed to load system status:", err);
      toast.error(err?.message || "Failed to load system status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshAction = (
    <button
      type="button"
      onClick={loadData}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
    >
      <RefreshCw className={`size-3.5 stroke-[1.75] ${loading ? "animate-spin" : ""}`} />
      <span>Refresh Status</span>
    </button>
  );

  return (
    <AdminShell
      title="System Health & Infrastructure"
      subtitle="Database connectivity, table row volume, ML model load state, and Gemini API configuration."
      actions={refreshAction}
    >
      <div className="space-y-6">
        {/* Top Metric StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              <StatCard
                title="System Health"
                value={systemData?.system_health === "healthy" ? "Healthy" : "Degraded"}
                icon={
                  systemData?.system_health === "healthy" ? (
                    <CheckCircle2 />
                  ) : (
                    <AlertTriangle />
                  )
                }
                iconBg={systemData?.system_health === "healthy" ? "mint" : "coral"}
                description="All services responding"
              />
              <StatCard
                title="Database Status"
                value={systemData?.database_connected ? "Connected" : "Disconnected"}
                icon={<Database />}
                iconBg={systemData?.database_connected ? "primary" : "coral"}
                description="SQLAlchemy 2 active pool"
              />
              <StatCard
                title="Gemini API Key"
                value={systemData?.gemini_key_configured ? "Configured" : "Missing"}
                icon={<Key />}
                iconBg={systemData?.gemini_key_configured ? "mint" : "coral"}
                description="Environment variable active"
              />
              <StatCard
                title="BERT ML Classifiers"
                value={
                  systemData?.ai_models_status.distortion_classifier_loaded &&
                  systemData?.ai_models_status.safety_classifier_loaded
                    ? "Both Loaded"
                    : "Partial"
                }
                icon={<Cpu />}
                iconBg="secondary"
                description="Distortion (6) & Safety (3)"
              />
            </>
          )}
        </div>

        {/* Database Table Row Counts Grid (10 Tables) */}
        <Card className="rounded-xl border shadow-xs bg-card">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-['Poppins'] text-foreground flex items-center gap-2">
                  <HardDrive className="size-5 text-primary stroke-[1.75]" />
                  Database Table Row Counts
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Real-time database volume across all 10 Better Me entities.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30 bg-primary/5">
                SQLAlchemy 2
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : systemData?.table_row_counts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.entries(systemData.table_row_counts).map(([tableName, count]) => {
                  const meta = TABLE_METADATA[tableName] || {
                    label: tableName.replace(/_/g, " "),
                    desc: "Data entity",
                  };
                  return (
                    <div
                      key={tableName}
                      className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-foreground truncate" title={meta.label}>
                          {meta.label}
                        </div>
                        <code className="text-[10px] text-muted-foreground">
                          {tableName}
                        </code>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-lg font-bold font-['Poppins'] text-foreground">
                          {count.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">rows</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No table counts available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI & ML Models Load Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Machine Learning Models */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold font-['Poppins'] text-foreground flex items-center gap-2">
                <Cpu className="size-5 text-lavender stroke-[1.75]" />
                Machine Learning Classifiers
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Local/HuggingFace Hub BERT models loaded in backend memory.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 rounded-lg w-full" />
                  <Skeleton className="h-16 rounded-lg w-full" />
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-lg border bg-muted/20 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                        <span>Safety BERT Classifier</span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                          3 classes
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        High, Low, Safe triage. Runs deterministically BEFORE any LLM call.
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        systemData?.ai_models_status.safety_classifier_loaded
                          ? "text-mint border-mint/30 bg-mint/10"
                          : "text-coral border-coral/30 bg-coral/10"
                      }`}
                    >
                      {systemData?.ai_models_status.safety_classifier_loaded ? "Loaded" : "Offline"}
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-muted/20 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                        <span>Cognitive Distortion BERT Classifier</span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                          6 classes
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Catastrophizing, Overgeneralization, All-or-Nothing, Mind Reading, Fortune Telling, Emotional Reasoning.
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        systemData?.ai_models_status.distortion_classifier_loaded
                          ? "text-mint border-mint/30 bg-mint/10"
                          : "text-coral border-coral/30 bg-coral/10"
                      }`}
                    >
                      {systemData?.ai_models_status.distortion_classifier_loaded ? "Loaded" : "Offline"}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Data Timeline & Privacy Compliance */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold font-['Poppins'] text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-primary stroke-[1.75]" />
                System Timeline & Privacy Protocol
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Audit trail boundaries and HIPAA/CBT data protection guarantees.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 rounded-lg w-full" />
                  <Skeleton className="h-10 rounded-lg w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border bg-muted/20">
                      <div className="text-muted-foreground text-[11px]">Earliest User Created</div>
                      <div className="font-semibold text-foreground mt-1">
                        {systemData?.data_timeline.earliest_user_created
                          ? new Date(systemData.data_timeline.earliest_user_created).toLocaleString()
                          : "No records yet"}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/20">
                      <div className="text-muted-foreground text-[11px]">Latest Message Recorded</div>
                      <div className="font-semibold text-foreground mt-1">
                        {systemData?.data_timeline.latest_message_recorded
                          ? new Date(systemData.data_timeline.latest_message_recorded).toLocaleString()
                          : "No records yet"}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-mint/10 border border-mint/20 space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <ShieldCheck className="size-4 text-mint stroke-[1.75]" />
                      <span>Zero Raw Message Policy (Enforced)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      All admin analytics endpoints operate purely on aggregate distributions or pseudonymous identifiers (<code>usr_...</code>). Raw user input, therapist messages, and clinical transcripts are never exposed to administrative reporting interfaces.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
