import React from "react";
import { Link } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { InstantReliefTab } from "./InstantReliefTab";
import { Wind, ExternalLink } from "lucide-react";

interface QuickCalmDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCalmDrawer({ open, onOpenChange }: QuickCalmDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-card border-l border-border z-50 overflow-hidden"
      >
        {/* Drawer Header */}
        <SheetHeader className="p-4 sm:p-5 pr-12 border-b border-border/60 bg-light-gray/60 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-light-blue/20 text-primary flex items-center justify-center shadow-2xs">
              <Wind className="size-4 stroke-[1.75]" />
            </div>
            <div>
              <SheetTitle className="text-base font-heading font-semibold text-foreground">
                Instant Calm Drawer
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground font-sans">
                Quick, somatic exercises to center your breathing and body.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Drawer Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <InstantReliefTab compact={true} />
        </div>

        {/* Drawer Footer Link to Full Practice Hub */}
        <div className="p-4 border-t border-border/60 bg-light-gray/60 flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-foreground font-sans">
            Need in-depth cognitive reframing?
          </span>
          <Link to="/practice?tab=relief" onClick={() => onOpenChange(false)}>
            <Button size="sm" variant="outline" className="text-xs font-semibold h-8 rounded-xl">
              <span>Open Practice Hub</span>
              <ExternalLink className="size-3 stroke-[1.75] ml-1.5" />
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default QuickCalmDrawer;
