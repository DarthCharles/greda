import { createRef, useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Combobox, ComboboxInput, ComboboxContent, Button,
  type ComboboxOption, type ComboboxProps,
} from "../index";

const options: ComboboxOption[] = [
  { value: "clay", label: "Clay", keywords: ["pottery"] },
  { value: "linen", label: "Linen", disabled: true },
  { value: "paper", label: "Paper" },
];

function Example(props: Omit<ComboboxProps, "children" | "options"> & { options?: ComboboxOption[] }) {
  return (
    <Combobox options={options} {...props}>
      <ComboboxInput aria-label="Material" />
      <ComboboxContent />
    </Combobox>
  );
}

function deferredOption() {
  let resolve: (option: ComboboxOption) => void = () => {};
  let reject: (error: Error) => void = () => {};
  const promise = new Promise<ComboboxOption>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe("combobox behavior", () => {
  it("filters labels and keywords, skips disabled options, and submits the selected ID", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<form aria-label="Project"><Example name="material" onValueChange={onValueChange} /></form>);
    const input = screen.getByRole("combobox", { name: "Material" });
    await user.click(input);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(document.getElementById(input.getAttribute("aria-activedescendant") ?? "")).toHaveTextContent("Paper");
    await user.type(input, "POT");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Clay" })).toBeVisible();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(options[0]);
    expect(input).toHaveValue("Clay");
    expect(input).toHaveFocus();
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("material")).toBe("clay");
  });

  it("cancels uncommitted text on Escape and Tab without changing selection or stealing focus", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<><Example defaultValue={options[0]} onValueChange={onValueChange} /><Button>Next field</Button></>);
    const input = screen.getByRole("combobox");
    await user.type(input, "pa");
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("Clay");
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-expanded", "false");
    await user.click(input);
    await user.type(input, "pa");
    await user.tab();
    await waitFor(() => expect(screen.getByRole("button", { name: "Next field" })).toHaveFocus());
    expect(input).toHaveValue("Clay");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("preserves remote ordering and selected labels while guarding loading, failure, and changing results", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const view = render(<Example filter={false} defaultValue={options[0]} options={[options[2], options[0]]} onCreate={onCreate} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "server search");
    expect(screen.getAllByRole("option").slice(0, 2).map((option) => option.textContent)).toEqual(["Paper", "Clay"]);
    await user.keyboard("{ArrowDown}");
    view.rerender(<Example filter={false} defaultValue={options[0]} options={[options[2]]} loading onCreate={onCreate} />);
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(input).toHaveAttribute("aria-busy", "true");
    await user.keyboard("{Enter}");
    view.rerender(<Example filter={false} defaultValue={options[0]} options={[]} error="Search failed" onCreate={onCreate} />);
    expect(screen.getByRole("status")).toHaveTextContent("Search failed");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("Clay");
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("supports controlled selection, query, and opening with a custom filter", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState<ComboboxOption | null>(null);
      const [query, setQuery] = useState("");
      const [open, setOpen] = useState(false);
      return <Example value={value} onValueChange={setValue} inputValue={query}
        onInputValueChange={(next) => { onQueryChange(next); setQuery(next); }}
        open={open} onOpenChange={setOpen} filter={(option, text) => option.value.startsWith(text)} />;
    }
    render(<Controlled />);
    await user.type(screen.getByRole("combobox"), "pa");
    expect(onQueryChange).toHaveBeenLastCalledWith("pa");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.click(screen.getByRole("option", { name: "Paper" }));
    expect(screen.getByRole("combobox")).toHaveValue("Paper");
    expect(onQueryChange).toHaveBeenLastCalledWith("");
  });

  it("clears the search and highlight when a controlled popup is closed externally", async () => {
    const user = userEvent.setup();
    const onInputValueChange = vi.fn();
    const view = render(<Example open inputValue="pa" onInputValueChange={onInputValueChange} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant");
    view.rerender(<Example open={false} inputValue="pa" onInputValueChange={onInputValueChange} />);
    expect(onInputValueChange).toHaveBeenCalledExactlyOnceWith("");
    view.rerender(<Example open inputValue="" onInputValueChange={onInputValueChange} />);
    expect(input).toHaveValue("");
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(screen.getByRole("option", { name: "Clay" })).toBeVisible();
  });

  it("blocks pointer selection and creation for read-only fields even when forced open", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onCreate = vi.fn((label: string) => ({ value: label, label }));
    const view = render(
      <Combobox key="select" options={options} defaultValue={options[0]} defaultOpen onValueChange={onValueChange}>
        <ComboboxInput aria-label="Material" readOnly />
        <ComboboxContent />
      </Combobox>
    );
    await user.click(await screen.findByRole("option", { name: "Paper" }));
    expect(onValueChange).not.toHaveBeenCalled();
    view.rerender(
      <Combobox key="create" options={options} defaultInputValue="Wool" open onCreate={onCreate} onValueChange={onValueChange}>
        <ComboboxInput aria-label="New material" readOnly />
        <ComboboxContent />
      </Combobox>
    );
    await user.click(await screen.findByRole("option", { name: "Create “Wool”" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("requires explicit creation, trims input, selects the returned ID, and retains local creations", async () => {
    const user = userEvent.setup();
    const created = { value: "server-id", label: "Wool" };
    const onCreate = vi.fn(() => created);
    const onValueChange = vi.fn();
    render(<Example onCreate={onCreate} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "   ");
    expect(screen.queryByRole("option", { name: /Create/ })).not.toBeInTheDocument();
    await user.clear(input);
    await user.type(input, " cLaY ");
    expect(screen.queryByRole("option", { name: /Create/ })).not.toBeInTheDocument();
    await user.clear(input);
    await user.type(input, " Wool ");
    await user.keyboard("{Enter}");
    expect(onCreate).not.toHaveBeenCalled();
    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(input).toHaveValue("Wool"));
    expect(onCreate).toHaveBeenCalledExactlyOnceWith("Wool");
    expect(onValueChange).toHaveBeenLastCalledWith(created);
    await user.click(input);
    expect(screen.getByRole("option", { name: "Wool" })).toHaveAttribute("aria-selected", "true");
  });

  it("blocks duplicate asynchronous creation, preserves a failure for retry, and then selects success", async () => {
    const user = userEvent.setup();
    const first = deferredOption();
    const second = deferredOption();
    const onCreate = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    render(
      <form>
        <Combobox options={options} onCreate={onCreate}>
          <ComboboxInput aria-label="Material" required aria-describedby="material-help" />
          <ComboboxContent />
        </Combobox>
        <p id="material-help">Choose or create a material.</p>
      </form>
    );
    const input = screen.getByRole("combobox");
    await user.type(input, "Wool");
    await user.click(screen.getByRole("option", { name: "Create “Wool”" }));
    expect(input).toHaveAttribute("aria-readonly", "true");
    expect(input).toBeInvalid();
    expect(input).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Creating option");
    await user.type(input, "blocked");
    expect(input).toHaveValue("Wool");
    await user.keyboard("{ArrowDown}{Enter}{Enter}");
    expect(onCreate).toHaveBeenCalledTimes(1);
    await act(async () => { first.reject(new Error("Network failed")); });
    expect(input).toHaveValue("Wool");
    expect(input).not.toHaveAttribute("aria-readonly");
    expect(screen.getByRole("status")).toHaveTextContent("Could not create");
    await user.click(screen.getByRole("option", { name: "Create “Wool”" }));
    await act(async () => { second.resolve({ value: "wool", label: "Wool" }); });
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveValue("Wool");
    expect(input).toBeValid();
    expect(onCreate).toHaveBeenCalledTimes(2);
  });

  it("ignores a late creation result after dismissal", async () => {
    const user = userEvent.setup();
    const request = deferredOption();
    const onValueChange = vi.fn();
    render(<Example defaultValue={options[0]} onCreate={() => request.promise} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "Wool");
    await user.click(screen.getByRole("option", { name: "Create “Wool”" }));
    await user.keyboard("{Escape}");
    await act(async () => { request.resolve({ value: "wool", label: "Wool" }); });
    expect(input).toHaveValue("Clay");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("allows the application to restrict creation even when no option matches", async () => {
    const user = userEvent.setup();
    render(<Example onCreate={(label) => ({ value: label, label })} isValidNewOption={(query) => query.length >= 3} />);
    await user.type(screen.getByRole("combobox"), "xy");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No options found");
    await user.keyboard("z");
    expect(screen.getByRole("option", { name: "Create “xyz”" })).toBeInTheDocument();
  });

  it("does not commit or dismiss during IME composition", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.keyDown(input, { key: "Escape", isComposing: true });
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(options[0]);
  });

  it("validates committed selections and resets uncontrolled form state", async () => {
    const user = userEvent.setup();
    let preventReset = false;
    render(
      <form aria-label="Project" id="project-form" onReset={(event) => {
        if (preventReset) event.preventDefault();
      }}>
        <Combobox options={options} name="material" defaultValue={options[0]}>
          <ComboboxInput aria-label="Material" required />
          <ComboboxContent />
        </Combobox>
        <Button type="reset">Reset</Button>
      </form>
    );
    const input = screen.getByRole("combobox");
    await user.click(input);
    expect(input).toBeValid();
    await user.click(screen.getByRole("option", { name: "Paper" }));
    expect(input).toBeValid();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(input).toHaveValue("Clay");
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("material")).toBe("clay");
    await user.click(input);
    await user.click(screen.getByRole("option", { name: "Paper" }));
    preventReset = true;
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(input).toHaveValue("Paper");
  });

  it("associates external forms and rejects unselected search text for required fields", async () => {
    const user = userEvent.setup();
    render(<>
      <form id="project" aria-label="Project" />
      <Combobox options={options} form="project" name="material">
        <ComboboxInput aria-label="Material" required />
        <ComboboxContent />
      </Combobox>
    </>);
    const input = screen.getByRole("combobox");
    await user.type(input, "Clay");
    expect(input).toBeInvalid();
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("material")).toBe("");
    await user.click(screen.getByRole("option", { name: "Clay" }));
    expect(input).toBeValid();
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("material")).toBe("clay");
  });

  it("forwards input refs and events, respects prevented keyboard events, and disables form submission", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const view = render(
      <form aria-label="Project">
        <Combobox options={options} name="material" defaultValue={options[0]}>
          <ComboboxInput ref={ref} aria-label="Material" onChange={onChange}
            aria-required="true" aria-readonly="true" aria-busy="true"
            onKeyDown={(event) => { if (event.key === "ArrowDown") event.preventDefault(); }} />
          <ComboboxContent />
        </Combobox>
      </form>
    );
    await user.type(screen.getByRole("combobox"), "p");
    expect(ref.current).toBe(screen.getByRole("combobox"));
    expect(ref.current).toHaveAttribute("aria-required", "true");
    expect(ref.current).toHaveAttribute("aria-readonly", "true");
    expect(ref.current).toHaveAttribute("aria-busy", "true");
    expect(onChange).toHaveBeenCalled();
    await user.keyboard("{ArrowDown}");
    expect(ref.current).not.toHaveAttribute("aria-activedescendant");
    view.rerender(<form aria-label="Project"><Example name="material" defaultValue={options[0]} disabled /></form>);
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).has("material")).toBe(false);
  });
});
