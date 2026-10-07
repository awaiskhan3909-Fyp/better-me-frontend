import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Brain, Shield, TrendingUp, MessageCircle, Clock, Heart, Sparkles, Activity, Target, CheckCircle, ArrowRight, Zap } from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Better Me" className="h-10" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary-lighter to-white">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-secondary-lighter border border-secondary/30 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-secondary-dark" />
                <span className="text-sm font-medium text-secondary-dark">AI-Powered CBT Therapy</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Thinking Patterns
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Break free from negative thought cycles with intelligent cognitive behavioral therapy.
                Detect distortions, challenge beliefs, and build mental resilience—all at your own pace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex-1 sm:flex-initial">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary-dark shadow-xl shadow-primary/30 group">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login" className="flex-1 sm:flex-initial">
                  <Button size="lg" variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary/5">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-slate-600">Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-slate-600">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-slate-600">100% Private</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:block hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1674027215016-0a4abfdbf1cc?w=800&q=80"
                alt="Cognitive Therapy Illustration"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">6</p>
                    <p className="text-sm text-slate-600">Distortions Detected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Better Mental Health
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Evidence-based tools designed to help you identify, challenge, and overcome cognitive distortions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-primary/5 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Smart Pattern Detection
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  AI identifies 6 types of cognitive distortions in real-time, providing instant awareness of unhelpful thinking patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-secondary-lighter group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-primary-dark" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Therapeutic Conversations
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Engage in structured CBT exercises through natural dialogue, receiving personalized evidence-based guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-primary/5 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-light to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Progress Analytics
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Track your emotional patterns and mental health journey with comprehensive insights and visualization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Safety First
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Built-in emotional risk detection with immediate support resources when concerning patterns emerge.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-primary/5 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  24/7 Availability
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Access therapeutic support whenever you need it—day or night. No appointments, no waiting rooms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-pink-50 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Compassionate Support
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Experience non-judgmental, empathetic guidance designed to be warm, understanding, and encouraging.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-lighter/30 to-transparent -z-10" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How Better me Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Your journey to healthier thinking patterns starts here, guided by AI-powered CBT principles.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      STEP 1
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Share Your Thoughts</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Express what's on your mind through natural conversation. Write freely—no special format needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30">
                      <Zap className="w-8 h-8 text-primary-dark" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="inline-block bg-secondary/20 text-secondary-dark text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      STEP 2
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">AI Analysis</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our system analyzes your message for cognitive distortions like catastrophizing, mind reading, and overgeneralization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                      <Target className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      STEP 3
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Receive Guidance</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Get evidence-based CBT responses that help you challenge and reframe unhelpful thoughts into healthier patterns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green/30">
                      <Activity className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      STEP 4
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Track Progress</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Monitor your emotional patterns and see tangible evidence of your growth through comprehensive analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary rounded-3xl p-12 lg:p-16 shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />

              <div className="relative z-10 text-center text-white space-y-8">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Join thousands transforming their mental health</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Ready to Transform Your
                  <span className="block">Thinking Patterns?</span>
                </h2>

                <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Start your journey towards healthier thought patterns and improved mental wellbeing.
                  Your first step is just a click away.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-slate-50 shadow-xl px-8 py-6 text-lg group"
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Secure & confidential</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logo} alt="Better Me" className="h-8" />
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              <strong className="text-slate-900">Important:</strong> Better Me is a supportive tool and not a substitute for professional mental health care.
              If you're experiencing a mental health emergency, please contact emergency services or a crisis helpline immediately.
            </p>
            <div className="pt-6 border-t">
              <p className="text-slate-500">
                © 2026 Better Me. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
