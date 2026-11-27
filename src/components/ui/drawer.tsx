// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "../../lib/utils";
import { DialogDescription, DialogOverlay, DialogTitle } from "./dialog";
import { NativeDialogContent, supportsNativeDialog } from "./internal/native-dialog";

const swipeDirections = {
  bottom: { axis: "y", sign: 1 },
  top: { axis: "y", sign: -1 },
  left: { axis: "x", sign: -1 },
  right: { axis: "x", sign: 1 },
} as const;

const interactiveSwipeTargets = [
  "a[href]", "button", "input", "select", "textarea", "label", "summary",
  "audio[controls]", "video[controls]", "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]", "[role='button']", "[role='link']",
].join(", ");

export type DrawerProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  direction?: keyof typeof swipeDirections;
  autoFocus?: boolean;
};

const DrawerContext = React.createContext<{
  direction: NonNullable<DrawerProps["direction"]>;
  autoFocus: boolean;
  open: boolean;
  changeOpen: (next: boolean) => void;
  modal: boolean;
} | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) throw new Error("DrawerContent and DrawerHandle require a Drawer.");
  return context;
}

const Drawer = ({
  direction = "bottom", autoFocus = true, modal = true, open, defaultOpen, onOpenChange, ...props
}: DrawerProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? uncontrolledOpen;
  const changeOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DrawerContext.Provider value={{ direction, autoFocus, modal, open: isOpen, changeOpen }}>
      <DialogPrimitive.Root modal={modal} open={isOpen} onOpenChange={changeOpen} {...props} />
    </DrawerContext.Provider>
  );
};
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
  nativeBackdrop?: boolean;
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, container, nativeBackdrop, onOpenAutoFocus, ...props }, ref) => {
  const { direction, autoFocus, modal } = useDrawer();
  const isNative = nativeBackdrop && modal && supportsNativeDialog(container);
  const Content = isNative ? NativeDialogContent : DialogPrimitive.Content;

  const content = (
    <Content
      {...props}
      ref={ref}
      data-drawer-content=""
      onOpenAutoFocus={(event) => {
        onOpenAutoFocus?.(event);
        if (!autoFocus) event.preventDefault();
      }}
      className={cn(
        "comal-ui fixed z-overlay flex max-w-[var(--dialog-width)] flex-col gap-md overflow-y-auto overscroll-contain border surface-primary p-lg text-primary shadow-lg",
        "[--drawer-swipe:none] [translate:var(--drawer-swipe)] transition-[translate] duration-200 data-[drawer-dragging]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out",
        direction === "bottom" && "inset-x-0 bottom-0 mx-auto max-h-[calc(100dvh-var(--space-md))] rounded-t-lg pb-[calc(var(--space-lg)+env(safe-area-inset-bottom))] data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full",
        direction === "top" && "inset-x-0 top-0 mx-auto max-h-[calc(100dvh-var(--space-md))] rounded-b-lg pt-[calc(var(--space-lg)+env(safe-area-inset-top))] data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-top-full",
        direction === "left" && "inset-y-0 left-0 w-[calc(100%-var(--space-md))] rounded-r-lg data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full",
        direction === "right" && "inset-y-0 right-0 w-[calc(100%-var(--space-md))] rounded-l-lg data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full",
        className
      )}
    />
  );

  return (
    <DrawerPortal container={container}>
      <DrawerOverlay data-slot="drawer-overlay" className={isNative ? "invisible" : undefined} />
      {content}
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

type DrawerDrag = {
  pointerId: number;
  content: HTMLElement;
  originX: number;
  originY: number;
  axis: "x" | "y";
  sign: 1 | -1;
  threshold: number;
};

function swipeDistance(drag: DrawerDrag, event: React.PointerEvent<HTMLDivElement>) {
  const x = event.clientX - drag.originX;
  const y = event.clientY - drag.originY;
  const distance = (drag.axis === "x" ? x : y) * drag.sign;
  const crossDistance = Math.abs(drag.axis === "x" ? y : x);
  return distance > crossDistance ? distance : 0;
}

const DrawerHandle = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({
  children, className, onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  onLostPointerCapture, ...props
}, ref) => {
  const { direction, open, changeOpen } = useDrawer();
  const { axis, sign } = swipeDirections[direction];
  const drag = React.useRef<DrawerDrag | null>(null);

  const resetDrag = React.useCallback(() => {
    const content = drag.current?.content;
    drag.current = null;
    content?.removeAttribute("data-drawer-dragging");
    content?.style.removeProperty("--drawer-swipe");
  }, []);

  React.useEffect(() => resetDrag, [open, direction, resetDrag]);

  return (
    <div
      {...props}
      ref={ref}
      data-slot="drawer-handle"
      className={cn(
        "comal-ui shrink-0 cursor-grab touch-none select-none active:cursor-grabbing",
        children == null && "grid min-h-11 min-w-11 place-items-center first:-mx-lg first:-mt-lg",
        className
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || !open || !event.isPrimary || event.button !== 0 || drag.current) return;
        const handle = event.currentTarget;
        const target = event.target;
        const ownerWindow = handle.ownerDocument.defaultView;
        if (!ownerWindow || !(target instanceof ownerWindow.Element) || !handle.contains(target)) return;
        const control = target.closest(interactiveSwipeTargets);
        if (control && control !== handle && handle.contains(control)) return;

        const content = handle.closest<HTMLElement>("[data-drawer-content]");
        if (!content) return;

        const bounds = content.getBoundingClientRect();
        const size = axis === "x" ? bounds.width : bounds.height;
        handle.setPointerCapture(event.pointerId);
        drag.current = {
          pointerId: event.pointerId, content, axis, sign,
          originX: event.clientX, originY: event.clientY,
          threshold: Math.min(96, Math.max(24, size / 4)),
        };
        content.setAttribute("data-drawer-dragging", "");
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const current = drag.current;
        if (event.defaultPrevented || current?.pointerId !== event.pointerId) return;

        const offset = swipeDistance(current, event) * current.sign;
        current.content.style.setProperty(
          "--drawer-swipe",
          current.axis === "x" ? `${offset}px 0px` : `0px ${offset}px`
        );
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        const current = drag.current;
        if (current?.pointerId !== event.pointerId) return;

        resetDrag();
        if (!event.defaultPrevented && open && swipeDistance(current, event) >= current.threshold) {
          changeOpen(false);
        }
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        if (drag.current?.pointerId === event.pointerId) resetDrag();
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event);
        if (drag.current?.pointerId === event.pointerId) resetDrag();
      }}
    >
      {children ?? (
        <span
          aria-hidden="true"
          className={cn(
            "rounded-full bg-muted-foreground",
            axis === "y" ? "h-1 w-10" : "h-10 w-1"
          )}
        />
      )}
    </div>
  );
});
DrawerHandle.displayName = "DrawerHandle";

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
  DrawerHandle,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
