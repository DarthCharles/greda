import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../index";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Arrow keys move between tabs; Home/End select the first/last enabled tab. Vertical orientation uses Up/Down. Disabled triggers are skipped. Use activationMode="manual" for expensive panels. Loading/error content belongs inside panels. Theme colors and radii follow tokens.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Workspace sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Your workspace overview.</TabsContent>
      <TabsContent value="activity">Recent activity appears here.</TabsContent>
    </Tabs>
  ),
};
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="one" orientation="vertical">
      <TabsList aria-label="Sections">
        <TabsTrigger value="one">First</TabsTrigger>
        <TabsTrigger value="two">Second</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel</TabsContent>
      <TabsContent value="two">Second panel</TabsContent>
    </Tabs>
  ),
};
