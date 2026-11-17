import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import ThoughtRecordModal from "../../thought-records/components/ThoughtRecordModal";
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  Loader2,
  Scale,
  Smile,
  Shield,
  ArrowRight,
} from "lucide-react";
import {
  getCurrentUser,
  getThoughtRecords,
  deleteThoughtRecord,
  CBTThoughtRecord,
} from "../../../lib/apiClient";
import { toast } from "sonner";

interface ThoughtRecordsTabProps {
  onNavigateTab?: (tab: "exercises" | "relief" | "records") => void;
}

export function ThoughtRecordsTab({ onNavigateTab }: ThoughtRecordsTabProps) {
  const currentUser = getCurrentUser();

  const [records, setRecords] = useState<CBTThoughtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CBTThoughtRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRecords = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getThoughtRecords(currentUser.id);
      setRecords(data || []);
    } catch (err) {
      console.warn("Could not load thought records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentUser?.id]);

  const handleDelete = async (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this thought record?")) return;
    try {
      setDeletingId(recordId);
      await deleteThoughtRecord(recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      if (selectedRecord?.id === recordId) {
        setSelectedRecord(null);
      }
      toast.success("Thought record deleted");
    } catch (err: any) {
      console.error("Failed to delete thought record:", err);
      toast.error(err?.message || "Could not delete thought record");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
      {/* Overview & Action Header */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary bg-light-blue/20 px-2.5 py-0.5 rounded-full">
              Formal CBT Worksheet
            </span>
            <span className="text-xs text-muted-foreground font-sans">
              {records.length} {records.length === 1 ? "record" : "records"} logged
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-heading font-semibold text-foreground">
            5-Step CBT Thought Records
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl leading-relaxed">
            Break the cycle of negative automatic thinking. Log the trigger situation, rate your emotional intensity, identify distortions, examine the evidence, and co-create a realistic balanced perspective.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-semibold h-10 px-4 rounded-xl shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Plus className="size-4 stroke-[1.75]" />
          <span>New Thought Record</span>
        </Button>
      </div>

      {/* Thought Records List */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="text-sm sm:text-base font-heading font-semibold text-foreground">
            Your Logged Thought Records
          </h3>
          <span className="text-xs text-muted-foreground font-sans">
            {records.length} Total
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="size-4 stroke-[1.75] animate-spin text-primary" />
            <span>Loading thought records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 px-4 bg-light-gray/60 rounded-xl border border-dashed border-border">
            <FileText className="size-8 stroke-[1.75] text-muted-foreground mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-foreground">No thought records logged yet</h4>
            <p className="text-xs text-muted-foreground font-sans mt-1 max-w-sm mx-auto">
              Whenever a situation triggers distressing emotions or automatic thoughts, complete a structured thought record to reframe your perspective.
            </p>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-xs font-semibold rounded-xl"
            >
              <Plus className="size-3.5 stroke-[1.75] mr-1" /> Log First Thought Record
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((rec) => {
              const dateStr = new Date(rec.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className="bg-background rounded-xl p-4 border border-border hover:border-primary/40 hover:shadow-xs transition-colors flex flex-col justify-between cursor-pointer group space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-full">
                        {rec.distortion_type || "Cognitive Distortion"}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-sans">
                        {dateStr}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Situation:
                      </span>
                      <p className="text-xs font-semibold text-foreground line-clamp-1">
                        {rec.situation}
                      </p>
                    </div>

                    <div className="bg-light-gray/60 p-2 rounded-lg text-xs font-sans space-y-1">
                      <span className="text-[10px] font-semibold text-coral block">
                        Automatic Thought:
                      </span>
                      <p className="text-muted-foreground italic line-clamp-2">
                        "{rec.automatic_thought}"
                      </p>
                    </div>

                    {rec.balanced_thought && (
                      <div className="bg-mint/10 p-2 rounded-lg text-xs font-sans space-y-0.5">
                        <span className="text-[10px] font-semibold text-mint block">
                          Balanced Reframe:
                        </span>
                        <p className="text-foreground line-clamp-2">
                          "{rec.balanced_thought}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans">
                      <span>Intensity: {rec.initial_belief_rating}% → {rec.outcome_belief_rating ?? rec.initial_belief_rating}%</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(rec.id, e)}
                      disabled={deletingId === rec.id}
                      className="text-muted-foreground hover:text-coral p-1 rounded-md transition-colors"
                      title="Delete record"
                    >
                      {deletingId === rec.id ? (
                        <Loader2 className="size-3.5 stroke-[1.75] animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5 stroke-[1.75]" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL MODAL FOR A SELECTED RECORD */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-card text-card-foreground rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-md border border-border overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border/60 bg-light-gray/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-primary block">
                  Thought Record Details
                </span>
                <h3 className="text-base font-heading font-semibold text-foreground mt-0.5">
                  {selectedRecord.distortion_type || "CBT Reflection"}
                </h3>
                <p className="text-[11px] text-muted-foreground font-sans">
                  Logged on {new Date(selectedRecord.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-light-gray flex items-center justify-center transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs font-sans">
              <div className="bg-light-gray/40 p-3 rounded-xl border border-border space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  1. The Situation / Trigger:
                </span>
                <p className="text-foreground font-medium">{selectedRecord.situation}</p>
              </div>

              <div className="bg-coral/10 p-3 rounded-xl border border-coral/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-coral uppercase tracking-wider block">
                    2. Automatic Thought & Initial Intensity:
                  </span>
                  <span className="font-bold text-coral">{selectedRecord.initial_belief_rating}%</span>
                </div>
                <p className="text-foreground italic">"{selectedRecord.automatic_thought}"</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-light-gray/50 p-3 rounded-xl border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    3A. Evidence Supporting:
                  </span>
                  <p className="text-muted-foreground">
                    {selectedRecord.evidence_for || "No specific evidence noted."}
                  </p>
                </div>
                <div className="bg-light-gray/50 p-3 rounded-xl border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    3B. Evidence Against:
                  </span>
                  <p className="text-muted-foreground">
                    {selectedRecord.evidence_against || "No counter-evidence noted."}
                  </p>
                </div>
              </div>

              {selectedRecord.balanced_thought && (
                <div className="bg-mint/15 p-3.5 rounded-xl border border-mint/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-mint uppercase tracking-wider block">
                      4. Balanced Alternative Thought & Outcome Intensity:
                    </span>
                    <span className="font-bold text-mint">{selectedRecord.outcome_belief_rating ?? selectedRecord.initial_belief_rating}%</span>
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">
                    "{selectedRecord.balanced_thought}"
                  </p>
                </div>
              )}

              {selectedRecord.behavioral_action && (
                <div className="bg-light-blue/15 p-3 rounded-xl border border-light-blue/30 space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                    5. Actionable Next Step:
                  </span>
                  <p className="text-foreground font-medium">
                    {selectedRecord.behavioral_action}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border/60 bg-light-gray/60 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRecord(null)}
                className="text-xs font-medium rounded-xl px-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* THOUGHT RECORD MODAL CREATION WORKFLOW */}
      <ThoughtRecordModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            fetchRecords();
          }
        }}
      />
    </div>
  );
}

export default ThoughtRecordsTab;
