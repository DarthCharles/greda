import { createRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  cn,
  Button,
  Input,
  Label,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Toast,
  ToastProvider,
  ToastTitle,
  ToastClose,
  ToastViewport,
} from "../index";

describe("accessible component behavior", () => {
  it("connects a collapsible trigger to its content, forwards refs, and does not submit its form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const rootRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    render(
      <form onSubmit={onSubmit}>
        <Collapsible ref={rootRef} data-testid="disclosure">
          <CollapsibleTrigger ref={triggerRef}>Details</CollapsibleTrigger>
          <CollapsibleContent ref={contentRef}>
            <Input aria-label="Delivery note" />
          </CollapsibleContent>
        </Collapsible>
      </form>
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(contentRef.current).toHaveAttribute("id", trigger.getAttribute("aria-controls"));
    expect(contentRef.current).toContainElement(screen.getByRole("textbox", { name: "Delivery note" }));
    expect(rootRef.current).toBe(screen.getByTestId("disclosure"));
    expect(triggerRef.current).toBe(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(trigger);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("supports controlled disclosure state and composes the child's click handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    function ControlledDisclosure() {
      const [open, setOpen] = useState(false);
      return (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button onClick={onClick}>Options</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Optional settings</CollapsibleContent>
          <Button onClick={() => setOpen(false)}>Close options</Button>
        </Collapsible>
      );
    }
    render(<ControlledDisclosure />);
    const trigger = screen.getByRole("button", { name: "Options" });
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Optional settings")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close options" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Optional settings")).not.toBeInTheDocument();
  });

  it.each([false, true])("preserves open=%s while a collapsible is disabled", async (defaultOpen) => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible defaultOpen={defaultOpen} disabled onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Order details</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", String(defaultOpen));
    expect(onOpenChange).not.toHaveBeenCalled();
    if (defaultOpen) {
      expect(screen.getByText("Order details")).toBeVisible();
    } else {
      expect(screen.queryByText("Order details")).not.toBeInTheDocument();
    }
  });

  it("updates controlled radio selection through labels and submits only the selected value", async () => {
    const user = userEvent.setup();
    function DeliveryForm() {
      const [value, setValue] = useState("standard");
      return (
        <form aria-label="Delivery">
          <RadioGroup aria-label="Delivery method" name="delivery" value={value} onValueChange={setValue} required>
            <RadioGroupItem id="standard" value="standard" />
            <Label htmlFor="standard">Standard</Label>
            <RadioGroupItem id="express" value="express" />
            <Label htmlFor="express">Express</Label>
            <RadioGroupItem value="pickup" disabled aria-label="Pickup" />
          </RadioGroup>
        </form>
      );
    }
    render(<DeliveryForm />);
    await user.click(screen.getByText("Express"));
    expect(screen.getByRole("radio", { name: "Express" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Standard" })).not.toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Pickup" }));
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).getAll("delivery")).toEqual(["express"]);
  });

  it("disables every radio when the group is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Delivery" defaultValue="standard" disabled onValueChange={onValueChange}>
        <RadioGroupItem value="standard" aria-label="Standard" />
        <RadioGroupItem value="express" aria-label="Express" />
      </RadioGroup>
    );
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
      await user.click(radio);
    }
    expect(screen.getByRole("radio", { name: "Standard" })).toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("lets consumer utility overrides replace conflicting defaults", () => {
    expect(cn("px-3 text-sm", false, "px-6")).toBe("text-sm px-6");
    expect(cn("px-md h-xl", "px-4 h-[72px]")).toBe("px-4 h-[72px]");
    expect(cn("w-6 h-8", "size-md")).toBe("size-md");
    expect(cn("md:-translate-y-xs", "md:translate-y-2")).toBe("md:translate-y-2");
    expect(cn("text-caption", "text-secondary")).toBe("text-caption text-secondary");
    expect(cn("text-secondary", "text-caption")).toBe("text-secondary text-caption");
    expect(cn("font-heading text-sm font-medium leading-none tracking-tight text-action", "text-label"))
      .toBe("text-action text-label");
    expect(cn("text-display", "text-title font-medium")).toBe("text-title font-medium");
    expect(cn("md:text-body", "md:text-caption text-primary")).toBe("md:text-caption text-primary");
    expect(
      cn("bg-primary hover:bg-primary-hover", "bg-accent hover:bg-secondary")
    ).toBe("bg-accent hover:bg-secondary");
    expect(cn("surface-primary", "bg-primary")).toBe("bg-primary");
    expect(cn("bg-primary", "surface-secondary")).toBe("surface-secondary");
    expect(cn("bg-primary", "surface-tertiary")).toBe("surface-tertiary");
    expect(cn("surface-tertiary", "bg-primary")).toBe("bg-primary");
    expect(cn("hover:surface-primary", "hover:bg-accent")).toBe("hover:bg-accent");
    expect(cn("surface-primary text-primary border-primary", "surface-inverse text-inverse border-inverse"))
      .toBe("surface-inverse text-inverse border-inverse");
  });

  it("prevents repeated activation while loading and defaults to a non-submit button", async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const user = userEvent.setup();
    const view = render(
      <form onSubmit={onSubmit}>
        <Button onClick={onClick}>Save</Button>
      </form>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    view.rerender(
      <Button loading onClick={onClick}>
        Saving
      </Button>
    );
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports labels, validation descriptions, and native form values", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Profile">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          aria-invalid="true"
          aria-describedby="name-error"
        />
        <p id="name-error">A name is required.</p>
      </form>
    );
    await user.click(screen.getByText("Name"));
    const field = screen.getByRole("textbox", { name: "Name" });
    expect(field).toHaveFocus();
    expect(field).toHaveAccessibleDescription("A name is required.");
    await user.type(field, "Alex");
    expect(
      new FormData(screen.getByRole("form") as HTMLFormElement).get("name")
    ).toBe("Alex");
  });

  it("traps dialog focus, closes with Escape, and restores the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open editor</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change your name.</DialogDescription>
          <Input aria-label="Name" />
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
    const trigger = screen.getByRole("button", { name: "Open editor" });
    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: "Edit profile" })
    ).toHaveAccessibleDescription("Change your name.");
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
    );
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });

  it("opens a controlled drawer with the keyboard and restores focus on dismissal", async () => {
    const user = userEvent.setup();
    const contentRef = createRef<HTMLDivElement>();
    function ControlledDrawer() {
      const [open, setOpen] = useState(false);
      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild><Button>Open schedule</Button></DrawerTrigger>
          <DrawerContent ref={contentRef}>
            <DrawerTitle>Schedule</DrawerTitle>
            <DrawerDescription>Review the pickup window.</DrawerDescription>
            <Button>Change date</Button>
            <DrawerClose asChild><Button>Done</Button></DrawerClose>
          </DrawerContent>
        </Drawer>
      );
    }

    render(<ControlledDrawer />);
    const trigger = screen.getByRole("button", { name: "Open schedule" });
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    const drawer = screen.getByRole("dialog", { name: "Schedule" });
    expect(contentRef.current).toBe(drawer);
    expect(drawer).toHaveAccessibleDescription("Review the pickup window.");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Change date" })).toHaveFocus()
    );
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Done" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("changes tabs with arrow keys while skipping disabled triggers", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Sections">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two" disabled>
            Two
          </TabsTrigger>
          <TabsTrigger value="three">Three</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="three">Third panel</TabsContent>
      </Tabs>
    );
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
        "aria-selected",
        "true"
      )
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Third panel");
  });

  it("toggles a checkbox with Space and submits its native value", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Preferences">
        <Checkbox id="subscribe" name="subscribe" value="yes" />
        <Label htmlFor="subscribe">Subscribe</Label>
      </form>
    );
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toBeChecked();
    expect(
      new FormData(screen.getByRole("form") as HTMLFormElement).get("subscribe")
    ).toBe("yes");
  });

  it("selects an option using the keyboard and restores focus", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select onValueChange={onChange}>
        <SelectTrigger aria-label="Visibility">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="team">Team</SelectItem>
        </SelectContent>
      </Select>
    );
    await user.tab();
    await user.keyboard("{Enter}");
    await screen.findByRole("option", { name: "Private" });
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("team");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());
    expect(screen.getByRole("combobox")).toHaveTextContent("Team");
  });

  it("exposes a dismissible toast without removing the surrounding UI", async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(true);
      return (
        <ToastProvider>
          <Button>Keep editing</Button>
          <Toast open={open} onOpenChange={setOpen} duration={Infinity}>
            <ToastTitle>Saved</ToastTitle>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    }
    render(<Example />);
    await user.click(
      await screen.findByRole("button", { name: "Dismiss notification" })
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Dismiss notification" })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Keep editing" })).toBeEnabled();
  });
});
