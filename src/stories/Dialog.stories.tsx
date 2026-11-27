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
function renderProfileDialog(nativeBackdrop = false) {
  const Fields = nativeBackdrop ? "form" : "div";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent nativeBackdrop={nativeBackdrop}>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Update your public display name.</DialogDescription>
        <Fields className="catalog-stack" method={nativeBackdrop ? "dialog" : undefined}>
          <div className="catalog-field catalog-field-fluid">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" defaultValue="Alex" />
          </div>
          {nativeBackdrop ? (
            <Button type="submit">Done</Button>
          ) : (
            <DialogClose asChild><Button>Done</Button></DialogClose>
          )}
        </Fields>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => renderProfileDialog(),
};

export const NativeBackdrop: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set nativeBackdrop on DialogContent to use an HTML dialog’s backdrop in an installed iOS web app. For a nested portaled overlay, pass the native dialog element as its container. Find it with contentRef.current?.closest('dialog').",
      },
    },
  },
  render: () => renderProfileDialog(true),
};
