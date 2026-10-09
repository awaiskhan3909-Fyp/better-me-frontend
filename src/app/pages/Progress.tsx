import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, Home, TrendingUp, Calendar, AlertCircle, MessageCircle, Sparkles, ArrowRight, Scale } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import logo from "../../imports/Better_me_Logo.png";
import { getCurrentUser, getDashboardStats, DashboardStatsResponse } from "../services/apiService";

export default function Progress() {
  const currentUser = getCurrentUser();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats(currentUser?.id);
        setStats(data);
      } catch (err) {
        console.warn("Could not load stats for progress page", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [currentUser]);

  // Real or fallback trend items
  const trends = stats?.emotional_trends && stats.emotional_trends.length > 0 ? stats.emotional_trends : [];

  const distortionTrendData = trends.map((insight, index) => ({
    id: `distortion-${index}`,
    date: new Date(insight.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Catastrophizing: insight.distortion_counts["Catastrophizing"] || 0,
    "Mind Reading": insight.distortion_counts["Mind Reading"] || 0,
    Overgeneralization: insight.distortion_counts["Overgeneralization"] || 0,
    "All-or-Nothing": insight.distortion_counts["All-or-Nothing Thinking"] || 0,
    "Emotional Reasoning": insight.distortion_counts["Emotional Reasoning"] || 0,
    "Fortune Telling": insight.distortion_counts["Fortune Telling"] || 0,
  }));

  const riskLevelData = trends.map((insight, index) => ({
    id: `risk-${index}`,
    date: new Date(insight.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    riskScore: insight.risk_level === "high" || insight.risk_level === "high risk" ? 3 : insight.risk_level === "medium" || insight.risk_level === "moderate" ? 2 : 1,
  }));

  // Distortions breakdown
  const breakdown = stats?.distortions_breakdown || {
    Catastrophizing: 0,
    "Mind Reading": 0,
    Overgeneralization: 0,
    "All-or-Nothing Thinking": 0,
    "Emotional Reasoning": 0,
    "Fortune Telling": 0,
  };

  const totalDistortions = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const mostCommonDistortion = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0] || ["None", 0];

  const totalSessions = stats?.total_sessions ?? 0;
  const currentRisk = stats?.current_risk_level ?? "Safe";

  const distortionColors: Record<string, string> = {
    Catastrophizing: "#ef4444",
    "Mind Reading": "#8b5cf6",
    Overgeneralization: "#f97316",
    "All-or-Nothing": "#2563eb",
    "Emotional Reasoning": "#ec4899",
    "Fortune Telling": "#06b6d4",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Better Me" className="h-8" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/thought-records">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-purple-700">
                <Scale className="w-4 h-4 mr-1.5 text-purple-600" />
                Thought Records
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" size="sm" className="text-slate-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-700">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Your Therapy Progress</h1>
          <p className="text-slate-600 font-['Inter']">
            Track your cognitive distortions and mental health trends across your sessions.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5 group">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Total Sessions</p>
                  <p className="text-3xl font-semibold text-slate-900">{totalSessions}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-secondary-lighter group">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Distortions Identified</p>
                  <p className="text-3xl font-semibold text-slate-900">{totalDistortions}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-green-50 group">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Current Risk Status</p>
                  <p className="text-3xl font-semibold text-green-600 capitalize">{currentRisk.toLowerCase()}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5 group">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Total Reflections</p>
                  <p className="text-3xl font-semibold text-slate-900">{stats?.total_messages ?? 0}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-light to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {totalSessions === 0 ? (
          <Card className="p-8 text-center bg-white shadow-lg border-0 rounded-2xl mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No analytics available yet</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              As soon as you hold your first CBT chat session, our fine-tuned BERT models will automatically chart your cognitive distortion patterns, reframing progress, and emotional safety trends right here.
            </p>
            <Link to="/chat">
              <Button className="bg-primary hover:bg-primary-dark text-white rounded-xl px-6">
                Start First Session <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Distortion Trends Chart */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Distortion Trends Over Time</CardTitle>
                  <CardDescription>
                    How different cognitive distortions appear across your recorded sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={distortionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line type="monotone" dataKey="Catastrophizing" stroke={distortionColors.Catastrophizing} strokeWidth={2} />
                      <Line type="monotone" dataKey="Mind Reading" stroke={distortionColors["Mind Reading"]} strokeWidth={2} />
                      <Line type="monotone" dataKey="Overgeneralization" stroke={distortionColors.Overgeneralization} strokeWidth={2} />
                      <Line type="monotone" dataKey="All-or-Nothing" stroke={distortionColors["All-or-Nothing"]} strokeWidth={2} />
                      <Line type="monotone" dataKey="Emotional Reasoning" stroke={distortionColors["Emotional Reasoning"]} strokeWidth={2} />
                      <Line type="monotone" dataKey="Fortune Telling" stroke={distortionColors["Fortune Telling"]} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Emotional Safety / Risk Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Safety & Risk Tracking</CardTitle>
                  <CardDescription>
                    Evaluated emotional risk stability over your therapy sessions (1 = Safe, 2 = Moderate, 3 = High Risk)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={riskLevelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
                      <YAxis domain={[0, 3]} ticks={[1, 2, 3]} stroke="#64748b" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(val: any) => [val === 3 ? "High Risk" : val === 2 ? "Moderate" : "Safe", "Risk Level"]}
                      />
                      <Bar dataKey="riskScore" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Distortion Breakdown</CardTitle>
                  <CardDescription>Total counts across all your messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(breakdown).map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-medium text-slate-700">{name}</span>
                      <Badge variant="outline" className="font-semibold text-xs bg-white">
                        {count} times
                      </Badge>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Most Frequent Pattern:</p>
                    <p className="font-semibold text-primary text-sm">
                      {mostCommonDistortion[0]} ({mostCommonDistortion[1]} instances)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
