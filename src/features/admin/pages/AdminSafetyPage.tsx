import React, { useState, useEffect } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { StatCard } from "../../../components/ui/stat-card";
import { DataTable, Column } from "../../../components/ui/data-table";
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  ShieldAlert,
  AlertTriangle,
  LifeBuoy,
  Activity,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchAdminSafety } from "../api";
import { AdminSafetyResponse, SafetyFlaggedItem } from "../types";
import { toast } from "sonner";

export default function AdminSafetyPage() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [safetyData, setSafetyData] = useState<AdminSafetyResponse | null>(null);

  const loadData = async (selectedDays: number) => {
    try {
      setLoading(true);
      const data = await fetchAdminSafety(selectedDays);
      setSafetyData(data);
    } catch (err: any) {
      console.error("Failed to load safety analytics:", err);
      toast.error(err?.message || "Failed to load safety analytics.");
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

  // Risk distribution colors
  const RISK_COLORS: Record<string, string> = {
    Safe: "var(--mint)",
    Low: "var(--primary)",
    Medium: "var(--lavender)",
    High: "var(--coral)",
  };

  const distributionChartData = safetyData
    ? Object.entries(safetyData.risk_level_distribution).map(([level, count]) => ({
        name: level,
        count,
        color: RISK_COLORS[level] || "var(--primary)",
      }))
    : [];

  const columns: Column<SafetyFlaggedItem>[] = [
    {
      key: "event_id",
      header: "Alert Ref",
      cell: (row) => <span className="font-mono text-xs text-muted-foreground">#{row.event_id}</span>,
    },
    {
      key: "pseudonym_id",
      header: "Patient Token",
      cell: (row) => (
        <span className="font-mono text-xs font-semibold bg-muted px-2 py-0.5 rounded-md text-foreground">
          {row.pseudonym_id}
        </span>
      ),
    },
    {
      key: "session_title",
      header: "Session Context",
      cell: (row) => (
        <span className="text-xs font-medium text-foreground truncate max-w-xs block">
          {row.session_title || "Therapy Session"}
        </span>
      ),
    },
    {
      key: "safety_risk_level",
      header: "Assessed Risk",
      cell: (row) => {
        const isHigh = row.safety_risk_level === "High";
        return (
          <Badge
            variant={isHigh ? "destructive" : "outline"}
            className={`text-[10px] font-semibold ${
              isHigh
                ? "bg-coral text-white"
                : row.safety_risk_level === "Medium"
                ? "text-primary border-primary/40 bg-primary-lighter/10"
                : "text-mint border-mint/40"
            }`}
          >
            {row.safety_risk_level}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Intervention Protocol",
      cell: (row) => (
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md font-sans ${
            row.status === "Intervened"
              ? "bg-coral/15 text-coral"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {row.status === "Intervened" ? "Crisis Helpline Triggered" : "Clinical Pacing Active"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Timestamp",
      cell: (row) => (
        <span className="text-xs text-muted-foreground font-sans">
          {new Date(row.created_at).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <AdminShell
      title="Safety & Crisis Operations"
      subtitle={`Real-time clinical safety risk monitoring over the past ${days} days`}
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
          {loading || !safetyData ? (
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
                title="Deterministic Crisis Interventions"
                value={safetyData.crisis_interventions_count}
                icon={<LifeBuoy />}
                iconBg="coral"
                description="Deterministic crisis protocols executed (LLM bypassed)"
              />

              <StatCard
                title="Safety Alert Flags Triggered"
                value={safetyData.safety_alerts_triggered}
                icon={<AlertTriangle />}
                iconBg="primary"
                description="Elevated distress thresholds identified by BERT"
              />

              <StatCard
                title="Elevated Risk Conversations"
                value={safetyData.elevated_risk_conversations}
                icon={<ShieldAlert />}
                iconBg="secondary"
                description="Conversations currently flagged as Medium or High"
              />
            </>
          )}
        </div>

        {/* 2. RECHARTS: RISK DISTRIBUTION & DAILY TREND */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Level Distribution (BarChart) */}
          <Card className="rounded-xl border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading font-semibold text-foreground">
                Safety Risk Distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-sans">
                Messages classified by Safety BERT Classifier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading || !safetyData ? (
                <div className="h-56 flex items-center justify-center">
                  <Skeleton className="h-48 w-full rounded-xl" />
                </div>
              ) : distributionChartData.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-xs text-muted-foreground">
                  No risk classifications recorded in this period.
                </div>
              ) : (
                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" name="Messages" radius={[6, 6, 0, 0]}>
                        {distributionChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Elevated Events Trend (AreaChart) */}
          <Card className="lg:col-span-2 rounded-xl border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading font-semibold text-foreground">
                    High & Medium Risk Events Trend
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-sans">
                    Chronological volume of safety incidents requiring clinical monitoring
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-coral">
                  Safety Gate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading || !safetyData ? (
                <div className="h-56 flex items-center justify-center">
                  <Skeleton className="h-48 w-full rounded-xl" />
                </div>
              ) : safetyData.daily_trend.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-xs text-muted-foreground">
                  <CheckCircle2 className="size-8 stroke-[1.75] text-mint mb-2" />
                  <span>No elevated safety events recorded in this period. System is calm.</span>
                </div>
              ) : (
                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={safetyData.daily_trend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--coral)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--coral)" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--lavender)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--lavender)" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        tickFormatter={(d) => (d.length > 5 ? d.slice(5) : d)}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="High"
                        name="High Risk (Crisis)"
                        stroke="var(--coral)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorHigh)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Medium"
                        name="Medium Risk (Elevated)"
                        stroke="var(--lavender)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMed)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 3. SAFETY MONITORING QUEUE TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Safety & Crisis Event Queue
              </h3>
              <p className="text-xs text-muted-foreground font-sans">
                De-identified incidents flagged by safety classifiers and deterministic crisis gates (No raw message text)
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              {safetyData?.flagged_queue?.length || 0} Events Logged
            </Badge>
          </div>

          <DataTable
            columns={columns}
            data={safetyData?.flagged_queue || []}
            keyExtractor={(row) => row.event_id}
            isLoading={loading}
            loadingRowsCount={4}
            emptyTitle="All Clear: No elevated safety incidents"
            emptyDescription="No messages have triggered medium/high safety thresholds in the selected period."
          />
        </div>
      </div>
    </AdminShell>
  );
}
