// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
import * as React from "react";

import { cn } from "../../lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "comal-ui",
        "ds-flex ds-min-h-[60px] ds-w-full ds-rounded-md ds-border ds-border-input ds-bg-transparent ds-px-3 ds-py-2 ds-text-base ds-shadow-sm placeholder:ds-text-muted-foreground focus-visible:ds-outline-none focus-visible:ds-ring-1 focus-visible:ds-ring-ring disabled:ds-cursor-not-allowed disabled:ds-opacity-disabled aria-[invalid=true]:ds-border-destructive md:ds-text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
