// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-fixed ds-top-0 ds-z-toast ds-flex ds-max-h-screen ds-w-full ds-flex-col-reverse ds-p-4 sm:ds-bottom-0 sm:ds-right-0 sm:ds-top-auto sm:ds-flex-col md:ds-max-w-[var(--toast-width)]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "ds-group ds-pointer-events-auto ds-relative ds-flex ds-w-full ds-items-center ds-justify-between ds-space-x-2 ds-overflow-hidden ds-rounded-md ds-border ds-p-4 ds-pr-6 ds-shadow-lg ds-transition-all data-[swipe=cancel]:ds-translate-x-0 data-[swipe=end]:ds-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:ds-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:ds-transition-none data-[state=open]:ds-animate-in data-[state=closed]:ds-animate-out data-[swipe=end]:ds-animate-out data-[state=closed]:ds-fade-out-80 data-[state=closed]:ds-slide-out-to-right-full data-[state=open]:ds-slide-in-from-top-full data-[state=open]:sm:ds-slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "ds-border ds-bg-background ds-text-foreground",
        destructive:
          "ds-destructive ds-group ds-border-destructive ds-bg-destructive ds-text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn("comal-ui", toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-inline-flex ds-h-8 ds-shrink-0 ds-items-center ds-justify-center ds-rounded-md ds-border ds-bg-transparent ds-px-3 ds-text-sm ds-font-medium ds-transition-colors hover:ds-bg-secondary focus:ds-outline-none focus:ds-ring-1 focus:ds-ring-ring disabled:ds-pointer-events-none disabled:ds-opacity-50 group-[.ds-destructive]:ds-border-muted/40 group-[.ds-destructive]:hover:ds-border-destructive/30 group-[.ds-destructive]:hover:ds-bg-destructive group-[.ds-destructive]:hover:ds-text-destructive-foreground group-[.ds-destructive]:focus:ds-ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-absolute ds-right-1 ds-top-1 ds-rounded-md ds-p-1 ds-text-foreground/50 ds-opacity-0 ds-transition-opacity hover:ds-text-foreground focus:ds-opacity-100 focus:ds-outline-none focus:ds-ring-1 group-hover:ds-opacity-100 group-[.ds-destructive]:ds-text-red-300 group-[.ds-destructive]:hover:ds-text-red-50 group-[.ds-destructive]:focus:ds-ring-red-400 group-[.ds-destructive]:focus:ds-ring-offset-red-600",
      className
    )}
    aria-label="Dismiss notification"
    toast-close=""
    {...props}
  >
    <X className="ds-h-4 ds-w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-text-sm ds-font-semibold [&+div]:ds-text-xs",
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("comal-ui", "ds-text-sm ds-opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
