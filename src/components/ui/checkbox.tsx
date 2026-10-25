// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "../../lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-grid ds-place-content-center ds-peer ds-h-4 ds-w-4 ds-shrink-0 ds-rounded-sm ds-border ds-border-primary ds-shadow focus-visible:ds-outline-none focus-visible:ds-ring-1 focus-visible:ds-ring-ring disabled:ds-cursor-not-allowed disabled:ds-opacity-disabled aria-[invalid=true]:ds-border-destructive data-[state=checked]:ds-bg-primary data-[state=checked]:ds-text-primary-foreground data-[state=indeterminate]:ds-bg-primary data-[state=indeterminate]:ds-text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className={cn(
        "comal-ui",
        "ds-grid ds-place-content-center ds-text-current"
      )}
    >
      <Check className="ds-h-4 ds-w-4" data-check-icon="" />
      <Minus className="ds-h-4 ds-w-4" data-mixed-icon="" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
