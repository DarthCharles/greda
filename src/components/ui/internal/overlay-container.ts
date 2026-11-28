import * as React from "react";

// Undefined means there is no native dialog. Null means its shell is mounting.
export const OverlayContainerContext = React.createContext<HTMLDialogElement | null | undefined>(
  undefined
);

export function useOverlayContainer(container?: Element | DocumentFragment | null) {
  const shell = React.useContext(OverlayContainerContext);
  if (shell === undefined) return container ?? undefined;
  return container && shell?.contains(container) ? container : shell;
}
