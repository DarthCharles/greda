// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-fixed ds-inset-0 ds-z-overlay ds-bg-overlay data-[state=open]:ds-animate-in data-[state=closed]:ds-animate-out data-[state=closed]:ds-fade-out-0 data-[state=open]:ds-fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  container?: React.ComponentPropsWithoutRef<
    typeof DialogPrimitive.Portal
  >["container"];
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, container, children, ...props }, ref) => (
  <DialogPortal container={container}>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "comal-ui",
        "ds-fixed ds-left-[50%] ds-top-[50%] ds-z-overlay ds-grid ds-text-foreground ds-w-[calc(100%-2rem)] ds-max-w-lg ds-max-h-[calc(100dvh-2rem)] ds-overflow-y-auto ds-translate-x-[-50%] ds-translate-y-[-50%] ds-gap-4 ds-border ds-bg-background ds-p-6 ds-shadow-lg ds-duration-200 data-[state=open]:ds-animate-in data-[state=closed]:ds-animate-out data-[state=closed]:ds-fade-out-0 data-[state=open]:ds-fade-in-0 data-[state=closed]:ds-zoom-out-95 data-[state=open]:ds-zoom-in-95 data-[state=closed]:ds-slide-out-to-left-1/2 data-[state=closed]:ds-slide-out-to-top-[48%] data-[state=open]:ds-slide-in-from-left-1/2 data-[state=open]:ds-slide-in-from-top-[48%] sm:ds-rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="comal-ui ds-absolute ds-right-4 ds-top-4 ds-rounded-sm ds-opacity-70 ds-ring-offset-background ds-transition-opacity hover:ds-opacity-100 focus:ds-outline-none focus:ds-ring-2 focus:ds-ring-ring focus:ds-ring-offset-2 disabled:ds-pointer-events-none data-[state=open]:ds-bg-accent data-[state=open]:ds-text-muted-foreground">
        <X className="ds-h-4 ds-w-4" />
        <span className="ds-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "comal-ui",
      "ds-flex ds-flex-col ds-space-y-1.5 ds-text-center sm:ds-text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "comal-ui",
      "ds-flex ds-flex-col-reverse sm:ds-flex-row sm:ds-justify-end sm:ds-space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "comal-ui",
      "comal-heading ds-text-lg ds-font-semibold ds-leading-none ds-tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("comal-ui", "ds-text-sm ds-text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
