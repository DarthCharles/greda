import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Input } from "../index";

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Associate with a field using htmlFor, or wrap a native field. Clicking the label focuses its field. Labels have no independent loading or invalid state; document those on the associated control. Theme typography and colors are inherited.",
      },
    },
  },
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="label-example">Display name</Label>
      <Input id="label-example" />
    </div>
  ),
};
