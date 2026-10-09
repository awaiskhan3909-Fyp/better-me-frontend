import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Scale,
  Plus,
  Home,
  MessageCircle,
  TrendingDown,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import ThoughtRecordModal from "../components/ThoughtRecordModal";
import {
  getThoughtRecords,
  deleteThoughtRecord,
  getCurrentUser,
  CBTThoughtRecord,
} from "../services/apiService";
import { toast } from "sonner";

export default function ThoughtRecords() {
  const currentUser = getCurrentUser();
  const [records, setRecords] = useState<CBTThoughtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  const fetchRecords = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    try {
      const data = await getThoughtRecords(currentUser.id);
      setRecords(data);
    } catch (err) {
      console.warn("Could not load thought records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentUser]);

  const handleDelete = async (recordId: string) => {
    if (!window.confirm("Are you sure you want to delete this Thought Record?")) return;
    try {
      await deleteThoughtRecord(recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      toast.success("Thought Record deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record.");
    }
  };

  // Metrics
  const totalRecords = records.length;
  const avgBeliefDrop =
    totalRecords > 0
      ? Math.round(
          records.reduce((acc, r) => acc + (r.initial_belief_rating - r.outcome_belief_rating), 0) /
            totalRecords
        )
      : 0;

  const distortionCounts = records.reduce((acc: Record<string, number>, r) => {
    acc[r.distortion_type] = (acc[r.distortion_type] || 0) + 1;
    return acc;
  }, {});

  const mostFrequentDistortion =
    Object.entries(distortionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const distortionColors: Record<string, string> = {
    Catastrophizing: "bg-red-50 text-red-700 border-red-300",
    "Mind Reading": "bg-amber-50 text-amber-700 border-amber-300",
    Overgeneralization: "bg-blue-50 text-blue-700 border-blue-300",
    "All-or-Nothing Thinking": "bg-purple-50 text-purple-700 border-purple-300",
    "Emotional Reasoning": "bg-pink-50 text-pink-700 border-pink-300",
    "Fortune Telling": "bg-indigo-50 text-indigo-700 border-indigo-300",
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
            <Link to="/chat">
              <Button variant="ghost" size="sm" className="text-slate-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Session
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-700">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Thought Record
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Title & Clinical Intro */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Cognitive Restructuring Studio
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Beck's 5-Column Thought Records
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Putting cognitive distortions on trial. Track your thoughts, examine objective evidence, formulate balanced alternative reframes, and monitor measurable cognitive shifts.
          </p>
        </div>

        {/* Quantified Shift Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-medium">Completed Exercises</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-800">{totalRecords}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Documented cognitive breakthroughs</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-medium">Average Belief Reduction</CardDescription>
              <CardTitle className="text-3xl font-bold text-emerald-600 flex items-center gap-1">
                <TrendingDown className="w-6 h-6" />
                -{avgBeliefDrop}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Decrease in conviction of negative distortions</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-medium">Top Reframed Trap</CardDescription>
              <CardTitle className="text-2xl font-bold text-purple-700 truncate">
                {mostFrequentDistortion}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Most frequent thought distortion mastered</p>
            </CardContent>
          </Card>
        </div>

        {/* Thought Records List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-600" />
              Your Cognitive Reframing Log
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {records.length} {records.length === 1 ? "record" : "records"} recorded
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500">Loading your thought records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Thought Records yet</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 mb-6">
                Whenever an overwhelming or distorted negative thought strikes, put it on trial using Beck's 5-column method.
              </p>
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Your First Thought Record
              </Button>
            </div>
          ) : (
            records.map((record) => {
              const beliefDelta = record.initial_belief_rating - record.outcome_belief_rating;
              const isExpanded = expandedRecordId === record.id;

              return (
                <div
                  key={record.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
                >
                  {/* Top Bar: Distortion Badge, Date, Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Badge
                        variant="outline"
                        className={`${
                          distortionColors[record.distortion_type] || "bg-slate-100 text-slate-700"
                        } font-semibold text-xs px-2.5 py-0.5`}
                      >
                        {record.distortion_type}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(record.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {beliefDelta > 0 && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                          <TrendingDown className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          -{beliefDelta}% Belief Drop
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-slate-400 hover:text-red-600 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Core 2-Column Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column 1: Situation & Automatic Thought */}
                    <div className="bg-red-50/30 border border-red-100 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
                          Automatic Negative Thought
                        </span>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-[10px]">
                          Belief: {record.initial_belief_rating}%
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-900 leading-snug">
                        "{record.automatic_thought}"
                      </p>
                      <p className="text-xs text-slate-500 pt-1 border-t border-red-100/60">
                        <strong>Trigger:</strong> {record.situation}
                      </p>
                    </div>

                    {/* Column 2: Rational Balanced Reframe */}
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Balanced Alternative Reframe
                        </span>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                          Belief: {record.outcome_belief_rating}%
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-900 leading-snug">
                        "{record.balanced_thought}"
                      </p>
                      {record.behavioral_action && (
                        <p className="text-xs text-emerald-800 pt-1 border-t border-emerald-100/60 font-medium">
                          <strong>Active Homework:</strong> {record.behavioral_action}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expandable Socratic Evidence Trial */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in-50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Socratic Evidence Examination:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="font-semibold text-red-700 mb-1">Evidence For:</p>
                          <p className="text-slate-700 leading-relaxed">{record.evidence_for}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="font-semibold text-emerald-700 mb-1">Evidence Against:</p>
                          <p className="text-slate-700 leading-relaxed">{record.evidence_against}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Accordion Button */}
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                      className="text-xs text-slate-500 hover:text-slate-700 h-7 px-2"
                    >
                      {isExpanded ? "Hide Evidence Trial" : "View Socratic Evidence Trial"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Thought Record Wizard Modal */}
      <ThoughtRecordModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onRecordSaved={(newRecord) => {
          setRecords((prev) => [newRecord, ...prev]);
        }}
      />
    </div>
  );
}
