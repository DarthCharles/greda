import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverAnchor, Button, Input, Label } from "../index";

const meta = {
  title: "Components/Popover",
  component: Popover,
  args: { children: undefined },
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Adapted from shadcn/ui New York, built on Radix. Tab and Shift+Tab cycle through content controls. Enter, Space, or click toggles the trigger; Escape, outside press, or focus leaving dismisses it. Focus moves into the content and returns to the trigger on Escape or close. Non-modal by default and allows outside interaction; modal traps focus, blocks outside interaction, and requires a close control. Give content an aria-label or aria-labelledby. Root placement accepts a side with optional -start or -end alignment; sideOffset controls the gap. Content also accepts Radix side, align, collision, and autofocus options. Set width with className; content scrolls within available viewport space. Use container for scoped themes and PopoverAnchor to position against an element other than the trigger. Entrance and exit animations respect reduced motion. Triggers accept native disabled and asChild; loading can be composed with Button. No visual variants.",
      },
    },
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="catalog-stack">
      <Button variant="outline">Continue editing</Button>
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Edit dimensions</Button></PopoverTrigger>
        <PopoverContent aria-label="Dimensions">
          <div className="catalog-stack">
            <div className="catalog-field">
              <Label htmlFor="popover-width">Width</Label>
              <Input id="popover-width" defaultValue="100%" />
            </div>
            <PopoverClose asChild><Button>Done</Button></PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen} placement="right-start" sideOffset={8}>
        <PopoverTrigger asChild><Button variant="outline">Details</Button></PopoverTrigger>
        <PopoverContent aria-label="Details">
          <p>Controlled state, aligned to the start of the trigger.</p>
          <PopoverClose asChild><Button>Close details</Button></PopoverClose>
        </PopoverContent>
      </Popover>
    );
  },
};

export const CustomAnchor: Story = {
  render: () => (
    <Popover placement="bottom-start">
      <PopoverAnchor asChild>
        <section className="catalog-stack" aria-label="Delivery card">
          <PopoverTrigger asChild><Button variant="outline">Delivery details</Button></PopoverTrigger>
          <p>Deliver to the workshop reception.</p>
        </section>
      </PopoverAnchor>
      <PopoverContent aria-label="Delivery details">
        <p>This panel is positioned below the whole card.</p>
        <PopoverClose asChild><Button>Done</Button></PopoverClose>
      </PopoverContent>
    </Popover>
  ),
};

export const Modal: Story = {
  render: () => (
    <Popover modal>
      <PopoverTrigger asChild><Button>Review changes</Button></PopoverTrigger>
      <PopoverContent aria-label="Review changes">
        <p>Focus stays here until you close the popover.</p>
        <PopoverClose asChild><Button>Finish review</Button></PopoverClose>
      </PopoverContent>
    </Popover>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button disabled>Unavailable</Button></PopoverTrigger>
      <PopoverContent aria-label="Unavailable details">Details</PopoverContent>
    </Popover>
  ),
};

export const ScopedTheme: Story = {
  render: function ScopedThemeExample() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    return (
      <div data-theme="comal" data-color-scheme="dark" ref={setContainer}>
        <Popover placement="bottom-start">
          <PopoverTrigger asChild><Button>Scoped details</Button></PopoverTrigger>
          <PopoverContent container={container} aria-label="Scoped details">
            <p>This portal inherits the local Comal dark theme.</p>
            <PopoverClose asChild><Button>Close scoped details</Button></PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
};
