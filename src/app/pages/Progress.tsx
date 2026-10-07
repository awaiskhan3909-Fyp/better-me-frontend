import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, Home, TrendingUp, Calendar, AlertCircle, MessageCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { emotionalInsightsData, recentSessions } from "../data/mockData";
import logo from "../../imports/Better_me_Logo.png";

export default function Progress() {
  // Prepare data for charts
  const distortionTrendData = emotionalInsightsData.map((insight, index) => ({
    id: `distortion-${index}`,
    date: new Date(insight.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Catastrophizing: insight.distortionCounts.Catastrophizing,
    "Mind Reading": insight.distortionCounts["Mind Reading"],
    Overgeneralization: insight.distortionCounts.Overgeneralization,
    "All-or-Nothing": insight.distortionCounts["All-or-Nothing Thinking"],
    "Emotional Reasoning": insight.distortionCounts["Emotional Reasoning"],
    "Fortune Telling": insight.distortionCounts["Fortune Telling"],
  }));

  const riskLevelData = emotionalInsightsData.map((insight, index) => ({
    id: `risk-${index}`,
    date: new Date(insight.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    riskScore: insight.riskLevel === "high" ? 3 : insight.riskLevel === "medium" ? 2 : 1,
  }));

  const totalDistortions = emotionalInsightsData.reduce(
    (sum, insight) =>
      sum +
      Object.values(insight.distortionCounts).reduce((a, b) => a + b, 0),
    0
  );

  const mostCommonDistortion = Object.entries(
    emotionalInsightsData.reduce(
      (acc, insight) => {
        Object.entries(insight.distortionCounts).forEach(([key, value]) => {
          acc[key] = (acc[key] || 0) + value;
        });
        return acc;
      },
      {} as Record<string, number>
    )
  ).sort((a, b) => b[1] - a[1])[0];

  const distortionColors = {
    Catastrophizing: "#ef4444",
    "Mind Reading": "#b8a1ff",
    Overgeneralization: "#f97316",
    "All-or-Nothing": "#2a5fb7",
    "Emotional Reasoning": "#ec4899",
    "Fortune Telling": "#6a9ff7",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Better Me" className="h-8" />
          </div>
          <div className="flex items-center gap-2">
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Your Progress</h1>
          <p className="text-slate-600 font-['Inter']">
            Track your journey and see how your thinking patterns are evolving over time.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5 group">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Total Sessions</p>
                  <p className="text-3xl font-semibold text-slate-900">{recentSessions.length}</p>
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
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Distortions Detected</p>
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
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Current Risk</p>
                  <p className="text-3xl font-semibold text-green-600">Low</p>
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
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">This Week</p>
                  <p className="text-3xl font-semibold text-slate-900">{recentSessions.length}</p>
                  <p className="text-xs font-['Inter'] text-green-600 mt-1">+2 from last week</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-light to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Distortion Trends Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distortion Trends Over Time</CardTitle>
                <CardDescription>
                  Track how different cognitive distortions appear in your sessions
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
                    <Line
                      key="line-catastrophizing"
                      type="monotone"
                      dataKey="Catastrophizing"
                      stroke={distortionColors.Catastrophizing}
                      strokeWidth={2}
                    />
                    <Line
                      key="line-mind-reading"
                      type="monotone"
                      dataKey="Mind Reading"
                      stroke={distortionColors["Mind Reading"]}
                      strokeWidth={2}
                    />
                    <Line
                      key="line-overgeneralization"
                      type="monotone"
                      dataKey="Overgeneralization"
                      stroke={distortionColors.Overgeneralization}
                      strokeWidth={2}
                    />
                    <Line
                      key="line-all-or-nothing"
                      type="monotone"
                      dataKey="All-or-Nothing"
                      stroke={distortionColors["All-or-Nothing"]}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotional Risk Levels</CardTitle>
                <CardDescription>
                  Monitor your emotional intensity across sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={riskLevelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
                    <YAxis
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                      ticks={[1, 2, 3]}
                      tickFormatter={(value) =>
                        value === 3 ? "High" : value === 2 ? "Medium" : "Low"
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) =>
                        value === 3 ? "High" : value === 2 ? "Medium" : "Low"
                      }
                    />
                    <Bar key="bar-risk-score" dataKey="riskScore" fill="#2a5fb7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Patterns we've noticed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900 mb-1">Positive Trend</p>
                      <p className="text-sm text-green-700">
                        Your overall risk levels have been consistently low. Great work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-900 mb-1">Most Common Pattern</p>
                      <p className="text-sm text-orange-700">
                        {mostCommonDistortion[0]} ({mostCommonDistortion[1]} instances)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Consistency</p>
                      <p className="text-sm text-blue-700">
                        You've been active for 7 days. Regular engagement helps build resilience.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                        <MessageCircle className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(session.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-600">
                          {session.duration}m • {session.messageCount} messages
                        </p>
                        <Badge
                          className={`mt-1 text-xs ${
                            session.riskLevel === "low"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : session.riskLevel === "medium"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {session.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
