import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const merge = extendTailwindMerge({ prefix: "ds-" });
/** Combine conditional classes and resolve conflicting prefixed utilities. */
export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs));
}
