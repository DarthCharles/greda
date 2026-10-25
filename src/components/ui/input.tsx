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
          "ds-flex ds-h-9 ds-w-full ds-rounded-md ds-border ds-border-input ds-bg-transparent ds-px-3 ds-py-1 ds-text-base ds-shadow-sm ds-transition-colors file:ds-border-0 file:ds-bg-transparent file:ds-text-sm file:ds-font-medium file:ds-text-foreground placeholder:ds-text-muted-foreground focus-visible:ds-outline-none focus-visible:ds-ring-1 focus-visible:ds-ring-ring disabled:ds-cursor-not-allowed disabled:ds-opacity-disabled aria-[invalid=true]:ds-border-destructive md:ds-text-sm",
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
