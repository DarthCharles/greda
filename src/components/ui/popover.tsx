// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../../lib/utils";

const PopoverAnchor = PopoverPrimitive.Anchor;

export type PopoverAnchorProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>;

type Side = NonNullable<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>["side"]>;
type Align = NonNullable<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>["align"]>;

export interface PopoverProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
  placement?: Side | `${Side}-${Exclude<Align, "center">}`;
  sideOffset?: number;
}

// Keep root-level positioning options compatible with the original Popover API.
const PopoverPositionContext = React.createContext<{
  side: Side;
  align: Align;
  sideOffset: number;
}>({ side: "bottom", align: "center", sideOffset: 4 });

function Popover({ placement = "bottom", sideOffset = 4, ...props }: PopoverProps) {
  const [side, align = "center"] = placement.split("-") as [Side, Align?];
  return (
    <PopoverPositionContext.Provider value={{ side, align, sideOffset }}>
      <PopoverPrimitive.Root {...props} />
    </PopoverPositionContext.Provider>
  );
}

export type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn("comal-ui", className)}
    {...props}
  />
));
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  container?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>["container"]
    | React.RefObject<HTMLElement | null>;
};

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ container, className, collisionPadding = 8, forceMount, ...props }, ref) => {
  const position = React.useContext(PopoverPositionContext);
  const containerRef = container && "current" in container ? container : undefined;
  const [refContainer, setRefContainer] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    setRefContainer(containerRef?.current ?? null);
  }, [containerRef]);
  if (containerRef && !refContainer) return null;
  const portalContainer = container && "current" in container ? refContainer : container;
  return (
    <PopoverPrimitive.Portal container={portalContainer} forceMount={forceMount}>
      <PopoverPrimitive.Content
        ref={ref}
        side={position.side}
        align={position.align}
        sideOffset={position.sideOffset}
        collisionPadding={collisionPadding}
        forceMount={forceMount}
        className={cn(
          "comal-ui",
          "z-popover w-72 max-w-[var(--radix-popover-content-available-width)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-md border bg-popover p-4 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export type PopoverCloseProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>;

const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  PopoverCloseProps
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className={cn("comal-ui", className)}
    {...props}
  />
));
PopoverClose.displayName = PopoverPrimitive.Close.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverAnchor };
