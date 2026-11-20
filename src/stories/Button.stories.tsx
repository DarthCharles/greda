import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, buttonVariants, Input, Label } from "../index";
import { Plus } from "../icons";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { variant: "default", size: "default", loading: false, asChild: false },
  argTypes: {
    variant: {
      description: "Visual emphasis. Choose a variant by the action's role, as described above.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      description: "Use default for standard controls, sm for compact layouts, lg for larger actions, and icon for an icon-only button with an accessible name.",
      table: { defaultValue: { summary: "default" } },
    },
    type: {
      description: "Native button behavior. Set submit to submit a form, or reset to restore form defaults. Not applied when using asChild.",
      control: "select",
      options: ["button", "submit", "reset"],
      table: { defaultValue: { summary: "button" } },
    },
    loading: {
      description: "Sets aria-busy and disables native buttons. Supply a useful loading label; no spinner is added automatically.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      description: "Disables a native button. Links rendered with asChild keep link semantics and are not disabled by this prop.",
      table: { defaultValue: { summary: "false" } },
    },
    asChild: {
      description: "Compose styles and props onto one child element. The child keeps its semantics; disabled and loading do not prevent link navigation.",
      table: { defaultValue: { summary: "false" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          `Use Button for actions. Enter or Space activates a focused native button. Use the toolbar to compare themes and color schemes.

### Choose a variant

- **default:** the main action in a group, such as Save changes.
- **secondary:** a supporting action that still needs a filled surface.
- **outline:** a clearly bounded alternative to the main action.
- **ghost:** a low-emphasis action such as Cancel, often alongside a primary button.
- **destructive:** an action that removes data or has a destructive consequence. Explain the consequence and provide confirmation or undo when appropriate.
- **link:** an inline action with link-like styling. This variant changes appearance, not HTML semantics; use an anchor with asChild for navigation.

### Forms, loading, and links

Button defaults to type="button", variant="default", and size="default". Set type="submit" explicitly to submit a form. Native button props, events, aria-* attributes, data-* attributes, and refs are supported.

Loading sets aria-busy and disables native buttons to prevent repeated activation. Provide a useful label such as Saving…; loading does not insert a spinner. Use disabled for unavailable native actions.

Use asChild with a single anchor for navigation. The anchor keeps link semantics: disabled and loading do not prevent navigation or guarantee a disabled link. Use buttonVariants to style a standalone element while retaining its semantics.`,
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
        <Plus aria-hidden="true" />
      </Button>
    </div>
  ),
};
export const ActionHierarchy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Save changes is the primary action and explicitly submits the form. Cancel uses ghost emphasis and resets this example to its initial value. Type a workspace name, then save or cancel to try the form.",
      },
    },
  },
  render: function ActionHierarchyExample() {
    const [status, setStatus] = useState("");
    return (
      <form
        className="catalog-stack"
        onSubmit={(event) => {
          event.preventDefault();
          setStatus("Changes saved.");
        }}
        onReset={() => setStatus("Changes canceled.")}
      >
        <div className="catalog-field">
          <Label htmlFor="button-workspace">Workspace name</Label>
          <Input
            id="button-workspace"
            name="workspace"
            defaultValue="Design team"
            required
            onChange={() => setStatus("")}
          />
        </div>
        <div className="catalog-row">
          <Button type="submit">Save changes</Button>
          <Button type="reset" variant="ghost">Cancel</Button>
        </div>
        <p role="status" className="catalog-muted">{status}</p>
      </form>
    );
  },
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
          "Press and hold to see the button move down 1px. Buttons with aria-haspopup or aria-pressed stay still. Toggle selection changes do not animate. Reduced-motion preferences disable the movement.",
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
          "A toggle button reports its selection with aria-pressed. Activate it with a click, Enter, or Space.",
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
