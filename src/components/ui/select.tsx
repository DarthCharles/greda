// Adapted from shadcn/ui (New York). See upstream/shadcn-ui for source and MIT license.
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-flex ds-h-9 ds-w-full ds-items-center ds-justify-between ds-whitespace-nowrap ds-rounded-md ds-border ds-border-input ds-bg-transparent ds-px-3 ds-py-2 ds-text-sm ds-shadow-sm ds-ring-offset-background data-[placeholder]:ds-text-muted-foreground focus:ds-outline-none focus:ds-ring-1 focus:ds-ring-ring disabled:ds-cursor-not-allowed disabled:ds-opacity-disabled aria-[invalid=true]:ds-border-destructive [&>span]:ds-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="ds-h-4 ds-w-4 ds-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-flex ds-cursor-default ds-items-center ds-justify-center ds-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="ds-h-4 ds-w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-flex ds-cursor-default ds-items-center ds-justify-center ds-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="ds-h-4 ds-w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

export type SelectContentProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> & {
  container?: React.ComponentPropsWithoutRef<
    typeof SelectPrimitive.Portal
  >["container"];
};

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, container, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal container={container}>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "comal-ui",
        "ds-relative ds-z-popover ds-max-h-[--radix-select-content-available-height] ds-min-w-[8rem] ds-overflow-y-auto ds-overflow-x-hidden ds-rounded-md ds-border ds-bg-popover ds-text-popover-foreground ds-shadow-md data-[state=open]:ds-animate-in data-[state=closed]:ds-animate-out data-[state=closed]:ds-fade-out-0 data-[state=open]:ds-fade-in-0 data-[state=closed]:ds-zoom-out-95 data-[state=open]:ds-zoom-in-95 data-[side=bottom]:ds-slide-in-from-top-2 data-[side=left]:ds-slide-in-from-right-2 data-[side=right]:ds-slide-in-from-left-2 data-[side=top]:ds-slide-in-from-bottom-2 ds-origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:ds-translate-y-1 data-[side=left]:-ds-translate-x-1 data-[side=right]:ds-translate-x-1 data-[side=top]:-ds-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "comal-ui",
          "ds-p-1",
          position === "popper" &&
            "ds-h-[var(--radix-select-trigger-height)] ds-w-full ds-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-px-2 ds-py-1.5 ds-text-sm ds-font-semibold",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "comal-ui",
      "ds-relative ds-flex ds-w-full ds-cursor-default ds-select-none ds-items-center ds-rounded-sm ds-py-1.5 ds-pl-2 ds-pr-8 ds-text-sm ds-outline-none focus:ds-bg-accent focus:ds-text-accent-foreground data-[disabled]:ds-pointer-events-none data-[disabled]:ds-opacity-50",
      className
    )}
    {...props}
  >
    <span className="ds-absolute ds-right-2 ds-flex ds-h-3.5 ds-w-3.5 ds-items-center ds-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="ds-h-4 ds-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      "comal-ui",
      "-ds-mx-1 ds-my-1 ds-h-px ds-bg-muted",
      className
    )}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
