import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Drawer,
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
      description: "Viewport edge where the drawer opens and swipes closed.",
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

Press Enter or Space on the trigger to open the drawer. In modal mode, Tab and Shift+Tab stay inside it. Wrap the drawer header in DrawerHandle to make it a swipe area. Swipe toward the opening edge, press Escape, or press the backdrop to dismiss the drawer. Closing returns focus to the trigger. Use DrawerTrigger and DrawerClose with Button through asChild for button variants, sizes, and disabled states.`,
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children: _children, ...args }) => (
    <Drawer key={String(args.defaultOpen)} {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Delivery window</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHandle>
          <DrawerHeader>
            <DrawerTitle>Delivery window</DrawerTitle>
            <DrawerDescription>Your order is due Friday between 9 am and noon.</DrawerDescription>
          </DrawerHeader>
        </DrawerHandle>
        <DrawerFooter>
          <DrawerClose asChild><Button>Done</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const ScopedTheme: Story = {
  parameters: {
    docs: {
      description: {
        story: `This drawer inherits Comal dark from its local wrapper. Pass the wrapper element to DrawerContent through its container prop. A top or bottom drawer spans narrow screens and caps its width at \`--dialog-width\`.

Give long content its own named, keyboard-focusable scroll region to keep the footer visible. Set \`min-height: 0\` and \`overflow-y: auto\` on the region. Dragging starts only on DrawerHandle, so the scroll region works with native touch scrolling.`,
      },
    },
  },
  render: function ScopedThemeExample() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    return (
      <div data-theme="comal" data-color-scheme="dark" ref={setContainer}>
        <Drawer>
          <DrawerTrigger asChild><Button>Pickup details</Button></DrawerTrigger>
          <DrawerContent container={container}>
            <DrawerHandle>
              <DrawerHeader>
                <DrawerTitle>Pickup details</DrawerTitle>
                <DrawerDescription>Your order will be ready on Saturday.</DrawerDescription>
              </DrawerHeader>
            </DrawerHandle>
            <div
              className="catalog-stack"
              role="region"
              aria-label="Pickup instructions"
              tabIndex={0}
              style={{ minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}
            >
              <p className="comal-ui">Collect your order from the service desk between 10 am and 2 pm.</p>
              <p className="comal-ui">Bring your confirmation email so the team can find your items.</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild><Button>Done</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const Right: Story = {
  args: { direction: "right" },
  parameters: {
    docs: { description: { story: "Set direction to right for a full-height panel. Swipe the title area toward the right edge or use the close button in the header." } },
  },
  render: ({ children: _children, ...args }) => (
    <Drawer key={String(args.defaultOpen)} {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Delivery window</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHandle
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
        </DrawerHandle>
      </DrawerContent>
    </Drawer>
  ),
};
