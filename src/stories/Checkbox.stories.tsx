import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Label,
} from "../index";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Radix checkbox with boolean or indeterminate state. Space toggles a focused checkbox. Use Label with htmlFor and onCheckedChange for controlled state. Disabled blocks interaction; form loading should disable it. Size and state colors come from tokens.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="catalog-row">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept the terms</Label>
    </div>
  ),
};
export const Checked: Story = {
  render: () => (
    <div className="catalog-row">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Subscribed</Label>
    </div>
  ),
};
export const Indeterminate: Story = {
  render: () => (
    <div className="catalog-row">
      <Checkbox id="mixed" checked="indeterminate" />
      <Label htmlFor="mixed">Select all</Label>
    </div>
  ),
};
export const Disabled: Story = {
  render: () => (
    <div className="catalog-row">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled">Unavailable</Label>
    </div>
  ),
};
export const Invalid: Story = {
  render: () => (
    <div className="catalog-field">
      <div className="catalog-row">
        <Checkbox
          id="required"
          aria-invalid="true"
          aria-describedby="check-error"
        />
        <Label htmlFor="required">Accept the terms</Label>
      </div>
      <p id="check-error" className="catalog-error">
        Accept the terms to continue.
      </p>
    </div>
  ),
};

export const InsideContainers: Story = {
  render: () => (
    <div className="catalog-stack">
      <Card style={{ padding: "1rem" }}>
        <div className="catalog-row">
          <Checkbox id="card-mixed" checked="indeterminate" />
          <Label htmlFor="card-mixed">Partially selected in card</Label>
        </div>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open checkbox dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Mixed selection</DialogTitle>
          <DialogDescription>
            The indeterminate icon is preserved inside themed component
            containers.
          </DialogDescription>
          <div className="catalog-row">
            <Checkbox id="dialog-mixed" checked="indeterminate" />
            <Label htmlFor="dialog-mixed">Partially selected in dialog</Label>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
