import React, { useState, useEffect, useMemo } from "react";
import AdminShell from "../../../app/layouts/AdminShell";
import { DataTable, Column } from "../../../components/ui/data-table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { EmptyState } from "../../../components/ui/empty-state";
import {
  Users,
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Calendar,
  X,
} from "lucide-react";
import { fetchAdminUsers } from "../api";
import { AdminUserItem } from "../types";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [days, setDays] = useState<number>(30);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"created" | "sessions" | "messages" | "practices">("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const loadUsers = async (selectedDays: number) => {
    try {
      setLoading(true);
      const data = await fetchAdminUsers(selectedDays, 100);
      setUsers(data || []);
    } catch (err: any) {
      console.error("Failed to fetch admin users:", err);
      toast.error(err?.message || "Failed to load pseudonymized user cohort.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(days);
  }, [days]);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.pseudonym_id.toLowerCase().includes(q) ||
          u.current_risk_level.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }

    // 2. Sorting
    result.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortBy === "created") {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      } else if (sortBy === "sessions") {
        valA = a.total_sessions;
        valB = b.total_sessions;
      } else if (sortBy === "messages") {
        valA = a.total_user_messages;
        valB = b.total_user_messages;
      } else if (sortBy === "practices") {
        valA = a.practices_completed;
        valB = b.practices_completed;
      }

      if (sortOrder === "asc") {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });

    return result;
  }, [users, searchQuery, sortBy, sortOrder]);

  // Pagination calculation
  const totalItems = filteredAndSortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedUsers.slice(start, start + pageSize);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  // Reset to page 1 on search or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder]);

  // CSV Export (Zero PII, fully pseudonymized)
  const handleExportCSV = () => {
    if (filteredAndSortedUsers.length === 0) {
      toast.error("No user records available to export.");
      return;
    }

    const headers = [
      "Pseudonym ID",
      "Role",
      "Active Status",
      "Intake Completed",
      "Distress Baseline",
      "Total Sessions",
      "User Messages Sent",
      "CBT Practices Completed",
      "Current Risk Level",
      "Created Date",
      "Last Active Date",
    ];

    const rows = filteredAndSortedUsers.map((u) => [
      u.pseudonym_id,
      u.role,
      u.is_active ? "Active" : "Inactive",
      u.has_completed_intake ? "Yes" : "No",
      u.distress_baseline !== null ? u.distress_baseline : "N/A",
      u.total_sessions,
      u.total_user_messages,
      u.practices_completed,
      u.current_risk_level,
      new Date(u.created_at).toLocaleDateString(),
      u.last_active ? new Date(u.last_active).toLocaleDateString() : "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `better_me_users_cohort_${days}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredAndSortedUsers.length} pseudonymized user records.`);
  };

  // DataTable column definitions
  const columns: Column<AdminUserItem>[] = [
    {
      key: "pseudonym_id",
      header: "Patient Token",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold bg-muted px-2 py-0.5 rounded-md text-foreground">
            {row.pseudonym_id}
          </span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => (
        <Badge
          variant={row.role === "admin" ? "default" : "outline"}
          className={`text-[10px] font-semibold ${
            row.role === "admin" ? "bg-lavender text-white" : "text-muted-foreground"
          }`}
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: "intake",
      header: "Intake Baseline",
      cell: (row) => (
        <span className="text-xs font-sans">
          {row.distress_baseline !== null ? (
            <span
              className={`font-semibold ${
                row.distress_baseline >= 8
                  ? "text-coral"
                  : row.distress_baseline >= 5
                  ? "text-primary"
                  : "text-mint"
              }`}
            >
              {row.distress_baseline}/12
            </span>
          ) : (
            <span className="text-muted-foreground italic">None</span>
          )}
        </span>
      ),
    },
    {
      key: "sessions",
      header: "Sessions",
      cell: (row) => <span className="font-semibold text-xs text-foreground">{row.total_sessions}</span>,
    },
    {
      key: "messages",
      header: "Messages",
      cell: (row) => <span className="text-xs text-muted-foreground">{row.total_user_messages}</span>,
    },
    {
      key: "practices",
      header: "Practices",
      cell: (row) => (
        <span className="text-xs font-semibold text-primary">{row.practices_completed}</span>
      ),
    },
    {
      key: "risk",
      header: "Clinical Risk",
      cell: (row) => {
        const risk = row.current_risk_level;
        let badgeColor = "text-mint bg-mint/20";
        if (risk === "Medium") badgeColor = "text-primary bg-primary-lighter/30";
        if (risk === "High") badgeColor = "text-coral bg-coral/20";

        return (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {risk}
          </span>
        );
      },
    },
    {
      key: "last_active",
      header: "Last Active",
      cell: (row) => (
        <span className="text-xs text-muted-foreground font-sans">
          {row.last_active ? new Date(row.last_active).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        className="text-xs font-semibold h-9 rounded-lg"
      >
        <Download className="size-3.5 stroke-[1.75] mr-1.5" />
        Export CSV
      </Button>

      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
        {[
          { label: "7d", val: 7 },
          { label: "30d", val: 30 },
          { label: "90d", val: 90 },
        ].map((opt) => (
          <button
            key={opt.val}
            type="button"
            onClick={() => setDays(opt.val)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              days === opt.val
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AdminShell
      title="Pseudonymized Patient Cohort"
      subtitle={`De-identified clinical telemetry for ${users.length} users`}
      actions={headerActions}
    >
      <div className="space-y-4">
        {/* Search & Sort Controls Bar */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 stroke-[1.75] text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pseudonym ID or risk..."
              className="pl-9 pr-8 text-xs font-sans h-9 rounded-lg border-border"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5 stroke-[1.75]" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-muted-foreground font-sans">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-card border border-border text-foreground text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="created">Join Date</option>
              <option value="sessions">Total Sessions</option>
              <option value="messages">User Messages</option>
              <option value="practices">Practices</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-8 px-2 text-xs font-semibold"
              title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              <ArrowUpDown className="size-3.5 stroke-[1.75]" />
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={paginatedUsers}
          keyExtractor={(row) => row.pseudonym_id}
          isLoading={loading}
          loadingRowsCount={6}
          emptyTitle="No patient records match your filter"
          emptyDescription="Try clearing your search query or adjusting the reporting date range."
        />

        {/* Pagination Footer */}
        {!loading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-2 text-xs text-muted-foreground font-sans">
            <div>
              Showing{" "}
              <strong className="text-foreground">
                {Math.min(totalItems, (currentPage - 1) * pageSize + 1)}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(totalItems, currentPage * pageSize)}
              </strong>{" "}
              of <strong className="text-foreground">{totalItems}</strong> patients
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg"
              >
                <ChevronLeft className="size-3.5 stroke-[1.75] mr-1" />
                Previous
              </Button>

              <span className="px-3 py-1 bg-muted rounded-md font-semibold text-foreground text-xs">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg"
              >
                Next
                <ChevronRight className="size-3.5 stroke-[1.75] ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
