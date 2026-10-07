import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, MessageCircle, TrendingUp, LogOut, Calendar, Clock, AlertCircle, Sparkles, Activity, Target } from "lucide-react";
import { recentSessions } from "../data/mockData";
import logo from "../../imports/Better_me_Logo.png";

export default function Dashboard() {
  const totalSessions = recentSessions.length;
  const averageDuration = Math.round(
    recentSessions.reduce((sum, session) => sum + session.duration, 0) / totalSessions
  );

  const riskLevelColors = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200",
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
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Better Me" className="h-8" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/progress">
              <Button variant="ghost" className="text-slate-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-slate-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 font-['Inter']">
            How are you feeling today? I'm here to support you.
          </p>
        </div>

        {/* Quick Stats */}
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
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Start New Session */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary via-primary-dark to-secondary text-white mb-6 overflow-hidden relative">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-['Inter']">Start Your Journey</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">Ready for a session?</h3>
                    <p className="text-white/90 font-['Inter'] mb-6 max-w-md">
                      Start a conversation and let's work through what's on your mind together.
                    </p>
                    <Link to="/chat">
                      <Button className="bg-white text-primary hover:bg-slate-50 shadow-lg group">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start New Session
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <Target className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/30 rounded-full blur-3xl" />
            </Card>

            {/* Recent Sessions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription className="font-['Inter']">Your therapy session history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-slate-900">
                            {new Date(session.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <Badge className={riskLevelColors[session.riskLevel]}>
                            {session.riskLevel} risk
                          </Badge>
                        </div>
                        <p className="text-sm font-['Inter'] text-slate-600 mb-2">
                          {session.duration} minutes • {session.messageCount} messages
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {session.distortionsDetected.map((distortion) => (
                            <Badge
                              key={distortion}
                              variant="outline"
                              className={`text-xs font-['Inter'] ${distortionColors[distortion]}`}
                            >
                              {distortion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotional Insights Sidebar */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Emotional Insights</CardTitle>
                <CardDescription className="font-['Inter']">Patterns we've noticed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 mb-1">Great Progress!</p>
                        <p className="text-sm font-['Inter'] text-green-700 leading-relaxed">
                          Your risk levels have remained low over the past week. Keep up the great work!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary-dark mb-1">Most Common Distortion</p>
                        <p className="text-sm font-['Inter'] text-slate-700 leading-relaxed">
                          Overgeneralization appears most frequently. Consider challenging "always" and "never" statements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-secondary-lighter to-secondary/20 rounded-xl border border-secondary/30">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-dark mb-1">Consistency</p>
                        <p className="text-sm font-['Inter'] text-slate-700 leading-relaxed">
                          You've had {totalSessions} sessions in the past week. Regular practice helps build resilience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/progress">
                    <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary/5">
                      View Detailed Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
