import React, { useState, useEffect } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { StatCard } from "../../../components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Layers,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fetchAdminSessionsFunnel } from "../api";
import { AdminSessionsFunnelResponse } from "../types";
import { toast } from "sonner";

// Human-friendly labels and descriptions for the 8 CBT stages (AGENTS.md Rule 5)
const STAGE_METADATA: Record<string, { label: string; description: string; stepNumber: number }> = {
  check_in: {
    label: "Check-in",
    description: "Emotional baseline assessment & rapport validation",
    stepNumber: 1,
  },
  agenda: {
    label: "Agenda Setting",
    description: "Session goals and primary concern alignment",
    stepNumber: 2,
  },
  situation_thought_capture: {
    label: "Thought Capture",
    description: "Automatic negative thought (ANT) elicitation",
    stepNumber: 3,
  },
  distortion_identification: {
    label: "Distortion Tagging",
    description: "BERT classifier tags distortion class",
    stepNumber: 4,
  },
  socratic_questioning: {
    label: "Socratic Inquiry",
    description: "Empathetic questioning examining thought evidence",
    stepNumber: 5,
  },
  reframe: {
    label: "Cognitive Reframe",
    description: "Balanced alternative perspective synthesis",
    stepNumber: 6,
  },
  action_plan_homework: {
    label: "Action Plan / Homework",
    description: "Targeted behavioral experiment or practice assignment",
    stepNumber: 7,
  },
  wrap_up: {
    label: "Wrap-up",
    description: "Takeaways summary, distress shift & PDF report ready",
    stepNumber: 8,
  },
};

export default function AdminSessionsFunnelPage() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [funnelData, setFunnelData] = useState<AdminSessionsFunnelResponse | null>(null);

  const loadData = async (selectedDays: number) => {
    try {
      setLoading(true);
      const data = await fetchAdminSessionsFunnel(selectedDays);
      setFunnelData(data);
    } catch (err: any) {
      console.error("Failed to load sessions funnel:", err);
      toast.error(err?.message || "Failed to load sessions funnel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  const dateRangeActions = (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      {[
        { label: "7 Days", val: 7 },
        { label: "30 Days", val: 30 },
        { label: "90 Days", val: 90 },
      ].map((opt) => (
        <button
          key={opt.val}
          type="button"
          onClick={() => setDays(opt.val)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            days === opt.val
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  // Chart data formatting
  const chartData = funnelData?.cbt_funnel_stages.map((stage) => {
    const meta = STAGE_METADATA[stage.stage] || {
      label: stage.stage.replace(/_/g, " "),
      stepNumber: 0,
    };
    return {
      stageKey: stage.stage,
      name: `${meta.stepNumber}. ${meta.label}`,
      sessions: stage.active_at_stage_count,
      avgTurns: Number(stage.avg_turns_at_stage.toFixed(1)),
    };
  }) || [];

  return (
    <AdminShell
      title="CBT Sessions & Stage Funnel"
      subtitle="Progression across the 8 clinical CBT stages, drop-off dynamics, and turn depth."
      actions={dateRangeActions}
    >
      <div className="space-y-6">
        {/* Top Metric StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              <StatCard
                title="Tracked Sessions"
                value={funnelData?.total_tracked_sessions ?? 0}
                icon={<Filter />}
                iconBg="primary"
                description={`Over the last ${days} days`}
              />
              <StatCard
                title="Average Turns Per Session"
                value={funnelData?.average_session_turns ? funnelData.average_session_turns.toFixed(1) : "0.0"}
                icon={<Clock />}
                iconBg="secondary"
                description="Exchanges between user and AI"
              />
              <StatCard
                title="Stage Completion Rate"
                value={`${(funnelData?.session_completion_rate_percentage ?? 0).toFixed(1)}%`}
                icon={<CheckCircle2 />}
                iconBg="mint"
                description="Sessions reaching wrap-up stage"
              />
            </>
          )}
        </div>

        {/* 8-Stage CBT Funnel Progression Cards */}
        <Card className="rounded-xl border shadow-xs bg-card">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-['Poppins'] text-foreground flex items-center gap-2">
                  <Layers className="size-5 text-primary stroke-[1.75]" />
                  8-Stage CBT Therapy Progression Pipeline
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Ordered flow from emotional check-in through cognitive restructuring to homework & wrap-up.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                Clinical Order (AGENTS.md)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg w-full" />
                ))}
              </div>
            ) : funnelData?.cbt_funnel_stages && funnelData.cbt_funnel_stages.length > 0 ? (
              <div className="space-y-2.5">
                {funnelData.cbt_funnel_stages.map((stage, idx) => {
                  const meta = STAGE_METADATA[stage.stage] || {
                    label: stage.stage.replace(/_/g, " "),
                    description: "Stage activity",
                    stepNumber: idx + 1,
                  };
                  const total = funnelData.total_tracked_sessions || 1;
                  const percentOfTotal = Math.min(100, Math.round((stage.active_at_stage_count / total) * 100));

                  // Previous stage retention comparison
                  const prevCount = idx > 0 ? funnelData.cbt_funnel_stages[idx - 1].active_at_stage_count : null;
                  const dropOff = prevCount && prevCount > 0
                    ? Math.max(0, Math.round(((prevCount - stage.active_at_stage_count) / prevCount) * 100))
                    : 0;

                  return (
                    <div
                      key={stage.stage}
                      className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      {/* Left: Step number, label, description */}
                      <div className="flex items-start gap-3 min-w-[280px]">
                        <div className="size-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {meta.stepNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {meta.label}
                            </span>
                            <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {stage.stage}
                            </code>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {meta.description}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Visual Bar Indicator */}
                      <div className="flex-1 max-w-md w-full">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground font-medium">Session Retention</span>
                          <span className="font-bold text-foreground">{percentOfTotal}% ({stage.active_at_stage_count})</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-[width] duration-300"
                            style={{ width: `${percentOfTotal}%` }}
                          />
                        </div>
                      </div>

                      {/* Right: Average Turns & Drop-off */}
                      <div className="flex items-center gap-4 shrink-0 justify-end text-xs">
                        <div className="text-right">
                          <div className="text-muted-foreground text-[11px]">Avg Turns</div>
                          <div className="font-semibold text-foreground">
                            {stage.avg_turns_at_stage.toFixed(1)} turns
                          </div>
                        </div>

                        {idx > 0 && dropOff > 0 ? (
                          <div className="flex items-center gap-1 text-coral bg-coral/10 px-2 py-1 rounded-md text-[11px] font-medium">
                            <TrendingDown className="size-3.5 stroke-[1.75]" />
                            <span>-{dropOff}%</span>
                          </div>
                        ) : idx > 0 ? (
                          <div className="text-mint bg-mint/10 px-2 py-1 rounded-md text-[11px] font-medium">
                            100% held
                          </div>
                        ) : (
                          <div className="text-primary bg-primary/10 px-2 py-1 rounded-md text-[11px] font-medium">
                            Entry
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No session funnel activity recorded in the selected period.
              </div>
            )}

            {/* CBT Clinical Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-light-blue/15 border border-primary/20 text-xs text-foreground/80 mt-4">
              <Info className="size-4 text-primary shrink-0 mt-0.5 stroke-[1.75]" />
              <p>
                <strong>Adaptive Progression Protocol:</strong> Better Me transitions between CBT stages based on the user's emotional state rather than mechanical counters (validate emotion first, then ask one Socratic question). Not every session is forced through all 8 stages if early stabilization occurs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Sessions & Average Turns Distribution Chart */}
        <Card className="rounded-xl border shadow-xs bg-card">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-bold font-['Poppins'] text-foreground">
              Stage Volume & Turn Depth Comparison
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Total active sessions reached and average conversational turn exchanges at each CBT stage.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-72 w-full rounded-lg" />
            ) : chartData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "var(--lavender)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="sessions"
                      name="Active Sessions"
                      fill="var(--primary)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="avgTurns"
                      name="Avg Turns at Stage"
                      fill="var(--lavender)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No stage data available for chart.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
