import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge<"typography">({
  extend: {
    classGroups: {
      "bg-color": [{ surface: ["primary", "secondary", "tertiary", "raised", "inverse"] }],
      typography: [{ text: ["display", "title", "body", "label", "caption", "eyebrow"] }],
    },
    // A later complete role replaces earlier typography axes. A later single
    // axis keeps the role so its other properties still apply.
    conflictingClassGroups: {
      typography: ["font-family", "font-size", "font-weight", "leading", "tracking"],
    },
  },
});

/** Combine conditional classes and resolve conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
