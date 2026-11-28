// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";
import { NativeDialogContent, shouldUseNativeDialog } from "./internal/native-dialog";
import { useOverlayContainer } from "./internal/overlay-container";

const DialogModalContext = React.createContext(true);

const Dialog = ({ modal = true, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) => (
  <DialogModalContext.Provider value={modal}>
    <DialogPrimitive.Root modal={modal} {...props} />
  </DialogModalContext.Provider>
);
Dialog.displayName = "Dialog";

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
      "fixed inset-0 z-overlay bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
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
  nativeBackdrop?: boolean;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, container, children, nativeBackdrop, ...props }, ref) => {
  const modal = React.useContext(DialogModalContext);
  const portalContainer = useOverlayContainer(container);
  if (portalContainer === null) return null;
  const isNative = modal && shouldUseNativeDialog(nativeBackdrop, portalContainer);
  const Content = isNative ? NativeDialogContent : DialogPrimitive.Content;

  return (
    <DialogPortal container={portalContainer}>
      <DialogOverlay className={isNative ? "invisible" : undefined} />
      <Content
        ref={ref}
        className={cn(
          "comal-ui",
          "fixed left-[50%] top-[50%] z-overlay grid text-primary w-[calc(100%-2rem)] max-w-[var(--dialog-width)] max-h-[calc(100dvh-2rem)] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-md border surface-primary p-lg shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="comal-ui absolute right-md top-md rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted">
          <X className="size-md" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "comal-ui",
      "flex flex-col space-y-xs text-center sm:text-left",
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
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-xs",
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
      "comal-heading text-lg font-semibold leading-none tracking-tight",
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
    className={cn("comal-ui", "text-sm text-muted", className)}
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
