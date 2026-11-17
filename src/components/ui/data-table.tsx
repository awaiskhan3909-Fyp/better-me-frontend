import * as React from "react";
import { cn } from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Skeleton } from "./skeleton";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  isLoading?: boolean;
  loadingRowsCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingRowsCount = 4,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to display at this time.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-xl border border-border shadow-sm overflow-hidden bg-card", className)}>
      <Table>
        <TableHeader className="bg-light-gray/60">
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3", col.headerClassName)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: loadingRowsCount }).map((_, rIdx) => (
              <TableRow key={`skeleton-row-${rIdx}`} className="border-b border-border/50">
                {columns.map((col) => (
                  <TableCell key={`skeleton-cell-${col.key}-${rIdx}`} className="py-3.5">
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-8 text-center">
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  className="border-none shadow-none bg-transparent p-4"
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={keyExtractor(row, index)}
                className="hover:bg-light-gray/40 transition-colors border-b border-border/50 last:border-b-0"
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn("py-3.5 text-sm text-foreground", col.className)}>
                    {col.cell(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
