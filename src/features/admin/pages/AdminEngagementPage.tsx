import React, { useState, useEffect } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { StatCard } from "../../../components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Activity,
  ClipboardCheck,
  TrendingDown,
  Repeat,
  Wind,
  Target,
  Smile,
  HeartHandshake,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { fetchAdminEngagement } from "../api";
import { AdminEngagementResponse } from "../types";
import { toast } from "sonner";

export default function AdminEngagementPage() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [engagementData, setEngagementData] = useState<AdminEngagementResponse | null>(null);

  const loadData = async (selectedDays: number) => {
    try {
      setLoading(true);
      const data = await fetchAdminEngagement(selectedDays);
      setEngagementData(data);
    } catch (err: any) {
      console.error("Failed to load engagement analytics:", err);
      toast.error(err?.message || "Failed to load engagement analytics.");
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

  // Distress distribution chart data
  const distressData = engagementData
    ? [
        {
          name: "Mild (0-3)",
          count: engagementData.intake.distress_distribution.mild_0_to_3,
          color: "var(--mint)",
        },
        {
          name: "Moderate (4-6)",
          count: engagementData.intake.distress_distribution.moderate_4_to_6,
          color: "var(--primary)",
        },
        {
          name: "Severe (7+)",
          count: engagementData.intake.distress_distribution.severe_7_plus,
          color: "var(--coral)",
        },
      ]
    : [];

  // Primary goals chart data
  const goalsData = engagementData
    ? Object.entries(engagementData.intake.primary_goals).map(([goal, count]) => ({
        name: goal.replace(/_/g, " "),
        count,
      }))
    : [];

  return (
    <AdminShell
      title="User Engagement & Clinical Efficacy"
      subtitle="Intake distress baselines, cognitive restructuring belief shifts, and stress relief practice adoption."
      actions={dateRangeActions}
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
                title="Intakes Completed"
                value={engagementData?.intake.total_completed ?? 0}
                icon={<ClipboardCheck />}
                iconBg="primary"
                description={`Over the last ${days} days`}
              />
              <StatCard
                title="Baseline Distress"
                value={`${(engagementData?.intake.average_distress_baseline ?? 0).toFixed(1)} / 10`}
                icon={<Activity />}
                iconBg="secondary"
                description="Onboarding assessment scale"
              />
              <StatCard
                title="Avg Belief Reduction"
                value={`-${(engagementData?.thought_records_efficacy.average_belief_reduction ?? 0).toFixed(1)} pts`}
                icon={<TrendingDown />}
                iconBg="mint"
                description="Distortion conviction decrease"
              />
              <StatCard
                title="Repeat Session Rate"
                value={`${(engagementData?.retention.repeat_rate_percentage ?? 0).toFixed(1)}%`}
                icon={<Repeat />}
                iconBg="primary"
                description={`${engagementData?.retention.multi_session_users ?? 0} multi-session users`}
              />
            </>
          )}
        </div>

        {/* Distress Baseline & Clinical Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Intake Distress Distribution */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold font-['Poppins'] text-foreground">
                Baseline Distress Severity Distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Self-reported distress score (0-10) during onboarding assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-60 w-full rounded-lg" />
              ) : distressData.length > 0 ? (
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distressData}
                      margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]}>
                        {distressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No distress baseline records found.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Primary Therapy Goals */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold font-['Poppins'] text-foreground">
                Primary Therapy Goals
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Focus areas identified by users upon beginning their CBT journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-60 w-full rounded-lg" />
              ) : goalsData.length > 0 ? (
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={goalsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
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
                        dataKey="count"
                        name="Users Seeking Focus"
                        fill="var(--primary-lighter)"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No therapy goals recorded.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cognitive Restructuring Efficacy & Stress Relief Adoption */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thought Records Belief Restructuring Shift */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold font-['Poppins'] text-foreground flex items-center gap-2">
                    <Target className="size-5 text-primary stroke-[1.75]" />
                    Cognitive Restructuring Efficacy
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Pre vs Post belief conviction in automatic negative thoughts (ANTs).
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-mint border-mint/30 bg-mint/10">
                  CBT Outcome
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ) : engagementData?.thought_records_efficacy ? (
                <>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground font-medium">Initial Belief Conviction (Pre-Reframe)</span>
                        <span className="font-bold text-coral">
                          {engagementData.thought_records_efficacy.average_initial_belief_rating.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-coral rounded-full transition-[width] duration-300"
                          style={{
                            width: `${Math.min(100, engagementData.thought_records_efficacy.average_initial_belief_rating)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground font-medium">Outcome Belief Conviction (Post-Reframe)</span>
                        <span className="font-bold text-mint">
                          {engagementData.thought_records_efficacy.average_outcome_belief_rating.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-mint rounded-full transition-[width] duration-300"
                          style={{
                            width: `${Math.min(100, engagementData.thought_records_efficacy.average_outcome_belief_rating)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-mint/10 border border-mint/20 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="size-4 text-mint stroke-[1.75]" />
                      <span className="font-semibold text-foreground">Net Cognitive Shift</span>
                    </div>
                    <span className="font-bold text-mint text-sm">
                      -{engagementData.thought_records_efficacy.average_belief_reduction.toFixed(1)}% Conviction
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No thought record shifts recorded.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stress Relief Adoption Table */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold font-['Poppins'] text-foreground flex items-center gap-2">
                    <Wind className="size-5 text-mint stroke-[1.75]" />
                    Instant Relief & Somatic Practice
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Adoption and duration across breathing and sensory grounding exercises.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg w-full" />
                  ))}
                </div>
              ) : engagementData?.stress_relief_adoption && Object.keys(engagementData.stress_relief_adoption).length > 0 ? (
                <div className="space-y-2.5">
                  {Object.entries(engagementData.stress_relief_adoption).map(([activity, data]) => {
                    const minutes = Math.round(data.total_seconds / 60);
                    return (
                      <div
                        key={activity}
                        className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-md bg-mint/10 text-mint flex items-center justify-center font-bold">
                            <Wind className="size-4 stroke-[1.75]" />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground capitalize">
                              {activity.replace(/_/g, " ")}
                            </span>
                            <div className="text-[11px] text-muted-foreground">
                              {data.count} practice session{data.count !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-foreground">{minutes} min</span>
                          <div className="text-[10px] text-muted-foreground">Total time</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No stress relief activities recorded in this timeframe.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
