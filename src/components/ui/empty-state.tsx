import * as React from "react";
import { cn } from "./utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border border-dashed border-border bg-card/50",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-light-gray flex items-center justify-center text-muted-foreground mb-4 shrink-0 [&_svg]:size-6 [&_svg]:stroke-[1.75]">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-medium text-foreground tracking-tight mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
