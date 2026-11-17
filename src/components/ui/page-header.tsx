import * as React from "react";
import { cn } from "./utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  backAction?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  backAction,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 border-b border-border/60 mb-6 md:flex-row md:items-center md:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {backAction && <div className="mt-1 shrink-0">{backAction}</div>}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {(actions || children) && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
