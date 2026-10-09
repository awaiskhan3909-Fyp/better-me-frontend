import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Brain,
  MessageCircle,
  TrendingUp,
  LogOut,
  Calendar,
  Clock,
  AlertCircle,
  Sparkles,
  Activity,
  Target,
  Compass,
  ArrowRight
} from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import {
  getCurrentUser,
  logoutUser,
  getDashboardStats,
  DashboardStatsResponse
} from "../services/apiService";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats(currentUser?.id);
        setStats(data);
      } catch (err) {
        console.warn("Could not fetch remote stats, using fallback", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [currentUser]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const totalSessions = stats?.total_sessions ?? 0;
  const averageDuration = stats?.avg_duration_minutes ?? 0;
  const currentRisk = stats?.current_risk_level ?? "Safe";
  const userName = stats?.user_name || currentUser?.full_name || "Friend";
  const recentSessions = stats?.recent_sessions || [];

  const riskLevelColors: Record<string, string> = {
    low: "bg-green-100 text-green-700 border-green-200",
    safe: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    moderate: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200",
    "high risk": "bg-red-100 text-red-700 border-red-200",
  };

  const distortionColors: Record<string, string> = {
    Catastrophizing: "bg-red-50 text-red-700 border-red-200",
    "Mind Reading": "bg-purple-50 text-purple-700 border-purple-200",
    Overgeneralization: "bg-orange-50 text-orange-700 border-orange-200",
    "All-or-Nothing Thinking": "bg-blue-50 text-blue-700 border-blue-200",
    "Emotional Reasoning": "bg-pink-50 text-pink-700 border-pink-200",
    "Fortune Telling": "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Better Me" className="h-8" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/progress">
              <Button variant="ghost" className="text-slate-700 hover:text-primary">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-slate-700 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-1 flex items-center gap-2">
              Welcome Back, {userName} 👋
            </h1>
            <p className="text-slate-600 font-['Inter']">
              How are you feeling today? Your safe, AI-guided CBT space is ready.
            </p>
          </div>

          {/* User's Intake Focus Badges */}
          {stats?.primary_focus && stats.primary_focus.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Focus:</span>
              {stats.primary_focus.map((focus) => (
                <Badge key={focus} variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs py-1 px-2.5">
                  {focus}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
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
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Avg. Duration</p>
                  <p className="text-3xl font-semibold text-slate-900">{averageDuration}m</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-primary-dark" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-green-50 group">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-['Inter'] text-slate-600 mb-1">Current Risk</p>
                  <p className="text-3xl font-semibold text-green-600 capitalize">
                    {currentRisk.toLowerCase()}
                  </p>
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
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left 2 Cols: Start Session & Session History */}
          <div className="md:col-span-2 space-y-6">
            {/* Start New Session CTA Banner */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary via-primary-dark to-secondary text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">CBT Cognitive Reframing</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Ready for a therapy session?</h3>
                    <p className="text-white/90 font-['Inter'] text-sm mb-6 max-w-md">
                      Share your thoughts, exam worries, or feelings. Better Me will identify cognitive distortions and guide you with empathetic reframing.
                    </p>
                    <Link to="/chat">
                      <Button className="bg-white text-primary hover:bg-slate-50 shadow-lg font-medium px-6 rounded-xl">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start New Session
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-28 h-28 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <Target className="w-14 h-14 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/30 rounded-full blur-3xl" />
            </Card>

            {/* Session History (With Empty State) */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription className="font-['Inter']">Your recorded AI therapy discussions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentSessions.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary">
                      <Compass className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-800 mb-1">No sessions recorded yet</h4>
                    <p className="text-xs text-slate-500 font-['Inter'] max-w-sm mx-auto mb-4">
                      Start your very first session today. As you chat, your cognitive distortion trends and progress will automatically appear here.
                    </p>
                    <Link to="/chat">
                      <Button size="sm" className="bg-primary hover:bg-primary-dark text-white rounded-xl">
                        Begin First Session <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-slate-900 truncate">
                              {session.title}
                            </p>
                            <Badge className={riskLevelColors[session.riskLevel.toLowerCase()] || "bg-slate-100 text-slate-700"}>
                              {session.riskLevel} risk
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 font-['Inter'] mb-2">
                            {session.date} • {session.duration}m duration • {session.message_count} messages
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {session.distortions_detected.length > 0 ? (
                              session.distortions_detected.map((d) => (
                                <Badge
                                  key={d}
                                  variant="outline"
                                  className={`text-xs ${distortionColors[d] || "text-slate-600"}`}
                                >
                                  {d}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">No cognitive distortions flagged</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Col: Emotional Insights & CBT Coaching */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Therapy Insights</CardTitle>
                <CardDescription className="font-['Inter']">Personalized clinical observations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900 text-sm mb-0.5">Primary Target</p>
                      <p className="text-xs font-['Inter'] text-green-800 leading-relaxed">
                        {stats?.primary_goal || "Learn to challenge and reframe negative thoughts"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-dark text-sm mb-0.5">CBT Distortion Detection</p>
                      <p className="text-xs font-['Inter'] text-slate-700 leading-relaxed">
                        Fine-tuned BERT AI screens for 6 cognitive distortions: Catastrophizing, Mind Reading, Overgeneralization, Fortune Telling, Emotional Reasoning, and All-or-Nothing thinking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-secondary-lighter to-secondary/20 rounded-xl border border-secondary/30">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5 text-primary-dark" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-dark text-sm mb-0.5">Session Frequency</p>
                      <p className="text-xs font-['Inter'] text-slate-700 leading-relaxed">
                        {totalSessions > 0
                          ? `You've completed ${totalSessions} sessions so far. Consistency builds neural resilience.`
                          : "Regular 10-minute CBT check-ins significantly reduce chronic worry and rumination."}
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/progress" className="block pt-2">
                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary/5 rounded-xl">
                    View Progress Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
