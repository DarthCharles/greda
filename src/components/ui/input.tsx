// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "comal-ui",
          "flex h-xl w-full rounded-md border border-primary surface-raised px-sm py-2xs text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-disabled aria-[invalid=true]:border-destructive md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
