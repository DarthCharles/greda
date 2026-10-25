// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "comal-ui ds-inline-flex ds-items-center ds-justify-center ds-gap-2 ds-whitespace-nowrap ds-rounded-md ds-text-sm ds-font-medium ds-transition-all active:[&:not([aria-haspopup])]:ds-translate-y-px motion-reduce:active:[&:not([aria-haspopup])]:ds-transform-none focus-visible:ds-outline-none focus-visible:ds-ring-1 focus-visible:ds-ring-ring disabled:ds-pointer-events-none disabled:ds-opacity-disabled [&_svg]:ds-pointer-events-none [&_svg]:ds-size-4 [&_svg]:ds-shrink-0",
  {
    variants: {
      variant: {
        default:
          "ds-bg-primary ds-text-primary-foreground ds-shadow hover:ds-bg-primary-hover",
        destructive:
          "ds-bg-destructive ds-text-destructive-foreground ds-shadow-sm hover:ds-bg-destructive/90",
        outline:
          "ds-border ds-border-input ds-bg-background ds-shadow-sm hover:ds-bg-accent hover:ds-text-accent-foreground",
        secondary:
          "ds-bg-secondary ds-text-secondary-foreground ds-shadow-sm hover:ds-bg-secondary/80",
        ghost: "hover:ds-bg-accent hover:ds-text-accent-foreground",
        link: "ds-text-primary ds-underline-offset-4 hover:ds-underline",
      },
      size: {
        default: "ds-h-9 ds-px-4 ds-py-2",
        sm: "ds-h-8 ds-rounded-md ds-px-3 ds-text-xs",
        lg: "ds-h-10 ds-rounded-md ds-px-8",
        icon: "ds-h-9 ds-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      type,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : type ?? "button"}
        disabled={asChild ? undefined : disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
