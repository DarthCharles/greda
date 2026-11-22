import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, RadioGroup, RadioGroupItem } from "../index";

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  tags: ["autodocs"],
  args: { disabled: false, required: false },
  argTypes: {
    asChild: {
      description: "Applies the group's props and ref to one child element. This example renders options directly inside the group.",
      control: false,
      table: { defaultValue: { summary: "false" } },
    },
    value: {
      description: "Selected item value in controlled mode. Update it in onValueChange.",
      control: "text",
    },
    defaultValue: {
      description: "Initially selected item value in uncontrolled mode. Each RadioGroupItem needs a unique value.",
      control: "text",
    },
    onValueChange: {
      description: "Called with the selected item value when selection changes.",
    },
    name: {
      description: "Form field name. The selected item's value is submitted under this name.",
      control: "text",
    },
    required: {
      description: "Requires a selection for native form validation. Associate application errors with aria-invalid and aria-describedby.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      description: "Disables every item. Disable the group while its form is loading; individual items also accept disabled.",
      table: { defaultValue: { summary: "false" } },
    },
    orientation: {
      description: "Restricts arrow-key navigation to the layout direction. Set the visual layout separately with className.",
      control: "select",
      options: ["horizontal", "vertical"],
    },
    loop: {
      description: "Wraps keyboard navigation from the last enabled item to the first and back.",
      control: "boolean",
      table: { defaultValue: { summary: "true" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Choose one option from a visible set. Give RadioGroup an aria-label or aria-labelledby and associate each item with a Label. Tab enters or leaves the group; arrow keys move focus and selection, skipping disabled items. Space selects the focused item. Items have one default size and no visual variants; use className for overrides. Compare themes and color schemes using the toolbar.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "delivery", defaultValue: "standard" },
  render: (args) => (
    <RadioGroup {...args} aria-label="Delivery method">
      <div className="catalog-row">
        <RadioGroupItem id="delivery-standard" value="standard" />
        <Label htmlFor="delivery-standard">Standard delivery</Label>
      </div>
      <div className="catalog-row">
        <RadioGroupItem id="delivery-express" value="express" />
        <Label htmlFor="delivery-express">Express delivery</Label>
      </div>
      <div className="catalog-row">
        <RadioGroupItem id="delivery-pickup" value="pickup" disabled />
        <Label htmlFor="delivery-pickup">Pickup (unavailable)</Label>
      </div>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: { description: { story: "Use value and onValueChange to keep selection in application state. Select a contact method to update the value shown below." } },
  },
  render: function ControlledExample() {
    const [value, setValue] = useState("email");
    return (
      <div className="catalog-stack">
        <RadioGroup aria-label="Contact method" value={value} onValueChange={setValue}>
          <div className="catalog-row">
            <RadioGroupItem id="contact-email" value="email" />
            <Label htmlFor="contact-email">Email</Label>
          </div>
          <div className="catalog-row">
            <RadioGroupItem id="contact-phone" value="phone" />
            <Label htmlFor="contact-phone">Phone</Label>
          </div>
        </RadioGroup>
        <p className="catalog-muted">Selected: {value}</p>
      </div>
    );
  },
};

export const Horizontal: Story = {
  parameters: {
    docs: { description: { story: "Set orientation to horizontal for Left/Right keyboard navigation and use className to arrange the options. The layout wraps when space is limited." } },
  },
  render: () => (
    <RadioGroup aria-label="View density" orientation="horizontal" defaultValue="comfortable" className="flex flex-wrap gap-4">
      <div className="catalog-row">
        <RadioGroupItem id="density-comfortable" value="comfortable" />
        <Label htmlFor="density-comfortable">Comfortable</Label>
      </div>
      <div className="catalog-row">
        <RadioGroupItem id="density-compact" value="compact" />
        <Label htmlFor="density-compact">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: "Set disabled on RadioGroup to prevent changes to every option while preserving the selection." } },
  },
  render: () => (
    <RadioGroup aria-label="Billing interval" defaultValue="monthly" disabled>
      <div className="catalog-row">
        <RadioGroupItem id="billing-monthly" value="monthly" />
        <Label htmlFor="billing-monthly">Monthly</Label>
      </div>
      <div className="catalog-row">
        <RadioGroupItem id="billing-yearly" value="yearly" />
        <Label htmlFor="billing-yearly">Yearly</Label>
      </div>
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  parameters: {
    docs: { description: { story: "Use required for native form validation. For application errors, set aria-invalid and associate a visible message through aria-describedby on the group and affected items." } },
  },
  render: () => (
    <div className="catalog-field">
      <RadioGroup aria-label="Shipping address" name="address" required aria-invalid="true" aria-describedby="address-error">
        <div className="catalog-row">
          <RadioGroupItem id="address-home" value="home" aria-invalid="true" aria-describedby="address-error" />
          <Label htmlFor="address-home">Home</Label>
        </div>
        <div className="catalog-row">
          <RadioGroupItem id="address-work" value="work" aria-invalid="true" aria-describedby="address-error" />
          <Label htmlFor="address-work">Work</Label>
        </div>
      </RadioGroup>
      <p id="address-error" className="catalog-error">Choose a shipping address to continue.</p>
    </div>
  ),
};
