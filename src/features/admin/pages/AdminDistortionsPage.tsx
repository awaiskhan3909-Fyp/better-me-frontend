import React, { useState, useEffect, useMemo } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { StatCard } from "../../../components/ui/stat-card";
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  PieChart as PieIcon,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
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
  LineChart,
  Line,
} from "recharts";
import { fetchAdminDistortions } from "../api";
import { AdminDistortionsResponse } from "../types";
import { toast } from "sonner";

export default function AdminDistortionsPage() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [distortionsData, setDistortionsData] = useState<AdminDistortionsResponse | null>(null);

  const loadData = async (selectedDays: number) => {
    try {
      setLoading(true);
      const data = await fetchAdminDistortions(selectedDays);
      setDistortionsData(data);
    } catch (err: any) {
      console.error("Failed to load distortion analytics:", err);
      toast.error(err?.message || "Failed to load distortion analytics.");
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

  const frequencyChartData = useMemo(() => {
    if (!distortionsData) return [];
    const colors = [
      "var(--primary)",
      "var(--mint)",
      "var(--lavender)",
      "var(--coral)",
      "var(--primary-light)",
      "var(--primary-dark)",
      "var(--primary-lighter)",
    ];
    return Object.entries(distortionsData.detected_distortions_frequency).map(([name, count], idx) => ({
      name,
      count,
      color: colors[idx % colors.length],
    }));
  }, [distortionsData]);

  // Top distortion
  const topDistortion = useMemo(() => {
    if (!frequencyChartData || frequencyChartData.length === 0) return "N/A";
    const sorted = [...frequencyChartData].sort((a, b) => b.count - a.count);
    return sorted[0].name;
  }, [frequencyChartData]);

  return (
    <AdminShell
      title="Cognitive Distortion Analytics"
      subtitle={`Distortion prevalence, classifier confidence, and Socratic gating over the past ${days} days`}
      actions={dateRangeActions}
    >
      <div className="space-y-6">
        {/* Mobile Date Filter */}
        <div className="lg:hidden flex items-center justify-between bg-card p-3 rounded-xl border border-border">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5 stroke-[1.75]" /> Period:
          </span>
          {dateRangeActions}
        </div>

        {/* 1. STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading || !distortionsData ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 bg-card border border-border rounded-xl space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-36" />
              </div>
            ))
          ) : (
            <>
              <StatCard
                title="Dominant Cognitive Distortion"
                value={topDistortion}
                icon={<PieIcon />}
                iconBg="primary"
                description="Most frequently detected thinking pattern"
              />

              <StatCard
                title="BERT Classifier Mean Confidence"
                value={`${(distortionsData.average_confidence * 100).toFixed(1)}%`}
                icon={<Layers />}
                iconBg="mint"
                description={`High confidence (>0.8): ${distortionsData.confidence_distribution.high_above_0_8} detections`}
              />

              <StatCard
                title="Socratic Evidence Gating Rate"
                value={`${distortionsData.socratic_gating.gating_rate_percentage}%`}
                icon={<Filter />}
                iconBg="secondary"
                description={`${distortionsData.socratic_gating.evidence_gated_sessions} of ${distortionsData.socratic_gating.total_evaluated_sessions} sessions gated`}
              />
            </>
          )}
        </div>

        {/* 2. FREQUENCY CHART & CONFIDENCE SPREAD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Frequency Chart */}
          <Card className="lg:col-span-2 rounded-xl border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading font-semibold text-foreground">
                    Cognitive Distortion Frequency
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-sans">
                    Classification distribution across active sessions
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-primary">
                  BERT 6-Class
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading || !distortionsData ? (
                <div className="h-64 flex items-center justify-center">
                  <Skeleton className="h-56 w-full rounded-xl" />
                </div>
              ) : frequencyChartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
                  No distortions detected in this period.
                </div>
              ) : (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={frequencyChartData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.6} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={130}
                        tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" name="Detections" radius={[0, 6, 6, 0]}>
                        {frequencyChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Confidence Breakdown Card */}
          <Card className="rounded-xl border border-border shadow-sm bg-card flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading font-semibold text-foreground">
                Confidence Calibration
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-sans">
                Prediction certainty tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading || !distortionsData ? (
                <div className="h-48 flex items-center justify-center">
                  <Skeleton className="h-44 w-full rounded-xl" />
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-semibold text-mint">High Certainty (&gt;80%)</span>
                      <span className="text-muted-foreground">
                        {distortionsData.confidence_distribution.high_above_0_8} detections
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-mint rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-semibold text-primary">Moderate Certainty (60-80%)</span>
                      <span className="text-muted-foreground">
                        {distortionsData.confidence_distribution.medium_0_6_to_0_8} detections
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-semibold text-coral">Low Certainty (&lt;60%)</span>
                      <span className="text-muted-foreground">
                        {distortionsData.confidence_distribution.low_under_0_6} detections
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-coral rounded-full" style={{ width: "5%" }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border text-xs text-muted-foreground font-sans leading-relaxed">
                    Predictions below 60% are cross-referenced with Socratic evidence gating to prevent false-positive reframing.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 3. CONTEXT HEATMAP & PRACTICE ALIGNMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Context Heatmap Breakdown */}
          <Card className="rounded-xl border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading font-semibold text-foreground">
                Situational Context Heatmap
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-sans">
                Trigger situations cross-referenced with cognitive distortions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading || !distortionsData ? (
                <div className="h-44 flex items-center justify-center">
                  <Skeleton className="h-36 w-full rounded-xl" />
                </div>
              ) : !distortionsData.context_heatmap || distortionsData.context_heatmap.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-xs text-muted-foreground">
                  No contextual NER entities mapped in this period.
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {distortionsData.context_heatmap.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted/40 border border-border rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-foreground block">{item.context}</span>
                        <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                          {Object.entries(item.distortions).map(([dName, cnt]) => (
                            <span key={dName} className="bg-card px-1.5 py-0.5 rounded border border-border">
                              {dName}: {cnt}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-xs font-semibold shrink-0">
                        {item.total} events
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Practice Alignment */}
          <Card className="rounded-xl border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading font-semibold text-foreground">
                Clinical Homework Alignment
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-sans">
                Completed CBT exercises targeting identified distortions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading || !distortionsData ? (
                <div className="h-44 flex items-center justify-center">
                  <Skeleton className="h-36 w-full rounded-xl" />
                </div>
              ) : Object.keys(distortionsData.practices_by_distortion).length === 0 ? (
                <div className="h-44 flex items-center justify-center text-xs text-muted-foreground">
                  No practice exercises submitted in this period.
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {Object.entries(distortionsData.practices_by_distortion).map(([cat, count]) => (
                    <div
                      key={cat}
                      className="p-3 bg-muted/30 border border-border rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-foreground">{cat}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-semibold text-primary">
                          {count} completed
                        </Badge>
                        <CheckCircle2 className="size-3.5 stroke-[1.75] text-mint" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
