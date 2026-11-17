import * as React from "react";
import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { StatCard } from "../../components/ui/stat-card";
import { PageHeader } from "../../components/ui/page-header";
import { EmptyState } from "../../components/ui/empty-state";
import { DataTable, Column } from "../../components/ui/data-table";
import { Modal } from "../../components/ui/modal";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  FileText,
  Heart,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TrendingUp,
  XCircle,
  FolderOpen
} from "lucide-react";

interface SampleRow {
  id: string;
  name: string;
  category: string;
  score: number;
  status: "Completed" | "In Progress" | "Needs Review";
  date: string;
}

const SAMPLE_DATA: SampleRow[] = [
  { id: "1", name: "Thought Journal #14", category: "Catastrophizing", score: 82, status: "Completed", date: "Today" },
  { id: "2", name: "Decatastrophizing Practice", category: "Fortune Telling", score: 65, status: "In Progress", date: "Yesterday" },
  { id: "3", name: "Socratic Reframing Session", category: "All-or-Nothing", score: 94, status: "Completed", date: "Nov 12" },
  { id: "4", name: "Behavioral Experiment Log", category: "Mind Reading", score: 48, status: "Needs Review", date: "Nov 10" },
];

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [tableLoading, setTableLoading] = React.useState(false);

  const columns: Column<SampleRow>[] = [
    {
      key: "name",
      header: "Session / Exercise",
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.category}</p>
        </div>
      ),
    },
    {
      key: "score",
      header: "Clarity Score",
      cell: (row) => <span className="font-mono text-sm font-semibold">{row.score}%</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        if (row.status === "Completed") return <Badge variant="mint">Completed</Badge>;
        if (row.status === "In Progress") return <Badge variant="secondary">In Progress</Badge>;
        return <Badge variant="coral">Needs Review</Badge>;
      },
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => <span className="text-muted-foreground text-xs">{row.date}</span>,
    },
  ];

  return (
    <div className="min-h-dvh bg-light-gray/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header Component */}
        <PageHeader
          title="Design System & UI Component Showcase"
          description="Task 4.2: Brand tokens, typography scale, radius 8/12/16, shadows sm/md, and 10 Radix-based UI wrappers."
          badge={<Badge variant="secondary">Design System v1.0</Badge>}
          actions={
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Back to Dashboard</Button>
              </Link>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="size-4 stroke-[1.75]" />
                Open Modal
              </Button>
            </div>
          }
        />

        {/* 1. Brand Tokens & Theme Styles */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">1. Brand Colors & Tokens (AGENTS.md Section 7)</h2>
            <p className="text-sm text-muted-foreground">Derived from CSS variables in src/styles/theme.css (no raw hex in components).</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl border border-border shadow-sm bg-card space-y-2">
              <div className="h-12 w-full rounded-lg bg-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Blue (Primary)</p>
                <p className="text-xs font-mono text-muted-foreground">#3A7BD5</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border shadow-sm bg-card space-y-2">
              <div className="h-12 w-full rounded-lg bg-light-blue" />
              <div>
                <p className="text-xs font-semibold text-foreground">Light Blue</p>
                <p className="text-xs font-mono text-muted-foreground">#A6C8FF</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border shadow-sm bg-card space-y-2">
              <div className="h-12 w-full rounded-lg bg-mint" />
              <div>
                <p className="text-xs font-semibold text-foreground">Mint</p>
                <p className="text-xs font-mono text-muted-foreground">#6FD3A8</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border shadow-sm bg-card space-y-2">
              <div className="h-12 w-full rounded-lg bg-light-gray border border-border" />
              <div>
                <p className="text-xs font-semibold text-foreground">Light Gray</p>
                <p className="text-xs font-mono text-muted-foreground">#F5F7FA</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border shadow-sm bg-card space-y-2">
              <div className="h-12 w-full rounded-lg bg-coral" />
              <div>
                <p className="text-xs font-semibold text-foreground">Coral</p>
                <p className="text-xs font-mono text-muted-foreground">#FF7A7A</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border shadow-sm bg-card space-y-2">
              <div className="h-12 w-full rounded-lg bg-lavender" />
              <div>
                <p className="text-xs font-semibold text-foreground">Lavender (Secondary)</p>
                <p className="text-xs font-mono text-muted-foreground">#B8A1FF</p>
              </div>
            </div>
          </div>

          {/* Radius & Shadows Spec */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Card className="p-5">
              <h3 className="font-heading text-base font-semibold text-foreground mb-3">Radius Constraints (8 / 12 / 16 only)</h3>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="p-3 bg-light-gray border border-border rounded-lg text-center">
                  <p className="text-xs font-semibold">radius-sm (8px)</p>
                  <p className="text-xs text-muted-foreground">Badges, Buttons, Inputs</p>
                </div>
                <div className="p-3 bg-light-gray border border-border rounded-xl text-center">
                  <p className="text-xs font-semibold">radius-md (12px)</p>
                  <p className="text-xs text-muted-foreground">Cards, Tabs, Tables</p>
                </div>
                <div className="p-3 bg-light-gray border border-border rounded-2xl text-center">
                  <p className="text-xs font-semibold">radius-lg (16px)</p>
                  <p className="text-xs text-muted-foreground">Modals, Dialogs</p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-heading text-base font-semibold text-foreground mb-3">Shadows (sm / md only)</h3>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="p-4 bg-card border border-border rounded-xl shadow-sm text-center">
                  <p className="text-xs font-semibold">shadow-sm</p>
                  <p className="text-xs text-muted-foreground">Cards, StatCards, Tables</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-xl shadow-md text-center">
                  <p className="text-xs font-semibold">shadow-md</p>
                  <p className="text-xs text-muted-foreground">Modals, Popovers</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 2. Button Component Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">2. Button Wrapper</h2>
            <p className="text-sm text-muted-foreground">Standardized variants, sizes, icon integration (Lucide stroke 1.75), transition-colors without transition-all.</p>
          </div>

          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Primary Default</Button>
                <Button variant="secondary">Secondary Lavender</Button>
                <Button variant="mint">Mint Positive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive Coral</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sizes & Icons</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (h-8)</Button>
                <Button size="default">Default (h-9)</Button>
                <Button size="lg">Large (h-10)</Button>
                <Button size="default">
                  <CheckCircle className="size-4 stroke-[1.75]" />
                  With Icon
                </Button>
                <Button size="icon" variant="outline" aria-label="Search">
                  <Search className="size-4 stroke-[1.75]" />
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Badge Component Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">3. Badge Wrapper</h2>
            <p className="text-sm text-muted-foreground">Radius 8px, semantic clinical and status badges.</p>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Primary Blue</Badge>
              <Badge variant="secondary">Lavender</Badge>
              <Badge variant="mint">Mint / Positive</Badge>
              <Badge variant="coral">Coral / High Distress</Badge>
              <Badge variant="lightBlue">Light Blue Context</Badge>
              <Badge variant="destructive">Critical Risk</Badge>
              <Badge variant="outline">Outline Neutral</Badge>
            </div>
          </Card>
        </section>

        {/* 4. StatCard Component Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">4. StatCard Wrapper</h2>
            <p className="text-sm text-muted-foreground">Structured metric card with Poppins value, trend indicators, functional icons, and shadow-sm.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Streak"
              value="12 Days"
              change={{ value: "4 days vs last week", trend: "up" }}
              icon={<TrendingUp />}
              iconBg="primary"
            />
            <StatCard
              title="Reframed Thoughts"
              value="38"
              change={{ value: "+8 this week", trend: "up" }}
              icon={<FileText />}
              iconBg="secondary"
            />
            <StatCard
              title="Average Distress"
              value="24%"
              change={{ value: "18% reduction", trend: "down" }}
              icon={<Heart />}
              iconBg="mint"
            />
            <StatCard
              title="Critical Flares"
              value="0"
              description="Zero clinical safety events"
              icon={<Activity />}
              iconBg="light-gray"
            />
          </div>
        </section>

        {/* 5. Tabs Component Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">5. Tabs Wrapper</h2>
            <p className="text-sm text-muted-foreground">Radix Tabs with radius 12 container, radius 8 active pill, no transition-all.</p>
          </div>

          <Card className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Clinical Overview</TabsTrigger>
                <TabsTrigger value="distortions">Distortions Tracked</TabsTrigger>
                <TabsTrigger value="exercises">Homework & Exercises</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-2">
                <h4 className="font-heading text-base font-medium">Session Stage Progression</h4>
                <p className="text-sm text-muted-foreground">
                  The client has successfully reached the Socratic questioning stage. Cognitive reframes have shown an 18% improvement in subjective emotional balance.
                </p>
              </TabsContent>
              <TabsContent value="distortions" className="space-y-2">
                <h4 className="font-heading text-base font-medium">Distortion Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  Most frequent: Catastrophizing (42%), All-or-Nothing Thinking (28%), Fortune Telling (15%).
                </p>
              </TabsContent>
              <TabsContent value="exercises" className="space-y-2">
                <h4 className="font-heading text-base font-medium">Assigned CBT Homework</h4>
                <p className="text-sm text-muted-foreground">
                  Completed 3 Thought Records and 2 Box Breathing exercises in the practice section.
                </p>
              </TabsContent>
            </Tabs>
          </Card>
        </section>

        {/* 6. Card & Card Layout Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">6. Card Wrapper</h2>
            <p className="text-sm text-muted-foreground">Standardized Header, Title, Description, Content, and Footer with radius 12 and shadow-sm.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Clinical Summary</CardTitle>
                <CardDescription>Generated automatically after Stage 8 Wrap-up</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-foreground">
                  Key identified cognitive thought: <span className="italic font-medium">"I won't be able to finish my final project and will fail."</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Target reframe validated: Breaking the workload into manageable 20-minute daily sprints.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-4">
                <Badge variant="mint">Validated Reframe</Badge>
                <Button variant="ghost" size="sm">
                  View Full Report
                  <ArrowRight className="size-4 stroke-[1.75]" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety & Crisis Protocol State</CardTitle>
                <CardDescription>Monitored on every turn before LLM inference</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="mint">Low Risk (Gate Clear)</Badge>
                  <span className="text-xs text-muted-foreground">Deterministic rule check: Passed</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  No self-harm or suicidal intent detected. Normal therapeutic companion conversation flow remains active.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-border/50 pt-4">
                <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                  Test Safety Modal
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 7. DataTable Component Wrapper */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">7. DataTable Wrapper</h2>
              <p className="text-sm text-muted-foreground">Configurable table with custom columns, cell renderers, and built-in skeleton loader.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTableLoading(!tableLoading)}
            >
              <RefreshCw className="size-4 stroke-[1.75]" />
              {tableLoading ? "Show Data" : "Toggle Loading Skeleton"}
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={SAMPLE_DATA}
            keyExtractor={(row) => row.id}
            isLoading={tableLoading}
          />
        </section>

        {/* 8. EmptyState Component Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">8. EmptyState Wrapper</h2>
            <p className="text-sm text-muted-foreground">Purpose-built empty container with functional icon, Poppins title, Inter description, and action CTA.</p>
          </div>

          <EmptyState
            icon={<FolderOpen />}
            title="No Thought Records Captured"
            description="When you identify a cognitive distortion during chat therapy, you can save it here to reframe it anytime."
            action={
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="size-4 stroke-[1.75]" />
                Create First Thought Record
              </Button>
            }
          />
        </section>

        {/* 9. Skeleton Component Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">9. Skeleton Wrapper</h2>
            <p className="text-sm text-muted-foreground">Radius 8/12px pulse placeholders for asynchronous loading states.</p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full rounded-lg" />
              <Skeleton className="h-3 w-5/6 rounded-lg" />
              <Skeleton className="h-3 w-4/6 rounded-lg" />
            </div>
          </Card>
        </section>

        {/* 10. Modal Component Wrapper */}
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Design System Modal Wrapper"
          description="Built on top of Radix Dialog with radius 16 (rounded-2xl), shadow-md, and responsive sizing."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setModalOpen(false)}>
                Confirm Action
              </Button>
            </>
          }
        >
          <div className="space-y-3 py-2 text-sm text-foreground">
            <p>
              This is a demonstration of the standardized <code className="bg-light-gray px-1.5 py-0.5 rounded-lg border border-border text-xs font-mono">Modal</code> wrapper component.
            </p>
            <div className="p-3 rounded-xl bg-light-blue/20 border border-light-blue/40 text-xs text-foreground space-y-1">
              <p className="font-semibold">Clinical Note:</p>
              <p className="text-muted-foreground">Modals adhere strictly to 16px corner radius, shadow-md, and standard Inter typography.</p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
