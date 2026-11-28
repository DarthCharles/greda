// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../lib/utils";
import { useOverlayContainer } from "./internal/overlay-container";

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
>(({ className, container, sideOffset = 4, ...props }, ref) => {
  const portalContainer = useOverlayContainer(container);
  if (portalContainer === null) return null;
  return (
    <TooltipPrimitive.Portal container={portalContainer}>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "comal-ui",
          "z-popover max-w-[var(--tooltip-width)] overflow-hidden rounded-md surface-inverse px-sm py-xs text-xs text-inverse animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-xs data-[side=left]:slide-in-from-right-xs data-[side=right]:slide-in-from-left-xs data-[side=top]:slide-in-from-bottom-xs origin-[--radix-tooltip-content-transform-origin]",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
