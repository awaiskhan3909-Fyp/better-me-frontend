import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Brain,
  Shield,
  TrendingUp,
  Clock,
  Heart,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Scale,
  Wind,
  AlertTriangle,
  Eye,
  Split,
  BookOpen,
  Layers,
  Activity
} from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import heroWellness3D from "../../imports/hero_wellness_3d.jpg";

const HERO_EXAMPLES = [
  {
    id: "work",
    label: "Work & Exams",
    distortion: "Catastrophizing",
    icon: AlertTriangle,
    color: "#e11d48",
    bgBadge: "bg-red-50 text-red-700 border-red-200",
    thought: "I made one mistake in my presentation, now my entire career is ruined.",
    reframe: "One error does not define my ability. Making human mistakes is normal and an opportunity to improve."
  },
  {
    id: "social",
    label: "Social Anxiety",
    distortion: "Mind Reading",
    icon: Eye,
    color: "#8b5cf6",
    bgBadge: "bg-purple-50 text-purple-700 border-purple-200",
    thought: "They looked away while I was talking; they definitely think I am boring.",
    reframe: "I cannot read minds. A momentary distraction doesn't mean they dislike me or find me boring."
  },
  {
    id: "perfection",
    label: "Perfectionism",
    distortion: "All-or-Nothing",
    icon: Split,
    color: "#2563eb",
    bgBadge: "bg-blue-50 text-blue-700 border-blue-200",
    thought: "If this project isn't 100% flawless, it's a complete and total failure.",
    reframe: "High-impact work is built through iteration. Delivering solid progress is already a meaningful success."
  }
];

export default function Landing() {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const currentExample = HERO_EXAMPLES[selectedExampleIndex];
  const DistortionIcon = currentExample.icon;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#2a5fb7]/10 selection:text-[#2a5fb7]">
      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Better Me" className="h-8 sm:h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs sm:text-sm font-medium px-4 sm:px-5 rounded-xl shadow-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Beautiful Ambient Background */}
      <section className="relative overflow-hidden bg-[#f6faff] py-14 sm:py-20 lg:py-24">
        
        {/* Subtle Tech-Wellness Dot Grid Background Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#2a5fb7 0.8px, transparent 0.8px), radial-gradient(#8b5cf6 0.8px, transparent 0.8px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0, 14px 14px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }}
        />

        {/* Ambient Glowing Light Orbs */}
        <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/20 via-sky-300/15 to-transparent rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-24 right-10 w-[550px] h-[550px] bg-gradient-to-br from-[#b8a1ff]/25 via-indigo-300/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
              <p className="text-xs font-bold tracking-wider text-[#2a5fb7] uppercase font-['Inter']">
                Cognitive Behavioral Therapy & Distortion Reframing
              </p>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Transform Your
                <span className="block bg-gradient-to-r from-[#2a5fb7] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                  Thinking Patterns
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-['Inter']">
                Break free from automatic negative thought loops. Better Me helps you detect cognitive distortions, examine worries through Socratic reframing, and build lasting emotional resilience.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-[#2a5fb7] hover:bg-[#1a4f97] text-white text-xs sm:text-sm font-bold h-12 px-7 rounded-xl shadow-lg shadow-blue-500/20 group">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/thought-records" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold h-12 px-6 rounded-xl">
                    <BookOpen className="w-4 h-4 mr-1.5 text-[#2a5fb7]" />
                    Explore CBT Practice
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 pt-2 text-xs text-slate-500 font-['Inter']">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Confidential</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Evidence-Based CBT</span>
                </div>
              </div>
            </div>

            {/* Right Showcase: 3D Wellness Visual & Interactive Reframe Showcase */}
            <div className="lg:col-span-6 relative flex justify-center">
              
              {/* Outer Glow Wrapper */}
              <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[32px] border border-white shadow-2xl shadow-blue-900/15 overflow-hidden flex flex-col">
                
                {/* 3D Wellness Hero Artwork Header */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-b from-[#e8f1fc] to-white flex items-center justify-center">
                  <img
                    src={heroWellness3D}
                    alt="CBT Cognitive Wellness & Reframing"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle Gradient Overlay to fade into card body */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* Interactive Card Body */}
                <div className="p-5 sm:p-6 space-y-3.5 -mt-2 relative z-10 bg-white">
                  
                  {/* 3 Clickable Scenario Switcher Pills */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Click scenario to test:</span>
                      <span className="text-[#2a5fb7] font-semibold lowercase">interactive preview</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                      {HERO_EXAMPLES.map((ex, idx) => {
                        const isSelected = selectedExampleIndex === idx;
                        return (
                          <button
                            key={ex.id}
                            onClick={() => setSelectedExampleIndex(idx)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-white text-[#2a5fb7] shadow-xs font-bold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {ex.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Thought & Reframe Step Display */}
                  <div className="space-y-2.5 pt-1">
                    
                    {/* Automatic Negative Thought */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Negative Automatic Thought:
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 italic font-['Inter'] leading-relaxed">
                        "{currentExample.thought}"
                      </p>
                    </div>

                    {/* Detected Distortion Badge */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        <DistortionIcon className="w-3.5 h-3.5" style={{ color: currentExample.color }} />
                        <span className="text-xs font-bold text-slate-700">Distortion Detected:</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: currentExample.color }}>
                        {currentExample.distortion}
                      </span>
                    </div>

                    {/* Balanced Socratic Perspective */}
                    <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/70 p-3 rounded-xl border border-emerald-200/80 space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        <Scale className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Balanced Perspective:</span>
                      </div>
                      <p className="text-xs text-emerald-950 font-semibold font-['Inter'] leading-relaxed">
                        "{currentExample.reframe}"
                      </p>
                    </div>

                  </div>

                  {/* Bottom Try Link */}
                  <div className="pt-2 text-center border-t border-slate-100">
                    <Link
                      to="/register"
                      className="text-xs font-bold text-[#2a5fb7] hover:text-[#1a4f97] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Try Socratic Reframing With Your Own Thoughts</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Evidence-Based Tools for Mental Resilience
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-['Inter']">
              Modern Cognitive Behavioral Therapy techniques built into an accessible, responsive web application.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2a5fb7] border border-blue-100">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Smart Distortion Detection
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-['Inter']">
                  Fine-tuned BERT AI screens user reflections in real time for 6 cognitive distortions: Catastrophizing, Mind Reading, Overgeneralization, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  CBT Practice Center
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-['Inter']">
                  Practice challenging cognitive distortions with 24 dedicated scenarios and 5-step Socratic guided questioning.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0284c7] border border-sky-100">
                  <Wind className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Instant Stress Relief
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-['Inter']">
                  Interactive distress tolerance suite featuring 4-7-8 rhythmic breathing, 5-4-3-2-1 sensory grounding, and progressive muscle relaxation.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  My Learning Progress
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-['Inter']">
                  Track completed exercises across all 6 cognitive distortion categories, review past answers, and follow smart recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2a5fb7] border border-blue-100">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Safety Triage & Confidentiality
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-['Inter']">
                  Built-in multi-tier safety classifier with localized crisis helplines, privacy protections, and safe therapeutic boundary monitoring.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 border border-pink-100">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Compassionate Socratic Guidance
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-['Inter']">
                  Empathetic reframing that empowers you to discover your own rational perspectives rather than receiving superficial chatbot replies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-xs font-bold text-[#2a5fb7] uppercase tracking-wider font-['Inter'] block">
              Structured CBT Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How Better Me Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-['Inter']">
              Four simple steps from distressing thought to rational equilibrium.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-[#2a5fb7] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Share Thoughts</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-['Inter']">
                Type what you are experiencing in plain language (English or Roman Urdu). No special format needed.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-sm">AI Screening</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-['Inter']">
                Fine-tuned models detect cognitive distortions like Catastrophizing, Mind Reading, or Overgeneralization.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Socratic Reframe</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-['Inter']">
                Receive targeted Socratic prompts to test your assumptions against factual reality.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Track Growth</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-['Inter']">
                Review your session logs, belief drops, and emotional baseline stability over weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="bg-gradient-to-br from-[#182a4d] via-[#1a4f97] to-[#2a5fb7] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#b8a1ff]" />
                <span>Begin Your Mental Well-being Journey</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Ready to challenge negative thoughts?
              </h2>

              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-['Inter']">
                Build a calmer, more objective mindset with clinically-informed CBT tools.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-[#182a4d] hover:bg-slate-100 font-bold px-7 rounded-xl text-sm h-11 shadow-md">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <button className="w-full sm:w-auto h-11 px-6 rounded-xl text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/35 backdrop-blur-sm transition-all flex items-center justify-center shadow-xs cursor-pointer">
                    Sign In to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Better Me" className="h-7 w-auto" />
            </div>
            <p className="text-xs text-slate-500 max-w-md font-['Inter']">
              Better Me is a supportive CBT self-care tool. In case of an acute psychiatric emergency, please dial emergency services (1122 / 988) or reach out to local crisis hotlines.
            </p>
            <p className="text-xs text-slate-400 font-['Inter']">
              © 2026 Better Me. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
