import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, buttonVariants } from "../index";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Use for actions. Enter or Space activates a focused button. Loading disables repeated activation and sets aria-busy; supply a useful loading label. Use asChild for links; disabled and loading are intended for native buttons. Use the toolbar to compare themes and color schemes.",
      },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: "Continue" } };
export const Variants: Story = {
  render: () => (
    <div className="catalog-row">
      {(
        [
          "default",
          "secondary",
          "outline",
          "ghost",
          "destructive",
          "link",
        ] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="catalog-row">
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add item">
        +
      </Button>
    </div>
  ),
};
export const Disabled: Story = {
  args: { children: "Unavailable", disabled: true },
};
export const Loading: Story = { args: { children: "Saving…", loading: true } };
export const Link: Story = {
  render: () => (
    <Button asChild>
      <a href="#example">Read more</a>
    </Button>
  ),
};

export const PressFeedback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Press and hold to see the button move down 1px, matching shadcn’s current Nova style. Buttons with aria-haspopup or aria-pressed stay still. Toggle selection changes do not animate. Reduced-motion preferences disable the movement.",
      },
    },
  },
  args: { children: "Press and hold" },
};

export const VariantHelper: Story = {
  render: () => (
    <a href="#example" className={buttonVariants({ variant: "outline" })}>
      Link styled with buttonVariants
    </a>
  ),
};

export const SharedUtilities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Components and application markup share unprefixed utilities and CSS tokens. Use className to replace component defaults. Standalone elements can opt into Greda's scoped baseline with comal-ui.",
      },
    },
  },
  render: () => (
    <div className="catalog-stack">
      <div className="comal-ui rounded-md border border-primary bg-accent p-4 text-accent-foreground">
        Application markup using the same color utilities as Greda.
      </div>
      <div className="catalog-row">
        <Button>Primary action</Button>
        <Button className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground">
          Custom action
        </Button>
      </div>
    </div>
  ),
};

export const ToggleSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use aria-pressed for toggle buttons. Switching outline and secondary keeps the same border space; both toggle states stay still and change without animation. Enter and Space toggle the selection.",
      },
    },
  },
  render: function ToggleSelectionExample() {
    const [selected, setSelected] = useState(false);
    return (
      <div className="catalog-row">
        <Button
          variant={selected ? "secondary" : "outline"}
          aria-pressed={selected}
          onClick={() => setSelected(!selected)}
        >
          Weekend
        </Button>
        <Button variant="outline">Neighboring action</Button>
      </div>
    );
  },
};
