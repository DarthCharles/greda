import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, RadioGroup, RadioGroupItem } from "../index";

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Choose one option from a labeled group. Use aria-label or aria-labelledby on RadioGroup and Label with htmlFor for each item. Tab enters or leaves the group; arrow keys move focus and selection, skipping disabled items and looping by default. Space selects a focused item. Use defaultValue for uncontrolled state or value/onValueChange for controlled state; name and required support forms. Set orientation for directional keyboard navigation and use className for horizontal layout. One default size, no visual variants or indeterminate state. Disable the group while its form is loading. For validation, associate an error with aria-describedby and aria-invalid on the group and affected items.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup aria-label="Delivery method" name="delivery" defaultValue="standard">
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
        <p className="catalog-note">Selected: {value}</p>
      </div>
    );
  },
};

export const Horizontal: Story = {
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
