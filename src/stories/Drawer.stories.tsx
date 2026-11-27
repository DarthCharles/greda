import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Drawer,
  type DrawerProps,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../index";
import { X } from "../icons";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  subcomponents: {
    DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle,
    DrawerDescription, DrawerFooter, DrawerClose, DrawerHandle,
  },
  args: { defaultOpen: false, modal: true, direction: "bottom", autoFocus: true },
  argTypes: {
    children: { control: false },
    open: {
      description: "Current visibility in controlled mode. Update it from onOpenChange.",
      control: false,
    },
    defaultOpen: {
      description: "Initial visibility in uncontrolled mode.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    onOpenChange: {
      description: "Called with the next visibility state when the drawer opens or dismisses.",
      control: false,
    },
    modal: {
      description: "When true, the backdrop blocks outside interaction and focus stays inside the drawer.",
      control: "boolean",
      table: { defaultValue: { summary: "true" } },
    },
    direction: {
      description: "Viewport edge where the drawer opens.",
      options: ["bottom", "top", "left", "right"],
      control: "select",
      table: { defaultValue: { summary: "bottom" } },
    },
    autoFocus: {
      description: "Moves focus into the drawer on open. Set to false if you manage initial focus yourself.",
      control: "boolean",
      table: { defaultValue: { summary: "true" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Open a panel from a viewport edge to show details or related actions. Always include DrawerTitle and a visible DrawerClose control. Add DrawerDescription for introductory text. When omitting it, pass \`aria-describedby={undefined}\` to DrawerContent.

Press Enter or Space on the trigger to open the drawer. In modal mode, Tab and Shift+Tab stay inside it. Dismiss the drawer with its Close button, Escape, or a tap on the backdrop. Add DrawerHandle to let users swipe toward the opening edge to dismiss. An empty DrawerHandle renders a visible grip. Closing returns focus to the trigger. Use DrawerTrigger and DrawerClose with Button through asChild for button variants, sizes, and disabled states. For long content, use a named, keyboard-focusable scroll region with \`min-height: 0\` and \`overflow-y: auto\` to keep the footer visible.`,
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderBottomDrawer(
  { children: _children, ...args }: DrawerProps,
  nativeBackdrop = false
) {
  return (
    <Drawer key={String(args.defaultOpen)} {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Delivery window</Button>
      </DrawerTrigger>
      <DrawerContent nativeBackdrop={nativeBackdrop}>
        <DrawerHandle />
        <DrawerHeader>
          <DrawerTitle>Delivery window</DrawerTitle>
          <DrawerDescription>Your order is due Friday between 9 am and noon.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild><Button>Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Default: Story = {
  render: (args) => renderBottomDrawer(args),
};

export const NativeBackdrop: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set nativeBackdrop on DrawerContent to use the browser’s backdrop for a modal drawer in an installed iOS web app. For a nested portaled overlay, pass the native dialog element as its container. Find it with contentRef.current?.closest('dialog').",
      },
    },
  },
  render: (args) => renderBottomDrawer(args, true),
};

export const Right: Story = {
  args: { direction: "right" },
  parameters: {
    docs: { description: { story: "Set direction to right for a full-height panel. Use the Close button in the header to dismiss the drawer." } },
  },
  render: ({ children: _children, ...args }) => (
    <Drawer key={String(args.defaultOpen)} {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Delivery window</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div
          style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "start", gap: "var(--space-md)" }}
        >
          <DrawerHeader>
            <DrawerTitle>Delivery window</DrawerTitle>
            <DrawerDescription>Your order is due Friday between 9 am and noon.</DrawerDescription>
          </DrawerHeader>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close delivery window">
              <X aria-hidden="true" />
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
