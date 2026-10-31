import { createRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, Input, Popover, PopoverTrigger, PopoverContent, PopoverClose } from "../index";

describe("popover behavior", () => {
  it("resolves a portal container ref when initially open", async () => {
    const container = createRef<HTMLDivElement>();
    render(
      <div ref={container} data-theme="comal">
        <Popover defaultOpen>
          <PopoverTrigger>Details</PopoverTrigger>
          <PopoverContent container={container} aria-label="Details">
            <PopoverClose>Done</PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
    );
    expect(container.current).toContainElement(await screen.findByRole("dialog", { name: "Details" }));
  });

  it("forwards Radix dismissal events so consumers can prevent Escape dismissal", async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = vi.fn((event: KeyboardEvent) => event.preventDefault());
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverContent aria-label="Details" onEscapeKeyDown={onEscapeKeyDown}>
          <PopoverClose>Done</PopoverClose>
        </PopoverContent>
      </Popover>
    );
    await user.keyboard("{Escape}");
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog", { name: "Details" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("opens from the keyboard, focuses content, and restores focus on Escape and close", async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Popover>
          <PopoverTrigger ref={triggerRef} onClick={onClick}>Edit</PopoverTrigger>
          <PopoverContent ref={contentRef} aria-label="Editor">
            <Input aria-label="Name" />
            <PopoverClose>Done</PopoverClose>
          </PopoverContent>
        </Popover>
      </form>
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(contentRef.current).toBe(screen.getByRole("dialog", { name: "Editor" }));
    expect(triggerRef.current).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(triggerRef.current).toHaveFocus();
    await user.keyboard(" ");
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(triggerRef.current).toHaveFocus());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("supports controlled state, asChild refs and events, outside dismissal, and disabled triggers", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Popover open={open} onOpenChange={(next) => { onOpenChange(next); setOpen(next); }}>
            <PopoverTrigger asChild ref={ref}><Button onClick={onClick}>Details</Button></PopoverTrigger>
            <PopoverContent aria-label="Details"><Button>Inside</Button></PopoverContent>
          </Popover>
          <Button>Outside</Button>
          <Popover>
            <PopoverTrigger disabled>Unavailable</PopoverTrigger>
            <PopoverContent aria-label="Unavailable">Hidden</PopoverContent>
          </Popover>
        </>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(ref.current).toBe(screen.getByRole("button", { name: "Details" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Unavailable" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports defaultOpen and respects prevented asChild close events", async () => {
    const user = userEvent.setup();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Information</PopoverTrigger>
        <PopoverContent aria-label="Information">
          <PopoverClose asChild><Button onClick={(event) => event.preventDefault()}>Keep open</Button></PopoverClose>
        </PopoverContent>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Keep open" }));
    expect(screen.getByRole("dialog", { name: "Information" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
