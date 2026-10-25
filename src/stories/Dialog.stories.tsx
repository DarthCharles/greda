import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
  Input,
  Label,
} from "../index";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal with focus trapping, Escape dismissal, outside dismissal, and focus restoration to its trigger. Always include DialogTitle and a description, or explicitly omit aria-describedby when unnecessary. Compose loading/error states in the form. Width is controlled by --dialog-width. Apply themes on html for portals, or supply container.",
      },
    },
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Update your public display name.</DialogDescription>
        <div className="catalog-stack">
          <div className="catalog-field">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" defaultValue="Alex" />
          </div>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ),
};
