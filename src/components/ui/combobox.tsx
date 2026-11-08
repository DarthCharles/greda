"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils";
import { Input } from "./input";
import { Popover, PopoverAnchor, PopoverContent, type PopoverContentProps } from "./popover";

export interface ComboboxOption {
  /** Stable, unique ID used for selection and form submission. */
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string[];
}

export type ComboboxFilter = (option: ComboboxOption, query: string) => boolean;

export interface ComboboxProps {
  children: React.ReactNode;
  options: ComboboxOption[];
  value?: ComboboxOption | null;
  defaultValue?: ComboboxOption | null;
  onValueChange?: (option: ComboboxOption | null) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (query: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false preserves remote results and their ordering without filtering again. */
  filter?: ComboboxFilter | false;
  loading?: boolean;
  error?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  form?: string;
  onCreate?: (query: string) => ComboboxOption | Promise<ComboboxOption>;
  /** Additional eligibility check; the server must still enforce uniqueness. */
  isValidNewOption?: (query: string, options: ComboboxOption[]) => boolean;
}

interface ComboboxEntry {
  id: string;
  option?: ComboboxOption;
}

interface ComboboxContextValue {
  listId: string;
  statusId: string;
  selected: ComboboxOption | null;
  query: string;
  open: boolean;
  disabled: boolean;
  loading: boolean;
  creating: boolean;
  creationFailed: boolean;
  error: React.ReactNode;
  options: ComboboxOption[];
  entries: ComboboxEntry[];
  activeId: string | null;
  createId: string | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  composingRef: React.MutableRefObject<boolean>;
  form?: string;
  optionId: (option: ComboboxOption) => string;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setActiveId: (id: string | null) => void;
  select: (entry: ComboboxEntry) => void;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("Combobox parts must be used inside Combobox.");
  return context;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

const defaultFilter: ComboboxFilter = (option, query) =>
  [option.label, ...(option.keywords ?? [])].some((text) =>
    normalize(text).includes(normalize(query))
  );

function Combobox({
  children,
  options,
  value,
  defaultValue = null,
  onValueChange,
  inputValue,
  defaultInputValue = "",
  onInputValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  filter = defaultFilter,
  loading = false,
  error,
  disabled = false,
  name,
  form,
  onCreate,
  isValidNewOption,
}: ComboboxProps) {
  const id = React.useId();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalQuery, setInternalQuery] = React.useState(defaultInputValue);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [createdOptions, setCreatedOptions] = React.useState<ComboboxOption[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [creationFailed, setCreationFailed] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const composingRef = React.useRef(false);
  const formInputRef = React.useRef<HTMLInputElement>(null);
  const mounted = React.useRef(false);
  const creationPending = React.useRef(false);
  const operation = React.useRef(0);
  const selected = value === undefined ? internalValue : value;
  const query = inputValue === undefined ? internalQuery : inputValue;
  const open = !disabled && (controlledOpen ?? internalOpen);
  const previousOpen = React.useRef(open);
  const optionId = (option: ComboboxOption) => `${id}-option-${encodeURIComponent(option.value)}`;

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      operation.current += 1;
    };
  }, []);

  // Dismissal, replacement of a controlled value, or a new query invalidates
  // the selection side effect of an outstanding creation request.
  React.useEffect(() => {
    operation.current += 1;
  }, [open, query, selected?.value]);

  function setQuery(next: string) {
    if (next === query) return;
    operation.current += 1;
    if (inputValue === undefined) setInternalQuery(next);
    onInputValueChange?.(next);
    setActiveId(null);
    setCreationFailed(false);
  }

  function setOpen(next: boolean) {
    if (disabled && next) return;
    if (next !== open) {
      operation.current += 1;
      if (controlledOpen === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    }
  }

  function setSelected(next: ComboboxOption | null) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }

  React.useEffect(() => {
    if (previousOpen.current && !open) {
      setQuery("");
      setActiveId(null);
      setCreationFailed(false);
    }
    previousOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    const owner = formInputRef.current?.form;
    if (!owner) return;
    const reset = (event: Event) => {
      // React's delegated onReset can cancel the native reset after this listener.
      queueMicrotask(() => {
        if (event.defaultPrevented || !mounted.current) return;
        operation.current += 1;
        if (value === undefined) setInternalValue(defaultValue);
        if (inputValue === undefined) setInternalQuery(defaultInputValue);
        if (controlledOpen === undefined) {
          previousOpen.current = false;
          setInternalOpen(false);
        }
        setActiveId(null);
        setCreationFailed(false);
      });
    };
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [form, value, inputValue, controlledOpen, defaultValue, defaultInputValue]);

  const allOptions = filter === false ? options : [
    ...options,
    ...createdOptions.filter((created) => !options.some((option) => option.value === created.value)),
  ];
  const visibleOptions = loading || error ? [] : allOptions.filter((option) =>
    filter === false || filter(option, query)
  );
  const trimmedQuery = query.trim();
  const existingMatch = [...allOptions, ...(selected ? [selected] : [])].some((option) =>
    normalize(option.label) === normalize(trimmedQuery)
  );
  const createId = onCreate && trimmedQuery && !existingMatch && !loading && !error &&
    !creating && (isValidNewOption?.(trimmedQuery, allOptions) ?? true)
    ? `${id}-create` : null;
  const entries: ComboboxEntry[] = creating ? [] : [
    ...visibleOptions.filter((option) => !option.disabled).map((option) => ({ id: optionId(option), option })),
    ...(createId ? [{ id: createId }] : []),
  ];
  const currentActiveId = entries.some((entry) => entry.id === activeId) ? activeId : null;

  async function select(entry: ComboboxEntry) {
    if (disabled || inputRef.current?.readOnly || loading || error || creationPending.current) return;
    if (entry.option) {
      if (entry.option.disabled) return;
      setSelected(entry.option);
      setOpen(false);
      return;
    }
    if (!onCreate || !createId || entry.id !== createId) return;
    const request = ++operation.current;
    creationPending.current = true;
    setCreating(true);
    setCreationFailed(false);
    try {
      const option = await onCreate(trimmedQuery);
      if (!mounted.current || operation.current !== request || inputRef.current?.readOnly) return;
      if (option.disabled) throw new Error("The created option is disabled.");
      if (filter !== false) setCreatedOptions((previous) => [
        ...previous.filter((item) => item.value !== option.value), option,
      ]);
      setSelected(option);
      setOpen(false);
    } catch {
      if (mounted.current && operation.current === request) setCreationFailed(true);
    } finally {
      creationPending.current = false;
      if (mounted.current) setCreating(false);
    }
  }

  return (
    <ComboboxContext.Provider value={{
      listId: `${id}-list`, statusId: `${id}-status`, selected, query, open,
      disabled, loading, creating, creationFailed, error, options: visibleOptions,
      entries, activeId: currentActiveId, createId, inputRef, composingRef, form, optionId,
      setOpen, setQuery, setActiveId, select,
    }}>
      <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
        <input ref={formInputRef} type="hidden" name={name} form={form}
          value={selected?.value ?? ""} disabled={disabled} />
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

export type ComboboxInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "value" | "defaultValue" | "type" | "role" | "name" | "disabled"
>;

const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, onChange, onFocus, onClick, onBlur, onKeyDown, onCompositionStart,
    onCompositionEnd, readOnly, required, form, ...props }, ref) => {
    const context = useCombobox();
    const composing = context.composingRef;
    const { inputRef, selected, query, open, disabled, creating } = context;

    React.useEffect(() => {
      inputRef.current?.setCustomValidity(required && !selected ? "Please select an option." : "");
    }, [inputRef, required, selected]);

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      onKeyDown?.(event);
      if (event.defaultPrevented || composing.current || event.nativeEvent.isComposing ||
        event.keyCode === 229 || readOnly) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        context.setOpen(true);
        const entries = context.entries;
        const index = entries.findIndex((entry) => entry.id === context.activeId);
        const next = event.key === "ArrowDown"
          ? (index + 1) % entries.length
          : (index < 0 ? entries.length - 1 : (index - 1 + entries.length) % entries.length);
        context.setActiveId(entries[next]?.id ?? null);
      } else if (event.key === "Enter" && open) {
        event.preventDefault();
        const entry = context.entries.find((item) => item.id === context.activeId);
        if (entry) context.select(entry);
      } else if (event.key === "Escape" && open) {
        event.preventDefault();
        event.stopPropagation();
        context.setOpen(false);
      }
    }

    return (
      <PopoverAnchor asChild>
        <div className="comal-ui relative w-full">
          <Input
            {...props}
            ref={(element) => {
              inputRef.current = element;
              if (typeof ref === "function") ref(element);
              else if (ref) ref.current = element;
            }}
            className={cn("pr-8", className)}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? context.listId : undefined}
            aria-activedescendant={open ? context.activeId ?? undefined : undefined}
            aria-describedby={[props["aria-describedby"], open ? context.statusId : null].filter(Boolean).join(" ") || undefined}
            aria-busy={context.loading || creating || props["aria-busy"]}
            aria-readonly={readOnly || creating || props["aria-readonly"]}
            aria-required={required || props["aria-required"]}
            value={open ? query : selected?.label ?? ""}
            disabled={disabled}
            // Keep pending creation subject to required form validation.
            readOnly={readOnly}
            required={required && !selected}
            form={form ?? context.form}
            onChange={(event) => {
              onChange?.(event);
              if (event.defaultPrevented || readOnly || creating) return;
              context.setQuery(event.target.value);
              context.setOpen(true);
            }}
            onFocus={(event) => {
              onFocus?.(event);
              if (!event.defaultPrevented && !readOnly) context.setOpen(true);
            }}
            onClick={(event) => {
              onClick?.(event);
              if (!event.defaultPrevented && !readOnly) context.setOpen(true);
            }}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            onCompositionStart={(event) => {
              composing.current = true;
              onCompositionStart?.(event);
            }}
            onCompositionEnd={(event) => {
              composing.current = false;
              onCompositionEnd?.(event);
            }}
          />
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>
      </PopoverAnchor>
    );
  }
);
ComboboxInput.displayName = "ComboboxInput";

export interface ComboboxContentProps extends Omit<PopoverContentProps, "children" | "role"> {
  emptyText?: React.ReactNode;
  loadingText?: React.ReactNode;
  creatingText?: React.ReactNode;
  createErrorText?: React.ReactNode;
  renderCreateLabel?: (query: string) => React.ReactNode;
  renderOption?: (option: ComboboxOption) => React.ReactNode;
  getStatusText?: (count: number, canCreate: boolean) => string;
}

const ComboboxContent = React.forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ className, emptyText = "No options found.", loadingText = "Loading options…",
    creatingText = "Creating option…", createErrorText = "Could not create the option. Try again.",
    renderCreateLabel = (query) => `Create “${query}”`, renderOption = (option) => option.label,
    getStatusText = (count, canCreate) => `${count} ${count === 1 ? "option" : "options"} available.${canCreate ? " You can also create an option." : ""}`,
    onOpenAutoFocus, onCloseAutoFocus, onInteractOutside, onEscapeKeyDown, onPointerDown,
    "aria-label": ariaLabel = "Suggestions",
    ...props }, ref) => {
    const context = useCombobox();
    const lastOpenContext = React.useRef(context);

    React.useEffect(() => {
      if (context.open) lastOpenContext.current = context;
    }, [context]);

    // The query resets on close, but Radix keeps the popup mounted for its exit
    // animation. Keep the outgoing results stable until it is hidden.
    const display = context.open ? context : lastOpenContext.current;

    React.useEffect(() => {
      if (context.open && context.activeId) {
        context.inputRef.current?.ownerDocument.getElementById(context.activeId)?.scrollIntoView({ block: "nearest" });
      }
    }, [context.open, context.activeId, context.inputRef]);

    const status = display.creating ? creatingText : display.loading ? loadingText : display.error ||
      (display.creationFailed ? createErrorText : display.options.length === 0 && !display.createId
        ? emptyText : null);

    return (
      <PopoverContent
        {...props}
        ref={ref}
        role="presentation"
        className={cn("w-[var(--radix-popover-trigger-width)] p-1", className)}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          // Editable combobox focus stays on the input; options use active-descendant.
          event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event);
          // Preserve the next field's focus when dismissing with Tab/outside press.
          event.preventDefault();
        }}
        onInteractOutside={(event) => {
          onInteractOutside?.(event);
          if (event.target === context.inputRef.current) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          onEscapeKeyDown?.(event);
          if (context.composingRef.current || event.isComposing || event.keyCode === 229) event.preventDefault();
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          event.preventDefault();
        }}
      >
        <div id={context.listId} role="listbox" aria-label={ariaLabel}
          aria-busy={display.loading || display.creating || undefined}>
          {display.options.map((option) => {
            const id = context.optionId(option);
            return (
              <div key={option.value} id={id} role="option"
                aria-selected={context.selected?.value === option.value}
                aria-disabled={option.disabled || display.creating || undefined}
                data-highlighted={display.activeId === id ? "" : undefined}
                className="comal-ui relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground aria-disabled:opacity-disabled"
                onPointerMove={() => {
                  if (!option.disabled && !context.creating) context.setActiveId(id);
                }}
                onClick={() => context.select({ id, option })}
              >
                {renderOption(option)}
                {context.selected?.value === option.value && (
                  <Check aria-hidden="true" className="absolute right-2 h-4 w-4" />
                )}
              </div>
            );
          })}
          {display.createId && (
            <div id={display.createId} role="option" aria-selected="false"
              data-highlighted={display.activeId === display.createId ? "" : undefined}
              className="comal-ui cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
              onPointerMove={() => context.setActiveId(display.createId)}
              onClick={() => context.select({ id: display.createId! })}
            >
              {renderCreateLabel(display.query.trim())}
            </div>
          )}
        </div>
        <div id={context.statusId} role="status" aria-live="polite" aria-atomic="true"
          className={cn("comal-ui", status ? "px-2 py-1.5 text-sm" : "sr-only",
            status && (display.creationFailed ? "text-destructive" : "text-muted"))}>
          {status ?? getStatusText(display.options.length, Boolean(display.createId))}
        </div>
      </PopoverContent>
    );
  }
);
ComboboxContent.displayName = "ComboboxContent";

export { Combobox, ComboboxInput, ComboboxContent };
