import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export type IconSize = 16 | 20 | 24;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: IconSize;
  strokeWidth?: number;
  className?: string;
}

const sizeClasses: Record<IconSize, string> = {
  16: "size-4", // 16px
  20: "size-5", // 20px
  24: "size-6", // 24px
};

export function Icon({
  icon: Component,
  size = 16,
  strokeWidth = 1.75,
  className,
  ...props
}: IconProps) {
  return (
    <Component
      className={cn(sizeClasses[size], className)}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Icon;
