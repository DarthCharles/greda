"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { OverlayContainerContext } from "./overlay-container";

export function shouldUseNativeDialog(nativeBackdrop?: boolean, container?: Node | null) {
  if (nativeBackdrop === false) return false;
  if (container && !container.isConnected) return false;
  const view = container?.ownerDocument?.defaultView ??
    (typeof window === "undefined" ? undefined : window);
  if (typeof view?.HTMLDialogElement?.prototype.showModal !== "function" ||
    !("inert" in view.HTMLElement.prototype)) return false;
  if (nativeBackdrop === true) return true;

  const { navigator } = view;
  if ("standalone" in navigator && navigator.standalone === true) return true;
  // iPadOS can present a desktop user agent.
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return isIOS && view.matchMedia?.("(display-mode: standalone)").matches === true;
}

function showModal(element: HTMLDialogElement | null) {
  if (element?.isConnected && !element.open) {
    // Leave initial focus on the shell so Radix can run onOpenAutoFocus.
    const panel = element.firstElementChild;
    const wasInert = panel?.hasAttribute("inert");
    panel?.setAttribute("inert", "");
    try {
      element.showModal();
    } finally {
      if (!wasInert) panel?.removeAttribute("inert");
    }
  }
}

type NativePanelProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
};

const NativePanel = React.forwardRef<HTMLDivElement, NativePanelProps>(
  ({
    asChild, role, "aria-label": label, "aria-labelledby": labelledBy,
    "aria-describedby": describedBy, "aria-modal": modal, ...props
  }, ref) => {
    const Panel = asChild ? Slot : "div";
    const closeRef = React.useRef<HTMLButtonElement>(null);
    const [shell, setShell] = React.useState<HTMLDialogElement | null>(null);
    const shellRef = React.useCallback((element: HTMLDialogElement | null) => {
      showModal(element);
      setShell(element);
    }, []);

    return (
      <dialog
        ref={shellRef}
        role={role === "alertdialog" ? role : undefined}
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-modal={modal}
        data-slot="native-dialog"
        className="comal-ui pointer-events-auto fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-visible bg-transparent p-0 outline-none backdrop:[background-color:hsl(var(--overlay,0_0%_0%_/_0.4))] [&:not([open])>[data-state=closed]]:animate-none"
        onCancel={(event) => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          // Forward platform close requests through the same Radix Escape handling.
          event.currentTarget.ownerDocument.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", cancelable: true })
          );
        }}
        onClose={(event) => {
          const dialog = event.currentTarget;
          if (event.target !== dialog) return;
          if (dialog.open || dialog.firstElementChild?.getAttribute("data-state") !== "open") return;
          closeRef.current?.click();
          // A controlled root can reject a native close request.
          dialog.ownerDocument.defaultView?.requestAnimationFrame(() => {
            const panel = dialog.querySelector<HTMLElement>(":scope > [data-state=open]");
            if (!dialog.isConnected || !panel) return;
            showModal(dialog);
            panel.focus({ preventScroll: true });
          });
        }}
      >
        <OverlayContainerContext.Provider value={shell}>
          <Panel {...props} ref={ref} />
        </OverlayContainerContext.Provider>
        <DialogPrimitive.Close ref={closeRef} hidden />
      </dialog>
    );
  }
);
NativePanel.displayName = "NativePanel";

export const NativeDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ asChild, children, ...props }, ref) => (
  <DialogPrimitive.Content {...props} asChild ref={ref}>
    <NativePanel asChild={asChild}>{children}</NativePanel>
  </DialogPrimitive.Content>
));
NativeDialogContent.displayName = "NativeDialogContent";
