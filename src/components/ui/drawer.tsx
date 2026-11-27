// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "../../lib/utils";
import { DialogDescription, DialogOverlay, DialogTitle } from "./dialog";

export type DrawerProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  direction?: "bottom" | "top" | "left" | "right";
  autoFocus?: boolean;
};

const DrawerContext = React.createContext<{
  direction: NonNullable<DrawerProps["direction"]>;
  autoFocus: boolean;
} | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) throw new Error("DrawerContent requires a Drawer.");
  return context;
}

const Drawer = ({ direction = "bottom", autoFocus = true, ...props }: DrawerProps) => (
  <DrawerContext.Provider value={{ direction, autoFocus }}>
    <DialogPrimitive.Root {...props} />
  </DrawerContext.Provider>
);
Drawer.displayName = "Drawer";

const DrawerPortal = DialogPrimitive.Portal;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerOverlay = DialogOverlay;
const DrawerTitle = DialogTitle;
const DrawerDescription = DialogDescription;

export type DrawerContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  "forceMount"
> & {
  container?: React.ComponentPropsWithoutRef<
    typeof DrawerPortal
  >["container"];
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, container, onOpenAutoFocus, ...props }, ref) => {
  const { direction, autoFocus } = useDrawer();

  return (
    <DrawerPortal container={container}>
      <DrawerOverlay data-slot="drawer-overlay" />
      <DialogPrimitive.Content
        {...props}
        ref={ref}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          if (!autoFocus) event.preventDefault();
        }}
        className={cn(
          "comal-ui fixed z-overlay flex max-w-[var(--dialog-width)] flex-col gap-md overflow-y-auto overscroll-contain border surface-primary p-lg text-primary shadow-lg",
          "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
          direction === "bottom" && "inset-x-0 bottom-0 mx-auto max-h-[calc(100dvh-var(--space-md))] rounded-t-lg pb-[calc(var(--space-lg)+env(safe-area-inset-bottom))] data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full",
          direction === "top" && "inset-x-0 top-0 mx-auto max-h-[calc(100dvh-var(--space-md))] rounded-b-lg pt-[calc(var(--space-lg)+env(safe-area-inset-top))] data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-top-full",
          direction === "left" && "inset-y-0 left-0 w-[calc(100%-var(--space-md))] rounded-r-lg data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full",
          direction === "right" && "inset-y-0 right-0 w-[calc(100%-var(--space-md))] rounded-l-lg data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full",
          className
        )}
      />
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("comal-ui flex shrink-0 flex-col gap-xs", className)}
    {...props}
  />
));
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("comal-ui flex shrink-0 flex-col gap-xs sm:flex-row sm:justify-end", className)}
    {...props}
  />
));
DrawerFooter.displayName = "DrawerFooter";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
