import * as React from "react";
import { cn } from "./utils";
import { Card, CardContent } from "./card";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string | {
    value: string | number;
    trend?: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: React.ReactNode;
  iconBg?: "primary" | "secondary" | "mint" | "coral" | "light-blue" | "light-gray";
  description?: string;
  badge?: React.ReactNode;
}

const iconBgVariants = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary-dark",
  mint: "bg-mint/20 text-mint-dark",
  coral: "bg-coral/15 text-coral-dark",
  "light-blue": "bg-light-blue/25 text-primary",
  "light-gray": "bg-light-gray text-muted-foreground",
};

export function StatCard({
  title,
  value,
  change,
  icon,
  iconBg = "light-blue",
  description,
  badge,
  className,
  ...props
}: StatCardProps) {
  const changeObj = typeof change === "object" ? change : change ? { value: change } : null;

  return (
    <Card className={cn("p-5 flex flex-col justify-between gap-3 rounded-xl border border-border shadow-sm bg-card", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </span>
            {badge && <div>{badge}</div>}
          </div>
        </div>
        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 [&_svg]:size-5 [&_svg]:stroke-[1.75]",
              iconBgVariants[iconBg] || iconBgVariants["light-blue"]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(changeObj || description) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
          {changeObj && (
            <span
              className={cn(
                "font-medium",
                changeObj.trend === "up" && "text-mint-dark",
                changeObj.trend === "down" && "text-coral-dark",
                (!changeObj.trend || changeObj.trend === "neutral") && "text-muted-foreground"
              )}
            >
              {changeObj.trend === "up" ? "+" : ""}
              {changeObj.value}
            </span>
          )}
          {changeObj?.label && <span>{changeObj.label}</span>}
          {description && !changeObj && <span>{description}</span>}
        </div>
      )}
    </Card>
  );
}
