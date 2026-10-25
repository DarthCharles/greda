import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "../index";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native field with forwarded props and ref. Provide a visible Label; associate validation messages with aria-describedby. Tab focuses the control with a visible ring. Field sizing follows the container; use rows for textarea height. Loading is managed by the form. Compare themes using the toolbar.",
      },
    },
  },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="value">Description</Label>
      <Input id="value" placeholder="Enter a description" />
    </div>
  ),
};
export const Disabled: Story = {
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="disabled">Description</Label>
      <Input id="disabled" disabled defaultValue="Unavailable" />
    </div>
  ),
};
export const Invalid: Story = {
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="invalid">Description</Label>
      <Input id="invalid" aria-invalid="true" aria-describedby="error" />
      <p id="error" className="catalog-error">
        Enter a description.
      </p>
    </div>
  ),
};
