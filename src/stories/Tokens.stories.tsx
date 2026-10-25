import type { Meta, StoryObj } from "@storybook/react-vite";
import { TokenCatalog } from "./tokens/TokenCatalog";
import type { TokenGroup } from "./tokens/catalog";

const meta = {
  title: "Design Tokens",
  tags: ["!autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const renderGroup =
  (group?: TokenGroup): Story["render"] =>
  (_args, context) =>
    (
      <TokenCatalog
        group={group}
        themeKey={`${context.globals.theme}:${context.globals.scheme}`}
      />
    );
export const Overview: Story = { name: "All tokens", render: renderGroup() };
export const Colors: Story = { render: renderGroup("Colors") };
export const Typography: Story = { render: renderGroup("Typography") };
export const Spacing: Story = { render: renderGroup("Spacing") };
export const ShapeAndElevation: Story = {
  name: "Shape & elevation",
  render: renderGroup("Shape & elevation"),
};
export const SizingAndStates: Story = {
  name: "Sizing & states",
  render: renderGroup("Sizing & states"),
};
