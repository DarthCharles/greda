import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Input,
  Label,
} from "../index";

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  subcomponents: { CollapsibleTrigger, CollapsibleContent },
  tags: ["autodocs"],
  args: { disabled: false },
  argTypes: {
    open: {
      description: "Whether the panel is expanded in controlled mode. Update it in onOpenChange.",
      control: "boolean",
    },
    defaultOpen: {
      description: "Initial expanded state in uncontrolled mode.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    onOpenChange: {
      description: "Called with the next expanded state when the trigger is activated.",
    },
    disabled: {
      description: "Prevents trigger activation without changing the current expanded state. Use while the containing form is loading.",
      table: { defaultValue: { summary: "false" } },
    },
    asChild: {
      description: "Applies the root's props and ref to one child element. Trigger and Content also support asChild independently.",
      control: false,
      table: { defaultValue: { summary: "false" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          `Expand optional content in place. Compose CollapsibleTrigger and CollapsibleContent inside Collapsible; Radix connects the trigger and panel automatically. Enter or Space toggles the focused trigger. Tab follows document order and skips closed content.

Use CollapsibleTrigger asChild with Button for its variants and sizes. All parts accept className and forward refs. Keep essential instructions and validation errors visible outside the panel.`,
      },
    },
  },
} satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} className="catalog-stack catalog-form-stack">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Delivery instructions</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="catalog-field">
          <Label htmlFor="delivery-note">Where should we leave your order?</Label>
          <Input id="delivery-note" placeholder="For example, by the side door" />
        </div>
      </CollapsibleContent>
      <Button variant="secondary">Continue</Button>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  parameters: {
    docs: {
      description: {
        story: `Set defaultOpen to show the panel initially. A bare CollapsibleTrigger is a non-submit button with focus and disabled styles. With asChild, the supplied element keeps its native semantics.

Content stays in document flow, inherits the surrounding theme, and adds no fixed dimensions or animation. CollapsibleContent accepts forceMount for custom visibility or animation; callers then own closed-state visibility and focus handling.`,
      },
    },
  },
  render: () => (
    <Collapsible defaultOpen className="catalog-stack">
      <CollapsibleTrigger>Packaging details</CollapsibleTrigger>
      <CollapsibleContent>
        <p>Items are wrapped individually in recyclable paper.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: { description: { story: "Use open and onOpenChange to keep expanded state in your application. Toggle Gift options to update the status below." } },
  },
  render: function ControlledExample() {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="catalog-stack catalog-form-stack">
        <CollapsibleTrigger asChild>
          <Button variant="outline">Gift options</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="catalog-stack">
            <div className="catalog-field">
              <Label htmlFor="gift-message">Gift message</Label>
              <Input id="gift-message" />
            </div>
            <p>Gift messages are included on a separate card.</p>
          </div>
        </CollapsibleContent>
        <p role="status">Gift options are {open ? "expanded" : "collapsed"}.</p>
      </Collapsible>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: "Set disabled on Collapsible to prevent trigger activation, including when composed with Button. Explain unavailable options outside the closed panel." } },
  },
  render: () => (
    <Collapsible disabled className="catalog-stack">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Gift options (unavailable)</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>Gift wrapping is currently unavailable.</CollapsibleContent>
      <p>Gift options are unavailable for this order.</p>
    </Collapsible>
  ),
};

export const DisabledOpen: Story = {
  parameters: {
    docs: { description: { story: "Disabling an expanded disclosure preserves its state. Details stay visible while the trigger is unavailable." } },
  },
  render: () => (
    <Collapsible disabled defaultOpen className="catalog-stack">
      <CollapsibleTrigger>Order details</CollapsibleTrigger>
      <CollapsibleContent>
        <p>Your order contains two items. Details remain visible while updates are disabled.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
