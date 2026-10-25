import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
  Button,
} from "../index";

const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    docs: {
      description: {
        component:
          "Transient feedback with Radix announcement and swipe behavior. Provide ToastProvider and one ToastViewport. F8 focuses notifications; Tab reaches actions and Escape dismisses. Use type=foreground only for user initiated feedback. Keep critical errors inline rather than only in timed toasts. Use --toast-width for size and the toolbar for theme previews.",
      },
    },
  },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example() {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Save changes</Button>
      <Toast open={open} onOpenChange={setOpen}>
        <ToastTitle>Changes saved</ToastTitle>
        <ToastDescription>Your workspace is up to date.</ToastDescription>
        <div className="catalog-row">
          <ToastAction
            altText="Undo the last change"
            onClick={() => setOpen(false)}
          >
            Undo
          </ToastAction>
          <ToastClose />
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
export const Default: Story = { render: () => <Example /> };
