import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import AppShell from "../../app/layouts/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import CbtExercisesTab from "./components/CbtExercisesTab";
import InstantReliefTab from "./components/InstantReliefTab";
import ThoughtRecordsTab from "./components/ThoughtRecordsTab";
import { BookOpen, Wind, FileText, MessageCircle } from "lucide-react";

export type PracticeTab = "exercises" | "relief";

export default function PracticeHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");

  const getInitialTab = (): PracticeTab => {
    if (rawTab === "relief" || rawTab === "instant-relief") return "relief";
    return "exercises";
  };

  const [activeTab, setActiveTab] = useState<PracticeTab>(getInitialTab);

  // Sync state if searchParams change externally (e.g. back/forward navigation or redirect)
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [rawTab]);

  const handleTabChange = (val: string) => {
    const tab = val as PracticeTab;
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <AppShell
      title="Practice Hub"
      subtitle="Engage in cognitive restructuring exercises and instant somatic grounding."
      actions={
        <Link to="/chat">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-semibold h-8.5 sm:h-9 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <MessageCircle className="size-3.5 stroke-[1.75]" />
            <span>AI Chat Therapy</span>
          </Button>
        </Link>
      }
    >
      <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-4">
          <TabsList className="bg-light-gray/80 p-1 rounded-xl border border-border w-full sm:w-auto self-start grid grid-cols-2 sm:inline-flex h-auto gap-1">
            <TabsTrigger
              value="exercises"
              className="text-xs font-semibold py-2 px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="size-3.5 stroke-[1.75]" />
              <span>CBT Exercises</span>
            </TabsTrigger>

            <TabsTrigger
              value="relief"
              className="text-xs font-semibold py-2 px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Wind className="size-3.5 stroke-[1.75]" />
              <span>Instant Relief</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="focus-visible:outline-none">
            <CbtExercisesTab onNavigateTab={(t) => handleTabChange(t)} />
          </TabsContent>

          <TabsContent value="relief" className="focus-visible:outline-none">
            <InstantReliefTab onNavigateTab={(t) => handleTabChange(t)} />
          </TabsContent>

          {/* Thought Records feature preserved for future re-activation:
          <TabsContent value="records" className="focus-visible:outline-none">
            <ThoughtRecordsTab onNavigateTab={(t) => handleTabChange(t)} />
          </TabsContent>
          */}
        </Tabs>
      </div>
    </AppShell>
  );
}
