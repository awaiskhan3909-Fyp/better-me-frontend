import React, { useState, useEffect } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { StatCard } from "../../../components/ui/stat-card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import {
  Users,
  Activity,
  MessageCircle,
  BookOpen,
  Calendar,
  ShieldAlert,
  RotateCcw,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { fetchAdminOverview } from "../api";
import { AdminOverviewResponse } from "../types";
import { toast } from "sonner";

export default function AdminOverviewPage() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);

  const loadData = async (selectedDays: number) => {
    try {
      setLoading(true);
      const data = await fetchAdminOverview(selectedDays);
      setOverview(data);
    } catch (err: any) {
      console.error("Failed to fetch admin overview:", err);
      toast.error(err?.message || "Failed to load admin overview metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  // Date range filter buttons
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

  return (
    <AdminShell
      title="Platform Overview & Clinical Telemetry"
      subtitle={`Aggregate metrics for the past ${days} days`}
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

        {/* 1. 4 STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !overview ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 bg-card border border-border rounded-xl space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-36" />
              </div>
            ))
          ) : (
            <>
              {/* Stat 1: Registered Users */}
              <StatCard
                title="Total Registered Users"
                value={overview.total_registered_users}
                icon={<Users />}
                iconBg="primary"
                description={`+${overview.new_users_in_period} signed up in period`}
                badge={
                  <Badge variant="outline" className="text-[10px] font-semibold text-primary">
                    +{overview.new_users_in_period} new
                  </Badge>
                }
              />

              {/* Stat 2: Active Patients */}
              <StatCard
                title="Active Therapy Patients"
                value={overview.active_users_in_period}
                icon={<Activity />}
                iconBg="mint"
                description="Engaged in chats or CBT exercises"
              />

              {/* Stat 3: Total Sessions */}
              <StatCard
                title="Clinical Conversations"
                value={overview.total_sessions}
                icon={<MessageCircle />}
                iconBg="light-blue"
                description={`${overview.total_messages} total messages exchanged`}
              />

              {/* Stat 4: CBT Practices Completed */}
              <StatCard
                title="CBT Practices Completed"
                value={overview.total_practices_completed}
                icon={<BookOpen />}
                iconBg="secondary"
                description={`${overview.practice_breakdown.exercises_completed} ex • ${overview.practice_breakdown.thought_records_logged} rec • ${overview.practice_breakdown.stress_relief_completed} relief`}
              />
            </>
          )}
        </div>

        {/* 2. RECHARTS: SIGNUPS / MESSAGE ACTIVITY TREND & SESSIONS PER DAY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Activity Trend (AreaChart) */}
          <Card className="lg:col-span-2 rounded-xl border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading font-semibold text-foreground">
                    Therapy Interaction Volume
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-sans">
                    Daily messages recorded across all clinical sessions
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-primary">
                  {days}d Trend
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <Skeleton className="h-56 w-full rounded-xl" />
                </div>
              ) : !overview || overview.activity_trend.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-xs text-muted-foreground">
                  <Activity className="size-8 stroke-[1.75] text-muted-foreground mb-2" />
                  <span>No message activity recorded in this date range.</span>
                </div>
              ) : (
                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={overview.activity_trend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
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
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="messages"
                        name="Messages Exchanged"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorMessages)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Breakdown & Telemetry (BarChart & Summary) */}
          <Card className="rounded-xl border border-border shadow-sm bg-card flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading font-semibold text-foreground">
                Practice Distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-sans">
                Modality breakdown for completed exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              {loading || !overview ? (
                <div className="h-48 flex items-center justify-center">
                  <Skeleton className="h-44 w-full rounded-xl" />
                </div>
              ) : (
                <>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Exercises", count: overview.practice_breakdown.exercises_completed, fill: "var(--primary)" },
                          { name: "Thought Rec.", count: overview.practice_breakdown.thought_records_logged, fill: "var(--mint)" },
                          { name: "Relief", count: overview.practice_breakdown.stress_relief_completed, fill: "var(--lavender)" },
                        ]}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
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
                        <Bar dataKey="count" name="Completions" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Telemetry list */}
                  <div className="pt-3 border-t border-border space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5 stroke-[1.75] text-primary" />
                        Avg. Conversation Depth:
                      </span>
                      <span className="font-semibold text-foreground">
                        {overview.total_sessions > 0
                          ? (overview.total_messages / overview.total_sessions).toFixed(1)
                          : "0.0"}{" "}
                        turns/session
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ShieldAlert className="size-3.5 stroke-[1.75] text-coral" />
                        Safety Alerts Flagged:
                      </span>
                      <span className="font-semibold text-coral">
                        {overview.safety_alerts_triggered}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <MessageCircle className="size-3.5 stroke-[1.75] text-mint" />
                        Patient vs AI Ratio:
                      </span>
                      <span className="font-semibold text-foreground">
                        {overview.message_breakdown.user_messages} : {overview.message_breakdown.ai_messages}
                      </span>
                    </div>
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
