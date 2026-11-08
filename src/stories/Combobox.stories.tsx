import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Combobox, ComboboxInput, ComboboxContent, Label, Button,
  Dialog, DialogTrigger, DialogContent, DialogTitle,
  type ComboboxOption,
} from "../index";

const materials: ComboboxOption[] = [
  { value: "clay", label: "Clay", keywords: ["ceramic", "pottery"] },
  { value: "linen", label: "Linen" },
  { value: "oak", label: "Oak", disabled: true },
  { value: "paper", label: "Paper" },
];

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  args: { options: materials, children: undefined },
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Composable searchable single selection, built with Radix Popover. Arrow keys highlight enabled options, Enter selects, Escape cancels, and Tab continues to the next control. Focus stays on the input. Provide a visible Label. Supports local filtering, remote results, and optional creation. See the [usage guide](?path=/docs/components-combobox--usage-guide) for composition, state, and data handling.",
      },
    },
  },
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Local filtering matches labels and search keywords without case sensitivity. Oak is disabled and skipped during keyboard navigation.",
      },
    },
  },
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="combobox-material">Material</Label>
      <Combobox options={materials} name="material">
        <ComboboxInput id="combobox-material" placeholder="Choose a material" />
        <ComboboxContent />
      </Combobox>
      <Button variant="outline">Continue</Button>
    </div>
  ),
};

export const Creatable: Story = {
  parameters: {
    docs: {
      description: {
        story: "Supply onCreate to offer creation for a nonempty query without a known exact label match. Return the new option directly or through a promise; success selects it.",
      },
    },
  },
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="combobox-creatable">Material</Label>
      <Combobox options={materials} onCreate={(label) => ({ value: crypto.randomUUID(), label })}>
        <ComboboxInput id="combobox-creatable" placeholder="Choose or create a material" />
        <ComboboxContent />
      </Combobox>
    </div>
  ),
};

export const CreationError: Story = {
  parameters: {
    docs: {
      description: {
        story: "Create “reserved” to simulate a rejected request. Pending creation prevents edits and repeated submissions. Failure preserves the query for retry; customize the small destructive message with createErrorText on ComboboxContent.",
      },
    },
  },
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="combobox-create-error">Material</Label>
      <Combobox options={materials} onCreate={async (label) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (label.toLowerCase() === "reserved") throw new Error("This name is reserved.");
        return { value: crypto.randomUUID(), label };
      }}>
        <ComboboxInput id="combobox-create-error" aria-describedby="combobox-create-hint" placeholder="Choose or create" />
        <ComboboxContent createErrorText="This name is reserved. Choose another name." />
      </Combobox>
      <p id="combobox-create-hint" className="catalog-muted" style={{ fontSize: "var(--font-size-sm)", margin: 0 }}>Try creating “reserved” to see an error.</p>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set disabled on Combobox to disable the input and omit the selected value from form submission.",
      },
    },
  },
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="combobox-disabled">Material</Label>
      <Combobox options={materials} defaultValue={materials[0]} disabled>
        <ComboboxInput id="combobox-disabled" />
        <ComboboxContent />
      </Combobox>
    </div>
  ),
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story: "Put required, aria-invalid, and aria-describedby on ComboboxInput. Required fields reject uncommitted search text; associate application validation errors with the input.",
      },
    },
  },
  render: () => (
    <div className="catalog-field">
      <Label htmlFor="combobox-invalid">Material</Label>
      <Combobox options={materials}>
        <ComboboxInput id="combobox-invalid" placeholder="Choose a material" required
          aria-invalid="true" aria-describedby="combobox-validation" />
        <ComboboxContent />
      </Combobox>
      <p id="combobox-validation" className="catalog-error">Select a material before continuing.</p>
    </div>
  ),
};

export const InsideDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: "Selection keeps focus on the input. Escape closes the combobox popup before closing the containing dialog.",
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button>Edit material</Button></DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Edit material</DialogTitle>
        <Label htmlFor="combobox-dialog">Material</Label>
        <Combobox options={materials}>
          <ComboboxInput id="combobox-dialog" placeholder="Choose a material" />
          <ComboboxContent />
        </Combobox>
      </DialogContent>
    </Dialog>
  ),
};
