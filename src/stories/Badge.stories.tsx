import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../index";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Noninteractive status text. No keyboard, disabled, or loading behavior; convey status using text as well as color. Override tokens or className for sizing. The toolbar previews theme overrides and dark mode.",
      },
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: "Active" } };
export const Variants: Story = {
  render: () => (
    <div className="catalog-row">
      {(["default", "secondary", "outline", "destructive"] as const).map(
        (variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        )
      )}
    </div>
  ),
};
