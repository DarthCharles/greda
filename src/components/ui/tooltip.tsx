// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> & {
  container?: React.ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Portal
  >["container"];
};

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, container, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal container={container}>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "comal-ui",
        "ds-z-popover ds-max-w-[var(--tooltip-width)] ds-overflow-hidden ds-rounded-md ds-bg-primary ds-px-3 ds-py-1.5 ds-text-xs ds-text-primary-foreground ds-animate-in ds-fade-in-0 ds-zoom-in-95 data-[state=closed]:ds-animate-out data-[state=closed]:ds-fade-out-0 data-[state=closed]:ds-zoom-out-95 data-[side=bottom]:ds-slide-in-from-top-2 data-[side=left]:ds-slide-in-from-right-2 data-[side=right]:ds-slide-in-from-left-2 data-[side=top]:ds-slide-in-from-bottom-2 ds-origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
