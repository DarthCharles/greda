import type { Meta, StoryObj } from "@storybook/react-vite";
import { TokenCatalog } from "./tokens/TokenCatalog";
import type { TokenPage } from "./tokens/catalog";

const meta = {
  title: "Design Tokens",
  tags: ["!autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderPage = (page: TokenPage): Story["render"] => (_args, context) => (
  <TokenCatalog
    page={page}
    theme={context.globals.theme}
    scheme={context.globals.scheme}
  />
);

export const Overview: Story = { render: renderPage("overview") };
export const Palette: Story = { name: "Base colors", render: renderPage("palette") };
export const Roles: Story = { name: "Color roles", render: renderPage("roles") };
export const Typography: Story = { render: renderPage("typography") };
export const Spacing: Story = { render: renderPage("spacing") };
export const ShapeAndElevation: Story = {
  name: "Shape & elevation",
  render: renderPage("shape-and-elevation"),
};
export const SizingAndStates: Story = {
  name: "Sizing & states",
  render: renderPage("sizing-and-states"),
};
