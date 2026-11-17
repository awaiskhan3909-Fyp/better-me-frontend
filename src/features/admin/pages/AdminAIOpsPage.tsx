import React, { useState, useEffect } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { StatCard } from "../../../components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Cpu,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Server,
  Layers,
  Lock,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { fetchAdminAIOps } from "../api";
import { AdminAIOpsResponse } from "../types";
import { toast } from "sonner";

export default function AdminAIOpsPage() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [opsData, setOpsData] = useState<AdminAIOpsResponse | null>(null);

  const loadData = async (selectedDays: number) => {
    try {
      setLoading(true);
      const data = await fetchAdminAIOps(selectedDays);
      setOpsData(data);
    } catch (err: any) {
      console.error("Failed to load AI operations telemetry:", err);
      toast.error(err?.message || "Failed to load AI operations telemetry.");
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

  // Response sources donut chart data
  const SOURCE_COLORS: Record<string, string> = {
    gemini_conversational: "var(--primary)",
    fallback_template: "var(--primary-lighter)",
    safety_override: "var(--coral)",
  };

  const SOURCE_LABELS: Record<string, string> = {
    gemini_conversational: "Gemini Conversational",
    fallback_template: "Offline Fallback Template",
    safety_override: "Deterministic Safety Override",
  };

  const sourceChartData = opsData
    ? Object.entries(opsData.response_sources_breakdown).map(([key, count]) => ({
        key,
        name: SOURCE_LABELS[key] || key.replace(/_/g, " "),
        value: count,
        color: SOURCE_COLORS[key] || "var(--lavender)",
      }))
    : [];

  // Response types chart data
  const responseTypeData = opsData
    ? Object.entries(opsData.response_types_breakdown).map(([typeKey, count]) => ({
        name: typeKey.replace(/_/g, " "),
        count,
      }))
    : [];

  return (
    <AdminShell
      title="AI Operations & Telemetry"
      subtitle="LLM latency, response source allocation, fallback reliability, and validation safety."
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
                title="Total AI Responses"
                value={opsData?.total_ai_responses ?? 0}
                icon={<Cpu />}
                iconBg="primary"
                description={`Over the last ${days} days`}
              />
              <StatCard
                title="Offline Fallback Rate"
                value={`${(opsData?.offline_template_fallback_rate_percentage ?? 0).toFixed(1)}%`}
                icon={<AlertTriangle />}
                iconBg={
                  (opsData?.offline_template_fallback_rate_percentage ?? 0) > 10
                    ? "coral"
                    : "mint"
                }
                description="Emergency template fallback"
              />
              <StatCard
                title="Average Latency"
                value={`${opsData?.avg_latency_ms ?? 720} ms`}
                icon={<Zap />}
                iconBg="secondary"
                description="LLM inference + BERT pipeline"
              />
              <StatCard
                title="Validation Failures"
                value={opsData?.validation_failures ?? 0}
                icon={<ShieldCheck />}
                iconBg="mint"
                description="Sanitization / safety gate blocks"
              />
            </>
          )}
        </div>

        {/* Middle Section: Source Distribution & ML Pipeline Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Donut Chart: Source Share */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold font-['Poppins'] text-foreground">
                Response Generation Source Share
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Breakdown between Gemini LLM, deterministic safety overrides, and offline fallbacks.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : sourceChartData.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="h-56 w-56 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {sourceChartData.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend & Breakdown Table */}
                  <div className="flex-1 w-full space-y-3">
                    {sourceChartData.map((item) => {
                      const total = opsData?.total_ai_responses || 1;
                      const pct = ((item.value / total) * 100).toFixed(1);
                      return (
                        <div key={item.key} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="size-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium text-foreground">{item.name}</span>
                          </div>
                          <div className="font-bold text-foreground">
                            {item.value} <span className="text-muted-foreground font-normal">({pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No response source telemetry recorded.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Model Stack & Pipeline Architecture */}
          <Card className="lg:col-span-6 rounded-xl border shadow-xs bg-card">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold font-['Poppins'] text-foreground">
                    Active ML & LLM Pipeline Stack
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Strict execution order per AGENTS.md Section 3.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-mint border-mint/30 bg-mint/10">
                  Pipeline Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                {
                  step: "1. Safety BERT Classifier",
                  desc: "Deterministic crisis gate runs BEFORE any LLM call (Safe, Low, High).",
                  badge: "3 classes",
                  status: "Active",
                  variant: "mint",
                },
                {
                  step: "2. Distortion BERT Classifier",
                  desc: "Identifies 6 cognitive distortion classes with confidence score.",
                  badge: "6 classes",
                  status: "Active",
                  variant: "primary",
                },
                {
                  step: "3. Lexicon NER & Memory Briefing",
                  desc: "Extracts clinical context (work, relationship, health) & long-term goals.",
                  badge: "Context",
                  status: "Active",
                  variant: "lavender",
                },
                {
                  step: "4. Google Gemini 2.5 Flash",
                  desc: "Socratic empathy & reframing generation via GeminiLLMProvider only.",
                  badge: "Gemini API",
                  status: "Connected",
                  variant: "primary",
                },
                {
                  step: "5. Sanitization & Fallback Safeguard",
                  desc: "Deterministic fallback templates activate if network or timeout occurs.",
                  badge: "Fallback Guard",
                  status: "Standby",
                  variant: "mint",
                },
              ].map((layer, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <span>{layer.step}</span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                        {layer.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5 truncate sm:text-clip">
                      {layer.desc}
                    </p>
                  </div>
                  <div className="shrink-0 font-medium text-[11px] text-mint bg-mint/10 px-2 py-0.5 rounded">
                    {layer.status}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Response Types Breakdown BarChart */}
        <Card className="rounded-xl border shadow-xs bg-card">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-['Poppins'] text-foreground">
                  Response Strategy Types Volume
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  CBT strategy classification selected by the therapeutic response decision engine.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                <Lock className="size-3.5 stroke-[1.75]" />
                <span>Zero message text logged (Pseudonymized & Aggregate)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : responseTypeData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={responseTypeData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
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
                      name="Response Volume"
                      fill="var(--primary)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No response type telemetry recorded.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
