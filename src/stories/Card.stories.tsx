import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "../index";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Composable surface with header, title, description, content, and footer. The card itself is not interactive and has no disabled or loading state. Keep actions inside accessible controls. Width follows the container. Preview light, dark, and consumer themes in the toolbar.",
      },
    },
  },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 400 }}>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>A shared place for your team.</CardDescription>
      </CardHeader>
      <CardContent>
        Compose content and actions for your application.
      </CardContent>
      <CardFooter>
        <Button>Open workspace</Button>
        <Button variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};
