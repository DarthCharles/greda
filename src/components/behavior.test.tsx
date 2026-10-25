import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  cn,
  Button,
  Input,
  Label,
  Checkbox,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
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
  it("lets consumer utility overrides replace conflicting defaults", () => {
    expect(cn("ds-px-3 ds-text-sm", false, "ds-px-6")).toBe(
      "ds-text-sm ds-px-6"
    );
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
