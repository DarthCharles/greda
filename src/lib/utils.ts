import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "bg-color": [{ surface: ["primary", "secondary", "raised", "inverse"] }],
    },
  },
});

/** Combine conditional classes and resolve conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
